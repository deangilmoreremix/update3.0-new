import React from 'react';
import { Info, User, Crown, Shield, Upload } from 'lucide-react';

export const DemoInstructions: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="space-y-4">
          <h3 className="font-semibold text-blue-900">Demo Instructions</h3>
          
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <p className="font-medium">Quick Login Options:</p>
              <ul className="mt-2 space-y-1 ml-4">
                <li className="flex items-center">
                  <User className="w-3 h-3 mr-2" />
                  <strong>Regular User:</strong> Use any email (e.g., demo@example.com) + any password
                </li>
                <li className="flex items-center">
                  <Crown className="w-3 h-3 mr-2" />
                  <strong>Super Admin:</strong> Use email with "admin" (e.g., admin@company.com) + any password
                </li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium">Super Admin Features:</p>
              <ul className="mt-2 space-y-1 ml-4">
                <li className="flex items-center">
                  <Shield className="w-3 h-3 mr-2" />
                  Access Super Admin Dashboard from profile dropdown
                </li>
                <li className="flex items-center">
                  <Upload className="w-3 h-3 mr-2" />
                  Use "Bulk Upload" tab for CSV user management and AI role assignment
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-100 rounded p-3 mt-4">
              <p className="font-medium text-blue-900">Note about Replit Auth:</p>
              <p className="text-blue-800">
                The "Continue with Replit" button is disabled in demo mode to prevent popup issues. 
                Use the email/password form above for testing all features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};