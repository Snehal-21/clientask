import React, { useCallback, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaTasks, FaPlus, FaUsers, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-bold">Navigation</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-white/10"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul>
              <li className="mb-2">
                <button 
                  onClick={() => handleNavigation('/dashboard')} 
                  className={`flex items-center w-full text-left p-2 hover:bg-white/10 rounded transition-colors duration-200 ${
                    location.pathname === '/dashboard' ? 'bg-white/20' : ''
                  }`}
                >
                  <FaHome className="w-5 h-5 mr-3" />
                  Dashboard
                </button>
              </li>
              <li className="mb-2">
                <button 
                  onClick={() => handleNavigation('/tasks')} 
                  className={`flex items-center w-full text-left p-2 hover:bg-white/10 rounded transition-colors duration-200 ${
                    location.pathname === '/tasks' ? 'bg-white/20' : ''
                  }`}
                >
                  <FaTasks className="w-5 h-5 mr-3" />
                  Tasks
                </button>
              </li>
              {(user.role === 'admin' || user.role === 'manager') && (
                <li className="mb-2">
                  <button 
                    onClick={() => handleNavigation('/tasks/new')} 
                    className={`flex items-center w-full text-left p-2 hover:bg-white/10 rounded transition-colors duration-200 ${
                      location.pathname === '/tasks/new' ? 'bg-white/20' : ''
                    }`}
                  >
                    <FaPlus className="w-5 h-5 mr-3" />
                    Create Task
                  </button>
                </li>
              )}
              {user.role === 'admin' && (
                <li className="mb-2">
                  <button 
                    onClick={() => handleNavigation('/users')} 
                    className={`flex items-center w-full text-left p-2 hover:bg-white/10 rounded transition-colors duration-200 ${
                      location.pathname === '/users' ? 'bg-white/20' : ''
                    }`}
                  >
                    <FaUsers className="w-5 h-5 mr-3" />
                    Manage Users
                  </button>
                </li>
              )}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-2 text-white hover:bg-white/10 rounded transition-colors duration-200"
            >
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Titlebar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-4"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">
              Welcome, {user.name} <span className="text-blue-600 text-lg font-normal">({user.role})</span>
            </h1>
          </div>
          {/* <button 
            onClick={handleLogout} 
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            <FaSignOutAlt className="w-5 h-5 mr-2" />
            Logout
          </button> */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
