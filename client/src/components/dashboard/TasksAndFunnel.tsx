import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskStore } from '../../store/taskStore';
import { useDealStore } from '../../store/dealStore';
import { CheckSquare, Clock, AlertCircle, TrendingUp } from 'lucide-react';

const TasksAndFunnel: React.FC = () => {
  const { isDark } = useTheme();
  const { tasks } = useTaskStore();
  const { deals } = useDealStore();

  // Convert tasks object to array and get recent tasks
  const taskArray = Object.values(tasks);
  const recentTasks = taskArray.slice(0, 6);

  // Convert deals object to array and calculate funnel stages
  const dealArray = Object.values(deals);
  const funnelStages = [
    { name: 'Discovery', count: dealArray.filter(d => d.stage === 'discovery').length, color: 'blue' },
    { name: 'Qualification', count: dealArray.filter(d => d.stage === 'qualification').length, color: 'green' },
    { name: 'Proposal', count: dealArray.filter(d => d.stage === 'proposal').length, color: 'yellow' },
    { name: 'Negotiation', count: dealArray.filter(d => d.stage === 'negotiation').length, color: 'orange' },
    { name: 'Closed Won', count: dealArray.filter(d => d.stage === 'closed-won').length, color: 'green' },
  ];

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
        return isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600';
      case 'medium':
        return isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
      default:
        return isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600';
    }
  };

  const getStageColor = (color: string) => {
    const colorMap = {
      blue: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
      green: isDark ? 'bg-green-500/20' : 'bg-green-100',
      yellow: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
      orange: isDark ? 'bg-orange-500/20' : 'bg-orange-100',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tasks Section */}
      <div className={`p-6 rounded-xl border ${
        isDark 
          ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
          : 'border-gray-200 bg-white/50 backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent Tasks
          </h2>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {taskArray.length} total
          </span>
        </div>
        
        <div className="space-y-3">
          {recentTasks.map((task) => {
            const TaskIcon = getTaskIcon(task.status);
            return (
              <div key={task.id} className={`p-3 rounded-lg border ${
                isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-white/50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <TaskIcon className={`h-5 w-5 mt-0.5 ${getTaskStatusColor(task.status)}`} />
                    <div className="flex-1">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className={`w-full mt-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
          isDark 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}>
          View All Tasks
        </button>
      </div>

      {/* Sales Funnel Section */}
      <div className={`p-6 rounded-xl border ${
        isDark 
          ? 'border-white/10 bg-white/5 backdrop-blur-sm' 
          : 'border-gray-200 bg-white/50 backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sales Funnel
          </h2>
          <TrendingUp className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
        </div>
        
        <div className="space-y-4">
          {funnelStages.map((stage, index) => (
            <div key={stage.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStageColor(stage.color)}`} />
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stage.name}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stage.count} deals
                </span>
                <div className={`w-20 h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full rounded-full ${getStageColor(stage.color)}`}
                    style={{ width: `${Math.max(10, (stage.count / Math.max(...funnelStages.map(s => s.count))) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 rounded-lg ${
          isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-r from-blue-50 to-purple-50'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Pipeline Value
            </span>
            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ${dealArray.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksAndFunnel;