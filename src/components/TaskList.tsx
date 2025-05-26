"use client";

import { Clock, Check } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          key={task.id}
          className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
            task.completed
              ? "bg-green-50 border-green-200"
              : "bg-white border-gray-200 hover:border-teal-200 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTaskToggle(task.id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 
                       transition-colors ${
                         task.completed
                           ? "bg-green-500 border-green-500"
                           : "border-gray-300 hover:border-teal-700"
                       }`}
            >
              {task.completed && <Check className="w-4 h-4 text-white" />}
            </motion.button>
            <div>
              <p
                className={`font-medium ${
                  task.completed
                    ? "text-green-700 line-through"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {task.time}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
