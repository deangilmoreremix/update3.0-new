import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Deal, PipelineColumn } from '../types';
import { AIEnhancedDealCard } from './deals/AIEnhancedDealCard';
import { AlertCircle, ArrowUpDown, BarChart3, Bot, Briefcase, Clock, DollarSign, Download, FilterX, Layers, List, PieChart, Plus, RefreshCw, Search, SlidersHorizontal, Target, TrendingUp, X } from 'lucide-react';
import { ModernButton } from './ui/ModernButton';
import { usePersonalization } from '../contexts/PersonalizationContext';
import { useContactStore } from '../store/contactStore';

// Enhanced mock data with Bolt-style comprehensive deal structure
const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise CRM Implementation',
    company: 'TechCorp Inc.',
    contact: 'Sarah Johnson',
    contactId: '1',
    value: 150000,
    stage: 'qualification',
    probability: 75,
    priority: 'high',
    dueDate: new Date('2024-02-15'),
    notes: 'Large enterprise client interested in comprehensive CRM solution with advanced AI features',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp&backgroundColor=3b82f6',
    lastActivity: 'Demo scheduled for next week',
    tags: ['enterprise', 'crm', 'high-value', 'ai-ready'],
    isFavorite: true,
    customFields: {
      'Decision Maker': 'Sarah Johnson',
      'Budget Approved': true,
      'Timeline': 'Q1 2024',
      'Team Size': '50+',
      'Implementation Complexity': 'High',
      'Technical Requirements': 'Advanced integrations needed'
    },
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/techcorp',
      website: 'https://techcorp.com',
      twitter: 'https://twitter.com/techcorp'
    },
    lastEnrichment: {
      confidence: 85,
      aiProvider: 'OpenAI GPT-4',
      timestamp: new Date('2024-01-15')
    },
    links: [
      { title: 'Company Website', url: 'https://techcorp.com', type: 'website' },
      { title: 'LinkedIn Profile', url: 'https://linkedin.com/company/techcorp', type: 'linkedin' },
      { title: 'Product Demo', url: 'https://demo.techcorp.com', type: 'demo' }
    ],
    attachments: [
      { id: '1', name: 'TechCorp_Requirements.pdf', size: 2547892, type: 'pdf', uploadedAt: '2024-01-10' },
      { id: '2', name: 'Proposal_v2.docx', size: 1234567, type: 'docx', uploadedAt: '2024-01-14' }
    ],
    nextFollowUp: '2024-02-05',
    aiScore: 85
  },
  {
    id: '2',
    title: 'Marketing Automation Platform',
    company: 'GrowthStartup',
    contact: 'Michael Chen',
    contactId: '2',
    value: 75000,
    stage: 'proposal',
    probability: 60,
    priority: 'medium',
    dueDate: new Date('2024-03-01'),
    notes: 'Fast-growing startup looking for comprehensive marketing automation solution',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GrowthStartup&backgroundColor=8b5cf6',
    lastActivity: 'Proposal presentation delivered',
    tags: ['startup', 'marketing', 'automation', 'growth-stage'],
    isFavorite: false,
    customFields: {
      'Company Size': '50-100',
      'Industry': 'SaaS',
      'Growth Stage': 'Series A',
      'Marketing Team Size': '8',
      'Current Tools': 'HubSpot, Mailchimp',
      'Pain Points': 'Lead scoring, nurturing workflows'
    },
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/growthstartup',
      website: 'https://growthstartup.com',
      twitter: 'https://twitter.com/growthstartup'
    },
    lastEnrichment: {
      confidence: 70,
      aiProvider: 'Google Gemini',
      timestamp: new Date('2024-01-20')
    },
    links: [
      { title: 'Company Website', url: 'https://growthstartup.com', type: 'website' },
      { title: 'Product Tour', url: 'https://app.growthstartup.com/tour', type: 'demo' }
    ],
    attachments: [
      { id: '3', name: 'Marketing_Strategy.pdf', size: 3456789, type: 'pdf', uploadedAt: '2024-01-18' }
    ],
    nextFollowUp: '2024-02-10',
    aiScore: 70
  },
  {
    id: '3',
    title: 'Sales Analytics Dashboard',
    company: 'DataCorp Solutions',
    contact: 'Emily Rodriguez',
    contactId: '3',
    value: 45000,
    stage: 'negotiation',
    probability: 80,
    priority: 'high',
    dueDate: new Date('2024-02-28'),
    notes: 'Advanced analytics solution for sales team performance tracking and forecasting',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DataCorp&backgroundColor=f59e0b',
    lastActivity: 'Contract terms under review',
    tags: ['analytics', 'dashboard', 'sales', 'data-driven'],
    isFavorite: true,
    customFields: {
      'Implementation Timeline': '6 weeks',
      'Technical Contact': 'Emily Rodriguez',
      'Budget Range': '$40k-$50k',
      'Data Sources': 'Salesforce, HubSpot, Custom APIs',
      'Reporting Requirements': 'Real-time dashboards, weekly reports',
      'User Count': '25 sales reps'
    },
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/datacorp',
      website: 'https://datacorp.com',
      twitter: 'https://twitter.com/datacorp'
    },
    lastEnrichment: {
      confidence: 90,
      aiProvider: 'OpenAI GPT-4',
      timestamp: new Date('2024-01-25')
    },
    links: [
      { title: 'Company Website', url: 'https://datacorp.com', type: 'website' },
      { title: 'Live Demo', url: 'https://demo.datacorp.com', type: 'demo' },
      { title: 'Case Study', url: 'https://datacorp.com/case-study-analytics', type: 'case-study' }
    ],
    attachments: [
      { id: '4', name: 'Analytics_Requirements.xlsx', size: 1987654, type: 'xlsx', uploadedAt: '2024-01-22' },
      { id: '5', name: 'Contract_Draft.pdf', size: 987654, type: 'pdf', uploadedAt: '2024-01-25' }
    ],
    nextFollowUp: '2024-02-01',
    aiScore: 90
  },
  {
    id: '4',
    title: 'Customer Support Platform',
    company: 'ServiceFirst',
    contact: 'David Wilson',
    contactId: '4',
    value: 85000,
    stage: 'closed-won',
    probability: 100,
    priority: 'medium',
    dueDate: new Date('2024-01-30'),
    notes: 'Successfully closed comprehensive customer support platform with AI-powered ticketing',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-30'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ServiceFirst&backgroundColor=10b981',
    lastActivity: 'Contract signed, implementation starting',
    tags: ['support', 'platform', 'closed', 'ai-powered'],
    isFavorite: false,
    customFields: {
      'Contract Duration': '2 years',
      'Go-live Date': '2024-03-01',
      'Support Level': 'Premium',
      'Team Size': '15 support agents',
      'Integration Requirements': 'Slack, Zendesk migration',
      'Success Metrics': 'Response time <2hrs, CSAT >90%'
    },
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/servicefirst',
      website: 'https://servicefirst.com',
      twitter: 'https://twitter.com/servicefirst'
    },
    lastEnrichment: {
      confidence: 95,
      aiProvider: 'OpenAI GPT-4',
      timestamp: new Date('2024-01-30')
    },
    links: [
      { title: 'Company Website', url: 'https://servicefirst.com', type: 'website' },
      { title: 'Support Portal', url: 'https://support.servicefirst.com', type: 'portal' }
    ],
    attachments: [
      { id: '6', name: 'Signed_Contract.pdf', size: 2345678, type: 'pdf', uploadedAt: '2024-01-30' },
      { id: '7', name: 'Implementation_Plan.docx', size: 1567890, type: 'docx', uploadedAt: '2024-01-30' }
    ],
    nextFollowUp: '2024-02-15',
    aiScore: 95
  },
  {
    id: '5',
    title: 'E-commerce Integration',
    company: 'RetailTech',
    contact: 'Lisa Thompson',
    contactId: '5',
    value: 35000,
    stage: 'closed-lost',
    probability: 0,
    priority: 'low',
    dueDate: new Date('2024-01-20'),
    notes: 'Lost to competitor primarily due to pricing concerns and timeline constraints',
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-20'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RetailTech&backgroundColor=ef4444',
    lastActivity: 'Final decision: chose competitor',
    tags: ['ecommerce', 'integration', 'lost', 'price-sensitive'],
    isFavorite: false,
    customFields: {
      'Lost Reason': 'Price and timeline',
      'Competitor': 'ShopifyPlus',
      'Follow-up Date': '2024-07-01',
      'Budget Constraint': '$30k max',
      'Timeline Requirement': '4 weeks',
      'Key Decision Factor': 'Implementation speed'
    },
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/retailtech',
      website: 'https://retailtech.com',
      twitter: 'https://twitter.com/retailtech'
    },
    lastEnrichment: {
      confidence: 60,
      aiProvider: 'Google Gemini',
      timestamp: new Date('2024-01-20')
    },
    links: [
      { title: 'Company Website', url: 'https://retailtech.com', type: 'website' },
      { title: 'E-commerce Platform', url: 'https://shop.retailtech.com', type: 'platform' }
    ],
    attachments: [
      { id: '8', name: 'Lost_Deal_Analysis.pdf', size: 1234567, type: 'pdf', uploadedAt: '2024-01-20' }
    ],
    nextFollowUp: '2024-07-01',
    aiScore: 60
  },
  {
    id: '6',
    title: 'AI-Powered Analytics',
    company: 'InnovateCorp',
    contact: 'James Brown',
    contactId: '6',
    value: 120000,
    stage: 'qualification',
    probability: 65,
    priority: 'high',
    dueDate: new Date('2024-03-15'),
    notes: 'Cutting-edge AI analytics solution for business intelligence and predictive modeling',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-28'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=InnovateCorp&backgroundColor=06b6d4',
    lastActivity: 'AI capabilities demo scheduled',
    tags: ['ai', 'analytics', 'intelligence', 'predictive'],
    isFavorite: true,
    customFields: {
      'AI Experience': 'Intermediate',
      'Data Volume': 'Large (>10TB)',
      'Integration Complexity': 'High',
      'ML Models Required': 'Forecasting, classification',
      'Compliance Requirements': 'GDPR, SOC2',
      'Team Technical Level': 'Advanced'
    },
    socialProfiles: {
      linkedin: 'https://linkedin.com/company/innovatecorp',
      website: 'https://innovatecorp.com',
      twitter: 'https://twitter.com/innovatecorp'
    },
    lastEnrichment: {
      confidence: 80,
      aiProvider: 'OpenAI GPT-4',
      timestamp: new Date('2024-01-28')
    },
    links: [
      { title: 'Company Website', url: 'https://innovatecorp.com', type: 'website' },
      { title: 'AI Research Lab', url: 'https://research.innovatecorp.com', type: 'research' },
      { title: 'Technical Blog', url: 'https://blog.innovatecorp.com', type: 'blog' }
    ],
    attachments: [
      { id: '9', name: 'AI_Requirements.pdf', size: 4567890, type: 'pdf', uploadedAt: '2024-01-26' },
      { id: '10', name: 'Technical_Specs.docx', size: 2345678, type: 'docx', uploadedAt: '2024-01-28' }
    ],
    nextFollowUp: '2024-02-08',
    aiScore: 80
  }
];

