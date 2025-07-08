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
}));