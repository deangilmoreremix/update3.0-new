import { create } from 'zustand';

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  contactId?: string;
  dealId?: string;
  type: 'meeting' | 'call' | 'demo' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface AppointmentState {
  appointments: Record<string, Appointment>;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  // API methods
  fetchAppointments: () => Promise<void>;
  createAppointment: (appointmentData: Partial<Appointment>) => Promise<Appointment>;
  updateAppointmentApi: (id: string, updates: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointmentApi: (id: string) => Promise<void>;
}

// Mock appointment data for development
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Product Demo - TechCorp',
    description: 'Demonstrate new AI features',
    startTime: '2024-01-25T14:00:00Z',
    endTime: '2024-01-25T15:00:00Z',
    attendees: ['sarah.johnson@techcorp.com', 'sales@company.com'],
    contactId: '1',
    dealId: '1',
    type: 'demo',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Discovery Call - Innovate AI',
    description: 'Understand requirements and pain points',
    startTime: '2024-01-26T10:00:00Z',
    endTime: '2024-01-26T11:00:00Z',
    attendees: ['mchen@innovate.ai', 'sales@company.com'],
    contactId: '2',
    dealId: '2',
    type: 'call',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Contract Review - Global Tech',
    description: 'Final contract discussion',
    startTime: '2024-01-20T16:00:00Z',
    endTime: '2024-01-20T17:00:00Z',
    attendees: ['e.rodriguez@globaltech.com', 'legal@company.com'],
    contactId: '3',
    dealId: '3',
    type: 'meeting',
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: mockAppointments.reduce((acc, appointment) => {
    acc[appointment.id] = appointment;
    return acc;
  }, {} as Record<string, Appointment>),

  addAppointment: (appointment) =>
    set((state) => ({
      appointments: { ...state.appointments, [appointment.id]: appointment },
    })),

  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: {
        ...state.appointments,
        [id]: { ...state.appointments[id], ...updates, updatedAt: new Date().toISOString() },
      },
    })),

  deleteAppointment: (id) =>
    set((state) => {
      const newAppointments = { ...state.appointments };
      delete newAppointments[id];
      return { appointments: newAppointments };
    }),

  getAppointment: (id) => get().appointments[id],

  // API methods
  fetchAppointments: async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const appointmentsArray = await response.json();
      
      const appointments = appointmentsArray.reduce((acc: Record<string, Appointment>, appointment: Appointment) => {
        acc[appointment.id] = appointment;
        return acc;
      }, {});
      
      set({ appointments });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Fallback to mock data if API fails
      const fallbackAppointments = mockAppointments.reduce((acc, appointment) => {
        acc[appointment.id] = appointment;
        return acc;
      }, {} as Record<string, Appointment>);
      
      set({ appointments: fallbackAppointments });
    }
  },

  createAppointment: async (appointmentData) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }
      
      const newAppointment = await response.json();
      get().addAppointment(newAppointment);
      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  updateAppointmentApi: async (id, updates) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }
      
      const updatedAppointment = await response.json();
      get().updateAppointment(id, updatedAppointment);
      return updatedAppointment;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },

  deleteAppointmentApi: async (id) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      
      get().deleteAppointment(id);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  },
}));