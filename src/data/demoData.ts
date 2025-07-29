// Demo data for development and testing
import { Contact, Deal, Task } from '../types';

export const demoContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    position: 'VP of Marketing',
    status: 'prospect',
    score: 85,
    lastActivityDate: new Date('2025-07-28'),
    leadSource: 'Website',
    industry: 'Technology',
    annualRevenue: 5000000,
    employeeCount: 150,
    location: 'San Francisco, CA',
    tags: ['high-priority', 'enterprise'],
    notes: 'Very interested in our AI solutions. Ready to move forward with pilot program.',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: '@sarahj_tech'
    }
  },
  {
    id: 'contact-2',
    name: 'Michael Chen',
    email: 'm.chen@innovateplus.com',
    phone: '+1 (555) 987-6543',
    company: 'InnovatePlus',
    position: 'CTO',
    status: 'customer',
    score: 95,
    lastActivityDate: new Date('2025-07-27'),
    leadSource: 'Referral',
    industry: 'Software',
    annualRevenue: 12000000,
    employeeCount: 300,
    location: 'Austin, TX',
    tags: ['customer', 'expansion-opportunity'],
    notes: 'Current customer looking to expand usage across more departments.'
  },
  {
    id: 'contact-3',
    name: 'Emma Rodriguez',
    email: 'emma.r@startupventures.com',
    phone: '+1 (555) 456-7890',
    company: 'Startup Ventures Inc',
    position: 'CEO',
    status: 'lead',
    score: 70,
    lastActivityDate: new Date('2025-07-26'),
    leadSource: 'LinkedIn',
    industry: 'Venture Capital',
    annualRevenue: 2500000,
    employeeCount: 45,
    location: 'New York, NY',
    tags: ['startup', 'quick-decision'],
    notes: 'Fast-growing startup, needs scalable solution.'
  }
];

export const demoDeals: Deal[] = [
  {
    id: 'deal-1',
    title: 'TechCorp AI Platform Implementation',
    value: 150000,
    stage: 'proposal',
    contactId: 'contact-1',
    probability: 75,
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date('2025-07-28'),
    expectedCloseDate: new Date('2025-08-15'),
    products: ['AI Platform', 'Professional Services'],
    competitors: ['Competitor A', 'Competitor B'],
    decisionMakers: ['Sarah Johnson', 'John Smith (IT Director)'],
    priority: 'high',
    currency: 'USD',
    nextSteps: [
      'Schedule technical demo',
      'Prepare custom proposal',
      'Arrange stakeholder meeting'
    ],
    aiInsights: {
      riskFactors: ['Competitive pressure', 'Budget approval timing'],
      opportunities: ['Expansion to other departments', 'Multi-year contract potential'],
      competitiveThreats: ['Competitor A pricing pressure'],
      winStrategy: 'Highlight ROI calculations and provide customer case studies'
    }
  },
  {
    id: 'deal-2',
    title: 'InnovatePlus Expansion - Additional Licenses',
    value: 75000,
    stage: 'negotiation',
    contactId: 'contact-2',
    probability: 90,
    createdAt: new Date('2025-07-10'),
    updatedAt: new Date('2025-07-27'),
    expectedCloseDate: new Date('2025-08-05'),
    products: ['Additional Licenses', 'Training Package'],
    priority: 'medium',
    currency: 'USD',
    nextSteps: ['Finalize pricing', 'Get legal approval'],
    aiInsights: {
      riskFactors: ['Contract renewal timing'],
      opportunities: ['Upsell premium features'],
      competitiveThreats: ['Competitor pricing pressure'],
      winStrategy: 'Propose volume discount and include training credits'
    }
  },
  {
    id: 'deal-3',
    title: 'Startup Ventures - Pilot Program',
    value: 25000,
    stage: 'qualification',
    contactId: 'contact-3',
    probability: 60,
    createdAt: new Date('2025-07-20'),
    updatedAt: new Date('2025-07-26'),
    expectedCloseDate: new Date('2025-08-30'),
    products: ['Starter Package'],
    priority: 'medium',
    currency: 'USD',
    nextSteps: ['Qualify budget', 'Understand timeline', 'Identify key stakeholders']
  }
];

export const demoTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Follow up with Sarah Johnson - Demo feedback',
    description: 'Get feedback on yesterday\'s demo and address any concerns',
    priority: 'high',
    completed: false,
    dueDate: new Date('2025-07-29'),
    createdAt: new Date('2025-07-28'),
    assignedTo: 'demo-user-123',
    category: 'call',
    relatedTo: { type: 'contact', id: 'contact-1' }
  },
  {
    id: 'task-2',
    title: 'Prepare TechCorp proposal',
    description: 'Create customized proposal with ROI calculations and implementation timeline',
    priority: 'high',
    completed: false,
    dueDate: new Date('2025-07-30'),
    createdAt: new Date('2025-07-27'),
    assignedTo: 'demo-user-123',
    category: 'other',
    relatedTo: { type: 'deal', id: 'deal-1' }
  },
  {
    id: 'task-3',
    title: 'Send InnovatePlus contract',
    description: 'Send updated contract with revised pricing for additional licenses',
    priority: 'medium',
    completed: false,
    dueDate: new Date('2025-07-29'),
    createdAt: new Date('2025-07-26'),
    assignedTo: 'demo-user-123',
    category: 'email',
    relatedTo: { type: 'deal', id: 'deal-2' }
  }
];

// Demo analytics data
export const demoAnalytics = {
  totalRevenue: 2500000,
  monthlyRevenue: 285000,
  dealsWon: 12,
  dealsLost: 3,
  averageDealSize: 125000,
  winRate: 80,
  salesCycleLength: 45,
  pipelineValue: 750000,
  quotaAttainment: 95,
  revenueGrowth: 23.5
};
