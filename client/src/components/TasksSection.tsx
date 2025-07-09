import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTaskStore } from '../store/taskStore';
import { CheckSquare, Clock, AlertCircle, Plus } from 'lucide-react';
import Avatar from './ui/Avatar';
import { getAvatarByIndex, getInitials } from '../utils/avatars';

const TasksSection: React.FC = () => {
  const { isDark } = useTheme();
  const { tasks } = useTaskStore();
  
  // Convert tasks object to array and get recent tasks
  const taskArray = Object.values(tasks);
  const recentTasks = taskArray.slice(0, 6);

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckSquare;
      case 'in-progress':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'in-progress':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      default:
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return isDark ? 'text-red-400 bg-red-500/10' : 'text-red-600 bg-red-50';
      case 'medium':
        return isDark ? 'text-yellow-400 bg-yellow-500/10' : 'text-yellow-600 bg-yellow-50';
      default:
        return isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {taskArray.length} total tasks
        </span>
        <button className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}>
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {recentTasks.map((task) => {
          const TaskIcon = getTaskIcon(task.status);
          return (
            <div key={task.id} className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.01] ${
              isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white/50 hover:bg-gray-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Avatar
                    src={getAvatarByIndex(parseInt(task.id) || 0, 'executives')}
                    alt={`Task ${task.id}`}
                    size="sm"
                    fallback={getInitials(task.title || 'Task')}
                    status={task.status === 'completed' ? 'online' : task.status === 'in-progress' ? 'busy' : 'away'}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <TaskIcon className={`w-4 h-4 ${getTaskStatusColor(task.status)}`} />
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {task.title}
                      </h4>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : task.status === 'in-progress'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {recentTasks.length === 0 && (
        <div className="text-center py-8">
          <CheckSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No tasks found
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
            Create a new task to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default TasksSection;