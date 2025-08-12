from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import numpy as np
from sentence_transformers import SentenceTransformer
import spacy
import json
import google.generativeai as genai
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import faiss

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/careernavigator'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Configure Gemini AI
genai.configure(api_key="your-gemini-api-key")
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Load NLP models
try:
    nlp = spacy.load("en_core_web_sm")
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
except:
    print("Warning: NLP models not loaded. Install spacy and sentence-transformers")

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    learning_style = db.Column(db.String(50))
    skill_level = db.Column(db.String(50))
    career_goals = db.Column(db.Text)
    points = db.Column(db.Integer, default=0)
    badges = db.Column(db.Text)  # JSON string

class Assessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    question_data = db.Column(db.Text)  # JSON string
    answers = db.Column(db.Text)  # JSON string
    results = db.Column(db.Text)  # JSON string
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    difficulty = db.Column(db.String(50))
    category = db.Column(db.String(100))
    duration = db.Column(db.String(50))
    skills_taught = db.Column(db.Text)  # JSON array
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    progress_percentage = db.Column(db.Float, default=0.0)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200))
    description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    salary_range = db.Column(db.String(100))
    location = db.Column(db.String(200))
    job_type = db.Column(db.String(50))
    posted_at = db.Column(db.DateTime, default=datetime.utcnow)

class UserSkill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    skill_name = db.Column(db.String(100), nullable=False)
    proficiency_level = db.Column(db.Integer)  # 1-5 scale
    verified = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

# Assessment Questions Data
ASSESSMENT_QUESTIONS = [
    {
        "id": 1,
        "question": "How do you prefer to learn new concepts?",
        "options": [
            {"text": "Reading detailed explanations and documentation", "style": "Visual", "weight": 3},
            {"text": "Listening to lectures and discussions", "style": "Auditory", "weight": 3},
            {"text": "Hands-on practice and experimentation", "style": "Kinesthetic", "weight": 3},
            {"text": "Watching video tutorials", "style": "Visual", "weight": 2}
        ]
    },
    {
        "id": 2,
        "question": "When solving problems, you typically:",
        "options": [
            {"text": "Draw diagrams or flowcharts", "style": "Visual", "weight": 3},
            {"text": "Talk through the problem aloud", "style": "Auditory", "weight": 3},
            {"text": "Jump in and try different solutions", "style": "Kinesthetic", "weight": 3},
            {"text": "Think silently and methodically", "style": "Visual", "weight": 2}
        ]
    },
    {
        "id": 3,
        "question": "Your programming experience level is:",
        "options": [
            {"text": "Complete beginner", "level": "Beginner", "weight": 1},
            {"text": "Some basic knowledge", "level": "Beginner", "weight": 2},
            {"text": "Intermediate skills", "level": "Intermediate", "weight": 3},
            {"text": "Advanced programmer", "level": "Advanced", "weight": 4}
        ]
    },
    # Add 17 more questions here for the full 20-question assessment
    {
        "id": 4,
        "question": "Which learning environment motivates you most?",
        "options": [
            {"text": "Quiet study with visual materials", "style": "Visual", "weight": 3},
            {"text": "Group discussions and study sessions", "style": "Auditory", "weight": 3},
            {"text": "Interactive workshops and labs", "style": "Kinesthetic", "weight": 3},
            {"text": "Online self-paced courses", "style": "Visual", "weight": 2}
        ]
    },
    {
        "id": 5,
        "question": "Your career goal is primarily in:",
        "options": [
            {"text": "Software Development", "category": "Development", "weight": 3},
            {"text": "Data Science/AI", "category": "Data Science", "weight": 3},
            {"text": "Cybersecurity", "category": "Security", "weight": 3},
            {"text": "Product Management", "category": "Management", "weight": 3}
        ]
    }
]

