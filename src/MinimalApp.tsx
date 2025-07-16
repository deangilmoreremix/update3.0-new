import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Simple dashboard component for testing
function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎉 SmartCRM Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
            <p className="text-gray-600">Your main dashboard is loading...</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Pipeline</h3>
            <p className="text-gray-600">Sales pipeline management</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Contacts</h3>
            <p className="text-gray-600">Contact management system</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">AI Tools</h3>
            <p className="text-gray-600">AI-powered automation tools</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Tasks</h3>
            <p className="text-gray-600">Task management</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600">Application settings</p>
          </div>
        </div>
        
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-green-800 font-semibold">✅ Success!</h4>
          <p className="text-green-700 mt-1">
            Your SmartCRM app is loading successfully. Full features coming back online...
          </p>
        </div>
      </div>
    </div>
  );
}

function MinimalApp() {
  return (
    <div className="h-full w-full">
      <Routes>
        <Route path="/" element={<SimpleDashboard />} />
        <Route path="/dashboard" element={<SimpleDashboard />} />
        <Route path="*" element={<SimpleDashboard />} />
      </Routes>
    </div>
  );
}

export default MinimalApp;
