import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Navigate, useNavigate } from 'react-router-dom';

interface AIGoal {
  id: string;
  title: string;
  progress: number;
  status: 'active' | 'completed' | 'pending';
  dueDate: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const AIGoalsCard: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const aiGoals: AIGoal[] = [
    {
      id: '1',
      title: 'Automate Lead Qualification',
      progress: 75,
      status: 'active',
      dueDate: '2025-01-15',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2',
      title: 'Optimize Email Campaigns',
      progress: 90,
      status: 'active',
      dueDate: '2025-01-10',
      icon: Zap,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '3',
      title: 'Predictive Deal Scoring',
      progress: 100,
      status: 'completed',
      dueDate: '2025-01-08',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '4',
      title: 'Smart Contact Enrichment',
      progress: 30,
      status: 'pending',
      dueDate: '2025-01-20',
      icon: Target,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDark ? 'text-green-400' : 'text-green-600';
      case 'active':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'pending':
        return isDark ? 'text-orange-400' : 'text-orange-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`p-6 rounded-2xl backdrop-blur-sm ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'
    } border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          AI Goals Progress
        </h3>
        <button
          onClick={() => navigate('/ai-goals')}
          className={`text-sm px-3 py-1 rounded-lg transition-colors ${
            isDark 
              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {aiGoals.map((goal) => {
          const IconComponent = goal.icon;
          
          return (
            <div key={goal.id} className="group cursor-pointer" onClick={() => navigate('/ai-goals')}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${goal.color} bg-opacity-20`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {goal.title}
                    </h4>
                    <p className={`text-xs ${getStatusColor(goal.status)}`}>
                      {goal.status === 'completed' ? 'Completed' : `Due ${new Date(goal.dueDate).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {goal.progress}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className={`h-2 rounded-full overflow-hidden ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-full bg-gradient-to-r ${goal.color} transition-all duration-500`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className={`mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {aiGoals.filter(g => g.status === 'completed').length}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Completed
            </p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {aiGoals.filter(g => g.status === 'active').length}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              In Progress
            </p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(aiGoals.reduce((acc, g) => acc + g.progress, 0) / aiGoals.length)}%
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Avg Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGoalsCard;