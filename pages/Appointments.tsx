import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { 
  Clock, 
  User, 
  Check, 
  Video, 
  Phone, 
  MapPin, 
  Plus, 
  Calendar as CalendarIcon, 
  AlertOctagon, 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  X,
  RefreshCw,
  Search,
  AlertCircle,
  Copy,
  Link
} from 'lucide-react';
import { useAppointmentStore, Appointment, AppointmentType, AppointmentStatus } from '../store/appointmentStore';
import Select from 'react-select';

const Appointments: React.FC = () => {
  const { 
    appointments, 
    fetchAppointments, 
    createAppointment, 
    updateAppointment,
    deleteAppointment,
    selectAppointment,
    selectedAppointment,
    selectedSlot,
    selectTimeSlot,
    isTimeSlotAvailable,
    getAppointmentsForDate
  } = useAppointmentStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment | null>(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [appointmentTypes, setAppointmentTypes] = useState<string[]>([]);
  
  // Form data for creating/editing appointments
  const [formData, setFormData] = useState<Partial<Appointment>>({
    title: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    date: new Date(),
    duration: 30,
    type: 'video',
    location: '',
    notes: '',
    status: 'scheduled'
  });
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  useEffect(() => {
    // Set initial selected date to today
    if (selectedSlot) {
      setFormData({
        ...formData,
        date: selectedSlot,
        endDate: new Date(selectedSlot.getTime() + 30 * 60000)
      });
      setShowAppointmentForm(true);
    }
  }, [selectedSlot]);
  
  useEffect(() => {
    if (selectedAppointment) {
      setAppointmentDetail(appointments[selectedAppointment]);
      setShowAppointmentDetail(true);
    }
  }, [selectedAppointment, appointments]);
  
  // Calculate appointments for the selected date
  const appointmentsForSelectedDate = getAppointmentsForDate(selectedDate);
  
  // Available time slots for the day
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  
  // Get contacts for dropdown (for demo we're using mock data)
  const contacts = [
    { value: '1', label: 'John Doe', email: 'john.doe@example.com', phone: '(555) 123-4567' },
    { value: '2', label: 'Jane Smith', email: 'jane.smith@example.com', phone: '(555) 987-6543' },
    { value: '3', label: 'Robert Johnson', email: 'robert@example.com', phone: '(555) 456-7890' },
    { value: '4', label: 'Sarah Williams', email: 'sarah@example.com', phone: '(555) 567-8901' },
  ];
  
  // Functions to format appointments and dates
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
    }
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    selectTimeSlot(null);
    setShowAppointmentForm(false);
  };
  
  const handleTimeSlotClick = (timeSlot: string) => {
    if (!isTimeSlotTaken(timeSlot)) {
      const [hourStr, minuteStr, period] = timeSlot.match(/(\d+):(\d+)\s+([AP]M)/)?.slice(1) || [];
      const isPM = period === 'PM';
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      
      if (isPM && hour !== 12) hour += 12;
      if (!isPM && hour === 12) hour = 0;
      
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, minute, 0, 0);
      
      // Select the time slot
      selectTimeSlot(slotTime);
    }
  };
  
  // Check if a time slot is taken
  const isTimeSlotTaken = (timeSlot: string) => {
    const [hourStr, minuteStr] = timeSlot.split(':');
    const isPM = timeSlot.includes('PM');
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hour, minute, 0, 0);
    
    return !isTimeSlotAvailable(slotTime, 30); // Assume 30 min duration for checking
  };
  
  // Function to get appointment at a specific time slot
  const getAppointmentAtTimeSlot = (timeSlot: string) => {
    const [hourStr, minuteStr] = timeSlot.split(':');
    const isPM = timeSlot.includes('PM');
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    
    const slotTime = new Date(selectedDate);
    slotTime.setHours(hour, minute, 0, 0);
    
    return Object.values(appointments).find(appointment => {
      const appointmentStartTime = appointment.date;
      const appointmentEndTime = appointment.endDate;
      
      return (
        isSameDay(appointmentStartTime, selectedDate) &&
        slotTime >= appointmentStartTime &&
        slotTime < appointmentEndTime
      );
    });
  };
  
  const formatDateHeader = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  };
  
  const renderAppointmentTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case 'in-person':
        return <MapPin size={18} className="text-green-500" />;
      case 'video':
        return <Video size={18} className="text-purple-500" />;
      case 'phone':
        return <Phone size={18} className="text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch(status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Calculate end date based on start time and duration
      const endDate = new Date(formData.date || new Date());
      endDate.setMinutes(endDate.getMinutes() + (formData.duration || 30));
      
      const appointmentData = {
        ...formData,
        endDate
      };
      
      if (isEditing && appointmentDetail) {
        // Update existing appointment
        await updateAppointment(appointmentDetail.id, appointmentData);
      } else {
        // Create new appointment
        await createAppointment(appointmentData);
      }
      
      // Reset form and close
      setFormData({
        title: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        date: new Date(),
        duration: 30,
        type: 'video',
        location: '',
        notes: '',
        status: 'scheduled'
      });
      setShowAppointmentForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditAppointment = (appt: Appointment) => {
    setFormData({
      title: appt.title,
      contactId: appt.contactId,
      contactName: appt.contactName,
      contactEmail: appt.contactEmail,
      contactPhone: appt.contactPhone,
      date: appt.date,
      duration: appt.duration,
      type: appt.type,
      location: appt.location,
      notes: appt.notes,
      status: appt.status
    });
    
    setShowAppointmentDetail(false);
    setIsEditing(true);
    setShowAppointmentForm(true);
  };
  
  const handleDeleteAppointment = async (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id);
        setShowAppointmentDetail(false);
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };
  
  const handleContactSelect = (option: any) => {
    if (option) {
      const contact = contacts.find(c => c.value === option.value);
      setFormData({
        ...formData,
        contactId: option.value,
        contactName: contact?.label || '',
        contactEmail: contact?.email || '',
        contactPhone: contact?.phone || ''
      });
    } else {
      setFormData({
        ...formData,
        contactId: undefined,
        contactName: '',
        contactEmail: '',
        contactPhone: ''
      });
    }
  };
  
  const handleAppointmentStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      await updateAppointment(id, { status });
      
      if (appointmentDetail && appointmentDetail.id === id) {
        setAppointmentDetail({
          ...appointmentDetail,
          status
        });
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };
  
  const handleCopyMeetingLink = () => {
    // In a real app, this would be a real meeting URL
    const meetingUrl = 'https://meeting.example.com/join/abc123';
    
    navigator.clipboard.writeText(meetingUrl)
      .then(() => {
        alert('Meeting link copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy meeting link:', err);
      });
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Schedule and manage your meetings with contacts</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => {
              setIsEditing(false);
              setFormData({
                title: '',
                contactName: '',
                contactEmail: '',
                contactPhone: '',
                date: new Date(),
                duration: 30,
                type: 'video',
                location: '',
                notes: '',
                status: 'scheduled'
              });
              setShowAppointmentForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <Plus size={18} className="mr-1" />
            New Appointment
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Calendar</h2>
            </div>
            <div className="p-4">
              <div className="calendar-container">
                <Calendar 
                  onChange={handleDateChange} 
                  value={selectedDate}
                  className="react-calendar" 
                  tileClassName={({ date }) => {
                    const hasAppointment = Object.values(appointments).some(appointment => 
                      isSameDay(appointment.date, date)
                    );
                    return hasAppointment ? 'has-appointment' : null;
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-8 pr-4 py-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search size={14} className="absolute left-2 top-2 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {Object.values(appointments)
                .filter(appointment => 
                  appointment.date >= new Date() && 
                  appointment.status === 'scheduled' && 
                  (searchText === '' || 
                    appointment.contactName.toLowerCase().includes(searchText.toLowerCase()) || 
                    appointment.title.toLowerCase().includes(searchText.toLowerCase())
                  )
                )
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map(appointment => (
                  <div key={appointment.id} className="border rounded-lg p-3 mb-3 hover:bg-gray-50 cursor-pointer" onClick={() => selectAppointment(appointment.id)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          {renderAppointmentTypeIcon(appointment.type)}
                          <h3 className="font-medium ml-1 text-sm">{appointment.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500">{appointment.contactName}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-medium">
                          {appointment.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-gray-500">{formatTime(appointment.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              
              {Object.values(appointments).filter(appointment => 
                appointment.date >= new Date() && 
                appointment.status === 'scheduled' &&
                (searchText === '' || 
                  appointment.contactName.toLowerCase().includes(searchText.toLowerCase()) || 
                  appointment.title.toLowerCase().includes(searchText.toLowerCase())
                )
              ).length === 0 && (
                <div className="text-center p-4">
                  <CalendarIcon size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              )}
              
              <div className="mt-2 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All Appointments
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    const prevDay = new Date(selectedDate);
                    prevDay.setDate(prevDay.getDate() - 1);
                    handleDateChange(prevDay);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-lg font-semibold">{formatDateHeader(selectedDate)}</h2>
                <button 
                  onClick={() => {
                    const nextDay = new Date(selectedDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    handleDateChange(nextDay);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="flex items-center">
                <div className="relative mr-2">
                  <select
                    className="border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm"
                    onChange={(e) => {
                      const types = [...appointmentTypes];
                      const value = e.target.value;
                      
                      if (types.includes(value)) {
                        setAppointmentTypes(types.filter(t => t !== value));
                      } else {
                        types.push(value);
                        setAppointmentTypes(types);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Filter Type</option>
                    <option value="video">Video</option>
                    <option value="phone">Phone</option>
                    <option value="in-person">In Person</option>
                  </select>
                </div>
                <button className="text-blue-600 text-sm hover:text-blue-800">
                  Share Calendar
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Time slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {timeSlots.map(timeSlot => {
                  const isTaken = isTimeSlotTaken(timeSlot);
                  const appointment = getAppointmentAtTimeSlot(timeSlot);
                  
                  return (
                    <div 
                      key={timeSlot}
                      onClick={() => !isTaken && handleTimeSlotClick(timeSlot)}
                      className={`border rounded-lg p-3 ${
                        isTaken ? 'bg-blue-50 border-blue-200' : 
                        selectedSlot && timeSlot === formatTime(selectedSlot) ? 'bg-green-50 border-green-200' : 
                        'hover:bg-gray-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-400 mr-2" />
                          <span className="font-medium">{timeSlot}</span>
                        </div>
                        {isTaken && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                            Booked
                          </span>
                        )}
                      </div>
                      
                      {isTaken && appointment && (
                        <div className="mt-2">
                          <div className="flex items-center">
                            {renderAppointmentTypeIcon(appointment.type)}
                            <p className="text-sm font-medium ml-1">{appointment.title}</p>
                          </div>
                          <div className="flex items-center mt-1">
                            <User size={14} className="text-gray-400 mr-1" />
                            <p className="text-xs text-gray-500">{appointment.contactName}</p>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>{formatDuration(appointment.duration)}</span>
                            
                            <div className="flex space-x-2">
                              {appointment.type === 'video' && (
                                <button className="p-1 text-purple-600 hover:text-purple-800" onClick={(e) => {
                                  e.stopPropagation();
                                  selectAppointment(appointment.id);
                                }}>
                                  <Video size={14} />
                                </button>
                              )}
                              {appointment.type === 'phone' && (
                                <button className="p-1 text-blue-600 hover:text-blue-800" onClick={(e) => {
                                  e.stopPropagation();
                                  if (appointment.contactPhone) {
                                    window.open(`tel:${appointment.contactPhone}`);
                                  }
                                }}>
                                  <Phone size={14} />
                                </button>
                              )}
                              {appointment.contactEmail && (
                                <button className="p-1 text-red-600 hover:text-red-800" onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`mailto:${appointment.contactEmail}`);
                                }}>
                                  <Mail size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!isTaken && (
                        <div className="mt-2 text-center text-sm text-gray-500">
                          Available
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* New Appointment Form */}
              {showAppointmentForm && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">{isEditing ? 'Edit Appointment' : 'Schedule New Appointment'}</h3>
                  <form onSubmit={handleSubmitAppointment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter appointment title"
                          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact
                        </label>
                        <Select
                          options={contacts}
                          value={formData.contactId ? { 
                            value: formData.contactId, 
                            label: formData.contactName 
                          } : null}
                          onChange={handleContactSelect}
                          placeholder="Select or enter contact name"
                          isClearable
                          className="basic-single"
                          classNamePrefix="select"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.date ? 
                            new Date(formData.date.getTime() - (formData.date.getTimezoneOffset() * 60000))
                              .toISOString()
                              .slice(0, 16) 
                            : ''
                          }
                          onChange={(e) => {
                            if (e.target.value) {
                              const newDate = new Date(e.target.value);
                              setFormData({ ...formData, date: newDate });
                            }
                          }}
                          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <select
                          value={formData.duration || 30}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={90}>1.5 hours</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Appointment Type
                        </label>
                        <div className="flex space-x-2">
                          <label className={`flex-1 flex items-center justify-center p-2 border rounded-md hover:bg-blue-50 cursor-pointer ${
                            formData.type === 'in-person' ? 'bg-blue-50 border-blue-300' : ''
                          }`}>
                            <input 
                              type="radio" 
                              name="type" 
                              value="in-person" 
                              checked={formData.type === 'in-person'} 
                              onChange={() => setFormData({ ...formData, type: 'in-person' })}
                              className="hidden" 
                            />
                            <MapPin size={16} className="mr-1 text-green-500" />
                            <span className="text-sm">In Person</span>
                          </label>
                          <label className={`flex-1 flex items-center justify-center p-2 border rounded-md hover:bg-blue-50 cursor-pointer ${
                            formData.type === 'video' ? 'bg-blue-50 border-blue-300' : ''
                          }`}>
                            <input 
                              type="radio" 
                              name="type" 
                              value="video" 
                              checked={formData.type === 'video'} 
                              onChange={() => setFormData({ ...formData, type: 'video' })}
                              className="hidden" 
                            />
                            <Video size={16} className="mr-1 text-purple-500" />
                            <span className="text-sm">Video</span>
                          </label>
                          <label className={`flex-1 flex items-center justify-center p-2 border rounded-md hover:bg-blue-50 cursor-pointer ${
                            formData.type === 'phone' ? 'bg-blue-50 border-blue-300' : ''
                          }`}>
                            <input 
                              type="radio" 
                              name="type" 
                              value="phone" 
                              checked={formData.type === 'phone'} 
                              onChange={() => setFormData({ ...formData, type: 'phone' })}
                              className="hidden" 
                            />
                            <Phone size={16} className="mr-1 text-blue-500" />
                            <span className="text-sm">Phone</span>
                          </label>
                        </div>
                      </div>
                      
                      {formData.type === 'in-person' && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Enter meeting location"
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      )}
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          value={formData.notes || ''}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Add any notes or preparation details"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button 
                        type="button"
                        onClick={() => {
                          setShowAppointmentForm(false);
                          selectTimeSlot(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw size={16} className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            {isEditing ? 'Update' : 'Schedule'} Appointment
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          
          {/* Appointments for selected date */}
          {appointmentsForSelectedDate.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Appointments for {selectedDate.toLocaleDateString()}</h2>
              <div className="divide-y">
                {appointmentsForSelectedDate.map(appointment => (
                  <div key={appointment.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex">
                      <div className="w-16 text-center mr-4">
                        <div className="text-sm font-medium">{formatTime(appointment.date)}</div>
                        <div className="text-xs text-gray-500">{formatDuration(appointment.duration)}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center">
                              {renderAppointmentTypeIcon(appointment.type)}
                              <h3 className="font-medium ml-1">{appointment.title}</h3>
                            </div>
                            <p className="text-sm text-gray-500">{appointment.contactName}</p>
                          </div>
                          <div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {appointment.location && (
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <MapPin size={12} className="mr-1" />
                            {appointment.location}
                          </div>
                        )}
                        
                        {appointment.notes && (
                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {appointment.notes}
                          </div>
                        )}
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {appointment.status === 'scheduled' && (
                            <>
                              <button 
                                onClick={() => handleEditAppointment(appointment)}
                                className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
                              >
                                Reschedule
                              </button>
                              <button 
                                onClick={() => handleAppointmentStatusChange(appointment.id, 'canceled')}
                                className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 text-red-600"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.type === 'video' && (
                            <button className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center">
                              <Video size={12} className="mr-1" />
                              Join Meeting
                            </button>
                          )}
                          {appointment.type === 'phone' && appointment.contactPhone && (
                            <button 
                              onClick={() => window.open(`tel:${appointment.contactPhone}`)}
                              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                            >
                              <Phone size={12} className="mr-1" />
                              Call
                            </button>
                          )}
                          {appointment.status === 'scheduled' && (
                            <button 
                              onClick={() => handleAppointmentStatusChange(appointment.id, 'completed')}
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                            >
                              <Check size={12} className="mr-1" />
                              Mark Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Appointment Detail Modal */}
      {showAppointmentDetail && appointmentDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
              <button onClick={() => setShowAppointmentDetail(false)} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center">
                    {renderAppointmentTypeIcon(appointmentDetail.type)}
                    <h4 className="text-xl font-semibold ml-2">{appointmentDetail.title}</h4>
                  </div>
                  <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(appointmentDetail.status)}`}>
                    {appointmentDetail.status.charAt(0).toUpperCase() + appointmentDetail.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{appointmentDetail.date.toLocaleDateString()}</p>
                  <p className="text-gray-500">{formatTime(appointmentDetail.date)} - {formatTime(appointmentDetail.endDate)}</p>
                  <p className="text-xs text-gray-500 mt-1">({formatDuration(appointmentDetail.duration)})</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h5>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <User size={16} className="text-gray-400 mr-2" />
                    <span className="font-medium">{appointmentDetail.contactName}</span>
                  </div>
                  {appointmentDetail.contactEmail && (
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <Mail size={14} className="text-gray-400 mr-2" />
                      <a href={`mailto:${appointmentDetail.contactEmail}`} className="hover:text-blue-600">
                        {appointmentDetail.contactEmail}
                      </a>
                    </div>
                  )}
                  {appointmentDetail.contactPhone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone size={14} className="text-gray-400 mr-2" />
                      <a href={`tel:${appointmentDetail.contactPhone}`} className="hover:text-blue-600">
                        {appointmentDetail.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {appointmentDetail.type === 'in-person' && appointmentDetail.location && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Location</h5>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{appointmentDetail.location}</span>
                  </div>
                </div>
              )}
              
              {appointmentDetail.type === 'video' && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Meeting Link</h5>
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                      <Video size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700 text-sm">https://meeting.example.com/join/abc123</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={handleCopyMeetingLink}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="Copy meeting link"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="Open meeting link"
                      >
                        <Link size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {appointmentDetail.notes && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Notes</h5>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                    {appointmentDetail.notes}
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-3 bg-gray-50 flex justify-between">
              <div className="space-x-2">
                <button
                  onClick={() => handleAppointmentStatusChange(appointmentDetail.id, 
                    appointmentDetail.status === 'scheduled' ? 'completed' : 'scheduled')}
                  className={`px-3 py-1.5 text-sm border rounded-md ${
                    appointmentDetail.status === 'scheduled' 
                      ? 'bg-green-600 hover:bg-green-700 text-white border-transparent'
                      : 'border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {appointmentDetail.status === 'scheduled' ? 'Mark Completed' : 'Mark Scheduled'}
                </button>
                {appointmentDetail.status === 'scheduled' && (
                  <button
                    onClick={() => handleAppointmentStatusChange(appointmentDetail.id, 'canceled')}
                    className="px-3 py-1.5 text-sm border border-red-300 text-red-700 hover:bg-red-50 rounded-md"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditAppointment(appointmentDetail)}
                  className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAppointment(appointmentDetail.id)}
                  className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;