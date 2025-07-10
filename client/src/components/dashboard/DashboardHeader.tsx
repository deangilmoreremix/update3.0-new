import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { User, Calendar, Clock } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  
  // Get current date information
  const currentDate = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
  const currentTime = currentDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Get user info (mock for now, can be connected to auth later)
  const currentUser = {
    name: 'John Smith',
    role: 'Sales Manager'
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {currentUser.name}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              Here's what's happening with your sales today
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{currentTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">{currentUser.role}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Optional motivational message or stats */}
      <div className="mt-4 p-4 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10">
        <p className="text-sm text-gray-300">
          💡 <strong>Pro tip:</strong> You have {Object.values(contacts).length} active contacts. 
          Focus on high-value opportunities to maximize your pipeline today!
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;