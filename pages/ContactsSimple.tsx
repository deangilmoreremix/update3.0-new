import React from 'react';

const Contacts: React.FC = () => {
  console.log("✅ Contacts component rendered");
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contacts</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Management</h2>
          <p className="text-gray-600">
            This is the Contacts page. Navigation is working properly!
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-gray-600">john@example.com</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">Jane Smith</h3>
              <p className="text-gray-600">jane@example.com</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">Bob Johnson</h3>
              <p className="text-gray-600">bob@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
