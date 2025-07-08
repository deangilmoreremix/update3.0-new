import { create } from 'zustand';
import { Contact } from '../types/contact';

interface ContactState {
  contacts: Record<string, Contact>;
  isLoading: boolean;
  error: string | null;
  selectedContact: Contact | null;
  
  // API functions
  fetchContacts: () => Promise<void>;
  createContact: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  selectContact: (contact: Contact | null) => void;
  importContacts: (contacts: Contact[]) => Promise<void>;
  
  // Utility functions
  addContact: (contact: Contact) => void;
  getContact: (id: string) => Contact | undefined;
}

// Mock contact data for development
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    title: 'VP of Engineering',
    company: 'TechCorp Solutions',
    industry: 'Technology',
    status: 'lead',
    interestLevel: 'hot',
    aiScore: 92,
    avatarSrc: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    tags: ['enterprise', 'decision-maker', 'technical'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@innovate.ai',
    phone: '+1 (555) 987-6543',
    title: 'CTO',
    company: 'Innovate AI',
    industry: 'Artificial Intelligence',
    status: 'prospect',
    interestLevel: 'medium',
    aiScore: 78,
    avatarSrc: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    tags: ['startup', 'ai-focused', 'growth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'e.rodriguez@globaltech.com',
    phone: '+1 (555) 456-7890',
    title: 'Head of Operations',
    company: 'Global Tech Industries',
    industry: 'Manufacturing',
    status: 'customer',
    interestLevel: 'high',
    aiScore: 85,
    avatarSrc: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    tags: ['enterprise', 'operations', 'loyalty'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'David Kim',
    firstName: 'David',
    lastName: 'Kim',
    email: 'dkim@startupventures.com',
    phone: '+1 (555) 321-9876',
    title: 'Founder & CEO',
    company: 'Startup Ventures',
    industry: 'Venture Capital',
    status: 'prospect',
    interestLevel: 'hot',
    aiScore: 88,
    avatarSrc: 'https://images.pexels.com/photos/2625122/pexels-photo-2625122.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    tags: ['startup', 'funding', 'decision-maker'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Lisa Wang',
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lwang@enterprisesoft.com',
    phone: '+1 (555) 654-3210',
    title: 'Director of Sales',
    company: 'Enterprise Software',
    industry: 'Software',
    status: 'customer',
    interestLevel: 'medium',
    aiScore: 76,
    avatarSrc: 'https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    tags: ['enterprise', 'sales', 'relationship'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Alex Thompson',
    firstName: 'Alex',
    lastName: 'Thompson',
    email: 'athompson@techstartup.io',
    phone: '+1 (555) 789-0123',
    title: 'Lead Developer',
    company: 'Tech Startup',
    industry: 'Technology',
    status: 'lead',
    interestLevel: 'medium',
    aiScore: 72,
    avatarSrc: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    tags: ['technical', 'developer', 'startup'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: mockContacts.reduce((acc, contact) => {
    acc[contact.id] = contact;
    return acc;
  }, {} as Record<string, Contact>),
  isLoading: false,
  error: null,
  selectedContact: null,

  // API functions
  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const contacts = await response.json();
      const contactsMap = contacts.reduce((acc: Record<string, Contact>, contact: Contact) => {
        acc[contact.id] = contact;
        return acc;
      }, {});
      set({ contacts: contactsMap, isLoading: false });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // Fallback to mock data for development
      set({ 
        contacts: mockContacts.reduce((acc, contact) => {
          acc[contact.id] = contact;
          return acc;
        }, {} as Record<string, Contact>),
        isLoading: false,
        error: null
      });
    }
  },

  createContact: async (contactData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create contact');
      }
      
      const newContact = await response.json();
      set((state) => ({
        contacts: { ...state.contacts, [newContact.id]: newContact },
        isLoading: false,
      }));
      return newContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      // Fallback to local creation
      const newContact = {
        ...contactData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Contact;
      
      set((state) => ({
        contacts: { ...state.contacts, [newContact.id]: newContact },
        isLoading: false,
        error: null,
      }));
      return newContact;
    }
  },

  updateContact: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      
      const updatedContact = await response.json();
      set((state) => ({
        contacts: { ...state.contacts, [id]: updatedContact },
        isLoading: false,
      }));
      return updatedContact;
    } catch (error) {
      console.error('Error updating contact:', error);
      // Fallback to local update
      const updatedContact = {
        ...get().contacts[id],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      set((state) => ({
        contacts: { ...state.contacts, [id]: updatedContact },
        isLoading: false,
        error: null,
      }));
      return updatedContact;
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
      
      set((state) => {
        const newContacts = { ...state.contacts };
        delete newContacts[id];
        return { contacts: newContacts, isLoading: false };
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      // Fallback to local deletion
      set((state) => {
        const newContacts = { ...state.contacts };
        delete newContacts[id];
        return { contacts: newContacts, isLoading: false, error: null };
      });
    }
  },

  selectContact: (contact) => set({ selectedContact: contact }),

  importContacts: async (contacts) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/contacts/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to import contacts');
      }
      
      const importedContacts = await response.json();
      const contactsMap = importedContacts.reduce((acc: Record<string, Contact>, contact: Contact) => {
        acc[contact.id] = contact;
        return acc;
      }, {});
      
      set((state) => ({
        contacts: { ...state.contacts, ...contactsMap },
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error importing contacts:', error);
      // Fallback to local import
      const contactsMap = contacts.reduce((acc: Record<string, Contact>, contact: Contact) => {
        const newContact = {
          ...contact,
          id: contact.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        acc[newContact.id] = newContact;
        return acc;
      }, {} as Record<string, Contact>);
      
      set((state) => ({
        contacts: { ...state.contacts, ...contactsMap },
        isLoading: false,
        error: null,
      }));
    }
  },

  // Utility functions
  addContact: (contact) => set((state) => ({
    contacts: { ...state.contacts, [contact.id]: contact }
  })),

  getContact: (id) => get().contacts[id],
}));