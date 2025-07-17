import React, { useState, useEffect } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { SmartCalendarTile } from './SmartCalendarTile';
import { AIMeetingAssistant } from './AIMeetingAssistant';
import { SmartSchedulingModal } from './SmartSchedulingModal';
import { AlertCircle, Brain, Calendar, CheckCircle, Clock, MapPin, Phone, Plus, Search, Settings, Sparkles, Target, TrendingUp, Users, X } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useToast } from '../../hooks/use-toast';

interface EnhancedAppointmentsProps {
  className?: string;
}

export const EnhancedAppointments: React.FC<EnhancedAppointmentsProps> = ({ className }) => {
  const { appointments, fetchAppointments } = useAppointmentStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showSmartScheduling, setShowSmartScheduling] = useState(false);
  const [showMeetingAssistant, setShowMeetingAssistant] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Convert appointments object to array and filter
  const appointmentsArray = Object.values(appointments);
  
  const filteredAppointments = appointmentsArray.filter(appointment => {
    const matchesSearch = searchText === '' || 
      appointment.title.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      appointment.attendees.some(att => att.name.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesType = filterType === 'all' || appointment.type === filterType;
    const matchesPriority = filterPriority === 'all' || appointment.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  // Get appointments for selected date
  const selectedDateAppointments = filteredAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    return appointmentDate.toDateString() === selectedDate.toDateString();
  });

  // Get appointments by date for calendar tiles
  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startTime);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const handleDateChange = (date: Date | Date[]) => {
    if (date instanceof Date) {
      setSelectedDate(date);
    }
  };

  const handleAppointmentClick = (appointment: unknown) => {
    setSelectedAppointment(appointment);
    setShowMeetingAssistant(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'demo': return <Target className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with AI Features */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                  AI-Enhanced Calendar
                </CardTitle>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  Smart scheduling with AI-powered insights and automation
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowSmartScheduling(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Schedule
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Smart Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Calendar with Custom Tiles */}
            <div className="calendar-container">
              <Calendar 
                onChange={handleDateChange} 
                value={selectedDate}
                className="react-calendar w-full" 
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const dayAppointments = getAppointmentsForDate(date);
                    if (dayAppointments.length > 0) {
                      return (
                        <div className="mt-1">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {dayAppointments.slice(0, 3).map((apt, index) => (
                              <div
                                key={apt.id}
                                className={`w-2 h-2 rounded-full ${
                                  apt.priority === 'high' ? 'bg-red-500' :
                                  apt.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                              />
                            ))}
                            {dayAppointments.length > 3 && (
                              <div className="text-xs text-gray-500">+{dayAppointments.length - 3}</div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  }
                  return null;
                }}
              />
            </div>

            {/* AI Calendar Insights */}
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">AI Insights</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">98% Success Rate</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                  <span className="text-gray-700 dark:text-gray-300">2 Conflicts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">{appointmentsArray.length} Meetings</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Optimal Week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Appointments - {selectedDate.toLocaleDateString()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowSmartScheduling(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="all">All Types</option>
                <option value="meeting">Meeting</option>
                <option value="call">Call</option>
                <option value="demo">Demo</option>
                <option value="other">Other</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No appointments for this date</p>
                  <Button
                    onClick={() => setShowSmartScheduling(true)}
                    className="mt-3"
                    variant="outline"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Schedule with AI
                  </Button>
                </div>
              ) : (
                selectedDateAppointments.map((appointment) => (
                  <Card 
                    key={appointment.id} 
                    className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(appointment.type)}
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                {appointment.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                              {appointment.priority && (
                                <Badge className={getPriorityColor(appointment.priority)}>
                                  {appointment.priority}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(appointment.startTime).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(appointment.endTime).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {appointment.attendees.length} attendees
                            </div>
                            {appointment.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {appointment.location}
                              </div>
                            )}
                          </div>

                          {appointment.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                              {appointment.description}
                            </p>
                          )}

                          {/* Attendee Avatars */}
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {appointment.attendees.slice(0, 4).map((attendee, index) => (
                                <img
                                  key={attendee.id}
                                  src={attendee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${attendee.name}`}
                                  alt={attendee.name}
                                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                                  title={attendee.name}
                                />
                              ))}
                              {appointment.attendees.length > 4 && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    +{appointment.attendees.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* AI Insights */}
                            {appointment.aiInsights && (
                              <div className="ml-auto flex items-center gap-2">
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                                  <Brain className="h-3 w-3 text-blue-600" />
                                  <span className="text-xs text-blue-700 dark:text-blue-300">
                                    {appointment.aiInsights.successProbability}% success
                                  </span>
                                </div>
                                {appointment.aiInsights.urgency > 80 && (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Scheduling Modal */}
      <SmartSchedulingModal
        isOpen={showSmartScheduling}
        onClose={() => setShowSmartScheduling(false)}
      />

      {/* AI Meeting Assistant Modal */}
      {showMeetingAssistant && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">AI Meeting Assistant</h2>
              <Button
                onClick={() => setShowMeetingAssistant(false)}
                variant="outline"
                size="icon"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <AIMeetingAssistant
                appointmentId={selectedAppointment.id}
                appointment={selectedAppointment}
                onClose={() => setShowMeetingAssistant(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Import X icon

export default EnhancedAppointments;