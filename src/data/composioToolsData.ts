// Composio Tools Data - Integration platform for 250+ business tools
// This data represents tools available through Composio API integration

export const composioTools: ComposioTool[] = [
  // CRM & Sales Tools
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    description: 'Complete CRM platform for sales, service, and marketing',
    icon: '🏢',
    status: 'active',
    popularityScore: 95,
    setupTime: '10 min',
    authType: 'oauth',
    useCases: ['Lead Management', 'Sales Pipeline', 'Customer Service', 'Marketing Automation']
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    description: 'Inbound marketing, sales, and customer service platform',
    icon: '🚀',
    status: 'active',
    popularityScore: 92,
    setupTime: '8 min',
    authType: 'apiKey',
    useCases: ['Inbound Marketing', 'Lead Nurturing', 'Content Management', 'Email Campaigns']
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'crm',
    description: 'Sales-focused CRM for pipeline management',
    icon: '📊',
    status: 'active',
    popularityScore: 78,
    setupTime: '5 min',
    authType: 'apiKey',
    useCases: ['Pipeline Management', 'Deal Tracking', 'Sales Reporting']
  },

  // Communication Tools
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'communication',
    description: 'Email service by Google with powerful automation capabilities',
    icon: '📧',
    status: 'active',
    popularityScore: 98,
    setupTime: '3 min',
    authType: 'oauth',
    useCases: ['Email Automation', 'Customer Communication', 'Newsletter Campaigns', 'Support Tickets']
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    category: 'communication',
    description: 'Email and calendar service by Microsoft',
    icon: '📮',
    status: 'active',
    popularityScore: 88,
    setupTime: '5 min',
    authType: 'oauth',
    useCases: ['Corporate Email', 'Calendar Integration', 'Meeting Scheduling']
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Team communication and collaboration platform',
    icon: '💬',
    status: 'active',
    popularityScore: 94,
    setupTime: '2 min',
    authType: 'oauth',
    useCases: ['Team Collaboration', 'Project Updates', 'File Sharing', 'Notifications']
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'communication',
    description: 'Unified communication and collaboration platform',
    icon: '👥',
    status: 'active',
    popularityScore: 85,
    setupTime: '5 min',
    authType: 'oauth',
    useCases: ['Video Conferencing', 'Team Chat', 'File Collaboration', 'Meeting Management']
  },

  // Calendar & Scheduling
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'calendar',
    description: 'Calendar service for scheduling and time management',
    icon: '📅',
    status: 'active',
    popularityScore: 96,
    setupTime: '2 min',
    authType: 'oauth',
    useCases: ['Meeting Scheduling', 'Event Management', 'Reminder Setting', 'Team Coordination']
  },
  {
    id: 'calendly',
    name: 'Calendly',
    category: 'calendar',
    description: 'Automated scheduling tool for meetings and appointments',
    icon: '⏰',
    status: 'active',
    popularityScore: 89,
    setupTime: '5 min',
    authType: 'apiKey',
    useCases: ['Appointment Booking', 'Client Meetings', 'Interview Scheduling', 'Consultation Calls']
  },

  // Social Media & Marketing
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social-media',
    description: 'Professional networking and business social platform',
    icon: '🔗',
    status: 'active',
    popularityScore: 91,
    setupTime: '7 min',
    authType: 'oauth',
    useCases: ['Lead Generation', 'Professional Networking', 'Content Marketing', 'Recruitment']
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    category: 'social-media',
    description: 'Social media platform for real-time updates and engagement',
    icon: '🐦',
    status: 'active',
    popularityScore: 82,
    setupTime: '3 min',
    authType: 'oauth',
    useCases: ['Brand Awareness', 'Customer Support', 'News Updates', 'Community Engagement']
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social-media',
    description: 'Social media platform for business pages and advertising',
    icon: '📘',
    status: 'active',
    popularityScore: 75,
    setupTime: '6 min',
    authType: 'oauth',
    useCases: ['Business Pages', 'Ad Campaigns', 'Customer Engagement', 'Event Promotion']
  },

  // E-commerce & Payment
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'ecommerce',
    description: 'E-commerce platform for online stores',
    icon: '🛒',
    status: 'active',
    popularityScore: 93,
    setupTime: '15 min',
    authType: 'apiKey',
    useCases: ['Online Store Management', 'Inventory Tracking', 'Order Processing', 'Customer Analytics']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payment',
    description: 'Payment processing platform for online businesses',
    icon: '💳',
    status: 'active',
    popularityScore: 97,
    setupTime: '10 min',
    authType: 'apiKey',
    useCases: ['Payment Processing', 'Subscription Billing', 'Invoice Management', 'Financial Reporting']
  },

  // Productivity & Project Management
  {
    id: 'trello',
    name: 'Trello',
    category: 'project-management',
    description: 'Visual project management using boards and cards',
    icon: '📋',
    status: 'active',
    popularityScore: 86,
    setupTime: '3 min',
    authType: 'oauth',
    useCases: ['Task Management', 'Project Tracking', 'Team Organization', 'Workflow Automation']
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'project-management',
    description: 'Work management platform for teams',
    icon: '✅',
    status: 'active',
    popularityScore: 90,
    setupTime: '8 min',
    authType: 'oauth',
    useCases: ['Project Planning', 'Task Assignment', 'Progress Tracking', 'Team Collaboration']
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    description: 'All-in-one workspace for notes, docs, and databases',
    icon: '📝',
    status: 'active',
    popularityScore: 87,
    setupTime: '10 min',
    authType: 'oauth',
    useCases: ['Documentation', 'Knowledge Management', 'Project Planning', 'Database Management']
  },

  // Marketing & Analytics
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    category: 'analytics',
    description: 'Web analytics service for tracking website performance',
    icon: '📈',
    status: 'active',
    popularityScore: 99,
    setupTime: '5 min',
    authType: 'oauth',
    useCases: ['Website Analytics', 'Traffic Analysis', 'Conversion Tracking', 'User Behavior']
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'marketing',
    description: 'Email marketing and automation platform',
    icon: '🐵',
    status: 'active',
    popularityScore: 84,
    setupTime: '7 min',
    authType: 'apiKey',
    useCases: ['Email Campaigns', 'Newsletter Management', 'Audience Segmentation', 'Marketing Automation']
  },

  // Coming Soon Tools
  {
    id: 'zendesk',
    name: 'Zendesk',
    category: 'customer-service',
    description: 'Customer service and support ticket platform',
    icon: '🎧',
    status: 'coming-soon',
    setupTime: '8 min',
    authType: 'oauth',
    useCases: ['Support Tickets', 'Customer Service', 'Help Desk', 'Knowledge Base']
  },
  {
    id: 'jira',
    name: 'Jira',
    category: 'project-management',
    description: 'Issue tracking and project management for software teams',
    icon: '🔧',
    status: 'coming-soon',
    setupTime: '12 min',
    authType: 'oauth',
    useCases: ['Bug Tracking', 'Agile Management', 'Sprint Planning', 'Development Workflow']
  }
];

