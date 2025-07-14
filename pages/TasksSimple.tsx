import React from 'react';

const Tasks: React.FC = () => {
  console.log("✅ Tasks component rendered");
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tasks</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Management</h2>
          <p className="text-gray-600">
            This is the Tasks page. Navigation is working properly!
          </p>
          
          <div className="mt-6 space-y-4">
            <div className="border p-4 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Follow up with John Doe</h3>
                <p className="text-gray-600">Due: Today</p>
              </div>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">High</span>
            </div>
            <div className="border p-4 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Prepare proposal for ABC Corp</h3>
                <p className="text-gray-600">Due: Tomorrow</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Medium</span>
            </div>
            <div className="border p-4 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Review quarterly reports</h3>
                <p className="text-gray-600">Due: Next week</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
