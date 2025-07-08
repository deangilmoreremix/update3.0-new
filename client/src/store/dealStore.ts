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
  // Computed values
  totalPipelineValue: number;
  stageValues: Record<string, number>;
  // Actions
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
    stage: 'negotiation',
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
    stage: 'proposal',
    probability: 60,
    closeDate: '2024-03-01',
    contactId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Manufacturing Automation',
    company: 'Global Tech Industries',
    value: 200000,
    stage: 'closed-won',
    probability: 100,
    closeDate: '2024-01-15',
    contactId: '3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Startup Investment Platform',
    company: 'Startup Ventures',
    value: 120000,
    stage: 'discovery',
    probability: 25,
    closeDate: '2024-04-01',
    contactId: '4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Enterprise CRM License',
    company: 'Enterprise Software',
    value: 95000,
    stage: 'closed-won',
    probability: 100,
    closeDate: '2024-01-30',
    contactId: '5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Development Tools Package',
    company: 'Tech Startup',
    value: 45000,
    stage: 'qualification',
    probability: 40,
    closeDate: '2024-03-15',
    contactId: '6',
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

export const useDealStore = create<DealState>((set, get) => {
  const computeValues = (deals: Record<string, Deal>) => {
    const dealsList = Object.values(deals);
    const totalPipelineValue = dealsList.reduce((sum, deal) => sum + deal.value, 0);
    const stageValues = dealsList.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + deal.value;
      return acc;
    }, {} as Record<string, number>);
    
    return { totalPipelineValue, stageValues };
  };

  const initialDeals = mockDeals.reduce((acc, deal) => {
    acc[deal.id] = deal;
    return acc;
  }, {} as Record<string, Deal>);

  const initialValues = computeValues(initialDeals);

  return {
    deals: initialDeals,
    totalPipelineValue: initialValues.totalPipelineValue,
    stageValues: initialValues.stageValues,

    addDeal: (deal) =>
      set((state) => {
        const newDeals = { ...state.deals, [deal.id]: deal };
        const computed = computeValues(newDeals);
        return {
          deals: newDeals,
          totalPipelineValue: computed.totalPipelineValue,
          stageValues: computed.stageValues,
        };
      }),

    updateDeal: (id, updates) =>
      set((state) => {
        const newDeals = {
          ...state.deals,
          [id]: { ...state.deals[id], ...updates, updatedAt: new Date().toISOString() },
        };
        const computed = computeValues(newDeals);
        return {
          deals: newDeals,
          totalPipelineValue: computed.totalPipelineValue,
          stageValues: computed.stageValues,
        };
      }),

    deleteDeal: (id) =>
      set((state) => {
        const newDeals = { ...state.deals };
        delete newDeals[id];
        const computed = computeValues(newDeals);
        return {
          deals: newDeals,
          totalPipelineValue: computed.totalPipelineValue,
          stageValues: computed.stageValues,
        };
      }),

    getDeal: (id) => get().deals[id],
  };
});