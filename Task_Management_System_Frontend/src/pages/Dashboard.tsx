import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, Loader } from 'lucide-react';
import { getAllTasks, getTasksByStatus, searchTasks, Task } from '../services/taskService';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      let tasksData: Task[];
      
      if (statusFilter !== 'ALL') {
        tasksData = await getTasksByStatus(statusFilter);
      } else if (searchTerm) {
        tasksData = await searchTasks(searchTerm);
      } else {
        tasksData = await getAllTasks();
      }
      
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, [statusFilter]); // Re-fetch when status filter changes
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <Link 
          to="/tasks/new" 
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusCircle size={18} className="mr-1" />
          New Task
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <button 
                type="submit" 
                className="absolute inset-y-0 right-0 px-3 bg-blue-600 text-white rounded-r-md"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Filter */}
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Tasks</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin h-10 w-10 text-blue-600" />
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No tasks found. Create your first task to get started!</p>
          </div>
        ) : (
          <TaskList tasks={tasks} onTasksChange={fetchTasks} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;