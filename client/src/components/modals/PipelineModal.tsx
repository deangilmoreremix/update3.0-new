import React, { useState, useEffect } from 'react';
import { X, Plus, Filter, Search, BarChart3, TrendingUp, Target, DollarSign, Calendar, Users, Star, Heart, Briefcase, Building, Phone, Mail, Globe, Zap, MoreHorizontal, ArrowUpDown, SlidersHorizontal, Eye, EyeOff, RefreshCw, Bot, Sparkles, Download, Upload, FilterX, Grid3X3, List } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Deal, PipelineColumn } from '../../types';
import { AIEnhancedDealCard } from '../deals/AIEnhancedDealCard';
import { ModernButton } from '../ui/ModernButton';
import Select from 'react-select';
import { useForm } from 'react-hook-form';

interface PipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Pipeline columns configuration
const pipelineColumns: PipelineColumn[] = [
  { id: 'qualification', title: 'Qualification', color: 'blue' },
  { id: 'proposal', title: 'Proposal', color: 'yellow' },
  { id: 'negotiation', title: 'Negotiation', color: 'orange' },
  { id: 'closed-won', title: 'Closed Won', color: 'green' },
  { id: 'closed-lost', title: 'Closed Lost', color: 'red' }
];

// Enhanced mock data with comprehensive deal structure
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
      'Marketing Team Size': '8'
    },
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
      'Budget Range': '$40k-$50k',
      'User Count': '25 sales reps'
    },
    nextFollowUp: '2024-02-08',
    aiScore: 90
  },
  {
    id: '4',
    title: 'Customer Support Platform',
    company: 'ServiceFirst Ltd',
    contact: 'David Kim',
    contactId: '4',
    value: 85000,
    stage: 'closed-won',
    probability: 100,
    priority: 'high',
    dueDate: new Date('2024-01-30'),
    notes: 'Comprehensive customer support solution with AI-powered ticket routing',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-30'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ServiceFirst&backgroundColor=10b981',
    lastActivity: 'Contract signed, implementation started',
    tags: ['support', 'ai', 'customer-service', 'won'],
    isFavorite: true,
    customFields: {
      'Contract Value': '$85,000',
      'Implementation Started': '2024-01-30',
      'Go-Live Date': '2024-03-15'
    },
    nextFollowUp: '2024-02-15',
    aiScore: 95
  },
  {
    id: '5',
    title: 'E-commerce Integration',
    company: 'RetailMax Corp',
    contact: 'Lisa Wang',
    contactId: '5',
    value: 35000,
    stage: 'closed-lost',
    probability: 0,
    priority: 'low',
    dueDate: new Date('2024-01-20'),
    notes: 'E-commerce platform integration project - lost to competitor',
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-20'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RetailMax&backgroundColor=ef4444',
    lastActivity: 'Chose competitor solution',
    tags: ['ecommerce', 'integration', 'lost', 'competitor'],
    isFavorite: false,
    customFields: {
      'Lost Reason': 'Price',
      'Competitor': 'ShopifyPlus',
      'Follow-up Date': '2024-06-01'
    },
    nextFollowUp: '2024-06-01',
    aiScore: 25
  },
  {
    id: '6',
    title: 'AI-Powered Analytics',
    company: 'InnovateTech',
    contact: 'Alex Thompson',
    contactId: '6',
    value: 120000,
    stage: 'qualification',
    probability: 65,
    priority: 'high',
    dueDate: new Date('2024-03-15'),
    notes: 'Advanced AI analytics platform for business intelligence and predictive modeling',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01'),
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=InnovateTech&backgroundColor=6366f1',
    lastActivity: 'Technical requirements assessment',
    tags: ['ai', 'analytics', 'enterprise', 'qualification'],
    isFavorite: true,
    customFields: {
      'Technical Requirements': 'Machine learning capabilities',
      'Data Volume': '10TB+',
      'Integration Needs': 'Salesforce, HubSpot, Custom APIs'
    },
    nextFollowUp: '2024-02-12',
    aiScore: 78
  }
];

