import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTaskStore } from '../store/taskStore';
import { CheckSquare, Clock, Plus } from 'lucide-react';
import Avatar from './ui/Avatar';
import { getAvatarByIndex, getInitials } from '../services/avatarCollection';

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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Days Tasks</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{taskArray.length} active tasks</p>
        </div>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {taskArray.filter(task => task.priority === 'high').length} high priority
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentTasks.map((task, index) => {
          const TaskIcon = getTaskIcon(task.status);
          const getCardClass = (isHighlighted?: boolean) => {
            return isHighlighted 
              ? isDark ? 'border-green-500/50 bg-green-500/10' : 'border-green-200 bg-green-50'
              : isDark ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white';
          };

          const getIconColor = (type: string) => {
            switch (type) {
              case 'call':
                return isDark ? 'text-blue-400' : 'text-blue-600';
              case 'email':
                return isDark ? 'text-green-400' : 'text-green-600';
              case 'meeting':
                return isDark ? 'text-purple-400' : 'text-purple-600';
              default:
                return isDark ? 'text-orange-400' : 'text-orange-600';
            }
          };

          return (
            <div key={task.id} className={`backdrop-blur-xl border rounded-2xl p-6 hover:${isDark ? 'bg-gray-800/70' : 'bg-gray-50'} transition-all duration-300 group ${getCardClass(false)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={getAvatarByIndex(index, 'executives')}
                    alt={`Team Member ${index + 1}`}
                    size="sm"
                    fallback={getInitials(`Team Member ${index + 1}`)}
                    status={task.status === 'completed' ? 'online' : task.status === 'in-progress' ? 'busy' : 'away'}
                  />
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Team Member {index + 1}
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Sales Representative
                    </p>
                  </div>
                </div>
                <button className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors opacity-0 group-hover:opacity-100`}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'} ${getIconColor(task.type || 'other')}`}>
                    <TaskIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white group-hover:text-green-400' : 'text-gray-900 group-hover:text-green-600'} transition-colors`}>
                      {task.title}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-white/10' : 'bg-gray-100'} ${getIconColor(task.type || 'other')}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800') :
                      task.priority === 'medium' ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800') :
                      (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800')
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`p-2 ${isDark ? 'bg-white/10 hover:bg-green-400/20' : 'bg-gray-100 hover:bg-green-100'} rounded-lg transition-colors`}>
                      <CheckSquare className="w-4 h-4" />
                    </button>
                    <button className={`p-2 ${isDark ? 'bg-white/10 hover:bg-green-400/20' : 'bg-gray-100 hover:bg-green-100'} rounded-lg transition-colors`}>
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksSection;