export interface AIGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  recommendedFor: ('contact' | 'deal' | 'company')[];
  toolMapping?: string; // Maps to existing AI tools
}

export const AI_GOALS: AIGoal[] = [
  // Sales Goals
  {
    id: 'leadScoring',
    title: 'Lead Scoring & Qualification',
    description: 'Automatically score and qualify leads based on engagement and fit',
    category: 'Sales',
    icon: 'BarChart3',
    complexity: 'Simple',
    estimatedTime: '2-3 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'emailPersonalization',
    title: 'Personalized Email Generation',
    description: 'Create highly personalized outreach emails based on prospect data',
    category: 'Sales',
    icon: 'Mail',
    complexity: 'Simple',
    estimatedTime: '1-2 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'email-composer'
  },
  {
    id: 'pipelineOptimization',
    title: 'Sales Pipeline Optimization',
    description: 'Analyze and optimize your sales pipeline for maximum conversion',
    category: 'Sales',
    icon: 'TrendingUp',
    complexity: 'Advanced',
    estimatedTime: '10-15 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'dealRiskAssessment',
    title: 'Deal Risk Assessment',
    description: 'Evaluate potential risks and likelihood of deal closure',
    category: 'Sales',
    icon: 'AlertTriangle',
    complexity: 'Intermediate',
    estimatedTime: '3-5 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'nextBestAction',
    title: 'Next Best Action',
    description: 'AI-powered recommendations for optimal next steps',
    category: 'Sales',
    icon: 'Navigation',
    complexity: 'Simple',
    estimatedTime: '1-2 minutes',
    recommendedFor: ['deal', 'contact'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'proposalGeneration',
    title: 'Proposal Generation',
    description: 'Generate customized proposals based on deal requirements',
    category: 'Sales',
    icon: 'FileText',
    complexity: 'Intermediate',
    estimatedTime: '5-8 minutes',
    recommendedFor: ['deal'],
    toolMapping: 'proposal-generator'
  },

  // Marketing Goals
  {
    id: 'emailCampaignOptimization',
    title: 'Email Campaign Optimization',
    description: 'Optimize email campaigns for higher open and click rates',
    category: 'Marketing',
    icon: 'Send',
    complexity: 'Intermediate',
    estimatedTime: '5-7 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'email-composer'
  },
  {
    id: 'contentCalendarGeneration',
    title: 'Content Calendar Generation',
    description: 'Create comprehensive content calendars for social media and blogs',
    category: 'Marketing',
    icon: 'Calendar',
    complexity: 'Advanced',
    estimatedTime: '15-20 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'dynamicPricing',
    title: 'Dynamic Pricing Strategy',
    description: 'Optimize pricing based on market conditions and customer data',
    category: 'Marketing',
    icon: 'DollarSign',
    complexity: 'Advanced',
    estimatedTime: '10-12 minutes',
    recommendedFor: ['deal', 'company'],
    toolMapping: 'business-analyzer'
  },

  // Relationship Goals
  {
    id: 'customerHealthMonitoring',
    title: 'Customer Health Monitoring',
    description: 'Monitor customer engagement and predict churn risk',
    category: 'Relationship',
    icon: 'Heart',
    complexity: 'Intermediate',
    estimatedTime: '3-5 minutes',
    recommendedFor: ['contact', 'company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'automatedOnboarding',
    title: 'Automated Customer Onboarding',
    description: 'Create personalized onboarding sequences for new customers',
    category: 'Relationship',
    icon: 'UserPlus',
    complexity: 'Advanced',
    estimatedTime: '8-12 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'workflow-automation'
  },
  {
    id: 'contactEnrichment',
    title: 'Contact Enrichment',
    description: 'Automatically enrich contact profiles with additional data',
    category: 'Relationship',
    icon: 'Search',
    complexity: 'Simple',
    estimatedTime: '2-3 minutes',
    recommendedFor: ['contact'],
    toolMapping: 'smart-search'
  },

  // Analytics Goals
  {
    id: 'businessIntelligence',
    title: 'Business Intelligence Dashboard',
    description: 'Generate comprehensive business intelligence reports',
    category: 'Analytics',
    icon: 'BarChart',
    complexity: 'Advanced',
    estimatedTime: '12-18 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'customerLifetimeValue',
    title: 'Customer Lifetime Value Prediction',
    description: 'Predict and optimize customer lifetime value',
    category: 'Analytics',
    icon: 'TrendingUp',
    complexity: 'Advanced',
    estimatedTime: '8-10 minutes',
    recommendedFor: ['contact', 'company'],
    toolMapping: 'business-analyzer'
  },
  {
    id: 'performanceOptimization',
    title: 'Performance Optimization Analysis',
    description: 'Analyze and optimize team and process performance',
    category: 'Analytics',
    icon: 'Zap',
    complexity: 'Intermediate',
    estimatedTime: '6-8 minutes',
    recommendedFor: ['company'],
    toolMapping: 'business-analyzer'
  },

  // Automation Goals
  {
    id: 'invoiceProcessing',
    title: 'Automated Invoice Processing',
    description: 'Streamline invoice generation and payment processing',
    category: 'Automation',
    icon: 'FileText',
    complexity: 'Intermediate',
    estimatedTime: '4-6 minutes',
    recommendedFor: ['deal', 'company'],
    toolMapping: 'document-processor'
  },
  {
    id: 'meetingScheduling',
    title: 'Smart Meeting Scheduling',
    description: 'Automatically schedule meetings based on availability and preferences',
    category: 'Automation',
    icon: 'Clock',
    complexity: 'Simple',
    estimatedTime: '1-3 minutes',
    recommendedFor: ['contact', 'deal'],
    toolMapping: 'calendar-integration'
  },
  {
    id: 'workflowDesigner',
    title: 'Custom Workflow Designer',
    description: 'Design and implement custom business workflows',
    category: 'Automation',
    icon: 'GitBranch',
    complexity: 'Advanced',
    estimatedTime: '20-30 minutes',
    recommendedFor: ['company'],
    toolMapping: 'workflow-automation'
  },

  // Content Goals
  {
    id: 'blogGeneration',
    title: 'Blog Content Generation',
    description: 'Generate engaging blog posts and articles',
    category: 'Content',
    icon: 'PenTool',
    complexity: 'Intermediate',
    estimatedTime: '8-12 minutes',
    recommendedFor: ['company'],
    toolMapping: 'content-generator'
  },
  {
    id: 'videoAutomation',
    title: 'Video Content Automation',
    description: 'Automate video content creation and editing',
    category: 'Content',
    icon: 'Video',
    complexity: 'Advanced',
    estimatedTime: '15-25 minutes',
    recommendedFor: ['company'],
    toolMapping: 'video-generator'
  },

  // AI-Native Goals
  {
    id: 'documentIntelligence',
    title: 'Document Intelligence Analysis',
    description: 'Extract insights and actions from documents using AI',
    category: 'AI-Native',
    icon: 'FileSearch',
    complexity: 'Intermediate',
    estimatedTime: '4-7 minutes',
    recommendedFor: ['deal', 'company'],
    toolMapping: 'document-analyzer'
  },
  {
    id: 'predictiveMaintenance',
    title: 'Predictive Maintenance Scheduling',
    description: 'Predict and schedule maintenance using AI analytics',
    category: 'AI-Native',
    icon: 'Settings',
    complexity: 'Advanced',
    estimatedTime: '10-15 minutes',
    recommendedFor: ['company'],
    toolMapping: 'predictive-analytics'
  },
  {
    id: 'inventoryOptimization',
    title: 'AI-Powered Inventory Optimization',
    description: 'Optimize inventory levels using predictive analytics',
    category: 'AI-Native',
    icon: 'Package',
    complexity: 'Advanced',
    estimatedTime: '12-18 minutes',
    recommendedFor: ['company'],
    toolMapping: 'inventory-optimizer'
  }
];

export const AI_GOAL_CATEGORIES = [
  'Sales',
  'Marketing', 
  'Relationship',
  'Analytics',
  'Automation',
  'Content',
  'AI-Native'
];

// Legacy export for existing components
export const allGoals = AI_GOALS;
export const goalCategories = AI_GOAL_CATEGORIES;

export const getGoalById = (id: string): AIGoal | undefined => {
  return AI_GOALS.find(goal => goal.id === id);
};

export const getGoalsByCategory = (category: string): AIGoal[] => {
  return AI_GOALS.filter(goal => goal.category === category);
};

export const getRecommendedGoals = (entityType: 'contact' | 'deal' | 'company'): AIGoal[] => {
  return AI_GOALS.filter(goal => goal.recommendedFor.includes(entityType));
};