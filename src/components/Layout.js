import React, { useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 fixed h-full">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <button onClick={() => handleNavigation('/dashboard')} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${location.pathname === '/dashboard' ? 'bg-gray-700' : ''}`}>Dashboard</button>
            </li>
            <li className="mb-2">
              <button onClick={() => handleNavigation('/tasks')} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${location.pathname === '/tasks' ? 'bg-gray-700' : ''}`}>Tasks</button>
            </li>
            {(user.role === 'admin' || user.role === 'manager') && (
              <li className="mb-2">
                <button onClick={() => handleNavigation('/tasks/new')} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${location.pathname === '/tasks/new' ? 'bg-gray-700' : ''}`}>Create Task</button>
              </li>
            )}
            {user.role === 'admin' && (
              <li className="mb-2">
                <button onClick={() => handleNavigation('/users')} className={`block w-full text-left p-2 hover:bg-gray-700 rounded ${location.pathname === '/users' ? 'bg-gray-700' : ''}`}>Manage Users</button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Titlebar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Logout
          </button>
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
