import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar, AlertCircle, Loader } from 'lucide-react';
import { Task, deleteTask } from '../services/taskService';

interface TaskCardProps {
  task: Task;
  onTaskDeleted: () => void;
}

const TaskCard = ({ task, onTaskDeleted }: TaskCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTask(task.id!);
        onTaskDeleted();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // Function to get status color
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
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between items-start">
        <Link to={`/tasks/${task.id}`} className="flex-1">
          <h3 className="font-medium text-lg text-gray-900 hover:text-blue-600 transition-colors">
            {task.title}
          </h3>
        </Link>
        
        <div className="flex space-x-2">
          <Link 
            to={`/tasks/${task.id}/edit`}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            aria-label="Edit task"
          >
            <Edit size={18} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            aria-label="Delete task"
          >
            {isDeleting ? <Loader className="animate-spin\" size={18} /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="mt-2 text-gray-600 line-clamp-2">{task.description}</p>
      )}
      
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ')}
        </span>
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
        )}
        
        {task.remarks && (
          <div className="flex items-center text-xs text-gray-500 ml-auto">
            <AlertCircle size={14} className="mr-1" />
            <span className="truncate max-w-[150px]">{task.remarks}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;