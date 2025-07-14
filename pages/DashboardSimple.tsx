import React from 'react';

const Dashboard: React.FC = () => {
  console.log("✅ Dashboard component rendered");
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Contacts</h3>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Active Deals</h3>
            <p className="text-3xl font-bold text-green-600">56</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
            <p className="text-3xl font-bold text-yellow-600">23</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">$45,678</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Smart CRM</h2>
          <p className="text-gray-600">
            This is a simplified dashboard view. All navigation and routing is working properly.
            You can navigate to different sections using the navbar above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
