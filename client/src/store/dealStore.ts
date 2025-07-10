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

interface Column {
  id: string;
  title: string;
  dealIds: string[];
}

interface DealState {
  deals: Record<string, Deal>;
  // Computed values
  totalPipelineValue: number;
  stageValues: Record<string, number>;
  // Kanban board data
  columns: Record<string, Column>;
  columnOrder: string[];
  // UI state
  isLoading: boolean;
  error: string | null;
  selectedDeal: Deal | null;
  aiInsight: string | null;
  isAnalyzing: boolean;
  // Actions
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  getDeal: (id: string) => Deal | undefined;
  selectDeal: (deal: Deal | null) => void;
  moveDealToStage: (dealId: string, newStage: string) => void;
  generateAiInsight: (deal: Deal) => Promise<void>;
  // API methods
  fetchDeals: () => Promise<void>;
  createDeal: (dealData: Partial<Deal>) => Promise<Deal>;
  updateDealApi: (id: string, updates: Partial<Deal>) => Promise<Deal>;
  deleteDealApi: (id: string) => Promise<void>;
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

  const updateKanbanColumns = (deals: Record<string, Deal>) => {
    const stages = ['discovery', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
    const columns: Record<string, Column> = {};
    const columnOrder: string[] = [];

    stages.forEach(stage => {
      const dealIds = Object.values(deals)
        .filter(deal => deal.stage === stage)
        .map(deal => deal.id);
      
      columns[stage] = {
        id: stage,
        title: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' '),
        dealIds
      };
      columnOrder.push(stage);
    });

    return { columns, columnOrder };
  };

  const initialDeals = mockDeals.reduce((acc, deal) => {
    acc[deal.id] = deal;
    return acc;
  }, {} as Record<string, Deal>);

  const initialValues = computeValues(initialDeals);
  const initialKanban = updateKanbanColumns(initialDeals);

  return {
    deals: initialDeals,
    totalPipelineValue: initialValues.totalPipelineValue,
    stageValues: initialValues.stageValues,
    columns: initialKanban.columns,
    columnOrder: initialKanban.columnOrder,
    isLoading: false,
    error: null,
    selectedDeal: null,
    aiInsight: null,
    isAnalyzing: false,

    addDeal: (deal) =>
      set((state) => {
        const newDeals = { ...state.deals, [deal.id]: deal };
        const computed = computeValues(newDeals);
        const kanban = updateKanbanColumns(newDeals);
        return {
          deals: newDeals,
          totalPipelineValue: computed.totalPipelineValue,
          stageValues: computed.stageValues,
          ...kanban,
        };
      }),

    updateDeal: (id, updates) =>
      set((state) => {
        const newDeals = {
          ...state.deals,
          [id]: { ...state.deals[id], ...updates, updatedAt: new Date().toISOString() },
        };
        const computed = computeValues(newDeals);
        const kanban = updateKanbanColumns(newDeals);
        return {
          deals: newDeals,
          totalPipelineValue: computed.totalPipelineValue,
          stageValues: computed.stageValues,
          ...kanban,
        };
      }),

    deleteDeal: (id) =>
      set((state) => {
        const newDeals = { ...state.deals };
        delete newDeals[id];
        const computed = computeValues(newDeals);
        const kanban = updateKanbanColumns(newDeals);
        return {
          deals: newDeals,
          totalPipelineValue: computed.totalPipelineValue,
          stageValues: computed.stageValues,
          ...kanban,
        };
      }),

    getDeal: (id) => get().deals[id],

    selectDeal: (deal) => set({ selectedDeal: deal }),

    moveDealToStage: (dealId, newStage) => {
      const { updateDeal } = get();
      updateDeal(dealId, { stage: newStage });
    },

    generateAiInsight: async (deal) => {
      set({ isAnalyzing: true, aiInsight: null });
      try {
        // Mock AI insight generation
        const insights = [
          `Deal ${deal.title} has a ${deal.probability}% probability of closing. Consider focusing on addressing budget concerns.`,
          `Based on deal size ($${deal.value.toLocaleString()}) and stage, this opportunity shows strong potential. Recommend scheduling technical demo.`,
          `Deal timeline suggests urgency. Contact ${deal.company} within 48 hours to maintain momentum.`,
          `High-value opportunity detected. Consider involving senior stakeholders for better closing rate.`
        ];
        
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        set({ aiInsight: randomInsight, isAnalyzing: false });
      } catch (error) {
        console.error('Error generating AI insight:', error);
        set({ isAnalyzing: false, error: 'Failed to generate AI insight' });
      }
    },

    // API methods
    fetchDeals: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch('/api/deals');
        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        const apiDeals = await response.json();
        
        // Transform API data to match Deal interface
        const deals = apiDeals.reduce((acc: Record<string, Deal>, apiDeal: any) => {
          acc[apiDeal.id] = {
            id: apiDeal.id,
            title: apiDeal.title,
            company: apiDeal.company,
            value: typeof apiDeal.value === 'string' ? parseFloat(apiDeal.value) : apiDeal.value,
            stage: apiDeal.stage,
            probability: typeof apiDeal.probability === 'string' ? parseFloat(apiDeal.probability) : apiDeal.probability,
            closeDate: apiDeal.expectedCloseDate || apiDeal.closeDate || '',
            contactId: apiDeal.contactId,
            createdAt: apiDeal.createdAt,
            updatedAt: apiDeal.updatedAt,
            contact: apiDeal.contact,
            priority: apiDeal.priority,
            notes: apiDeal.notes,
            dueDate: apiDeal.dueDate,
            tags: apiDeal.tags || [],
            lastActivity: apiDeal.lastActivityDate,
            isFavorite: apiDeal.isFavorite || false,
            contactAvatar: apiDeal.contactAvatar,
            companyAvatar: apiDeal.companyAvatar,
            customFields: apiDeal.customFields || {},
            socialProfiles: apiDeal.socialProfiles || {},
            lastEnrichment: apiDeal.lastEnrichment
          };
          return acc;
        }, {});
        
        const computed = computeValues(deals);
        const kanban = updateKanbanColumns(deals);
        set({ deals, ...computed, ...kanban, isLoading: false });
      } catch (error) {
        console.error('Error fetching deals:', error);
        // Fallback to mock data if API fails
        const fallbackDeals = mockDeals.reduce((acc, deal) => {
          acc[deal.id] = deal;
          return acc;
        }, {} as Record<string, Deal>);
        
        const computed = computeValues(fallbackDeals);
        const kanban = updateKanbanColumns(fallbackDeals);
        set({ deals: fallbackDeals, ...computed, ...kanban, isLoading: false, error: 'Using fallback data' });
      }
    },

    createDeal: async (dealData) => {
      try {
        const response = await fetch('/api/deals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dealData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create deal');
        }
        
        const newDeal = await response.json();
        get().addDeal(newDeal);
        return newDeal;
      } catch (error) {
        console.error('Error creating deal:', error);
        throw error;
      }
    },

    updateDealApi: async (id, updates) => {
      try {
        const response = await fetch(`/api/deals/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update deal');
        }
        
        const updatedDeal = await response.json();
        get().updateDeal(id, updatedDeal);
        return updatedDeal;
      } catch (error) {
        console.error('Error updating deal:', error);
        throw error;
      }
    },

    deleteDealApi: async (id) => {
      try {
        const response = await fetch(`/api/deals/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete deal');
        }
        
        get().deleteDeal(id);
      } catch (error) {
        console.error('Error deleting deal:', error);
        throw error;
      }
    },
  };
});