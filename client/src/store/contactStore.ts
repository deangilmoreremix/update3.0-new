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