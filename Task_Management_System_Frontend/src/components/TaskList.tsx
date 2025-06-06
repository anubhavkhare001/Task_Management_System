import { Task } from '../services/taskService';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onTasksChange: () => void;
}

const TaskList = ({ tasks, onTasksChange }: TaskListProps) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task}
          onTaskDeleted={onTasksChange}
        />
      ))}
    </div>
  );
};

export default TaskList;