import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, AlertCircle, Loader } from 'lucide-react';
import { getTaskById, deleteTask, Task } from '../services/taskService';

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      
      try {
        const taskData = await getTaskById(parseInt(taskId, 10));
        setTask(taskData);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [taskId]);
  
  const handleDelete = async () => {
    if (!taskId || !window.confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(parseInt(taskId, 10));
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      setIsDeleting(false);
    }
  };
  
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }
  
  if (error || !task) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        {error || 'Task not found'}
        <div className="mt-4">
          <Link to="/dashboard" className="text-blue-600 hover:underline flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="flex flex-wrap justify-between items-start mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
        
        <div className="flex space-x-2">
          <Link 
            to={`/tasks/${task.id}/edit`} 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-colors disabled:bg-red-400"
          >
            {isDeleting ? (
              <Loader className="animate-spin h-4 w-4 mr-1" />
            ) : (
              <Trash2 size={16} className="mr-1" />
            )}
            Delete
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      
      {task.description && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {task.dueDate && (
          <div className="flex items-start">
            <Calendar size={18} className="mr-2 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Due Date</p>
              <p className="text-gray-600">{format(new Date(task.dueDate), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        )}
        
        {task.createdOn && (
          <div className="flex items-start">
            <Clock size={18} className="mr-2 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Created</p>
              <p className="text-gray-600">{format(new Date(task.createdOn), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        )}
      </div>
      
      {task.remarks && (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-start">
            <AlertCircle size={18} className="mr-2 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Remarks</p>
              <p className="text-gray-600 whitespace-pre-line">{task.remarks}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;