export const PipelineModal: React.FC<PipelineModalProps> = ({ isOpen, onClose }) => {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [activeFilters, setActiveFilters] = useState<{
    stage: string | null;
    priority: string | null;
    value: [number, number] | null;
  }>({
    stage: null,
    priority: null,
    value: null
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Partial<Deal>>();

  const priorities = ['high', 'medium', 'low'];
  const stages = pipelineColumns.map(col => col.id);

  // Filter deals based on search and active filters
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = !searchTerm || 
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.contact.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = !activeFilters.stage || deal.stage === activeFilters.stage;
    const matchesPriority = !activeFilters.priority || deal.priority === activeFilters.priority;
    const matchesValue = !activeFilters.value || 
      (deal.value >= activeFilters.value[0] && deal.value <= activeFilters.value[1]);
    
    return matchesSearch && matchesStage && matchesPriority && matchesValue;
  });

  // Calculate KPIs
  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = filteredDeals.length > 0 ? totalValue / filteredDeals.length : 0;
  const highPriorityDeals = filteredDeals.filter(deal => deal.priority === 'high').length;
  const wonDeals = filteredDeals.filter(deal => deal.stage === 'closed-won').length;
  const lostDeals = filteredDeals.filter(deal => deal.stage === 'closed-lost').length;
  const winRate = wonDeals + lostDeals > 0 ? (wonDeals / (wonDeals + lostDeals)) * 100 : 0;

  // Group deals by stage
  const dealsByStage = pipelineColumns.reduce((acc, column) => {
    acc[column.id] = filteredDeals.filter(deal => deal.stage === column.id);
    return acc;
  }, {} as Record<string, Deal[]>);

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const dealId = draggableId;
      const newStage = destination.droppableId as Deal['stage'];
      
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.id === dealId ? { ...deal, stage: newStage } : deal
        )
      );
    }
  };

  // Handle deal selection
  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals(prev =>
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : [...prev, dealId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDeals.length === filteredDeals.length) {
      setSelectedDeals([]);
      setShowBulkActions(false);
    } else {
      setSelectedDeals(filteredDeals.map(deal => deal.id));
      setShowBulkActions(true);
    }
  };

  // Handle AI analysis
  const handleAnalyzeSelectedDeals = async () => {
    if (selectedDeals.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const updatedDeals = deals.map(deal => {
        if (selectedDeals.includes(deal.id)) {
          const randomAdjustment = Math.floor(Math.random() * 20) - 10;
          const newScore = Math.max(0, Math.min(100, (deal.aiScore || 50) + randomAdjustment));
          return { ...deal, aiScore: newScore };
        }
        return deal;
      });
      
      setDeals(updatedDeals);
      setIsAnalyzing(false);
      setSelectedDeals([]);
      setShowBulkActions(false);
    }, 3000);
  };

  // Handle form submission
  const onSubmit = (data: Partial<Deal>) => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: data.title || '',
      company: data.company || '',
      contact: data.contact || '',
      contactId: data.contactId || '',
      value: data.value || 0,
      stage: data.stage || 'qualification',
      probability: data.probability || 50,
      priority: data.priority || 'medium',
      dueDate: data.dueDate || new Date(),
      notes: data.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      contactAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.contact}`,
      companyAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.company}&backgroundColor=3b82f6`,
      lastActivity: 'Deal created',
      tags: [],
      isFavorite: false,
      customFields: {},
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      aiScore: 50
    };

    setDeals(prev => [...prev, newDeal]);
    setShowAddDealModal(false);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Sales Pipeline</h3>
                  <p className="text-gray-600 mt-1">Manage your deals with AI-powered insights</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowAddDealModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    <Plus size={18} className="mr-1" />
                    Add Deal
                  </button>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Total Value</p>
                      <p className="text-lg font-semibold text-gray-900">${totalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Deal Count</p>
                      <p className="text-lg font-semibold text-gray-900">{filteredDeals.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Avg Deal Size</p>
                      <p className="text-lg font-semibold text-gray-900">${avgDealSize.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">High Priority</p>
                      <p className="text-lg font-semibold text-gray-900">{highPriorityDeals}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Won Deals</p>
                      <p className="text-lg font-semibold text-gray-900">{wonDeals}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Win Rate</p>
                      <p className="text-lg font-semibold text-gray-900">{winRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-grow max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select
                    placeholder="Stage"
                    isClearable
                    className="min-w-[150px]"
                    options={stages.map(stage => ({ value: stage, label: stage.charAt(0).toUpperCase() + stage.slice(1).replace('-', ' ') }))}
                    onChange={(selectedOption) => setActiveFilters({
                      ...activeFilters, 
                      stage: selectedOption?.value || null
                    })}
                  />
                  <Select
                    placeholder="Priority"
                    isClearable
                    className="min-w-[150px]"
                    options={priorities.map(priority => ({ value: priority, label: priority.charAt(0).toUpperCase() + priority.slice(1) }))}
                    onChange={(selectedOption) => setActiveFilters({
                      ...activeFilters, 
                      priority: selectedOption?.value || null
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && (
              <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-blue-700 font-medium">{selectedDeals.length} deals selected</span>
                    <button 
                      onClick={handleSelectAll}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {selectedDeals.length === filteredDeals.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAnalyzeSelectedDeals}
                      disabled={isAnalyzing}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      <Zap size={16} className="mr-1" />
                      {isAnalyzing ? 'Analyzing...' : 'AI Analysis'}
                    </button>
                    <button 
                      onClick={() => setSelectedDeals([])}
                      className="inline-flex items-center px-2 py-1.5 text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pipeline Content */}
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {pipelineColumns.map(column => (
                    <div key={column.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">{column.title}</h3>
                        <span className="text-sm text-gray-500">
                          {dealsByStage[column.id]?.length || 0}
                        </span>
                      </div>
                      
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-3 min-h-[200px] ${
                              snapshot.isDraggingOver ? 'bg-blue-50' : ''
                            }`}
                          >
                            {dealsByStage[column.id]?.map((deal, index) => (
                              <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`${
                                      snapshot.isDragging ? 'rotate-3 scale-105' : ''
                                    } transition-transform`}
                                  >
                                    <AIEnhancedDealCard
                                      deal={deal}
                                      isSelected={selectedDeals.includes(deal.id)}
                                      onSelect={() => toggleDealSelection(deal.id)}
                                      onClick={() => {}}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Deal</h3>
                  <button 
                    onClick={() => setShowAddDealModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 gap-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Deal Title *</label>
                      <input
                        id="title"
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company *</label>
                      <input
                        id="company"
                        type="text"
                        {...register("company", { required: "Company is required" })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                      <input
                        id="contact"
                        type="text"
                        {...register("contact")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="value" className="block text-sm font-medium text-gray-700">Deal Value ($)</label>
                      <input
                        id="value"
                        type="number"
                        {...register("value", { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="stage" className="block text-sm font-medium text-gray-700">Stage</label>
                      <select
                        id="stage"
                        {...register("stage")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {pipelineColumns.map(column => (
                          <option key={column.id} value={column.id}>
                            {column.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                      <select
                        id="priority"
                        {...register("priority")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                      <input
                        id="dueDate"
                        type="date"
                        {...register("dueDate", { valueAsDate: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        id="notes"
                        rows={3}
                        {...register("notes")}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddDealModal(false)}
                      className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Deal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineModal;