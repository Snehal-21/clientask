import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueDate: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const fetchTasks = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.dueDate) queryParams.append('dueDate', filters.dueDate);

      const response = await axios.get(`http://localhost:5000/api/tasks?${queryParams}`);
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch tasks');
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, {
        status: newStatus
      });
      fetchTasks();
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link to="/tasks/new" className="btn-primary">
                  Create New Task
                </Link>
              )}
            </div> */}

            {/* Filters */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={filters.dueDate}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>

            {/* Task List */}
            <div className="mt-8 flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Assigned To
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentTasks.map((task) => (
                          <tr key={task._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                className="text-sm text-gray-900 border-gray-300 rounded-md"
                                disabled={user.role === 'user' && task.assignedTo._id !== user.id}
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.assignedTo.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {(user.role === 'admin' || user.role === 'manager') && (
                                <>
                                  <Link
                                    to={`/tasks/${task._id}/edit`}
                               
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => handleDelete(task._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>

                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {(user.role === 'user') && (
                                <>
                                  <Link
                                    to={`/tasks/${task._id}/edit`}
                               
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                  >
                                    Edit
                                  </Link>
                                 
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 