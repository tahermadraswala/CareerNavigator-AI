CareerNavigator-AI is an AI-driven platform that revolutionizes personalized learning and career development. It dynamically tailors learning pathways and job recommendations to each student based on their unique needs, learning styles, and career aspirations.

## 🚀 Key Features

### 1. Personalized Learning Paths
- **Dynamic Assessment:** Utilizes a 20-question adaptive test to evaluate learning styles (Visual, Auditory, Kinesthetic) and knowledge levels.
- **Tailored Recommendations:** Suggests structured courses, difficulty levels, and study formats based on individual profiles.

### 2. AI Skill Assessment & Progress Tracking
- **Skill Evaluation:** Continuously assesses students' current skills and identifies knowledge gaps.
- **Real-Time Analytics:** Tracks progress and offers adaptive recommendations to keep students on course.

### 3. Gamified Learning & Engagement
- **Interactive Motivation:** Employs badges, rewards, leaderboards, and challenges to enhance engagement.
- **Immersive Experiences:** Integrates interactive learning modules to boost student participation.

### 4. 24/7 AI Guidance & Support
- **Round-the-Clock Assistance:** Provides AI-driven support for academic and career-related queries.
- **Instant Resolution:** Offers immediate doubt resolution and personalized learning recommendations.

### 5. Career Matching & Job Readiness
- **Industry Alignment:** Aligns learning paths with current industry trends and job market demands.
- **Career Tools:** Features AI-driven job matching, resume building, and mock interview preparation.
- **Opportunity Discovery:** Helps students identify internships and job opportunities tailored to their skills.

## 🛠️ Technology Stack

### Frontend
- **React.js:** For building an interactive and dynamic user interface.
- **Tailwind CSS:** For creating a responsive and modern design.

### Backend
- **Flask (Python):** Handles API requests and core backend logic.
- **PostgreSQL:** Robust relational database for managing user data, assessments, and recommendations.

### AI & Machine Learning
- **Google Gemini 2.0 Flash:** Powers natural language processing, AI-driven chat assistance, and intelligent content generation.
- **Semantic Matching:** Utilizes FAISS with cosine similarity and SentenceTransformers (e.g., all-MiniLM-L6-v2) for precise content and job matching.

### Recommendation & Job Matching System
- **AI-Powered Path Generator:** Suggests personalized courses, career pathways, and skill-building resources.
- **Job Recommendation Model:** Uses BERT and TF-IDF-based methods to align user skills with industry demands.
- **Resume Processing:** Features an auto resume updater and parser using spaCy and Named Entity Recognition (NER).

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Git

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CareerNavigator-AI.git
cd CareerNavigator-AI
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Install Additional NLP Models
```bash
# Install spaCy English model
python -m spacy download en_core_web_sm
```

#### Database Setup
1. Create a PostgreSQL database named `careernavigator`
2. Update the database connection string in `.env` file
3. Initialize the database tables (they will be created automatically on first run)

#### Environment Configuration
1. Copy `.env.example` to `.env`
2. Update the following variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `SECRET_KEY`: A secure secret key for session management
   - `JWT_SECRET_KEY`: A secure key for JWT token generation

#### Run the Flask Server
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Node.js Dependencies
```bash
npm install
```

#### Start the Development Server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Assessment Endpoints
- `GET /api/assessment/questions` - Get assessment questions
- `POST /api/assessment/submit` - Submit assessment answers

### Course Endpoints
- `GET /api/courses` - Get all courses with user progress
- `POST /api/progress/update` - Update course progress

### Job Endpoints
- `GET /api/jobs/recommendations` - Get personalized job recommendations

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### AI Chat Endpoint
- `POST /api/chat` - Chat with AI assistant

### Leaderboard Endpoint
- `GET /api/leaderboard` - Get top learners leaderboard

## 🎯 Core Features Walkthrough

### 1. User Registration & Authentication
- Secure user registration with email verification
- JWT-based authentication for API access
- Role-based access control

### 2. Learning Style Assessment
- Interactive 20-question assessment
- Machine learning-based learning style detection
- Personalized course recommendations based on results

### 3. Course Management
- Comprehensive course catalog with filtering
- Progress tracking and completion certificates
- Difficulty-based course progression

### 4. AI-Powered Career Guidance
- 24/7 chat assistance using Google Gemini
- Contextual career advice based on user profile
- Industry trend analysis and recommendations

### 5. Job Matching System
- Skills-based job recommendations
- Real-time job market analysis
- Application tracking and interview preparation

### 6. Gamification Elements
- Points system for course completion
- Achievement badges and milestones
- Leaderboard competition
- Progress streaks and challenges

## 🔧 Development

### Running Tests
```bash
# Backend tests
python -m pytest tests/

# Frontend tests
cd frontend
npm test
```

### Code Formatting
```bash
# Backend (using black)
black app.py

# Frontend (using prettier)
cd frontend
npx prettier --write src/
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set up PostgreSQL add-on
3. Configure environment variables
4. Deploy using Git

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the build folder to your chosen platform
3. Configure API endpoint URLs for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request
