import React from 'react';
import { Users, Plus } from 'lucide-react';
import CustomerProfile from '../dashboard/CustomerProfile';
import NewLeadsSection from '../dashboard/NewLeadsSection';

const CustomerLeadManagement: React.FC = () => {

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-3">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Customer & Lead Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Contact profiles and lead nurturing tools
            </p>
          </div>
        </div>
        
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} />
          <span>Add Contact</span>
        </button>
      </div>

      {/* 3-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: New Leads Section (2 columns) */}
        <div className="lg:col-span-2">
          <NewLeadsSection />
        </div>
        
        {/* Right: Customer Profile (1 column) */}
        <div className="lg:col-span-1">
          <CustomerProfile />
        </div>
      </div>
    </div>
  );
};

export default CustomerLeadManagement;