import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    completedCourses: 0,
    totalPoints: 0,
    currentStreak: 7,
    rank: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, coursesRes, jobsRes, leaderboardRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/courses'),
        api.get('/jobs/recommendations'),
        api.get('/leaderboard')
      ]);

      const profile = profileRes.data.user;
      setStats({
        completedCourses: profile.completed_courses,
        totalPoints: profile.points,
        currentStreak: 7, // This would come from backend
        rank: leaderboardRes.data.leaderboard.findIndex(u => u.name === profile.full_name) + 1
      });

      // Get recent courses (first 3)
      setRecentCourses(coursesRes.data.courses.slice(0, 3));
      
      // Get job recommendations (first 3)
      setJobRecommendations(jobsRes.data.jobs.slice(0, 3));
      
      setLeaderboard(leaderboardRes.data.leaderboard.slice(0, 5));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.full_name}! 🚀
        </h1>
        <p className="text-blue-100">
          Ready to continue your learning journey? Let's achieve your career goals together!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed Courses</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{stats.currentStreak} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Leaderboard Rank</p>
              <p className="text-2xl font-bold text-purple-600">#{stats.rank || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/assessment"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📝</span>
                <div>
                  <h4 className="font-medium">Take Assessment</h4>
                  <p className="text-sm text-gray-600">Discover your learning style</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/courses"
              className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎓</span>
                <div>
                  <h4 className="font-medium">Browse Courses</h4>
                  <p className="text-sm text-gray-600">Find your next course</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/jobs"
              className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">💼</span>
                <div>
                  <h4 className="font-medium">Job Matching</h4>
                  <p className="text-sm text-gray-600">Find perfect opportunities</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/chat"
              className="block p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🤖</span>
                <div>
                  <h4 className="font-medium">AI Assistant</h4>
                  <p className="text-sm text-gray-600">Get personalized guidance</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Continue Learning</h3>
          {recentCourses.length > 0 ? (
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {course.difficulty}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              <Link
                to="/courses"
                className="block text-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View all courses →
              </Link>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No courses started yet. <Link to="/courses" className="text-blue-600">Explore courses</Link>
            </p>
          )}
        </div>

        {/* Job Recommendations & Leaderboard */}
        <div className="space-y-6">
          {/* Job Recommendations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Job Matches</h3>
            {jobRecommendations.length > 0 ? (
              <div className="space-y-3">
                {jobRecommendations.map((job) => (
                  <div key={job.id} className="border-l-4 border-green-400 pl-4">
                    <h4 className="font-medium text-sm">{job.title}</h4>
                    <p className="text-xs text-gray-600">{job.company}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-green-600">{job.match_score}% match</span>
                      <span className="text-xs text-gray-500">{job.location}</span>
                    </div>
                  </div>
                ))}
                <Link
                  to="/jobs"
                  className="block text-center text-blue-600 hover:text-blue-800 font-medium text-sm mt-3"
                >
                  View all jobs →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-center text-sm">
                Complete your profile to see job matches
              </p>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Top Learners 🏆</h3>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((learner, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <span className={`text-sm font-bold w-6 ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-400' : 
                        index === 2 ? 'text-orange-400' : 'text-gray-600'
                      }`}>
                        #{learner.rank}
                      </span>
                      <span className="text-sm ml-2">{learner.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{learner.points} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center text-sm">
                No leaderboard data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
