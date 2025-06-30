import { Goal } from '../types/goals';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  BarChart3, 
  PenTool, 
  Settings, 
  Brain 
} from 'lucide-react';

interface GoalCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  goals: Goal[];
}

// Create the aiGoalsData structure from your design requirements
export const aiGoalsData: GoalCategory[] = [
  {
    id: 'sales',
    name: 'Sales',
    description: 'Boost your sales performance with AI-powered automation',
    color: 'from-blue-500 to-cyan-500',
    goals: [
      {
        id: 'lead-scoring',
        title: 'Automated Lead Scoring System',
        description: 'Implement an AI-powered lead scoring system that automatically evaluates and prioritizes incoming leads based on behavioral data, company profile, and engagement metrics.',
        businessImpact: 'Increase sales team efficiency by 40% and improve conversion rates by focusing on high-quality leads first.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Sales',
        agentsRequired: ['Lead Analyzer', 'Data Processor', 'CRM Integrator', 'Score Calculator'],
        toolsNeeded: ['CRM API', 'ML Pipeline', 'Webhook System', 'Analytics Dashboard'],
        estimatedSetupTime: '2-3 hours',
        roi: '250-400% within 6 months',
        realWorldExample: 'A SaaS company implemented this system and saw their sales team close 35% more deals by focusing only on leads scored above 75/100, while reducing time spent on unqualified prospects by 60%.',
        prerequisite: ['CRM system with API access', 'Lead tracking data (minimum 3 months)', 'Sales team buy-in and training'],
        successMetrics: ['Lead-to-opportunity conversion rate increase by 25%', 'Sales cycle reduction by 15%', 'Sales team productivity increase by 40%', 'Cost per acquisition reduction by 20%']
      },
      {
        id: 'proposal-generator',
        title: 'AI Proposal Generation',
        description: 'Generate customized sales proposals using AI that adapts content, pricing, and terms based on prospect profile and conversation history.',
        businessImpact: 'Reduce proposal creation time by 75% and increase win rates by 30% through personalized, data-driven proposals.',
        priority: 'High',
        complexity: 'Intermediate',
        category: 'Sales',
        agentsRequired: ['Content Generator', 'Pricing Optimizer', 'Document Formatter'],
        toolsNeeded: ['Document Templates', 'Pricing Engine', 'CRM Integration'],
        estimatedSetupTime: '1-2 hours',
        roi: '200-350% within 4 months',
        realWorldExample: 'A consulting firm increased their proposal acceptance rate from 25% to 40% by using AI to customize proposals based on client industry, size, and previous interactions.',
        prerequisite: ['Proposal templates', 'Pricing guidelines', 'Customer data access'],
        successMetrics: ['Proposal creation time reduction by 75%', 'Win rate increase by 30%', 'Proposal quality score improvement by 45%']
      },
      {
        id: 'pipeline-optimization',
        title: 'Sales Pipeline Optimization',
        description: 'Optimize sales pipeline stages and activities using AI analysis of historical data and performance patterns.',
        businessImpact: 'Increase overall pipeline velocity by 35% and improve forecasting accuracy by 50%.',
        priority: 'Medium',
        complexity: 'Advanced',
        category: 'Sales',
        agentsRequired: ['Pipeline Analyzer', 'Performance Tracker', 'Forecasting Engine'],
        toolsNeeded: ['CRM Analytics', 'Historical Data', 'Performance Metrics'],
        estimatedSetupTime: '3-4 hours',
        roi: '180-280% within 6 months',
        realWorldExample: 'A technology company reduced their average sales cycle from 90 to 60 days by identifying and eliminating bottlenecks in their pipeline stages.',
        prerequisite: ['6+ months of sales data', 'Defined pipeline stages', 'Sales team metrics'],
        successMetrics: ['Pipeline velocity increase by 35%', 'Forecasting accuracy improvement by 50%', 'Deal conversion rate increase by 25%']
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Automate and optimize your marketing campaigns',
    color: 'from-purple-500 to-pink-500',
    goals: [
      {
        id: 'email-campaigns',
        title: 'AI Email Campaign Automation',
        description: 'Create personalized email campaigns that adapt content, timing, and frequency based on recipient behavior and preferences.',
        businessImpact: 'Increase email engagement rates by 60% and conversion rates by 40% through intelligent personalization.',
        priority: 'High',
        complexity: 'Intermediate',
        category: 'Marketing',
        agentsRequired: ['Content Personalizer', 'Timing Optimizer', 'Performance Tracker'],
        toolsNeeded: ['Email Platform API', 'Customer Data Platform', 'Analytics Tools'],
        estimatedSetupTime: '2-3 hours',
        roi: '300-500% within 3 months',
        realWorldExample: 'An e-commerce company increased their email revenue by 250% by using AI to send personalized product recommendations at optimal times.',
        prerequisite: ['Email marketing platform', 'Customer behavioral data', 'Email templates'],
        successMetrics: ['Open rate increase by 45%', 'Click-through rate increase by 60%', 'Conversion rate increase by 40%']
      },
      {
        id: 'content-calendar',
        title: 'Intelligent Content Calendar',
        description: 'Automatically generate and schedule social media content based on trending topics, audience engagement patterns, and business objectives.',
        businessImpact: 'Reduce content creation time by 70% while increasing engagement rates by 45%.',
        priority: 'Medium',
        complexity: 'Intermediate',
        category: 'Marketing',
        agentsRequired: ['Content Creator', 'Trend Analyzer', 'Scheduler'],
        toolsNeeded: ['Social Media APIs', 'Content Templates', 'Analytics Dashboard'],
        estimatedSetupTime: '1-2 hours',
        roi: '200-300% within 4 months',
        realWorldExample: 'A marketing agency automated 80% of their social media content creation, allowing them to manage 3x more client accounts.',
        prerequisite: ['Social media accounts', 'Brand guidelines', 'Content templates'],
        successMetrics: ['Content creation time reduction by 70%', 'Engagement rate increase by 45%', 'Posting consistency improvement by 90%']
      }
    ]
  },
  {
    id: 'relationship',
    name: 'Relationship',
    description: 'Strengthen customer relationships with intelligent automation',
    color: 'from-green-500 to-emerald-500',
    goals: [
      {
        id: 'customer-health',
        title: 'Customer Health Monitoring',
        description: 'Monitor customer engagement and satisfaction metrics to predict churn risk and identify upselling opportunities.',
        businessImpact: 'Reduce customer churn by 30% and increase upselling revenue by 25% through proactive relationship management.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Relationship',
        agentsRequired: ['Health Analyzer', 'Risk Predictor', 'Opportunity Finder'],
        toolsNeeded: ['Customer Data Platform', 'Analytics Tools', 'CRM Integration'],
        estimatedSetupTime: '3-4 hours',
        roi: '400-600% within 6 months',
        realWorldExample: 'A SaaS company reduced churn from 15% to 8% by implementing AI-driven customer health scoring and proactive outreach.',
        prerequisite: ['Customer interaction data', 'Usage metrics', 'Support ticket history'],
        successMetrics: ['Churn reduction by 30%', 'Customer lifetime value increase by 40%', 'Upselling success rate increase by 25%']
      }
    ]
  },
  {
    id: 'automation',
    name: 'Automation',
    description: 'Streamline business processes with intelligent automation',
    color: 'from-orange-500 to-red-500',
    goals: [
      {
        id: 'invoice-processing',
        title: 'Automated Invoice Processing',
        description: 'Automatically extract, validate, and process invoices using AI-powered document recognition and workflow automation.',
        businessImpact: 'Reduce invoice processing time by 80% and eliminate 95% of manual data entry errors.',
        priority: 'Medium',
        complexity: 'Intermediate',
        category: 'Automation',
        agentsRequired: ['Document Parser', 'Data Validator', 'Workflow Manager'],
        toolsNeeded: ['OCR Technology', 'ERP Integration', 'Approval Workflows'],
        estimatedSetupTime: '2-3 hours',
        roi: '150-250% within 4 months',
        realWorldExample: 'An accounting firm automated 90% of their invoice processing, reducing processing time from 30 minutes to 3 minutes per invoice.',
        prerequisite: ['Document management system', 'ERP/accounting software', 'Approval processes'],
        successMetrics: ['Processing time reduction by 80%', 'Error rate reduction by 95%', 'Staff productivity increase by 60%']
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Gain actionable insights from your business data',
    color: 'from-indigo-500 to-purple-500',
    goals: [
      {
        id: 'business-intelligence',
        title: 'AI Business Intelligence Dashboard',
        description: 'Create intelligent dashboards that automatically identify trends, anomalies, and opportunities in your business data.',
        businessImpact: 'Improve decision-making speed by 50% and identify 3x more growth opportunities through automated insights.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Analytics',
        agentsRequired: ['Data Analyzer', 'Pattern Detector', 'Insight Generator'],
        toolsNeeded: ['Data Warehouse', 'BI Tools', 'Machine Learning Platform'],
        estimatedSetupTime: '4-5 hours',
        roi: '250-400% within 6 months',
        realWorldExample: 'A retail company discovered seasonal patterns that led to a 35% increase in inventory efficiency and 20% boost in sales.',
        prerequisite: ['Clean data sources', 'Data warehouse', 'Business metrics defined'],
        successMetrics: ['Decision-making speed increase by 50%', 'Opportunity identification increase by 300%', 'Revenue impact from insights tracking']
      }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Create and manage content with AI assistance',
    color: 'from-teal-500 to-cyan-500',
    goals: [
      {
        id: 'blog-generation',
        title: 'AI Blog Content Generation',
        description: 'Generate high-quality blog posts and articles based on trending topics, SEO requirements, and brand voice guidelines.',
        businessImpact: 'Increase content production by 400% while maintaining quality and improving SEO rankings by 50%.',
        priority: 'Medium',
        complexity: 'Intermediate',
        category: 'Content',
        agentsRequired: ['Content Writer', 'SEO Optimizer', 'Brand Voice Analyzer'],
        toolsNeeded: ['Content Management System', 'SEO Tools', 'Brand Guidelines'],
        estimatedSetupTime: '1-2 hours',
        roi: '200-350% within 3 months',
        realWorldExample: 'A digital marketing agency increased their content output from 10 to 50 articles per month while improving average search rankings.',
        prerequisite: ['Content strategy', 'Brand voice guidelines', 'SEO keyword research'],
        successMetrics: ['Content production increase by 400%', 'SEO ranking improvement by 50%', 'Content engagement increase by 35%']
      }
    ]
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Streamline administrative tasks and processes',
    color: 'from-gray-500 to-slate-500',
    goals: [
      {
        id: 'hr-processing',
        title: 'HR Document Processing',
        description: 'Automate employee onboarding, document management, and HR workflow processing using AI-powered document analysis.',
        businessImpact: 'Reduce HR administrative time by 60% and improve employee onboarding experience by 40%.',
        priority: 'Low',
        complexity: 'Intermediate',
        category: 'Admin',
        agentsRequired: ['Document Processor', 'Workflow Coordinator', 'Compliance Checker'],
        toolsNeeded: ['HRIS Integration', 'Document Management', 'Workflow Tools'],
        estimatedSetupTime: '2-3 hours',
        roi: '120-200% within 6 months',
        realWorldExample: 'An HR department reduced new employee processing time from 2 weeks to 3 days while improving accuracy.',
        prerequisite: ['HRIS system', 'Digital document storage', 'HR processes defined'],
        successMetrics: ['Administrative time reduction by 60%', 'Onboarding time reduction by 70%', 'Process accuracy improvement by 85%']
      }
    ]
  },
  {
    id: 'ai-native',
    name: 'AI-Native',
    description: 'Advanced AI-powered business solutions',
    color: 'from-violet-500 to-purple-500',
    goals: [
      {
        id: 'document-intelligence',
        title: 'Document Intelligence Processing',
        description: 'Extract insights and data from business documents using advanced AI analysis and natural language processing.',
        businessImpact: 'Reduce document analysis time by 90% and improve data extraction accuracy by 95%.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'AI-Native',
        agentsRequired: ['Document Analyzer', 'Data Extractor', 'Insight Generator'],
        toolsNeeded: ['NLP Platform', 'Document Processing API', 'Knowledge Base'],
        estimatedSetupTime: '3-4 hours',
        roi: '300-500% within 6 months',
        realWorldExample: 'A legal firm automated contract review processes, reducing analysis time from 8 hours to 30 minutes per document.',
        prerequisite: ['Document corpus', 'AI platform access', 'Domain expertise'],
        successMetrics: ['Analysis time reduction by 90%', 'Accuracy improvement by 95%', 'Insight quality enhancement by 80%']
      },
      {
        id: 'predictive-maintenance',
        title: 'Predictive Maintenance System',
        description: 'Predict equipment failures and maintenance needs using IoT data and machine learning algorithms.',
        businessImpact: 'Reduce equipment downtime by 70% and maintenance costs by 40% through predictive insights.',
        priority: 'Medium',
        complexity: 'Advanced',
        category: 'AI-Native',
        agentsRequired: ['IoT Data Collector', 'Predictive Analyzer', 'Alert Manager'],
        toolsNeeded: ['IoT Sensors', 'ML Platform', 'Maintenance Management System'],
        estimatedSetupTime: '5-6 hours',
        roi: '400-700% within 12 months',
        realWorldExample: 'A manufacturing company reduced unplanned downtime by 65% by predicting equipment failures 2 weeks in advance.',
        prerequisite: ['IoT infrastructure', 'Historical maintenance data', 'Equipment sensors'],
        successMetrics: ['Downtime reduction by 70%', 'Maintenance cost reduction by 40%', 'Equipment lifespan increase by 25%']
      }
    ]
  }
];

import { 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  BarChart3, 
  PenTool, 
  Settings, 
  Brain 
} from 'lucide-react';

// Export goal categories for filtering
export const goalCategories = [
  { id: 'sales', name: 'Sales', icon: TrendingUp },
  { id: 'marketing', name: 'Marketing', icon: Target },
  { id: 'relationship', name: 'Relationship', icon: Users },
  { id: 'automation', name: 'Automation', icon: Zap },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'content', name: 'Content', icon: PenTool },
  { id: 'admin', name: 'Admin', icon: Settings },
  { id: 'ai-native', name: 'AI-Native', icon: Brain }
];

// Export all goals in a flat array for easier filtering
export const allGoals: Goal[] = aiGoalsData.reduce((acc, category) => {
  return acc.concat(category.goals);
}, [] as Goal[]);

export default aiGoalsData;