# API Routes

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        user = User(
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            full_name=data['full_name']
        )
        
        db.session.add(user)
        db.session.commit()
        
        token = create_access_token(identity=user.id)
        return jsonify({'token': token, 'user': {'id': user.id, 'email': user.email, 'full_name': user.full_name}})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            token = create_access_token(identity=user.id)
            return jsonify({
                'token': token, 
                'user': {
                    'id': user.id, 
                    'email': user.email, 
                    'full_name': user.full_name,
                    'learning_style': user.learning_style,
                    'points': user.points
                }
            })
        
        return jsonify({'error': 'Invalid credentials'}), 401
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/assessment/questions', methods=['GET'])
@jwt_required()
def get_assessment_questions():
    return jsonify({'questions': ASSESSMENT_QUESTIONS})

@app.route('/api/assessment/submit', methods=['POST'])
@jwt_required()
def submit_assessment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        answers = data['answers']
        
        # Analyze learning style
        style_scores = {'Visual': 0, 'Auditory': 0, 'Kinesthetic': 0}
        level_scores = {'Beginner': 0, 'Intermediate': 0, 'Advanced': 0}
        
        for answer in answers:
            question_id = answer['question_id']
            selected_option = answer['selected_option']
            
            question = next(q for q in ASSESSMENT_QUESTIONS if q['id'] == question_id)
            option = question['options'][selected_option]
            
            if 'style' in option:
                style_scores[option['style']] += option['weight']
            if 'level' in option:
                level_scores[option['level']] += option['weight']
        
        # Determine dominant learning style and skill level
        learning_style = max(style_scores, key=style_scores.get)
        skill_level = max(level_scores, key=level_scores.get) if any(level_scores.values()) else 'Beginner'
        
        # Save assessment results
        assessment = Assessment(
            user_id=user_id,
            question_data=json.dumps(ASSESSMENT_QUESTIONS),
            answers=json.dumps(answers),
            results=json.dumps({
                'learning_style': learning_style,
                'skill_level': skill_level,
                'style_scores': style_scores,
                'level_scores': level_scores
            })
        )
        
        # Update user profile
        user = User.query.get(user_id)
        user.learning_style = learning_style
        user.skill_level = skill_level
        user.points += 100  # Award points for completing assessment
        
        db.session.add(assessment)
        db.session.commit()
        
        # Generate personalized recommendations using AI
        recommendations = generate_learning_path(user_id, learning_style, skill_level)
        
        return jsonify({
            'results': {
                'learning_style': learning_style,
                'skill_level': skill_level,
                'recommendations': recommendations
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_learning_path(user_id, learning_style, skill_level):
    """Generate personalized learning path using AI"""
    try:
        prompt = f"""
        Generate a personalized learning pathway for a student with:
        - Learning Style: {learning_style}
        - Skill Level: {skill_level}
        
        Provide 5 recommended courses with:
        1. Course title
        2. Description
        3. Difficulty level
        4. Estimated duration
        5. Key skills to be learned
        
        Format as JSON array with these fields for each course:
        - title, description, difficulty, duration, skills
        """
        
        response = model.generate_content(prompt)
        # Parse AI response and return structured recommendations
        return {
            'ai_generated': True,
            'learning_style': learning_style,
            'recommended_approach': get_learning_approach(learning_style),
            'courses': parse_ai_course_recommendations(response.text)
        }
    
    except Exception as e:
        # Fallback to predefined recommendations
        return get_fallback_recommendations(learning_style, skill_level)

def get_learning_approach(learning_style):
    approaches = {
        'Visual': 'Focus on diagrams, charts, videos, and visual programming tools',
        'Auditory': 'Emphasize lectures, discussions, podcasts, and verbal explanations',
        'Kinesthetic': 'Prioritize hands-on projects, interactive coding, and practical exercises'
    }
    return approaches.get(learning_style, 'Mixed approach combining multiple learning methods')

def parse_ai_course_recommendations(ai_text):
    """Parse AI-generated course recommendations"""
    try:
        # This would parse the AI response - for now, return sample data
        return [
            {
                "title": "Python Fundamentals for Beginners",
                "description": "Learn Python programming from scratch with hands-on exercises",
                "difficulty": "Beginner",
                "duration": "4 weeks",
                "skills": ["Python basics", "Data types", "Control structures", "Functions"]
            },
            {
                "title": "Web Development with React",
                "description": "Build modern web applications using React.js",
                "difficulty": "Intermediate",
                "duration": "6 weeks",
                "skills": ["React.js", "JavaScript ES6", "Component design", "State management"]
            }
        ]
    except:
        return []

def get_fallback_recommendations(learning_style, skill_level):
    """Fallback recommendations when AI is unavailable"""
    return {
        'ai_generated': False,
        'learning_style': learning_style,
        'recommended_approach': get_learning_approach(learning_style),
        'courses': [
            {
                "title": f"{skill_level} Programming Track",
                "description": f"Tailored for {learning_style.lower()} learners at {skill_level.lower()} level",
                "difficulty": skill_level,
                "duration": "8 weeks",
                "skills": ["Programming fundamentals", "Problem solving", "Best practices"]
            }
        ]
    }

@app.route('/api/courses', methods=['GET'])
@jwt_required()
def get_courses():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Get all courses
        courses = Course.query.all()
        
        course_data = []
        for course in courses:
            progress = UserProgress.query.filter_by(
                user_id=user_id, 
                course_id=course.id
            ).first()
            
            course_data.append({
                'id': course.id,
                'title': course.title,
                'description': course.description,
                'difficulty': course.difficulty,
                'category': course.category,
                'duration': course.duration,
                'skills_taught': json.loads(course.skills_taught) if course.skills_taught else [],
                'progress': progress.progress_percentage if progress else 0
            })
        
        return jsonify({'courses': course_data})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/jobs/recommendations', methods=['GET'])
@jwt_required()
def get_job_recommendations():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Get user skills
        user_skills = UserSkill.query.filter_by(user_id=user_id).all()
        skill_names = [skill.skill_name for skill in user_skills]
        
        # Get all jobs
        jobs = Job.query.all()
        
        # Simple matching based on skills (would be more sophisticated with actual ML)
        matched_jobs = []
        for job in jobs:
            match_score = calculate_job_match_score(skill_names, job.requirements)
            matched_jobs.append({
                'id': job.id,
                'title': job.title,
                'company': job.company,
                'description': job.description,
                'requirements': job.requirements,
                'salary_range': job.salary_range,
                'location': job.location,
                'job_type': job.job_type,
                'match_score': match_score,
                'posted_at': job.posted_at.isoformat()
            })
        
        # Sort by match score
        matched_jobs.sort(key=lambda x: x['match_score'], reverse=True)
        
        return jsonify({'jobs': matched_jobs[:10]})  # Return top 10 matches
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_job_match_score(user_skills, job_requirements):
    """Calculate job matching score based on skills"""
    if not job_requirements:
        return 0
    
    job_req_lower = job_requirements.lower()
    matches = sum(1 for skill in user_skills if skill.lower() in job_req_lower)
    return min(matches / len(user_skills) * 100, 100) if user_skills else 0

@app.route('/api/chat', methods=['POST'])
@jwt_required()
def ai_chat():
    try:
        data = request.get_json()
        user_message = data['message']
        user_id = get_jwt_identity()
        
        # Get user context
        user = User.query.get(user_id)
        
        prompt = f"""
        You are CareerNavigator-AI, an AI assistant helping with career development and learning.
        User's learning style: {user.learning_style or 'Not specified'}
        User's skill level: {user.skill_level or 'Not specified'}
        
        User message: {user_message}
        
        Provide helpful, personalized advice for career development, learning resources, 
        or job search guidance. Be encouraging and specific.
        """
        
        response = model.generate_content(prompt)
        
        return jsonify({'response': response.text})
    
    except Exception as e:
        return jsonify({'response': f'I apologize, but I encountered an error: {str(e)}. Please try again.'})

@app.route('/api/progress/update', methods=['POST'])
@jwt_required()
def update_progress():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        course_id = data['course_id']
        progress_percentage = data['progress_percentage']
        
        progress = UserProgress.query.filter_by(
            user_id=user_id, 
            course_id=course_id
        ).first()
        
        if not progress:
            progress = UserProgress(user_id=user_id, course_id=course_id)
        
        progress.progress_percentage = progress_percentage
        
        if progress_percentage >= 100:
            progress.completed_at = datetime.utcnow()
            # Award points for course completion
            user = User.query.get(user_id)
            user.points += 200
        
        db.session.add(progress)
        db.session.commit()
        
        return jsonify({'success': True, 'progress': progress_percentage})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Get user skills
        skills = UserSkill.query.filter_by(user_id=user_id).all()
        
        # Get user progress
        progress = UserProgress.query.filter_by(user_id=user_id).all()
        completed_courses = len([p for p in progress if p.progress_percentage >= 100])
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'learning_style': user.learning_style,
                'skill_level': user.skill_level,
                'career_goals': user.career_goals,
                'points': user.points,
                'badges': json.loads(user.badges) if user.badges else [],
                'completed_courses': completed_courses,
                'skills': [{'name': s.skill_name, 'level': s.proficiency_level} for s in skills]
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/leaderboard', methods=['GET'])
@jwt_required()
def get_leaderboard():
    try:
        # Get top users by points
        top_users = User.query.order_by(User.points.desc()).limit(10).all()
        
        leaderboard = []
        for i, user in enumerate(top_users):
            leaderboard.append({
                'rank': i + 1,
                'name': user.full_name,
                'points': user.points,
                'learning_style': user.learning_style
            })
        
        return jsonify({'leaderboard': leaderboard})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database
@app.before_first_request
def create_tables():
    db.create_all()
    
    # Seed sample data if needed
    if Course.query.count() == 0:
        sample_courses = [
            Course(
                title="Python Fundamentals",
                description="Learn Python programming from scratch",
                difficulty="Beginner",
                category="Programming",
                duration="4 weeks",
                skills_taught=json.dumps(["Python basics", "Data types", "Control flow", "Functions"]),
                content="Comprehensive Python course content..."
            ),
            Course(
                title="Web Development with React",
                description="Build modern web applications",
                difficulty="Intermediate",
                category="Web Development", 
                duration="6 weeks",
                skills_taught=json.dumps(["React.js", "JavaScript", "HTML/CSS", "State Management"]),
                content="React development course content..."
            ),
            Course(
                title="Machine Learning Basics",
                description="Introduction to ML concepts and algorithms",
                difficulty="Advanced",
                category="Data Science",
                duration="8 weeks", 
                skills_taught=json.dumps(["ML Algorithms", "Python", "scikit-learn", "Data Analysis"]),
                content="Machine learning course content..."
            )
        ]
        
        sample_jobs = [
            Job(
                title="Junior Python Developer",
                company="TechCorp Inc.",
                description="Entry-level Python developer position",
                requirements="Python, Flask, Git, SQL",
                salary_range="$50,000 - $70,000",
                location="Remote",
                job_type="Full-time"
            ),
            Job(
                title="React Frontend Developer",
                company="WebSolutions Ltd.",
                description="Frontend developer specializing in React",
                requirements="React.js, JavaScript, HTML/CSS, Git",
                salary_range="$60,000 - $85,000", 
                location="New York, NY",
                job_type="Full-time"
            ),
            Job(
                title="Data Analyst Intern",
                company="DataDriven Co.",
                description="Internship in data analysis and visualization",
                requirements="Python, Pandas, SQL, Statistics",
                salary_range="$15 - $20/hour",
                location="San Francisco, CA",
                job_type="Internship"
            )
        ]
        
        for course in sample_courses:
            db.session.add(course)
        for job in sample_jobs:
            db.session.add(job)
        
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True)