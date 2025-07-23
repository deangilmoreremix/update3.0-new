import React, { FC } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Construction } from 'lucide-react';

const PlaceholderPage: FC<PlaceholderPageProps> = ({ title, description, icon }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          {icon || <Construction className="w-16 h-16 text-gray-400 mb-4" />}
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-md`}>
            {description || `${title} functionality is coming soon. This page is under development.`}
          </p>
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-8 max-w-md w-full`}>
            <h3 className="text-lg font-semibold mb-4">Coming Soon Features:</h3>
            <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Advanced {title.toLowerCase()} management</li>
              <li>• Real-time analytics and insights</li>
              <li>• AI-powered recommendations</li>
              <li>• Integration with existing tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
