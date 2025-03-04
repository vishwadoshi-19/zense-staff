import { Clock, Check } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  time: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (id: number) => void;
}

export const TaskList = ({ tasks, onTaskToggle }: TaskListProps) => {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            task.completed
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => onTaskToggle(task.id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 
                       transition-colors ${
                         task.completed
                           ? 'bg-green-500 border-green-500'
                           : 'border-gray-300 hover:border-blue-500'
                       }`}
            >
              {task.completed && <Check className="w-4 h-4 text-white" />}
            </button>
            <div>
              <p className={`font-medium ${
                task.completed ? 'text-green-700 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {task.time}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};