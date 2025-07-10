import React from 'react';
import { CheckSquare, MessageSquare, Calendar } from 'lucide-react';
import TasksAndFunnel from '../dashboard/TasksAndFunnel';
import RecentActivity from '../dashboard/RecentActivity';

const ActivitiesCommunications: React.FC = () => {

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-3">
          <CheckSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Activities & Communications</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Task management and communication tracking
          </p>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tasks Section (2 columns) */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks & Calendar</h3>
              <div className="flex space-x-2">
                <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30">
                  Add Task
                </button>
                <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30">
                  Schedule
                </button>
              </div>
            </div>
            <TasksAndFunnel />
          </div>
        </div>
        
        {/* Right: Communications & Appointments (1 column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Appointments Widget */}
          <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Calendar size={18} className="text-blue-600 mr-2" />
                Upcoming Appointments
              </h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-medium text-blue-900 dark:text-blue-100">Sales Demo</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Today, 2:00 PM</div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-medium text-green-900 dark:text-green-100">Client Meeting</div>
                <div className="text-sm text-green-700 dark:text-green-300">Tomorrow, 10:00 AM</div>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-medium text-purple-900 dark:text-purple-100">Team Standup</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Friday, 9:00 AM</div>
              </div>
            </div>
          </div>
          
          {/* Communications Panel */}
          <div className="bg-white/5 dark:bg-white/5 border-white/10 dark:border-white/10 backdrop-blur-xl border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <MessageSquare size={18} className="text-orange-600 mr-2" />
                Recent Communications
              </h3>
            </div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesCommunications;