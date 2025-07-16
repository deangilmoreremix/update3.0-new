import React from 'react';
import { GlassCard } from '../modern-ui/GlassCard';
import { AvatarWithStatus } from '../modern-ui/AvatarWithStatus';
import { ModernButton } from '../modern-ui/ModernButton';
import { Calendar, Clock, Video, MapPin, Users, ArrowRight, Plus } from 'lucide-react';
import { useContactStore } from '../../store/contactStore';
import { useAppointmentStore } from '../../store/appointmentStore';

interface Meeting {
  id: string;
  title: string;
  type: 'video' | 'phone' | 'in-person';
  startTime: string;
  endTime: string;
  location?: string;
  attendees: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export const UpcomingMeetings: React.FC = () => {
  const { contacts } = useContactStore();
  const { appointments } = useAppointmentStore();

  // Sample meeting data with real contact integration
  const upcomingMeetings: Meeting[] = [
    {
      id: '1',
      title: 'Q4 Strategy Planning',
      type: 'video',
      startTime: new Date(Date.now() + 1800000).toISOString(), // 30 min from now
      endTime: new Date(Date.now() + 5400000).toISOString(), // 1.5 hours from now
      attendees: Object.keys(contacts).slice(0, 3),
      status: 'scheduled',
      priority: 'high',
      description: 'Quarterly strategy discussion and goal setting'
    },
    {
      id: '2',
      title: 'Client Onboarding - TechCorp',
      type: 'video',
      startTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      endTime: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
      attendees: Object.keys(contacts).slice(1, 3),
      status: 'scheduled',
      priority: 'high',
      description: 'New client onboarding session'
    },
    {
      id: '3',
      title: 'Product Demo',
      type: 'phone',
      startTime: new Date(Date.now() + 14400000).toISOString(), // 4 hours from now
      endTime: new Date(Date.now() + 16200000).toISOString(), // 4.5 hours from now
      attendees: Object.keys(contacts).slice(2, 4),
      status: 'scheduled',
      priority: 'medium',
      description: 'Product demonstration for prospects'
    },
    {
      id: '4',
      title: 'Team Standup',
      type: 'in-person',
      startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 88200000).toISOString(), // Tomorrow + 30min
      location: 'Conference Room A',
      attendees: Object.keys(contacts).slice(0, 5),
      status: 'scheduled',
      priority: 'low',
      description: 'Daily team standup meeting'
    }
  ];

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const today = now.toDateString();
    const tomorrow = new Date(now.getTime() + 86400000).toDateString();
    
    if (date.toDateString() === today) return 'Today';
    if (date.toDateString() === tomorrow) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTimeUntilMeeting = (startTime: string) => {
    const now = new Date();
    const meetingTime = new Date(startTime);
    const diffMs = meetingTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) return `in ${diffMins}m`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `in ${diffHours}h`;
    const diffDays = Math.round(diffHours / 24);
    return `in ${diffDays}d`;
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'in-person': return MapPin;
      default: return Calendar;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderAttendeeAvatars = (attendeeIds: string[], maxShow = 3) => {
    const attendees = attendeeIds.map(id => contacts[id]).filter(Boolean);
    const remainingCount = Math.max(0, attendeeIds.length - maxShow);

    return (
      <div className="flex -space-x-2">
        {attendees.slice(0, maxShow).map((contact, index) => (
          <div key={contact.id} style={{ zIndex: maxShow - index }}>
            <AvatarWithStatus
              src={contact.avatarSrc}
              alt={contact.name}
              name={contact.name}
              size="sm"
              status="online"
              showStatus={false}
              className="border-2 border-white"
            />
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h3>
          <p className="text-sm text-gray-600 mt-1">Today's scheduled meetings and appointments</p>
        </div>
        <div className="flex space-x-2">
          <ModernButton variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </ModernButton>
          <ModernButton variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Schedule
          </ModernButton>
        </div>
      </div>

      <div className="space-y-4">
        {upcomingMeetings.map((meeting) => {
          const MeetingIcon = getMeetingIcon(meeting.type);
          const isUpcoming = new Date(meeting.startTime) > new Date();
          const timeUntil = getTimeUntilMeeting(meeting.startTime);

          return (
            <div
              key={meeting.id}
              className="p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MeetingIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{meeting.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(meeting.priority)}`}>
                        {meeting.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formatDate(meeting.startTime)} • {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                        </span>
                      </div>
                      {meeting.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{meeting.location}</span>
                        </div>
                      )}
                    </div>

                    {meeting.description && (
                      <p className="text-sm text-gray-600 mb-3 truncate">{meeting.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{meeting.attendees.length} attendees</span>
                        </div>
                        {renderAttendeeAvatars(meeting.attendees)}
                      </div>
                      
                      {isUpcoming && (
                        <span className="text-sm font-medium text-blue-600">
                          {timeUntil}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-3">
                  {meeting.type === 'video' && (
                    <ModernButton variant="primary" size="sm">
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </ModernButton>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {upcomingMeetings.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming meetings scheduled</p>
          <ModernButton variant="primary" size="sm" className="mt-3">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </ModernButton>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-gray-900">{upcomingMeetings.length}</p>
            <p className="text-sm text-gray-600">Today</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {upcomingMeetings.filter(m => m.type === 'video').length}
            </p>
            <p className="text-sm text-gray-600">Video Calls</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {upcomingMeetings.filter(m => m.priority === 'high').length}
            </p>
            <p className="text-sm text-gray-600">High Priority</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};