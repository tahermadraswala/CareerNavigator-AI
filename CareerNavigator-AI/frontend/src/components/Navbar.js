import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
              CareerNavigator-AI
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/dashboard" className={`px-3 py-2 ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/assessment" className={`px-3 py-2 ${isActive('/assessment')}`}>
                Assessment
              </Link>
              <Link to="/courses" className={`px-3 py-2 ${isActive('/courses')}`}>
                Courses
              </Link>
              <Link to="/jobs" className={`px-3 py-2 ${isActive('/jobs')}`}>
                Jobs
              </Link>
              <Link to="/chat" className={`px-3 py-2 ${isActive('/chat')}`}>
                AI Assistant
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium">{user?.points || 0} points</span>
            </div>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600">
              👤 {user?.full_name}
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;