export const composioToolCategories: ComposioToolCategory[] = [
  { id: 'crm', name: 'CRM & Sales', iconText: '🏢' },
  { id: 'communication', name: 'Communication', iconText: '💬' },
  { id: 'calendar', name: 'Calendar & Scheduling', iconText: '📅' },
  { id: 'social-media', name: 'Social Media', iconText: '📱' },
  { id: 'ecommerce', name: 'E-commerce', iconText: '🛒' },
  { id: 'payment', name: 'Payment', iconText: '💳' },
  { id: 'project-management', name: 'Project Management', iconText: '📋' },
  { id: 'productivity', name: 'Productivity', iconText: '📝' },
  { id: 'analytics', name: 'Analytics', iconText: '📈' },
  { id: 'marketing', name: 'Marketing', iconText: '📢' },
  { id: 'customer-service', name: 'Customer Service', iconText: '🎧' }
];

export function getToolsByCategory(category: string): ComposioTool[] {
  return composioTools.filter(tool => tool.category === category);
}

export function getToolsByStatus(status: 'active' | 'coming-soon'): ComposioTool[] {
  return composioTools.filter(tool => tool.status === status);
}

export function searchTools(query: string): ComposioTool[] {
  const lowerQuery = query.toLowerCase();
  return composioTools.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    (tool.useCases && tool.useCases.some(useCase => useCase.toLowerCase().includes(lowerQuery)))
  );
}