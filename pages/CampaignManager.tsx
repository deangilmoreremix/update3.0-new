import React from 'react';

const CampaignManager: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Campaign Manager</h1>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign Manager Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              Manage your marketing campaigns, email sequences, and automated workflows.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Email Campaigns</h3>
                <p className="text-sm text-gray-600">Create and manage email marketing campaigns</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Automation</h3>
                <p className="text-sm text-gray-600">Set up automated drip campaigns</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">Track campaign performance and ROI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;
