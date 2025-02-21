# Sahay - Personalized Learning Pathway Generator

Sahay is an AI-driven platform that revolutionizes personalized learning and career development. It dynamically tailors learning pathways and job recommendations to each student based on their unique needs, learning styles, and career aspirations.

## Key Features

### 1. Personalized Learning Paths
- **Dynamic Assessment:** Utilizes a 20-question adaptive test to evaluate learning styles (Visual, Auditory, Kinesthetic) and knowledge levels.
- **Tailored Recommendations:** Suggests structured courses, difficulty levels, and study formats based on individual profiles.

### 2. AI Skill Assessment & Progress Tracking
- **Skill Evaluation:** Continuously assesses students’ current skills and identifies knowledge gaps.
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

## Technology Stack

### Frontend
- **React.js:** For building an interactive and dynamic user interface.
- **Tailwind CSS:** For creating a responsive and modern design.

### Backend
- **Flask (Python):** Handles API requests and core backend logic.
- **PostgreSQL:** Robust relational database for managing user data, assessments, and recommendations.

### AI & Machine Learning
- **Latest AI Technologies:** Utilized for advanced data processing and intelligent recommendations.
- **OpenAI GPT-4 Turbo & Google Gemini 1.5 Pro:** Power natural language processing, AI-driven chat assistance, and intelligent content generation.
- **Semantic Matching:** Utilizes FAISS with cosine similarity and SentenceTransformers (e.g., all-MiniLM-L6-v2) for precise content and job matching.

### Recommendation & Job Matching System
- **AI-Powered Path Generator:** Suggests personalized courses, career pathways, and skill-building resources.
- **Job Recommendation Model:** Uses BERT and TF-IDF-based methods to align user skills with industry demands.
- **Resume Processing:** Features an auto resume updater and parser using spaCy and Named Entity Recognition (NER).

### Infrastructure & Deployment
- **Google Cloud Platform (GCP) & Vertex AI:** For scalable hosting, data processing, and AI model deployment.
- **Flask API Integration:** Ensures seamless communication between frontend, backend, and AI components.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/sahay.git
   ```
2. **Backend Setup:**
   - Navigate to the project root and install dependencies:
     ```bash
     cd sahay
     pip install -r requirements.txt
     ```
   - Set up your PostgreSQL database and configure your environment variables.
   - Run the Flask server:
     ```bash
     python app.py
     ```
3. **Frontend Setup:**
   - Navigate to the `client` directory:
     ```bash
     cd client
     npm install
     npm start
     ```

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any features, enhancements, or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).

---

Sahay brings together advanced AI techniques and modern web technologies to offer a comprehensive, personalized learning and career development ecosystem. Whether you're a student aiming to boost your career or an organization looking to enhance training programs, Sahay provides a cutting-edge solution tailored for success.
