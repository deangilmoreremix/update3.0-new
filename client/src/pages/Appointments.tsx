import React from 'react';
import { EnhancedAppointments } from '../components/calendar/EnhancedAppointments';

const Appointments: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          AI-Enhanced Calendar & Appointments
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your meetings with AI-powered insights and smart scheduling
        </p>
      </div>
      
      <EnhancedAppointments />
    </div>
  );
};

export default Appointments;