import React from 'react';

const Pipeline: React.FC = () => {
  console.log("✅ Pipeline component rendered");
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pipeline</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Pipeline</h2>
          <p className="text-gray-600">
            This is the Pipeline page. Navigation is working properly!
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border p-4 rounded-lg bg-blue-50">
              <h3 className="font-semibold">Prospects</h3>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <div className="border p-4 rounded-lg bg-yellow-50">
              <h3 className="font-semibold">Qualified</h3>
              <p className="text-2xl font-bold text-yellow-600">8</p>
            </div>
            <div className="border p-4 rounded-lg bg-orange-50">
              <h3 className="font-semibold">Proposal</h3>
              <p className="text-2xl font-bold text-orange-600">5</p>
            </div>
            <div className="border p-4 rounded-lg bg-green-50">
              <h3 className="font-semibold">Closed Won</h3>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
