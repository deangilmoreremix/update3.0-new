import React from 'react';
import { Trophy, Star, Target, Zap } from 'lucide-react';

export const AchievementPanel: React.FC = () => {
  const achievements = [
    {
      id: 1,
      title: 'Deal Closer',
      description: 'Closed 5 deals this month',
      progress: 85,
      icon: Trophy,
      color: 'text-yellow-500'
    },
    {
      id: 2,
      title: 'Pipeline Master',
      description: 'Managed $500K+ in pipeline value',
      progress: 92,
      icon: Star,
      color: 'text-blue-500'
    },
    {
      id: 3,
      title: 'AI Pioneer',
      description: 'Used AI analysis 50+ times',
      progress: 67,
      icon: Zap,
      color: 'text-purple-500'
    },
    {
      id: 4,
      title: 'Target Achiever',
      description: 'Hit monthly sales target',
      progress: 100,
      icon: Target,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Team Achievements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon;
          return (
            <div key={achievement.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <IconComponent className={`w-6 h-6 ${achievement.color}`} />
                <h3 className="ml-2 font-medium text-gray-900 dark:text-white">{achievement.title}</h3>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {achievement.description}
              </p>
              
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${achievement.progress}%` }}
                />
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {achievement.progress}% complete
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};