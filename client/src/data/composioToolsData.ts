// Composio Tools Data - Integration platform for 250+ business tools
// This data represents tools available through Composio API integration

export interface ComposioTool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  capabilities: string[];
  authType: 'oauth' | 'api_key' | 'basic';
  isPopular: boolean;
}

export const composioToolsData: ComposioTool[] = [
  // CRM & Sales Tools
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    description: 'Complete CRM platform for sales, service, and marketing',
    icon: '🏢',
    capabilities: ['contact_management', 'deal_tracking', 'lead_scoring', 'opportunity_management'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    description: 'Inbound marketing, sales, and customer service platform',
    icon: '🚀',
    capabilities: ['marketing_automation', 'contact_management', 'email_sequences', 'analytics'],
    authType: 'api_key',
    isPopular: true
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'CRM',
    description: 'Sales-focused CRM for pipeline management',
    icon: '📊',
    capabilities: ['pipeline_management', 'activity_tracking', 'deal_forecasting'],
    authType: 'api_key',
    isPopular: false
  },

  // Communication Tools
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    description: 'Email service by Google with powerful automation capabilities',
    icon: '📧',
    capabilities: ['send_email', 'read_email', 'email_templates', 'bulk_operations'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    category: 'Communication',
    description: 'Email and calendar service by Microsoft',
    icon: '📮',
    capabilities: ['send_email', 'calendar_integration', 'contact_sync'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Team communication and collaboration platform',
    icon: '💬',
    capabilities: ['send_messages', 'channel_management', 'file_sharing', 'notifications'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'Communication',
    description: 'Unified communication and collaboration platform',
    icon: '👥',
    capabilities: ['video_calls', 'chat', 'file_collaboration', 'meeting_scheduling'],
    authType: 'oauth',
    isPopular: true
  },

  // Calendar & Scheduling
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'Calendar',
    description: 'Calendar service for scheduling and time management',
    icon: '📅',
    capabilities: ['create_events', 'schedule_meetings', 'availability_check', 'reminder_management'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'calendly',
    name: 'Calendly',
    category: 'Calendar',
    description: 'Automated scheduling tool for meetings and appointments',
    icon: '⏰',
    capabilities: ['automated_scheduling', 'buffer_time', 'meeting_preferences'],
    authType: 'api_key',
    isPopular: true
  },

  // Social Media & Marketing
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Social Media',
    description: 'Professional networking and business social platform',
    icon: '🔗',
    capabilities: ['profile_updates', 'connection_requests', 'content_posting', 'lead_generation'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    category: 'Social Media',
    description: 'Social media platform for real-time updates and engagement',
    icon: '🐦',
    capabilities: ['post_tweets', 'direct_messages', 'follower_management', 'analytics'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Social Media',
    description: 'Social media platform for business pages and advertising',
    icon: '👥',
    capabilities: ['page_management', 'ad_campaigns', 'audience_insights'],
    authType: 'oauth',
    isPopular: false
  },

  // E-commerce & Payment
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'E-commerce',
    description: 'E-commerce platform for online stores',
    icon: '🛒',
    capabilities: ['inventory_management', 'order_processing', 'customer_data', 'analytics'],
    authType: 'api_key',
    isPopular: true
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payment',
    description: 'Payment processing platform for online businesses',
    icon: '💳',
    capabilities: ['payment_processing', 'subscription_management', 'invoice_generation'],
    authType: 'api_key',
    isPopular: true
  },

  // Productivity & Project Management
  {
    id: 'trello',
    name: 'Trello',
    category: 'Project Management',
    description: 'Visual project management using boards and cards',
    icon: '📋',
    capabilities: ['board_management', 'task_tracking', 'team_collaboration'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'Project Management',
    description: 'Work management platform for teams',
    icon: '✅',
    capabilities: ['project_tracking', 'task_assignment', 'progress_monitoring'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Productivity',
    description: 'All-in-one workspace for notes, docs, and databases',
    icon: '📝',
    capabilities: ['database_management', 'document_creation', 'template_automation'],
    authType: 'oauth',
    isPopular: true
  },

  // Marketing & Analytics
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    category: 'Analytics',
    description: 'Web analytics service for tracking website performance',
    icon: '📈',
    capabilities: ['traffic_analysis', 'conversion_tracking', 'audience_insights'],
    authType: 'oauth',
    isPopular: true
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    category: 'Marketing',
    description: 'Email marketing and automation platform',
    icon: '🐵',
    capabilities: ['email_campaigns', 'audience_segmentation', 'automation_workflows'],
    authType: 'api_key',
    isPopular: true
  }
];

export const toolCategories = [
  'CRM',
  'Communication', 
  'Calendar',
  'Social Media',
  'E-commerce',
  'Payment',
  'Project Management',
  'Productivity',
  'Analytics',
  'Marketing'
];

export function getToolsByCategory(category: string): ComposioTool[] {
  return composioToolsData.filter(tool => tool.category === category);
}

export function getPopularTools(): ComposioTool[] {
  return composioToolsData.filter(tool => tool.isPopular);
}

export function searchTools(query: string): ComposioTool[] {
  const lowerQuery = query.toLowerCase();
  return composioToolsData.filter(tool => 
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.capabilities.some(cap => cap.toLowerCase().includes(lowerQuery))
  );
}