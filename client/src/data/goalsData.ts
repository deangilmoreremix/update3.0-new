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
      },
      {
        id: 'ai-assistant-chatbot',
        title: 'Intelligent AI Assistant Chatbot',
        description: 'Deploy a conversational AI assistant that understands context, handles complex queries, and integrates with all business systems.',
        businessImpact: 'Reduce customer service costs by 60% while providing 24/7 support with 95% query resolution rate.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'AI-Native',
        agentsRequired: ['Conversation AI', 'Context Manager', 'Integration Agent', 'Learning Agent'],
        toolsNeeded: ['NLP Platform', 'Knowledge Base', 'CRM Integration', 'Chat Interface'],
        estimatedSetupTime: '3-4 hours',
        roi: '300-500% within 6 months',
        realWorldExample: 'A software company deployed an AI chatbot that handles 80% of customer inquiries autonomously, reducing support costs by $250K annually.',
        prerequisite: ['Knowledge base setup', 'Chat platform integration', 'Training data preparation'],
        successMetrics: ['Query resolution rate >95%', 'Response time <2 seconds', 'Customer satisfaction >4.5/5', 'Support cost reduction 60%']
      },
      {
        id: 'dynamic-pricing-engine',
        title: 'AI-Powered Dynamic Pricing Engine',
        description: 'Implement real-time pricing optimization using AI to maximize revenue based on demand, competition, and market conditions.',
        businessImpact: 'Increase revenue by 15-25% through optimal pricing strategies and improved profit margins.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'AI-Native',
        agentsRequired: ['Pricing Optimizer', 'Market Analyst', 'Competitor Monitor', 'Revenue Calculator'],
        toolsNeeded: ['Pricing Platform', 'Market Data API', 'Analytics Engine', 'E-commerce Integration'],
        estimatedSetupTime: '4-5 hours',
        roi: '200-400% within 8 months',
        realWorldExample: 'An e-commerce retailer increased revenue by 22% by implementing dynamic pricing that adjusts prices every hour based on competitor analysis.',
        prerequisite: ['Product catalog integration', 'Competitor data sources', 'Pricing rules definition'],
        successMetrics: ['Revenue increase 20%+', 'Profit margin improvement 15%', 'Price optimization accuracy 90%', 'Market response time <5 minutes']
      },
      {
        id: 'voice-commerce-assistant',
        title: 'Voice-Activated Commerce Assistant',
        description: 'Create a voice-enabled shopping and customer service assistant that handles orders, inquiries, and support through natural conversation.',
        businessImpact: 'Enable hands-free commerce experiences, increasing customer engagement and average order value by 30%.',
        priority: 'Medium',
        complexity: 'Advanced',
        category: 'AI-Native',
        agentsRequired: ['Voice Recognition Agent', 'Commerce Agent', 'Intent Processor', 'Order Manager'],
        toolsNeeded: ['Voice Platform', 'Speech Recognition', 'E-commerce API', 'Payment Gateway'],
        estimatedSetupTime: '5-6 hours',
        roi: '250-350% within 10 months',
        realWorldExample: 'A retail brand launched voice ordering that increased repeat purchases by 35% and average order value by $45.',
        prerequisite: ['Voice platform integration', 'Product catalog setup', 'Payment processing integration'],
        successMetrics: ['Voice recognition accuracy >95%', 'Order completion rate >85%', 'Customer satisfaction >4.3/5', 'Average order value increase 30%']
      },
      {
        id: 'intelligent-contract-analyzer',
        title: 'AI Contract Analysis & Management',
        description: 'Automate contract review, risk assessment, and compliance monitoring using AI to identify key clauses and potential issues.',
        businessImpact: 'Reduce legal review time by 70% and minimize contract risks through automated clause analysis and compliance tracking.',
        priority: 'Medium',
        complexity: 'Advanced',
        category: 'AI-Native',
        agentsRequired: ['Contract Parser', 'Risk Analyzer', 'Compliance Monitor', 'Alert Manager'],
        toolsNeeded: ['Document AI Platform', 'Legal Database', 'Contract Management System', 'Alert System'],
        estimatedSetupTime: '4-5 hours',
        roi: '300-450% within 12 months',
        realWorldExample: 'A legal firm reduced contract review time from 8 hours to 45 minutes while identifying 40% more potential risks.',
        prerequisite: ['Contract template library', 'Legal compliance database', 'Document management integration'],
        successMetrics: ['Review time reduction 70%', 'Risk identification accuracy 90%', 'Compliance score >95%', 'Cost savings $100K+ annually']
      }
    ]
  },
  {
    id: 'advanced-sales',
    name: 'Advanced Sales',
    description: 'Next-generation sales automation and intelligence',
    color: 'from-indigo-500 to-blue-500',
    goals: [
      {
        id: 'sales-conversation-ai',
        title: 'AI-Powered Sales Conversation Intelligence',
        description: 'Analyze sales calls in real-time to provide coaching, objection handling, and next-best-action recommendations during conversations.',
        businessImpact: 'Increase close rates by 35% and reduce sales cycle length by 25% through real-time conversation intelligence.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Sales',
        agentsRequired: ['Conversation Analyzer', 'Coaching Agent', 'Sentiment Tracker', 'Action Recommender'],
        toolsNeeded: ['Speech Analytics', 'Call Recording', 'CRM Integration', 'AI Coaching Platform'],
        estimatedSetupTime: '3-4 hours',
        roi: '400-600% within 6 months',
        realWorldExample: 'A tech company increased their sales team close rate from 15% to 28% by implementing real-time conversation intelligence.',
        prerequisite: ['Call recording system', 'CRM integration', 'Sales process documentation'],
        successMetrics: ['Close rate increase 35%', 'Sales cycle reduction 25%', 'Objection handling improvement 50%', 'Rep performance increase 40%']
      },
      {
        id: 'predictive-territory-planning',
        title: 'AI Territory & Account Planning',
        description: 'Optimize sales territory assignments and account prioritization using AI analysis of market potential and rep performance.',
        businessImpact: 'Increase territory efficiency by 45% and improve account coverage leading to 20% revenue growth.',
        priority: 'Medium',
        complexity: 'Advanced',
        category: 'Sales',
        agentsRequired: ['Territory Optimizer', 'Account Analyzer', 'Performance Tracker', 'Market Researcher'],
        toolsNeeded: ['Geographic Analytics', 'Market Data', 'Performance Dashboard', 'Territory Management'],
        estimatedSetupTime: '4-5 hours',
        roi: '250-400% within 8 months',
        realWorldExample: 'A pharmaceutical company increased sales productivity by 38% through AI-optimized territory planning.',
        prerequisite: ['Geographic market data', 'Rep performance history', 'Account classification system'],
        successMetrics: ['Territory efficiency +45%', 'Account coverage +30%', 'Revenue per territory +20%', 'Rep satisfaction +25%']
      },
      {
        id: 'competitive-intelligence-engine',
        title: 'Real-Time Competitive Intelligence',
        description: 'Monitor competitor activities, pricing, and market moves to provide real-time competitive insights for sales strategies.',
        businessImpact: 'Win 30% more competitive deals and respond to market changes 5x faster with automated competitive intelligence.',
        priority: 'High',
        complexity: 'Intermediate',
        category: 'Sales',
        agentsRequired: ['Market Monitor', 'Competitive Analyzer', 'Alert Manager', 'Strategy Advisor'],
        toolsNeeded: ['Web Scraping', 'Market Intelligence', 'Alert System', 'Competitive Dashboard'],
        estimatedSetupTime: '2-3 hours',
        roi: '200-350% within 6 months',
        realWorldExample: 'A SaaS company increased competitive win rate from 25% to 55% through real-time competitive intelligence.',
        prerequisite: ['Competitor identification', 'Market monitoring tools', 'Sales playbook integration'],
        successMetrics: ['Competitive win rate +30%', 'Market response time 5x faster', 'Deal size increase 15%', 'Pricing accuracy +40%']
      }
    ]
  },
  {
    id: 'advanced-marketing',
    name: 'Advanced Marketing',
    description: 'Next-level marketing automation and personalization',
    color: 'from-pink-500 to-purple-500',
    goals: [
      {
        id: 'hyper-personalization-engine',
        title: 'AI Hyper-Personalization Engine',
        description: 'Create individualized experiences for each customer using AI analysis of behavior, preferences, and predictive modeling.',
        businessImpact: 'Increase conversion rates by 40% and customer lifetime value by 35% through hyper-personalized experiences.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Marketing',
        agentsRequired: ['Personalization Engine', 'Behavior Analyzer', 'Content Optimizer', 'Experience Manager'],
        toolsNeeded: ['Customer Data Platform', 'AI Personalization', 'Content Management', 'Experience Platform'],
        estimatedSetupTime: '4-5 hours',
        roi: '350-500% within 8 months',
        realWorldExample: 'An e-commerce brand increased revenue per visitor by 55% through AI-powered hyper-personalization.',
        prerequisite: ['Customer data integration', 'Content library setup', 'Behavioral tracking implementation'],
        successMetrics: ['Conversion rate +40%', 'Customer LTV +35%', 'Engagement rate +50%', 'Revenue per visitor +45%']
      },
      {
        id: 'programmatic-ad-optimizer',
        title: 'AI Programmatic Advertising Optimizer',
        description: 'Automate ad bidding, targeting, and creative optimization across all channels using machine learning algorithms.',
        businessImpact: 'Reduce ad spend by 30% while increasing ROI by 60% through intelligent programmatic optimization.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Marketing',
        agentsRequired: ['Bid Optimizer', 'Audience Analyzer', 'Creative Tester', 'Performance Monitor'],
        toolsNeeded: ['Programmatic Platform', 'Ad Exchange APIs', 'Analytics Platform', 'Creative Studio'],
        estimatedSetupTime: '3-4 hours',
        roi: '400-700% within 6 months',
        realWorldExample: 'A retail company reduced cost per acquisition by 45% while doubling conversion rates through AI ad optimization.',
        prerequisite: ['Ad platform integrations', 'Creative asset library', 'Conversion tracking setup'],
        successMetrics: ['Ad spend reduction 30%', 'ROI increase 60%', 'CPA reduction 40%', 'Conversion rate +100%']
      },
      {
        id: 'viral-content-predictor',
        title: 'Viral Content Prediction Engine',
        description: 'Predict content virality potential using AI analysis of trends, audience sentiment, and engagement patterns.',
        businessImpact: 'Increase content reach by 200% and engagement by 150% by identifying and creating viral-potential content.',
        priority: 'Medium',
        complexity: 'Intermediate',
        category: 'Marketing',
        agentsRequired: ['Trend Analyzer', 'Sentiment Monitor', 'Engagement Predictor', 'Content Optimizer'],
        toolsNeeded: ['Social Analytics', 'Trend Monitoring', 'Content Analysis', 'Engagement Tracker'],
        estimatedSetupTime: '2-3 hours',
        roi: '250-400% within 6 months',
        realWorldExample: 'A media company increased viral content success rate from 5% to 35% using AI prediction algorithms.',
        prerequisite: ['Social media integration', 'Content performance history', 'Audience segmentation data'],
        successMetrics: ['Content reach +200%', 'Engagement rate +150%', 'Viral success rate +600%', 'Share rate +300%']
      }
    ]
  },
  {
    id: 'advanced-operations',
    name: 'Advanced Operations',
    description: 'Intelligent operations and process optimization',
    color: 'from-green-500 to-teal-500',
    goals: [
      {
        id: 'supply-chain-optimizer',
        title: 'AI Supply Chain Optimization',
        description: 'Optimize entire supply chain operations using AI for demand forecasting, inventory management, and logistics coordination.',
        businessImpact: 'Reduce supply chain costs by 25% and improve delivery times by 40% through intelligent optimization.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Operations',
        agentsRequired: ['Demand Forecaster', 'Inventory Optimizer', 'Logistics Coordinator', 'Risk Manager'],
        toolsNeeded: ['Supply Chain Platform', 'Forecasting Engine', 'Inventory System', 'Logistics APIs'],
        estimatedSetupTime: '5-6 hours',
        roi: '300-500% within 12 months',
        realWorldExample: 'A manufacturing company reduced inventory costs by 35% while improving on-time delivery from 75% to 96%.',
        prerequisite: ['Supply chain data integration', 'Vendor API connections', 'Historical demand data'],
        successMetrics: ['Cost reduction 25%', 'Delivery time improvement 40%', 'Inventory turnover +50%', 'Stockout reduction 80%']
      },
      {
        id: 'quality-control-ai',
        title: 'AI-Powered Quality Control System',
        description: 'Implement computer vision and machine learning for automated quality inspection and defect detection.',
        businessImpact: 'Improve product quality by 90% and reduce inspection costs by 60% through automated quality control.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Operations',
        agentsRequired: ['Vision Inspector', 'Defect Classifier', 'Quality Analyzer', 'Alert Manager'],
        toolsNeeded: ['Computer Vision Platform', 'Inspection Cameras', 'Quality Database', 'Alert System'],
        estimatedSetupTime: '4-5 hours',
        roi: '400-600% within 10 months',
        realWorldExample: 'An electronics manufacturer reduced defect rates from 3.5% to 0.2% using AI-powered visual inspection.',
        prerequisite: ['Production line integration', 'Quality standards database', 'Inspection equipment setup'],
        successMetrics: ['Defect reduction 90%', 'Inspection cost reduction 60%', 'Accuracy improvement 95%', 'Processing speed +200%']
      },
      {
        id: 'workforce-optimization',
        title: 'AI Workforce Planning & Optimization',
        description: 'Optimize staff scheduling, skill allocation, and productivity using AI analysis of workload patterns and employee performance.',
        businessImpact: 'Increase workforce productivity by 30% and reduce labor costs by 20% through intelligent workforce optimization.',
        priority: 'Medium',
        complexity: 'Intermediate',
        category: 'Operations',
        agentsRequired: ['Schedule Optimizer', 'Skill Matcher', 'Performance Analyzer', 'Workload Balancer'],
        toolsNeeded: ['Workforce Management', 'Skills Database', 'Performance Analytics', 'Scheduling Platform'],
        estimatedSetupTime: '3-4 hours',
        roi: '250-400% within 8 months',
        realWorldExample: 'A service company increased productivity by 35% while reducing overtime costs by 40% through AI workforce planning.',
        prerequisite: ['Employee skills database', 'Historical scheduling data', 'Performance metrics tracking'],
        successMetrics: ['Productivity increase 30%', 'Labor cost reduction 20%', 'Schedule efficiency +40%', 'Employee satisfaction +25%']
      }
    ]
  },
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Deep intelligence and predictive analytics',
    color: 'from-yellow-500 to-orange-500',
    goals: [
      {
        id: 'real-time-anomaly-detection',
        title: 'Real-Time Anomaly Detection System',
        description: 'Monitor all business metrics in real-time to detect anomalies, fraud, and unusual patterns before they impact operations.',
        businessImpact: 'Prevent 95% of potential issues and reduce fraud losses by 80% through real-time anomaly detection.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Analytics',
        agentsRequired: ['Anomaly Detector', 'Pattern Analyzer', 'Fraud Monitor', 'Alert Manager'],
        toolsNeeded: ['Anomaly Detection Platform', 'Real-time Analytics', 'Alert System', 'Monitoring Dashboard'],
        estimatedSetupTime: '3-4 hours',
        roi: '500-800% within 6 months',
        realWorldExample: 'A financial services company prevented $2.5M in fraud losses through real-time anomaly detection.',
        prerequisite: ['Data pipeline setup', 'Baseline pattern establishment', 'Alert system integration'],
        successMetrics: ['Issue prevention 95%', 'Fraud reduction 80%', 'Detection speed <1 minute', 'False positive rate <5%']
      },
      {
        id: 'predictive-market-intelligence',
        title: 'Predictive Market Intelligence Engine',
        description: 'Forecast market trends, customer behavior, and business opportunities using advanced predictive analytics.',
        businessImpact: 'Improve strategic decision accuracy by 70% and identify new opportunities 6 months earlier than competitors.',
        priority: 'High',
        complexity: 'Advanced',
        category: 'Analytics',
        agentsRequired: ['Market Predictor', 'Trend Analyzer', 'Opportunity Scout', 'Strategy Advisor'],
        toolsNeeded: ['Predictive Analytics Platform', 'Market Data APIs', 'Trend Analysis', 'Strategy Dashboard'],
        estimatedSetupTime: '4-5 hours',
        roi: '350-550% within 10 months',
        realWorldExample: 'A technology company identified a new market opportunity 8 months before competitors, capturing 40% market share.',
        prerequisite: ['Market data sources', 'Historical trend data', 'Competitive intelligence setup'],
        successMetrics: ['Decision accuracy +70%', 'Opportunity lead time +6 months', 'Market prediction accuracy 85%', 'Strategy success rate +50%']
      },
      {
        id: 'customer-journey-intelligence',
        title: 'AI Customer Journey Intelligence',
        description: 'Map and optimize entire customer journeys using AI to identify friction points and improvement opportunities.',
        businessImpact: 'Increase customer satisfaction by 45% and reduce churn by 35% through journey optimization.',
        priority: 'Medium',
        complexity: 'Intermediate',
        category: 'Analytics',
        agentsRequired: ['Journey Mapper', 'Friction Detector', 'Experience Optimizer', 'Satisfaction Tracker'],
        toolsNeeded: ['Journey Analytics Platform', 'Customer Data Platform', 'Experience Tracking', 'Optimization Engine'],
        estimatedSetupTime: '3-4 hours',
        roi: '300-450% within 8 months',
        realWorldExample: 'An e-commerce company reduced cart abandonment by 50% through AI-powered journey optimization.',
        prerequisite: ['Customer touchpoint tracking', 'Journey mapping tools', 'Experience measurement setup'],
        successMetrics: ['Customer satisfaction +45%', 'Churn reduction 35%', 'Journey completion +30%', 'Experience score +40%']
      }
    ]
];

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