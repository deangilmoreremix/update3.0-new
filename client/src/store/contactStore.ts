import { create } from 'zustand';
import { Contact } from '../types/contact';

interface ContactState {
  contacts: Record<string, Contact>;
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
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
    tags: ['enterprise', 'operations', 'loyalty'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: mockContacts.reduce((acc, contact) => {
    acc[contact.id] = contact;
    return acc;
  }, {} as Record<string, Contact>),

  addContact: (contact) =>
    set((state) => ({
      contacts: { ...state.contacts, [contact.id]: contact },
    })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: {
        ...state.contacts,
        [id]: { ...state.contacts[id], ...updates, updatedAt: new Date().toISOString() },
      },
    })),

  deleteContact: (id) =>
    set((state) => {
      const newContacts = { ...state.contacts };
      delete newContacts[id];
      return { contacts: newContacts };
    }),

  getContact: (id) => get().contacts[id],
}));