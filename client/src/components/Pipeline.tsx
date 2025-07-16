import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Deal, PipelineColumn } from '../types';
import AIEnhancedDealCard from './deals/AIEnhancedDealCard';
import { Search, Filter, Plus, BarChart3, Grid3X3, List, Target } from 'lucide-react';

// Mock data for the Bolt Pipeline
const mockDeals: Record<string, Deal> = {
  'deal-1': {
    id: 'deal-1',
    title: 'Enterprise Software License',
    company: 'TechCorp Solutions',
    contact: 'Sarah Johnson',
    value: 125000,
    stage: 'qualification',
    probability: 85,
    priority: 'high',
    dueDate: new Date('2024-02-15'),
    expectedCloseDate: '2024-02-15',
    contactAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp&backgroundColor=3b82f6&textColor=ffffff',
    isFavorite: true,
    tags: ['enterprise', 'software'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/techcorp-solutions',
      website: 'https://techcorp.com'
    },
    customFields: {
      "Deal Source": "Direct",
      "Account Manager": "Alex Rivera"
    },
    lastActivity: 'Sent proposal document',
    lastEnrichment: {
      confidence: 85,
      aiProvider: 'OpenAI GPT-4o',
      timestamp: new Date()
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  'deal-2': {
    id: 'deal-2',
    title: 'Cloud Migration Project',
    company: 'StartupXYZ',
    contact: 'Mike Chen',
    value: 75000,
    stage: 'proposal',
    probability: 65,
    priority: 'medium',
    dueDate: new Date('2024-02-20'),
    expectedCloseDate: '2024-02-20',
    contactAvatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=StartupXYZ&backgroundColor=8b5cf6&textColor=ffffff',
    tags: ['cloud', 'migration'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/startupxyz',
      website: 'https://startupxyz.com'
    },
    customFields: {
      "Deal Source": "Referral",
      "Account Manager": "Sam Wilson"
    },
    lastActivity: 'Demo completed',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12'
  },
  'deal-3': {
    id: 'deal-3',
    title: 'AI Analytics Platform',
    company: 'DataFlow Inc',
    contact: 'Emily Rodriguez',
    value: 95000,
    stage: 'negotiation',
    probability: 78,
    priority: 'high',
    dueDate: new Date('2024-02-10'),
    expectedCloseDate: '2024-02-10',
    contactAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DataFlow&backgroundColor=f59e0b&textColor=ffffff',
    isFavorite: true,
    tags: ['ai', 'analytics'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/dataflow-inc',
      website: 'https://dataflow.com'
    },
    customFields: {
      "Deal Source": "Marketing",
      "Account Manager": "Lisa Park"
    },
    lastActivity: 'Contract review in progress',
    lastEnrichment: {
      confidence: 78,
      aiProvider: 'Gemini Pro',
      timestamp: new Date()
    },
    createdAt: '2024-01-03',
    updatedAt: '2024-01-15'
  },
  'deal-4': {
    id: 'deal-4',
    title: 'Digital Transformation',
    company: 'RetailCorp',
    contact: 'David Kim',
    value: 45000,
    stage: 'discovery',
    probability: 40,
    priority: 'medium',
    dueDate: new Date('2024-02-25'),
    expectedCloseDate: '2024-02-25',
    contactAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RetailCorp&backgroundColor=10b981&textColor=ffffff',
    tags: ['retail', 'transformation'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/retailcorp',
      website: 'https://retailcorp.com'
    },
    customFields: {
      "Deal Source": "Cold Outreach",
      "Account Manager": "Chris Taylor"
    },
    lastActivity: 'Initial meeting scheduled',
    createdAt: '2024-01-07',
    updatedAt: '2024-01-14'
  },
  'deal-5': {
    id: 'deal-5',
    title: 'Security Compliance Suite',
    company: 'FinanceFirst',
    contact: 'Jennifer Lopez',
    value: 180000,
    stage: 'closed-won',
    probability: 100,
    priority: 'high',
    dueDate: new Date('2024-01-30'),
    expectedCloseDate: '2024-01-30',
    contactAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FinanceFirst&backgroundColor=059669&textColor=ffffff',
    isFavorite: true,
    tags: ['finance', 'security'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/financefirst',
      website: 'https://financefirst.com'
    },
    customFields: {
      "Deal Source": "Partner",
      "Account Manager": "Alex Rivera"
    },
    lastActivity: 'Contract signed',
    createdAt: '2023-12-15',
    updatedAt: '2024-01-30'
  },
  'deal-6': {
    id: 'deal-6',
    title: 'Mobile App Development',
    company: 'AppInnovate',
    contact: 'Robert Wilson',
    value: 35000,
    stage: 'closed-lost',
    probability: 0,
    priority: 'low',
    dueDate: new Date('2024-01-20'),
    expectedCloseDate: '2024-01-20',
    contactAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AppInnovate&backgroundColor=ef4444&textColor=ffffff',
    tags: ['mobile', 'development'],
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/appinnovate',
      website: 'https://appinnovate.com'
    },
    customFields: {
      "Deal Source": "Web Form",
      "Account Manager": "Sam Wilson"
    },
    lastActivity: 'Lost to competitor',
    createdAt: '2023-12-20',
    updatedAt: '2024-01-20'
  }
};

const mockColumns: Record<string, PipelineColumn> = {
  discovery: {
    id: 'discovery',
    title: 'Discovery',
    dealIds: ['deal-4'],
    color: '#3B82F6'
  },
  qualification: {
    id: 'qualification',
    title: 'Qualification',
    dealIds: ['deal-1'],
    color: '#F59E0B'
  },
  proposal: {
    id: 'proposal',
    title: 'Proposal',
    dealIds: ['deal-2'],
    color: '#8B5CF6'
  },
  negotiation: {
    id: 'negotiation',
    title: 'Negotiation',
    dealIds: ['deal-3'],
    color: '#F97316'
  },
  'closed-won': {
    id: 'closed-won',
    title: 'Closed Won',
    dealIds: ['deal-5'],
    color: '#10B981'
  },
  'closed-lost': {
    id: 'closed-lost',
    title: 'Closed Lost',
    dealIds: ['deal-6'],
    color: '#EF4444'
  }
};

const columnOrder = ['discovery', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];

const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Record<string, Deal>>(mockDeals);
  const [columns, setColumns] = useState<Record<string, PipelineColumn>>(mockColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [analyzingDealId, setAnalyzingDealId] = useState<string | null>(null);
  const [enrichingDealId, setEnrichingDealId] = useState<string | null>(null);

  // Filter deals based on search
  const filteredDeals = useMemo(() => {
    let filtered = { ...deals };

    if (searchTerm) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, deal]) =>
          deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          deal.contact.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [deals, searchTerm]);

  // Update columns with filtered deals
  const filteredColumns = useMemo(() => {
    const newColumns = { ...columns };
    
    Object.keys(newColumns).forEach(columnId => {
      newColumns[columnId] = {
        ...newColumns[columnId],
        dealIds: newColumns[columnId].dealIds.filter(dealId => filteredDeals[dealId])
      };
    });
    
    return newColumns;
  }, [columns, filteredDeals]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    if (sourceColumn === destColumn) {
      const newDealIds = Array.from(sourceColumn.dealIds);
      newDealIds.splice(source.index, 1);
      newDealIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        dealIds: newDealIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
    } else {
      const sourceDealIds = Array.from(sourceColumn.dealIds);
      sourceDealIds.splice(source.index, 1);
      const newSourceColumn = {
        ...sourceColumn,
        dealIds: sourceDealIds,
      };

      const destDealIds = Array.from(destColumn.dealIds);
      destDealIds.splice(destination.index, 0, draggableId);
      const newDestColumn = {
        ...destColumn,
        dealIds: destDealIds,
      };

      // Update deal stage
      const updatedDeal = {
        ...deals[draggableId],
        stage: destination.droppableId as Deal['stage'],
        updatedAt: new Date().toISOString(),
      };

      setDeals({
        ...deals,
        [draggableId]: updatedDeal,
      });

      setColumns({
        ...columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      });
    }
  };

  const handleAnalyzeDeal = async (deal: Deal): Promise<boolean> => {
    setAnalyzingDealId(deal.id);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const enhancedProbability = Math.min(deal.probability + 10, 95);
      const updatedDeal = {
        ...deal,
        probability: enhancedProbability,
        lastEnrichment: {
          confidence: enhancedProbability,
          aiProvider: 'Hybrid AI (GPT-4o + Gemini)',
          timestamp: new Date()
        },
        updatedAt: new Date().toISOString()
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to analyze deal:', error);
      return false;
    } finally {
      setAnalyzingDealId(null);
    }
  };

  const handleAIEnrichDeal = async (deal: Deal): Promise<boolean> => {
    setEnrichingDealId(deal.id);
    try {
      // Simulate AI enrichment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedDeal = {
        ...deal,
        customFields: {
          ...deal.customFields,
          "AI Insights": "High conversion potential",
          "Next Best Action": "Schedule follow-up call"
        },
        lastEnrichment: {
          confidence: 88,
          aiProvider: 'OpenAI GPT-4o',
          timestamp: new Date()
        },
        updatedAt: new Date().toISOString()
      };
      
      setDeals(prev => ({
        ...prev,
        [deal.id]: updatedDeal
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to enrich deal:', error);
      return false;
    } finally {
      setEnrichingDealId(null);
    }
  };

  const handleToggleFavorite = async (deal: Deal) => {
    const updatedDeal = {
      ...deal,
      isFavorite: !deal.isFavorite,
      updatedAt: new Date().toISOString()
    };
    
    setDeals(prev => ({
      ...prev,
      [deal.id]: updatedDeal
    }));
  };

  const handleFindNewImage = async (deal: Deal) => {
    // Simulate finding new image
    console.log('Finding new image for:', deal.company);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalPipelineValue = () => {
    return Object.values(filteredDeals).reduce((total, deal) => {
      if (deal.stage !== 'closed-lost') {
        return total + deal.value;
      }
      return total;
    }, 0);
  };

  const getDealsCount = () => {
    return Object.values(filteredDeals).filter(deal => deal.stage !== 'closed-lost').length;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales Pipeline</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your deals and track progress through the sales process
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{getDealsCount()} Active Deals</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="w-4 h-4" />
                <span>{formatCurrency(getTotalPipelineValue())} Pipeline Value</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Deal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-6 gap-6">
          {columnOrder.map((columnId) => {
            const column = filteredColumns[columnId];
            const deals = column.dealIds.map(dealId => filteredDeals[dealId]);

            return (
              <div key={column.id} className="flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {column.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {deals.length}
                      </span>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 min-h-[200px] rounded-lg p-2 transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600' 
                          : 'bg-gray-100 dark:bg-gray-800/50 border-2 border-transparent'
                      }`}
                    >
                      <div className="space-y-3">
                        {deals.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`transform transition-transform ${
                                  snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                }`}
                              >
                                <AIEnhancedDealCard
                                  deal={deal}
                                  isSelected={selectedDealId === deal.id}
                                  onSelect={() => setSelectedDealId(deal.id)}
                                  onClick={() => setSelectedDealId(deal.id)}
                                  onAnalyze={handleAnalyzeDeal}
                                  onAIEnrich={handleAIEnrichDeal}
                                  isAnalyzing={analyzingDealId === deal.id}
                                  onToggleFavorite={handleToggleFavorite}
                                  onFindNewImage={handleFindNewImage}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Pipeline;