import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Assessment from './components/Assessment';
import Courses from './components/Courses';
import Jobs from './components/Jobs';
import Chat from './components/Chat';
import Profile from './components/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Error loading profile. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
            <p className="text-blue-100 mb-2">{profile.email}</p>
            <div className="flex items-center space-x-4 text-sm">
              {profile.learning_style && (
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  📚 {profile.learning_style} Learner
                </span>
              )}
              {profile.skill_level && (
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  🎯 {profile.skill_level} Level
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Learning Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{profile.points}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{profile.completed_courses}</div>
                <div className="text-sm text-gray-600">Courses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{profile.badges?.length || 0}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">7</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Career Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Career Goals</h3>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
              )}
            </div>
            
            {editing ? (
              <div className="space-y-4">
                <textarea
                  value={formData.career_goals}
                  onChange={(e) => setFormData({ ...formData, career_goals: e.target.value })}
                  placeholder="Describe your career goals and aspirations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {profile.career_goals ? (
                  <p className="text-gray-700">{profile.career_goals}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    No career goals set yet. Click "Edit" to add your career aspirations.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Skills & Proficiency</h3>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="space-y-3">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">
                        {skill.level}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-gray-500 mb-4">No skills recorded yet</p>
                <p className="text-sm text-gray-400">
                  Complete courses and assessments to track your skills
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Style Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Learning Preferences</h3>
            {profile.learning_style ? (
              <div>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">
                    {profile.learning_style === 'Visual' ? '👁️' : 
                     profile.learning_style === 'Auditory' ? '👂' : '✋'}
                  </span>
                  <span className="font-medium">{profile.learning_style} Learner</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {profile.learning_style === 'Visual' && 'You learn best through visual aids, diagrams, and reading materials.'}
                  {profile.learning_style === 'Auditory' && 'You learn best through listening to explanations and discussions.'}
                  {profile.learning_style === 'Kinesthetic' && 'You learn best through hands-on practice and experimentation.'}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 mb-3">Learning style not identified</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Take Assessment
                </button>
              </div>
            )}
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-medium text-sm">First Course Completed</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-medium text-sm">100 Points Milestone</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-medium text-sm">Assessment Completed</p>
                  <p className="text-xs text-gray-500">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                📊 View Progress Report
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100">
                📄 Download Resume
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
                🎯 Update Skills
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100">
                📝 Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;