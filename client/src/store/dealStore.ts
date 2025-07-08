import { create } from 'zustand';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  contactId?: string;
  createdAt: string;
  updatedAt: string;
}

interface DealState {
  deals: Record<string, Deal>;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  getDeal: (id: string) => Deal | undefined;
}

// Mock deal data for development
const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise Software License',
    company: 'TechCorp Solutions',
    value: 150000,
    stage: 'Negotiation',
    probability: 75,
    closeDate: '2024-02-15',
    contactId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'AI Platform Integration',
    company: 'Innovate AI',
    value: 85000,
    stage: 'Proposal',
    probability: 60,
    closeDate: '2024-03-01',
    contactId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Manufacturing Optimization Suite',
    company: 'Global Tech Industries',
    value: 250000,
    stage: 'Closed Won',
    probability: 100,
    closeDate: '2024-01-20',
    contactId: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useDealStore = create<DealState>((set, get) => ({
  deals: mockDeals.reduce((acc, deal) => {
    acc[deal.id] = deal;
    return acc;
  }, {} as Record<string, Deal>),

  addDeal: (deal) =>
    set((state) => ({
      deals: { ...state.deals, [deal.id]: deal },
    })),

  updateDeal: (id, updates) =>
    set((state) => ({
      deals: {
        ...state.deals,
        [id]: { ...state.deals[id], ...updates, updatedAt: new Date().toISOString() },
      },
    })),

  deleteDeal: (id) =>
    set((state) => {
      const newDeals = { ...state.deals };
      delete newDeals[id];
      return { deals: newDeals };
    }),

  getDeal: (id) => get().deals[id],
}));