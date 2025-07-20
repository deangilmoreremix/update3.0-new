import React from 'react';

// Safe LineChart component that handles import issues
const SafeLineChart: React.FC<any> = (props) => {
  try {
    // Dynamically import LineChart to avoid build-time issues
    const { LineChart } = require('recharts');
    return React.createElement(LineChart, props);
  } catch (error) {
    console.warn('LineChart could not be loaded:', error);
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Chart loading...</p>
      </div>
    );
  }
};

export default SafeLineChart;
