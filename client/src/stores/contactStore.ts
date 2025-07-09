import { create } from 'zustand';

interface Contact {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  company: string;
  industry?: string;
  avatarSrc?: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  interestLevel: 'hot' | 'medium' | 'low' | 'cold';
  sources: string[];
  socialProfiles?: Record<string, string>;
  customFields?: Record<string, string | number | boolean>;
  notes?: string;
  aiScore?: number;
  lastConnected?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isFavorite?: boolean;
  lastEnrichment?: {
    confidence: number;
    aiProvider?: string;
    timestamp?: Date;
  };
  
  // Team-related fields
  isTeamMember?: boolean;
  role?: 'sales-rep' | 'manager' | 'executive' | 'admin';
  gamificationStats?: {
    totalDeals: number;
    totalRevenue: number;
    winRate: number;
    currentStreak: number;
    longestStreak: number;
    level: number;
    points: number;
    achievements: string[];
    lastAchievementDate?: Date;
    monthlyGoal?: number;
    monthlyProgress?: number;
  };
}

// Mock data for initial population
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    title: 'VP of Technology',
    company: 'TechCorp Solutions',
    industry: 'Technology',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    status: 'prospect',
    interestLevel: 'hot',
    sources: ['LinkedIn', 'Referral'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/sarah-johnson',
      twitter: 'https://twitter.com/sarahjohnson'
    },
    customFields: {
      'Budget': '$50,000',
      'Timeline': 'Q2 2024'
    },
    notes: 'Interested in our enterprise solution. Follow up next week.',
    aiScore: 85,
    lastConnected: '2024-01-15',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    tags: ['enterprise', 'high-value'],
    isFavorite: true
  },
  {
    id: '2',
    name: 'Michael Chen',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@innovate.com',
    phone: '+1 (555) 987-6543',
    title: 'CTO',
    company: 'Innovate Labs',
    industry: 'Software',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    status: 'customer',
    interestLevel: 'medium',
    sources: ['Website', 'Demo'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/michael-chen',
      github: 'https://github.com/michaelchen'
    },
    customFields: {
      'Current Plan': 'Professional',
      'Renewal Date': '2024-06-01'
    },
    notes: 'Existing customer looking to upgrade. Great relationship.',
    aiScore: 92,
    lastConnected: '2024-01-20',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-20'),
    tags: ['customer', 'upgrade'],
    isFavorite: false
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@startup.co',
    phone: '+1 (555) 456-7890',
    title: 'Founder & CEO',
    company: 'GrowthStartup',
    industry: 'Marketing',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    status: 'lead',
    interestLevel: 'low',
    sources: ['Cold Email'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/emily-rodriguez',
      twitter: 'https://twitter.com/emilyrodriguez'
    },
    customFields: {
      'Company Size': '10-50',
      'Industry': 'Marketing'
    },
    notes: 'Initial contact made. Need to nurture relationship.',
    aiScore: 45,
    lastConnected: '2024-01-10',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
    tags: ['startup', 'nurture'],
    isFavorite: false
  }
];

interface ContactStore {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  selectedContact: Contact | null;
  
  // Actions
  fetchContacts: () => Promise<void>;
  createContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Contact>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  selectContact: (contact: Contact | null) => void;
  
  // Team management
  addTeamMember: (contactId: string, role?: Contact['role']) => Promise<void>;
  removeTeamMember: (contactId: string) => Promise<void>;
  updateTeamMemberStats: (contactId: string, stats: Partial<Contact['gamificationStats']>) => Promise<void>;
  
  // New methods for enhanced features
  toggleFavorite: (contactId: string) => Promise<void>;
  findNewImage: (contactId: string) => Promise<string>;
  aiEnrichContact: (contactId: string, enrichmentData: any) => Promise<Contact>;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  isLoading: false,
  error: null,
  selectedContact: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ contacts: mockContacts, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch contacts', isLoading: false });
    }
  },

  createContact: async (contactData) => {
    set({ isLoading: true, error: null });
    try {
      const newContact: Contact = {
        ...contactData,
        id: `contact-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        contacts: [...state.contacts, newContact],
        isLoading: false
      }));
      
      return newContact;
    } catch (error) {
      set({ error: 'Failed to create contact', isLoading: false });
      throw error;
    }
  },

  updateContact: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const existingContact = get().contacts.find(c => c.id === id);
      if (!existingContact) {
        throw new Error('Contact not found');
      }
      
      const updatedContact = {
        ...existingContact,
        ...updates,
        updatedAt: new Date()
      };
      
      set(state => ({
        contacts: state.contacts.map(contact =>
          contact.id === id ? updatedContact : contact
        ),
        isLoading: false
      }));
      
      return updatedContact;
    } catch (error) {
      set({ error: 'Failed to update contact', isLoading: false });
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        contacts: state.contacts.filter(contact => contact.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete contact', isLoading: false });
      throw error;
    }
  },

  selectContact: (contact) => {
    set({ selectedContact: contact });
  },

  // Team management functions
  addTeamMember: async (contactId, role = 'sales-rep') => {
    const { updateContact } = get();
    await updateContact(contactId, {
      isTeamMember: true,
      role,
      gamificationStats: {
        totalDeals: 0,
        totalRevenue: 0,
        winRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        level: 1,
        points: 0,
        achievements: [],
        monthlyGoal: role === 'sales-rep' ? 50000 : role === 'manager' ? 100000 : 200000,
        monthlyProgress: 0
      }
    });
  },

  removeTeamMember: async (contactId) => {
    const { updateContact } = get();
    await updateContact(contactId, {
      isTeamMember: false,
      role: undefined,
      gamificationStats: undefined
    });
  },

  updateTeamMemberStats: async (contactId, stats) => {
    const contact = get().contacts.find(c => c.id === contactId);
    if (contact && contact.gamificationStats) {
      const { updateContact } = get();
      await updateContact(contactId, {
        gamificationStats: {
          ...contact.gamificationStats,
          ...stats
        }
      });
    }
  },
  
  // New methods for enhanced features
  toggleFavorite: async (contactId) => {
    const { updateContact } = get();
    const contact = get().contacts.find(c => c.id === contactId);
    if (contact) {
      await updateContact(contactId, {
        isFavorite: !contact.isFavorite
      });
    }
  },
  
  findNewImage: async (contactId) => {
    const { updateContact } = get();
    const contact = get().contacts.find(c => c.id === contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    // Simulate API call to find new image
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a new avatar with a different seed
    const newSeed = Date.now().toString();
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
    
    await updateContact(contactId, {
      avatarSrc: newAvatarUrl
    });
    
    return newAvatarUrl;
  },
  
  aiEnrichContact: async (contactId, enrichmentData) => {
    const { updateContact } = get();
    const contact = get().contacts.find(c => c.id === contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    
    const updates: Partial<Contact> = {
      lastEnrichment: {
        confidence: enrichmentData.confidence || 75,
        aiProvider: enrichmentData.aiProvider || 'AI Assistant',
        timestamp: new Date()
      }
    };
    
    // Apply other updates from enrichment data
    if (enrichmentData.phone) updates.phone = enrichmentData.phone;
    if (enrichmentData.industry) updates.industry = enrichmentData.industry;
    if (enrichmentData.title) updates.title = enrichmentData.title;
    if (enrichmentData.notes) {
      updates.notes = contact.notes 
        ? `${contact.notes}\n\nAI Research: ${enrichmentData.notes}` 
        : `AI Research: ${enrichmentData.notes}`;
    }
    
    const updatedContact = await updateContact(contactId, updates);
    return updatedContact;
  }
}));

export type { Contact };