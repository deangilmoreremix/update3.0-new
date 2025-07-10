import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageSquare, Calendar, Phone } from 'lucide-react';
import TasksAndFunnel from '../dashboard/TasksAndFunnel';
import InteractionHistory from '../dashboard/InteractionHistory';

const ActivitiesCommunications: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="mb-10">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mr-3">
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Activities & Communications</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Task management and communication tracking
          </p>
        </div>
      </div>

      {/* Three column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section - 2 columns */}
        <div className="lg:col-span-2">
          <TasksAndFunnel />
        </div>
        
        {/* Appointments and Communications - 1 column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upcoming Appointments */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Appointments</h3>
              <Calendar className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Demo with TechCorp', time: '2:00 PM', type: 'Video Call' },
                { title: 'Follow-up call', time: '4:30 PM', type: 'Phone Call' },
                { title: 'Strategy meeting', time: 'Tomorrow 10:00 AM', type: 'In-person' }
              ].map((appointment, index) => (
                <div key={index} className={`flex items-center justify-between p-3 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{appointment.title}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{appointment.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    appointment.type === 'Video Call' ? 'bg-blue-100 text-blue-800' :
                    appointment.type === 'Phone Call' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {appointment.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Communication Overview */}
          <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Communication Stats</h3>
              <Phone className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Emails Sent</span>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Calls Made</span>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Meetings</span>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Response Rate</span>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interaction History */}
      <div className="mt-6">
        <InteractionHistory />
      </div>
    </div>
  );
};

export default ActivitiesCommunications;