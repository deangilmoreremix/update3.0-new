import React, { useState, useEffect } from 'react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { AlertTriangle, Brain, Calendar, Phone, Star, Target, TrendingUp, Users } from 'lucide-react';
import { aiCalendarService } from '../../services/aiCalendarService';

interface Appointment {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  }>;
  type: 'meeting' | 'call' | 'demo' | 'other';
  priority?: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'completed' | 'cancelled';
  aiInsights?: {
    urgency: number;
    importance: number;
    conflictRisk: number;
    successProbability: number;
  };
}

interface SmartCalendarTileProps {
  date: Date;
  appointments: Appointment[];
  isSelected?: boolean;
  isToday?: boolean;
  onClick?: (date: Date) => void;
  showAIInsights?: boolean;
}

export const SmartCalendarTile: React.FC<SmartCalendarTileProps> = ({
  date,
  appointments,
  isSelected = false,
  isToday = false,
  onClick,
  showAIInsights = true
}) => {
  const [aiAnalysis, setAiAnalysis] = useState<{
    urgencyLevel: 'low' | 'medium' | 'high';
    hasHighPriorityMeetings: boolean;
    hasConflicts: boolean;
    productivityScore: number;
    recommendations: string[];
  } | null>(null);

  const [avatarUrls, setAvatarUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (appointments.length > 0 && showAIInsights) {
      analyzeDay();
    }
  }, [appointments, showAIInsights]);

  const analyzeDay = async () => {
    try {
      // Simple AI analysis based on appointments
      const highPriorityCount = appointments.filter(apt => apt.priority === 'high').length;
      const totalDuration = appointments.reduce((total, apt) => {
        const start = new Date(apt.startTime);
        const end = new Date(apt.endTime);
        return total + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
      }, 0);

      const hasConflicts = checkForConflicts(appointments);
      const urgencyLevel = highPriorityCount > 2 ? 'high' : highPriorityCount > 0 ? 'medium' : 'low';
      
      setAiAnalysis({
        urgencyLevel,
        hasHighPriorityMeetings: highPriorityCount > 0,
        hasConflicts,
        productivityScore: Math.min(100, Math.max(0, 100 - (totalDuration / 8))), // Based on 8-hour day
        recommendations: generateRecommendations(appointments, hasConflicts, urgencyLevel)
      });

      // Generate avatars for contacts without photos
      generateMissingAvatars();
    } catch (error) {
      console.error('Error analyzing day:', error);
    }
  };

  const checkForConflicts = (appointments: Appointment[]): boolean => {
    for (const i = 0; i < appointments.length; i++) {
      for (let j = i + 1; j < appointments.length; j++) {
        const apt1Start = new Date(appointments[i].startTime);
        const apt1End = new Date(appointments[i].endTime);
        const apt2Start = new Date(appointments[j].startTime);
        const apt2End = new Date(appointments[j].endTime);

        if (apt1Start < apt2End && apt2Start < apt1End) {
          return true;
        }
      }
    }
    return false;
  };

  const generateRecommendations = (appointments: Appointment[], hasConflicts: boolean, urgencyLevel: string): string[] => {
    const recommendations: string[] = [];
    
    if (hasConflicts) {
      recommendations.push("Resolve scheduling conflicts");
    }
    
    if (urgencyLevel === 'high') {
      recommendations.push("Consider rescheduling low-priority meetings");
    }
    
    if (appointments.length > 6) {
      recommendations.push("Heavy meeting day - block focus time");
    }
    
    return recommendations;
  };

  const generateMissingAvatars = async () => {
    const newAvatarUrls: Record<string, string> = {};
    
    for (const appointment of appointments) {
      for (const attendee of appointment.attendees) {
        if (!attendee.avatar && !avatarUrls[attendee.id]) {
          try {
            const avatarUrl = await aiCalendarService.generateContactAvatar(attendee.name, attendee.role);
            if (avatarUrl) {
              newAvatarUrls[attendee.id] = avatarUrl;
            }
          } catch (error) {
            console.error('Error generating avatar:', error);
          }
        }
      }
    }
    
    if (Object.keys(newAvatarUrls).length > 0) {
      setAvatarUrls(prev => ({ ...prev, ...newAvatarUrls }));
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyTextColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const priorityAppointments = appointments.filter(apt => apt.priority === 'high');
  const allAttendees = appointments.flatMap(apt => apt.attendees);
  const uniqueAttendees = allAttendees.filter((attendee, index, self) => 
    self.findIndex(a => a.id === attendee.id) === index
  );

  return (
    <TooltipProvider>
      <div 
        className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
          isSelected 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : isToday
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        } ${
          aiAnalysis?.urgencyLevel === 'high' ? 'ring-2 ring-red-200 dark:ring-red-800' :
          aiAnalysis?.urgencyLevel === 'medium' ? 'ring-2 ring-yellow-200 dark:ring-yellow-800' : ''
        }`}
        onClick={() => onClick?.(date)}
      >
        {/* Date Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-semibold ${
              isToday ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-gray-100'
            }`}>
              {date.getDate()}
            </span>
            {isToday && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                Today
              </Badge>
            )}
          </div>
          
          {/* AI Insights Indicators */}
          {showAIInsights && aiAnalysis && (
            <div className="flex items-center gap-1">
              {aiAnalysis.hasHighPriorityMeetings && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded">
                      <Star className="w-3 h-3 text-red-600 dark:text-red-400 fill-current" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>High priority meetings</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {aiAnalysis.hasConflicts && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                      <AlertTriangle className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Scheduling conflicts detected</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {aiAnalysis.productivityScore > 80 && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                      <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Optimal productivity day</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        {/* Appointment Previews */}
        <div className="space-y-2">
          {appointments.slice(0, 3).map((appointment, index) => (
            <div key={appointment.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <div className={`w-2 h-2 rounded-full ${
                appointment.priority === 'high' ? 'bg-red-500' :
                appointment.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {appointment.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(appointment.startTime).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
              {/* Meeting Type Icon */}
              <div className="flex-shrink-0">
                {appointment.type === 'call' && <Phone className="w-3 h-3 text-blue-500" />}
                {appointment.type === 'demo' && <Target className="w-3 h-3 text-purple-500" />}
                {appointment.type === 'meeting' && <Users className="w-3 h-3 text-green-500" />}
                {appointment.type === 'other' && <Calendar className="w-3 h-3 text-gray-500" />}
              </div>
            </div>
          ))}
          
          {appointments.length > 3 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              +{appointments.length - 3} more
            </div>
          )}
        </div>

        {/* Attendee Avatars */}
        {uniqueAttendees.length > 0 && (
          <div className="mt-3 flex items-center gap-1">
            <div className="flex -space-x-2">
              {uniqueAttendees.slice(0, 4).map((attendee, index) => (
                <Tooltip key={attendee.id}>
                  <TooltipTrigger>
                    <Avatar className="w-6 h-6 border-2 border-white dark:border-gray-800">
                      <img 
                        src={attendee.avatar || avatarUrls[attendee.id] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${attendee.name}`}
                        alt={attendee.name}
                        className="w-full h-full object-cover"
                      />
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{attendee.name}</p>
                    {attendee.role && <p className="text-xs text-gray-500">{attendee.role}</p>}
                  </TooltipContent>
                </Tooltip>
              ))}
              
              {uniqueAttendees.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    +{uniqueAttendees.length - 4}
                  </span>
                </div>
              )}
            </div>
            
            {showAIInsights && aiAnalysis && (
              <div className="ml-auto flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <Brain className="w-3 h-3 text-blue-500" />
                      <span className={`text-xs font-medium ${getUrgencyTextColor(aiAnalysis.urgencyLevel)}`}>
                        {aiAnalysis.productivityScore}%
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI Productivity Score</p>
                    {aiAnalysis.recommendations.length > 0 && (
                      <div className="mt-1">
                        <p className="text-xs font-medium">Recommendations:</p>
                        <ul className="text-xs">
                          {aiAnalysis.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
        )}

        {/* AI Urgency Indicator */}
        {showAIInsights && aiAnalysis && (
          <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getUrgencyColor(aiAnalysis.urgencyLevel)}`} />
        )}
      </div>
    </TooltipProvider>
  );
};

// Import Phone icon

export default SmartCalendarTile;