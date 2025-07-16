import React from 'react';

function SimpleApp() {
  console.log('🎯 SimpleApp is rendering');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🚀 SmartCRM Loading Test
        </h1>
        <p className="text-gray-600 mb-4">
          If you can see this, the React app is working!
        </p>
        <div className="space-y-2 text-sm">
          <p><strong>Build Status:</strong> ✅ Success</p>
          <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
          <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p><strong>Supabase Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Try Loading Dashboard
        </button>
      </div>
    </div>
  );
}

export default SimpleApp;
