import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      const tasks = response.data;

      const stats = {
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(task => task.status === 'pending').length,
        completedTasks: tasks.filter(task => task.status === 'completed').length,
        upcomingDeadlines: tasks
          .filter(task => task.status !== 'completed')
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5)
      };

      setStats(stats);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Stats Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Tasks</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalTasks}</dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingTasks}</dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.completedTasks}</dd>
              </div>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {stats.upcomingDeadlines.map((task) => (
                  <li key={task._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {task.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <Link
              to="/tasks"
              className="btn-primary"
            >
              View All Tasks
            </Link>
            
            {(user.role === 'admin' || user.role === 'manager') && (
              <Link
                to="/tasks/new"
                className="btn-secondary"
              >
                Create New Task
              </Link>
            )}
            
            {user.role === 'admin' && (
              <Link
                to="/users"
                className="btn-secondary"
              >
                Manage Users
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 