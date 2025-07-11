import React from 'react';

const AITools: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          AI Tools
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300">
            Your AI tools will appear here. This is a basic page to get the app running.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AITools;