const pipelineColumns: PipelineColumn[] = [
  { id: 'qualification', title: 'Qualification', dealIds: ['1', '6'], color: '#3B82F6' },
  { id: 'proposal', title: 'Proposal', dealIds: ['2'], color: '#8B5CF6' },
  { id: 'negotiation', title: 'Negotiation', dealIds: ['3'], color: '#F59E0B' },
  { id: 'closed-won', title: 'Closed Won', dealIds: ['4'], color: '#10B981' },
  { id: 'closed-lost', title: 'Closed Lost', dealIds: ['5'], color: '#EF4444' }
];

// Advanced filtering interface
interface AdvancedFilters {
  search: string;
  stage: string;
  priority: string;
  valueRange: { min: number; max: number };
  probabilityRange: { min: number; max: number };
  dateRange: { start: Date | null; end: Date | null };
  tags: string[];
  favorites: boolean;
  aiScore: { min: number; max: number };
}

export const EnhancedPipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [columns, setColumns] = useState<PipelineColumn[]>(pipelineColumns);
  const [filters, setFilters] = useState<AdvancedFilters>({
    search: '',
    stage: 'all',
    priority: 'all',
    valueRange: { min: 0, max: 1000000 },
    probabilityRange: { min: 0, max: 100 },
    dateRange: { start: null, end: null },
    tags: [],
    favorites: false,
    aiScore: { min: 0, max: 100 }
  });
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isAnalyzing, setIsAnalyzing] = useState<Record<string, boolean>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'value' | 'probability' | 'dueDate' | 'created'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { userPreferences } = usePersonalization();
  const { contacts } = useContactStore();

  // Enhanced filtering logic
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         deal.company.toLowerCase().includes(filters.search.toLowerCase()) ||
                         deal.contact.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStage = filters.stage === 'all' || deal.stage === filters.stage;
    const matchesPriority = filters.priority === 'all' || deal.priority === filters.priority;
    const matchesValue = deal.value >= filters.valueRange.min && deal.value <= filters.valueRange.max;
    const matchesProbability = deal.probability >= filters.probabilityRange.min && deal.probability <= filters.probabilityRange.max;
    const matchesFavorites = !filters.favorites || deal.isFavorite;
    const matchesAIScore = (deal.aiScore || 0) >= filters.aiScore.min && (deal.aiScore || 0) <= filters.aiScore.max;
    
    return matchesSearch && matchesStage && matchesPriority && matchesValue && matchesProbability && matchesFavorites && matchesAIScore;
  });

  // Sort deals
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    let aValue: any, bValue: unknown;
    
    switch (sortBy) {
      case 'value':
        aValue = a.value;
        bValue = b.value;
        break;
      case 'probability':
        aValue = a.probability;
        bValue = b.probability;
        break;
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        break;
      case 'created':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = a.value;
        bValue = b.value;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Enhanced statistics
  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const totalDeals = filteredDeals.length;
  const averageDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
  const highPriorityDeals = filteredDeals.filter(deal => deal.priority === 'high').length;
  const weightedPipelineValue = filteredDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
  const averageProbability = totalDeals > 0 ? filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / totalDeals : 0;
  const dealsClosingSoon = filteredDeals.filter(deal => {
    if (!deal.dueDate) return false;
    const daysUntilDue = Math.ceil((new Date(deal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue > 0;
  }).length;

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Update the deal's stage and related fields
    const updatedDeals = deals.map(deal => {
      if (deal.id === draggableId) {
        const updatedDeal = { 
          ...deal, 
          stage: destination.droppableId as Deal['stage'],
          updatedAt: new Date()
        };
        
        // Update probability based on stage
        if (destination.droppableId === 'closed-won') {
          updatedDeal.probability = 100;
        } else if (destination.droppableId === 'closed-lost') {
          updatedDeal.probability = 0;
        }
        
        return updatedDeal;
      }
      return deal;
    });

    // Update columns
    const newSourceDealIds = [...sourceColumn.dealIds];
    const newDestDealIds = [...destColumn.dealIds];

    newSourceDealIds.splice(source.index, 1);
    newDestDealIds.splice(destination.index, 0, draggableId);

    const updatedColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, dealIds: newSourceDealIds };
      }
      if (col.id === destination.droppableId) {
        return { ...col, dealIds: newDestDealIds };
      }
      return col;
    });

    setDeals(updatedDeals);
    setColumns(updatedColumns);
  };

  const handleAnalyzeDeal = async (deal: Deal): Promise<boolean> => {
    setIsAnalyzing(prev => ({ ...prev, [deal.id]: true }));
    
    try {
      // Simulate AI analysis with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update deal with AI insights
      const updatedDeals = deals.map(d => {
        if (d.id === deal.id) {
          return {
            ...d,
            aiScore: Math.min(100, (d.aiScore || 0) + Math.floor(Math.random() * 15) + 5),
            lastEnrichment: {
              confidence: 85 + Math.floor(Math.random() * 15),
              aiProvider: 'OpenAI GPT-4',
              timestamp: new Date()
            },
            customFields: {
              ...d.customFields,
              'AI Analysis': 'High conversion potential based on engagement patterns',
              'Risk Assessment': 'Low risk, strong technical fit',
              'Recommended Actions': 'Schedule technical demo, send ROI calculator'
            }
          };
        }
        return d;
      });
      
      setDeals(updatedDeals);
      return true;
    } catch (error) {
      console.error('Deal analysis failed:', error);
      return false;
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [deal.id]: false }));
    }
  };

  const handleAIEnrichDeal = async (deal: Deal): Promise<boolean> => {
    setIsAnalyzing(prev => ({ ...prev, [deal.id]: true }));
    
    try {
      // Simulate AI enrichment with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update deal with enriched data
      const updatedDeals = deals.map(d => {
        if (d.id === deal.id) {
          return {
            ...d,
            customFields: {
              ...d.customFields,
              'AI Insights': 'Strong buying signals detected from recent interactions',
              'Competitive Position': 'Leading against 2 competitors',
              'Next Best Actions': 'Send executive summary, schedule stakeholder meeting',
              'Deal Health': 'Excellent - on track for close',
              'Engagement Score': '92/100'
            },
            lastEnrichment: {
              confidence: 90 + Math.floor(Math.random() * 10),
              aiProvider: 'Google Gemini Pro',
              timestamp: new Date()
            },
            probability: Math.min(100, d.probability + Math.floor(Math.random() * 10) + 5)
          };
        }
        return d;
      });
      
      setDeals(updatedDeals);
      return true;
    } catch (error) {
      console.error('Deal enrichment failed:', error);
      return false;
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [deal.id]: false }));
    }
  };

  const handleToggleFavorite = async (deal: Deal) => {
    const updatedDeals = deals.map(d => {
      if (d.id === deal.id) {
        return { ...d, isFavorite: !d.isFavorite };
      }
      return d;
    });
    setDeals(updatedDeals);
  };

  const handleFindNewImage = async (deal: Deal) => {
    // Simulate finding new image
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedDeals = deals.map(d => {
      if (d.id === deal.id) {
        return { 
          ...d, 
          companyAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${d.company}-${Date.now()}&backgroundColor=${['3b82f6', '8b5cf6', 'f59e0b', '10b981', 'ef4444', '06b6d4'][Math.floor(Math.random() * 6)]}` 
        };
      }
      return d;
    });
    setDeals(updatedDeals);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      stage: 'all',
      priority: 'all',
      valueRange: { min: 0, max: 1000000 },
      probabilityRange: { min: 0, max: 100 },
      dateRange: { start: null, end: null },
      tags: [],
      favorites: false,
      aiScore: { min: 0, max: 100 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 sticky top-0 z-40 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Enhanced Sales Pipeline
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Track, analyze, and optimize your deal flow with AI-powered insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ModernButton
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
              >
                New Deal
              </ModernButton>
              <ModernButton
                variant="outline"
                size="sm"
                leftIcon={<BarChart3 className="w-4 h-4" />}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
              >
                Analytics
              </ModernButton>
              <ModernButton
                variant="outline"
                size="sm"
                leftIcon={<Bot className="w-4 h-4" />}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
              >
                AI Insights
              </ModernButton>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalValue.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Deals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDeals}</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${Math.round(averageDealSize).toLocaleString()}</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{highPriorityDeals}</p>
                </div>
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Weighted Value</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${Math.round(weightedPipelineValue).toLocaleString()}</p>
                </div>
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <PieChart className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg Probability</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(averageProbability)}%</p>
                </div>
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <TargetIcon className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/20 dark:border-gray-700/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Closing Soon</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dealsClosingSoon}</p>
                </div>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search deals, companies, or contacts..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filters.stage}
                onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
                className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Stages</option>
                <option value="qualification">Qualification</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="closed-won">Closed Won</option>
                <option value="closed-lost">Closed Lost</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as unknown)}
                className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="value">Sort by Value</option>
                <option value="probability">Sort by Probability</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="created">Sort by Created</option>
              </select>
              <ModernButton
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                leftIcon={<ArrowUpDown className="w-4 h-4" />}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
              >
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </ModernButton>
              <ModernButton
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
              >
                Advanced
              </ModernButton>
              {(filters.search || filters.stage !== 'all' || filters.priority !== 'all' || filters.favorites) && (
                <ModernButton
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  leftIcon={<FilterX className="w-4 h-4" />}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Clear Filters
                </ModernButton>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'kanban' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-gray-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Kanban
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-gray-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    List
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <ModernButton
                  variant="outline"
                  size="sm"
                  leftIcon={<Download className="w-4 h-4" />}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
                >
                  Export
                </ModernButton>
                <ModernButton
                  variant="outline"
                  size="sm"
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
                >
                  Refresh
                </ModernButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Pipeline Board */}
      <div className="p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => {
              const columnDeals = sortedDeals.filter(deal => deal.stage === column.id);
              const columnValue = columnDeals.reduce((sum, deal) => sum + deal.value, 0);
              const columnWeightedValue = columnDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);
              const avgProbability = columnDeals.length > 0 ? columnDeals.reduce((sum, deal) => sum + deal.probability, 0) / columnDeals.length : 0;
              
              return (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 h-full shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-200/20 dark:border-gray-700/20">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{column.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {columnDeals.length}
                          </span>
                          <div 
                            className="w-3 h-3 rounded-full shadow-sm" 
                            style={{ backgroundColor: column.color }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Total: </span>${columnValue.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Weighted: </span>${Math.round(columnWeightedValue).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Avg Prob: </span>{Math.round(avgProbability)}%
                        </p>
                      </div>
                    </div>
                    
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 min-h-[600px] transition-all duration-200 ${
                            snapshot.isDraggingOver 
                              ? 'bg-blue-50/50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 border-dashed' 
                              : ''
                          }`}
                        >
                          <div className="space-y-4">
                            {columnDeals.map((deal, index) => (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`transition-all duration-200 ${
                                      snapshot.isDragging 
                                        ? 'scale-105 rotate-2 shadow-2xl z-50' 
                                        : 'hover:scale-[1.02] hover:shadow-lg'
                                    }`}
                                  >
                                    <AIEnhancedDealCard
                                      deal={deal}
                                      onClick={() => console.log('Deal clicked:', deal.id)}
                                      onAnalyze={handleAnalyzeDeal}
                                      onAIEnrich={handleAIEnrichDeal}
                                      isAnalyzing={isAnalyzing[deal.id]}
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
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};