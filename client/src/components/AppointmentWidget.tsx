import React, { useState, useEffect } from 'react';
import { useAppointmentStore } from '../store/appointmentStore';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar, Clock, Video, Phone, MapPin, ArrowRight } from 'lucide-react';


interface AppointmentWidgetProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

const AppointmentWidget: React.FC<AppointmentWidgetProps> = ({
  limit = 3,
  showHeader = true,
  className = ''
}) => {
  const { appointments } = useAppointmentStore();
  const { isDark } = useTheme();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  
  useEffect(() => {
    // Get the upcoming appointments - filter from all appointments
    const appointmentList = Object.values(appointments || {});
    const now = new Date();
    const upcoming = appointmentList
      .filter(apt => new Date(apt.startTime) > now && apt.status === 'scheduled')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, limit);
    setUpcomingAppointments(upcoming);
  }, [appointments, limit]);
  
  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  
  // Get appointment type icon
  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-purple-500" />;
      case 'phone':
        return <Phone size={16} className="text-blue-500" />;
      case 'in-person':
        return <MapPin size={16} className="text-green-500" />;
      default:
        return <Calendar size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div className={`p-4 ${className}`}>
      {upcomingAppointments.length > 0 ? (
        <div className="space-y-3">
          {upcomingAppointments.map(appointment => (
            <div 
              key={appointment.id} 
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white/50 hover:bg-gray-50'
              }`}
              onClick={() => console.log('Selected appointment:', appointment.id)}
            >
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center">
                    {getAppointmentTypeIcon(appointment.type)}
                    <h4 className={`font-medium text-sm ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {appointment.title}
                    </h4>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {appointment.contactName}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock size={12} className="mr-1" />
                    {formatDate(appointment.date)}
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {appointment.duration} min
                  </p>
                </div>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                {appointment.type === 'video' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded flex items-center ${
                    isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                  }`}>
                    <Video size={10} className="mr-1" />
                    Video Call
                  </span>
                )}
                {appointment.type === 'phone' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded flex items-center ${
                    isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Phone size={10} className="mr-1" />
                    Phone Call
                  </span>
                )}
                {appointment.type === 'in-person' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded flex items-center ${
                    isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                  }`}>
                    <MapPin size={10} className="mr-1" />
                    In Person
                  </span>
                )}
                
                <button className={`text-xs flex items-center ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                }`}>
                  Details
                  <ArrowRight size={10} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Calendar size={32} className={`mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No upcoming appointments</p>
          <button 
            onClick={() => console.log('Schedule appointment')}
            className={`mt-2 inline-block text-sm cursor-pointer ${
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            Schedule one now
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentWidget;