import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Assessment = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/assessment/questions');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      question_id: questions[currentQuestion].id,
      selected_option: optionIndex
    };
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async () => {
    if (answers.length !== questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/assessment/submit', { answers });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Error submitting assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Assessment Complete!
            </h2>
            <p className="text-lg text-gray-600">
              Here are your personalized results and recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Your Learning Style</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">{results.learning_style}</p>
              <p className="text-sm text-gray-600">
                {results.recommended_approach}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Skill Level</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">{results.skill_level}</p>
              <p className="text-sm text-gray-600">
                Courses will be tailored to your current level
              </p>
            </div>
          </div>

          {results.recommendations && results.recommendations.courses && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Recommended Learning Path</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.recommendations.courses.map((course, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-lg mb-2">{course.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {course.difficulty}
                      </span>
                      <span className="text-gray-500">{course.duration}</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Skills you'll learn:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {course.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="text-xs px-2 py-1 bg-gray-100 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center space-x-4">
            <button
              onClick={() => navigate('/courses')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Start Learning
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
            ></button>