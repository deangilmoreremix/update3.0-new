import { create } from 'zustand';

interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees: Attendee[];
  contactId?: string;
  dealId?: string;
  type: 'meeting' | 'call' | 'demo' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  location?: string;
  agenda?: string[];
  aiInsights?: {
    urgency: number;
    importance: number;
    conflictRisk: number;
    successProbability: number;
    preparationSuggestions?: string[];
    meetingNotes?: string;
    actionItems?: string[];
    sentiment?: { score: number; label: string };
  };
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

// Enhanced mock appointment data with AI features
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Product Demo - TechCorp',
    description: 'Demonstrate new AI features and discuss implementation timeline',
    startTime: '2025-01-15T14:00:00Z',
    endTime: '2025-01-15T15:00:00Z',
    attendees: [
      {
        id: 'att1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        role: 'CTO'
      },
      {
        id: 'att2',
        name: 'Sales Rep',
        email: 'sales@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sales',
        role: 'Sales Representative'
      }
    ],
    contactId: '1',
    dealId: '1',
    type: 'demo',
    status: 'scheduled',
    priority: 'high',
    location: 'Zoom Meeting',
    agenda: ['Product overview', 'Feature demonstration', 'Q&A session', 'Next steps discussion'],
    aiInsights: {
      urgency: 85,
      importance: 90,
      conflictRisk: 10,
      successProbability: 88,
      preparationSuggestions: [
        'Review TechCorp\'s recent tech stack updates',
        'Prepare case studies from similar enterprise clients',
        'Demo environment ready with TechCorp-specific use cases'
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Discovery Call - Innovate AI',
    description: 'Understand requirements and pain points for AI integration',
    startTime: '2025-01-16T10:00:00Z',
    endTime: '2025-01-16T11:00:00Z',
    attendees: [
      {
        id: 'att3',
        name: 'Michael Chen',
        email: 'mchen@innovate.ai',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        role: 'VP of Engineering'
      },
      {
        id: 'att4',
        name: 'Account Manager',
        email: 'am@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager',
        role: 'Account Manager'
      }
    ],
    contactId: '2',
    dealId: '2',
    type: 'call',
    status: 'scheduled',
    priority: 'medium',
    location: 'Google Meet',
    agenda: ['Company overview', 'Current challenges', 'Solution exploration', 'Timeline discussion'],
    aiInsights: {
      urgency: 70,
      importance: 75,
      conflictRisk: 15,
      successProbability: 72,
      preparationSuggestions: [
        'Research Innovate AI\'s current tech challenges',
        'Prepare questions about their AI infrastructure',
        'Have competitor comparison ready'
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Contract Review - Global Tech',
    description: 'Final contract terms discussion and signing',
    startTime: '2025-01-14T16:00:00Z',
    endTime: '2025-01-14T17:00:00Z',
    attendees: [
      {
        id: 'att5',
        name: 'Elena Rodriguez',
        email: 'e.rodriguez@globaltech.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        role: 'Legal Counsel'
      },
      {
        id: 'att6',
        name: 'Legal Team',
        email: 'legal@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Legal',
        role: 'Legal Representative'
      }
    ],
    contactId: '3',
    dealId: '3',
    type: 'meeting',
    status: 'completed',
    priority: 'high',
    location: 'Conference Room A',
    agenda: ['Contract review', 'Terms negotiation', 'Signing ceremony'],
    aiInsights: {
      urgency: 95,
      importance: 95,
      conflictRisk: 5,
      successProbability: 95,
      meetingNotes: 'Successful contract signing. All terms agreed upon.',
      actionItems: ['Send signed contracts to both parties', 'Schedule kickoff meeting', 'Prepare onboarding materials'],
      sentiment: { score: 0.9, label: 'positive' }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Technical Integration Meeting',
    description: 'Discuss API integration and technical requirements',
    startTime: '2025-01-17T09:00:00Z',
    endTime: '2025-01-17T10:30:00Z',
    attendees: [
      {
        id: 'att7',
        name: 'Alex Kumar',
        email: 'alex.kumar@startup.io',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        role: 'Lead Developer'
      },
      {
        id: 'att8',
        name: 'Tech Lead',
        email: 'tech@company.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
        role: 'Technical Lead'
      }
    ],
    contactId: '4',
    dealId: '4',
    type: 'meeting',
    status: 'scheduled',
    priority: 'medium',
    location: 'Microsoft Teams',
    agenda: ['API documentation review', 'Integration timeline', 'Security requirements', 'Testing strategy'],
    aiInsights: {
      urgency: 60,
      importance: 80,
      conflictRisk: 20,
      successProbability: 78,
      preparationSuggestions: [
        'Prepare API documentation and sandbox access',
        'Review security compliance requirements',
        'Have integration timeline templates ready'
      ]
    },
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