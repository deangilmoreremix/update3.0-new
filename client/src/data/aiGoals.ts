import { Goal } from '@/types/goals';

export const aiGoals: Goal[] = [
  // Sales Category
  {
    id: 'sales-001',
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
    id: 'sales-002',
    title: 'Smart Proposal Generator',
    description: 'Generate personalized sales proposals using AI that adapts content, pricing, and terms based on prospect profile and interaction history.',
    businessImpact: 'Reduce proposal creation time by 75% while increasing win rates through personalized content.',
    priority: 'High',
    complexity: 'Intermediate',
    category: 'Sales',
    agentsRequired: ['Content Creator', 'Pricing Optimizer', 'Template Manager'],
    toolsNeeded: ['Document Generator', 'CRM Integration', 'Pricing Engine'],
    estimatedSetupTime: '1-2 hours',
    roi: '180-300% within 4 months',
    realWorldExample: 'A consulting firm increased their proposal win rate from 35% to 58% by using AI-generated proposals tailored to each prospect\'s industry and pain points.',
    prerequisite: ['Proposal templates', 'Pricing structure data', 'Customer interaction history'],
    successMetrics: ['Proposal creation time reduction by 75%', 'Win rate increase by 20%', 'Average deal size increase by 15%']
  },
  {
    id: 'sales-003',
    title: 'Pipeline Velocity Optimizer',
    description: 'Analyze sales pipeline data to identify bottlenecks and automatically suggest actions to accelerate deal progression.',
    businessImpact: 'Accelerate sales cycles by 30% and identify at-risk deals before they stall.',
    priority: 'Medium',
    complexity: 'Advanced',
    category: 'Sales',
    agentsRequired: ['Pipeline Analyzer', 'Risk Assessor', 'Action Recommender'],
    toolsNeeded: ['CRM Analytics', 'Machine Learning Models', 'Alert System'],
    estimatedSetupTime: '2-4 hours',
    roi: '200-350% within 5 months',
    realWorldExample: 'A B2B software company reduced their average sales cycle from 90 to 63 days by implementing AI-driven pipeline optimization.',
    prerequisite: ['Historical sales data', 'CRM with detailed opportunity tracking', 'Sales process documentation'],
    successMetrics: ['Sales cycle reduction by 30%', 'Pipeline conversion rate increase by 15%', 'Deal stagnation reduction by 50%']
  },

  // Marketing Category
  {
    id: 'marketing-001',
    title: 'Smart Email Campaign Generator',
    description: 'Create personalized email campaigns using AI that adapts content, timing, and frequency based on recipient behavior and preferences.',
    businessImpact: 'Boost email engagement rates by 60% and reduce unsubscribe rates by 30% through hyper-personalization.',
    priority: 'Medium',
    complexity: 'Intermediate',
    category: 'Marketing',
    agentsRequired: ['Content Creator', 'Personalization Engine', 'Timing Optimizer'],
    toolsNeeded: ['Email Platform API', 'Customer Data Platform', 'A/B Testing Framework'],
    estimatedSetupTime: '1-2 hours',
    roi: '180-300% within 4 months',
    realWorldExample: 'An e-commerce brand increased their email revenue by 85% by using AI to personalize subject lines, product recommendations, and send times for each customer segment.',
    prerequisite: ['Email marketing platform', 'Customer behavioral data', 'Brand voice guidelines'],
    successMetrics: ['Open rate increase by 45%', 'Click-through rate increase by 60%', 'Revenue per email increase by 75%', 'Unsubscribe rate decrease by 30%']
  },
  {
    id: 'marketing-002',
    title: 'Content Calendar Automation',
    description: 'Automatically generate and schedule social media content based on trending topics, audience engagement patterns, and business objectives.',
    businessImpact: 'Save 15 hours per week on content creation while increasing social media engagement by 40%.',
    priority: 'Medium',
    complexity: 'Simple',
    category: 'Marketing',
    agentsRequired: ['Content Planner', 'Trend Analyzer', 'Scheduler'],
    toolsNeeded: ['Social Media APIs', 'Content Generator', 'Analytics Tools'],
    estimatedSetupTime: '45 minutes',
    roi: '150-250% within 3 months',
    realWorldExample: 'A marketing agency automated content creation for 20 clients, increasing their capacity by 300% while improving average engagement rates from 2.1% to 3.4%.',
    prerequisite: ['Social media accounts', 'Brand guidelines', 'Content themes and topics'],
    successMetrics: ['Content creation time reduction by 80%', 'Engagement rate increase by 40%', 'Posting consistency improvement by 95%']
  },
  {
    id: 'marketing-003',
    title: 'Dynamic Pricing Optimizer',
    description: 'Implement AI-driven dynamic pricing that adjusts product prices in real-time based on demand, competition, and customer segments.',
    businessImpact: 'Increase revenue by 15-25% through optimized pricing strategies and improved profit margins.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'Marketing',
    agentsRequired: ['Price Analyzer', 'Competitor Monitor', 'Demand Forecaster'],
    toolsNeeded: ['Pricing API', 'Market Data Sources', 'E-commerce Integration'],
    estimatedSetupTime: '3-4 hours',
    roi: '300-500% within 6 months',
    realWorldExample: 'An online retailer increased revenue by 23% by implementing dynamic pricing across 500+ products, automatically adjusting prices every 4 hours based on market conditions.',
    prerequisite: ['E-commerce platform', 'Historical sales data', 'Competitor pricing data'],
    successMetrics: ['Revenue increase by 20%', 'Profit margin improvement by 15%', 'Price optimization accuracy above 85%']
  },

  // Relationship Category
  {
    id: 'relationship-001',
    title: 'Customer Health Monitoring',
    description: 'Monitor customer engagement and satisfaction in real-time to predict churn risk and trigger proactive retention campaigns.',
    businessImpact: 'Reduce customer churn by 45% and increase customer lifetime value by identifying at-risk customers early.',
    priority: 'High',
    complexity: 'Simple',
    category: 'Relationship',
    agentsRequired: ['Health Monitor', 'Risk Assessor', 'Alert System'],
    toolsNeeded: ['Customer Database', 'Engagement Tracker', 'Communication Platform'],
    estimatedSetupTime: '45 minutes',
    roi: '300-500% within 3 months',
    realWorldExample: 'A subscription service reduced churn from 12% to 7% monthly by identifying customers who decreased usage by 40% and automatically triggering personalized retention offers.',
    prerequisite: ['Customer usage data', 'Communication channels setup', 'Retention strategy framework'],
    successMetrics: ['Churn rate reduction by 45%', 'Customer lifetime value increase by 30%', 'Retention campaign success rate above 35%', 'Early warning accuracy of 85%+']
  },
  {
    id: 'relationship-002',
    title: 'Automated Customer Onboarding',
    description: 'Create personalized onboarding journeys that adapt based on customer profile, behavior, and progress through the process.',
    businessImpact: 'Improve time-to-value by 50% and increase product adoption rates through guided, personalized experiences.',
    priority: 'Medium',
    complexity: 'Intermediate',
    category: 'Relationship',
    agentsRequired: ['Journey Designer', 'Progress Tracker', 'Content Personalizer'],
    toolsNeeded: ['Onboarding Platform', 'User Analytics', 'Communication Tools'],
    estimatedSetupTime: '2-3 hours',
    roi: '200-350% within 4 months',
    realWorldExample: 'A SaaS platform increased user activation from 60% to 87% by implementing AI-driven onboarding that adapts the flow based on user role and company size.',
    prerequisite: ['User tracking system', 'Onboarding content library', 'Customer segmentation data'],
    successMetrics: ['Time-to-first-value reduction by 50%', 'User activation rate increase by 25%', 'Support ticket reduction by 40%']
  },

  // Automation Category
  {
    id: 'automation-001',
    title: 'Invoice Processing Automation',
    description: 'Automatically extract, validate, and process invoices using AI document recognition and workflow automation.',
    businessImpact: 'Reduce invoice processing time by 90% and eliminate manual data entry errors.',
    priority: 'High',
    complexity: 'Intermediate',
    category: 'Automation',
    agentsRequired: ['Document Scanner', 'Data Extractor', 'Validation Engine'],
    toolsNeeded: ['OCR Technology', 'Workflow Engine', 'ERP Integration'],
    estimatedSetupTime: '2-3 hours',
    roi: '250-400% within 4 months',
    realWorldExample: 'An accounting firm reduced invoice processing from 30 minutes per invoice to 2 minutes, handling 500% more invoices with the same team size.',
    prerequisite: ['Invoice templates knowledge', 'ERP system access', 'Approval workflow definition'],
    successMetrics: ['Processing time reduction by 90%', 'Error rate decrease by 95%', 'Throughput increase by 400%']
  },
  {
    id: 'automation-002',
    title: 'Meeting Scheduler AI',
    description: 'Automatically schedule meetings by coordinating calendars, preferences, and constraints using natural language processing.',
    businessImpact: 'Save 5+ hours per week on scheduling coordination and reduce scheduling conflicts by 80%.',
    priority: 'Medium',
    complexity: 'Simple',
    category: 'Automation',
    agentsRequired: ['Calendar Coordinator', 'Preference Matcher', 'Conflict Resolver'],
    toolsNeeded: ['Calendar APIs', 'NLP Engine', 'Email Integration'],
    estimatedSetupTime: '1 hour',
    roi: '150-250% within 2 months',
    realWorldExample: 'A consulting team eliminated 80% of back-and-forth scheduling emails and reduced average scheduling time from 15 minutes to 30 seconds per meeting.',
    prerequisite: ['Calendar system access', 'Team availability preferences', 'Meeting room booking system'],
    successMetrics: ['Scheduling time reduction by 85%', 'Conflict reduction by 80%', 'Email volume decrease by 70%']
  },

  // Analytics Category
  {
    id: 'analytics-001',
    title: 'Real-time Business Intelligence',
    description: 'Create automated dashboards that provide real-time insights into key business metrics with predictive analytics.',
    businessImpact: 'Enable data-driven decisions 5x faster with automated insights and trend predictions.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'Analytics',
    agentsRequired: ['Data Collector', 'Insight Generator', 'Trend Predictor'],
    toolsNeeded: ['BI Platform', 'Data Warehouse', 'ML Models'],
    estimatedSetupTime: '3-4 hours',
    roi: '300-500% within 6 months',
    realWorldExample: 'A retail chain increased revenue by 18% by using real-time analytics to optimize inventory, pricing, and marketing campaigns across 50+ stores.',
    prerequisite: ['Data sources integration', 'KPI definitions', 'Dashboard requirements'],
    successMetrics: ['Decision speed increase by 400%', 'Forecast accuracy above 85%', 'Actionable insight generation increase by 300%']
  },
  {
    id: 'analytics-002',
    title: 'Customer Lifetime Value Predictor',
    description: 'Predict customer lifetime value using machine learning to optimize acquisition spending and retention strategies.',
    businessImpact: 'Improve marketing ROI by 40% through better customer acquisition and retention targeting.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'Analytics',
    agentsRequired: ['Value Predictor', 'Behavior Analyzer', 'Segment Creator'],
    toolsNeeded: ['ML Platform', 'Customer Database', 'Analytics Engine'],
    estimatedSetupTime: '2-3 hours',
    roi: '250-400% within 5 months',
    realWorldExample: 'An e-commerce company improved marketing ROI from 3:1 to 5.2:1 by focusing acquisition spend on high-CLV customer segments.',
    prerequisite: ['Historical customer data', 'Transaction history', 'Customer interaction data'],
    successMetrics: ['Marketing ROI improvement by 40%', 'CLV prediction accuracy above 80%', 'Customer acquisition cost reduction by 25%']
  },

  // Content Category
  {
    id: 'content-001',
    title: 'AI Blog Content Generator',
    description: 'Generate high-quality, SEO-optimized blog content based on trending topics and target keywords using advanced AI.',
    businessImpact: 'Increase content production by 300% while maintaining quality and improving search rankings.',
    priority: 'Medium',
    complexity: 'Intermediate',
    category: 'Content',
    agentsRequired: ['Content Writer', 'SEO Optimizer', 'Quality Checker'],
    toolsNeeded: ['AI Writing Platform', 'SEO Tools', 'Content Management System'],
    estimatedSetupTime: '1-2 hours',
    roi: '200-350% within 4 months',
    realWorldExample: 'A digital marketing agency increased their content output from 8 to 25 blog posts per month while improving average organic traffic by 120%.',
    prerequisite: ['Content strategy', 'SEO keyword research', 'Brand voice guidelines'],
    successMetrics: ['Content production increase by 300%', 'Organic traffic growth by 100%', 'Content creation cost reduction by 60%']
  },
  {
    id: 'content-002',
    title: 'Video Content Automation',
    description: 'Automatically create video content from written materials using AI voice generation and visual compilation.',
    businessImpact: 'Reduce video production time by 80% while scaling video content creation across multiple channels.',
    priority: 'Medium',
    complexity: 'Advanced',
    category: 'Content',
    agentsRequired: ['Script Converter', 'Voice Generator', 'Video Compiler'],
    toolsNeeded: ['Video Generation Platform', 'AI Voice Tools', 'Visual Assets Library'],
    estimatedSetupTime: '2-3 hours',
    roi: '250-400% within 5 months',
    realWorldExample: 'An online education company automated the creation of 200+ lesson videos, reducing production time from 8 hours to 1.5 hours per video.',
    prerequisite: ['Written content library', 'Visual assets', 'Brand video guidelines'],
    successMetrics: ['Video production time reduction by 80%', 'Content volume increase by 400%', 'Production cost decrease by 70%']
  },

  // Admin Category
  {
    id: 'admin-001',
    title: 'HR Document Processing',
    description: 'Automate HR document processing including resume screening, contract generation, and compliance tracking.',
    businessImpact: 'Reduce HR administrative time by 70% and improve candidate screening accuracy by 85%.',
    priority: 'Medium',
    complexity: 'Intermediate',
    category: 'Admin',
    agentsRequired: ['Document Processor', 'Candidate Screener', 'Compliance Checker'],
    toolsNeeded: ['HR Management System', 'Document Scanner', 'Compliance Database'],
    estimatedSetupTime: '2-3 hours',
    roi: '200-300% within 4 months',
    realWorldExample: 'An HR department reduced resume screening time from 30 minutes to 3 minutes per candidate while improving hiring quality scores by 40%.',
    prerequisite: ['HR system integration', 'Document templates', 'Compliance requirements'],
    successMetrics: ['Document processing time reduction by 70%', 'Screening accuracy improvement by 85%', 'Compliance adherence above 95%']
  },
  {
    id: 'admin-002',
    title: 'Automated Compliance Monitoring',
    description: 'Monitor business activities for compliance violations and automatically generate required regulatory reports.',
    businessImpact: 'Reduce compliance risk by 80% and save 20+ hours per month on regulatory reporting.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'Admin',
    agentsRequired: ['Compliance Monitor', 'Risk Assessor', 'Report Generator'],
    toolsNeeded: ['Compliance Platform', 'Risk Management System', 'Regulatory Database'],
    estimatedSetupTime: '3-4 hours',
    roi: '300-500% within 6 months',
    realWorldExample: 'A financial services firm automated 90% of their compliance monitoring, reducing violations by 85% and regulatory reporting time by 75%.',
    prerequisite: ['Compliance framework', 'Business process documentation', 'Regulatory requirements'],
    successMetrics: ['Compliance violation reduction by 80%', 'Reporting time reduction by 75%', 'Risk identification improvement by 90%']
  },

  // AI-Native Category
  {
    id: 'ai-native-001',
    title: 'Intelligent Document Summarizer',
    description: 'Automatically summarize long documents, contracts, and reports with key insights and action items extraction.',
    businessImpact: 'Reduce document review time by 85% and improve comprehension through structured summaries.',
    priority: 'Medium',
    complexity: 'Intermediate',
    category: 'AI-Native',
    agentsRequired: ['Text Analyzer', 'Key Point Extractor', 'Summary Generator'],
    toolsNeeded: ['NLP Platform', 'Document Parser', 'Knowledge Base'],
    estimatedSetupTime: '1-2 hours',
    roi: '200-350% within 3 months',
    realWorldExample: 'A legal firm reduced contract review time from 3 hours to 25 minutes per document while improving key clause identification by 90%.',
    prerequisite: ['Document access', 'Summary templates', 'Quality criteria definition'],
    successMetrics: ['Review time reduction by 85%', 'Key insight identification accuracy above 90%', 'Document processing throughput increase by 400%']
  },
  {
    id: 'ai-native-002',
    title: 'Predictive Maintenance System',
    description: 'Predict equipment failures and maintenance needs using IoT data and machine learning algorithms.',
    businessImpact: 'Reduce equipment downtime by 60% and maintenance costs by 30% through predictive insights.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'AI-Native',
    agentsRequired: ['Sensor Monitor', 'Failure Predictor', 'Maintenance Scheduler'],
    toolsNeeded: ['IoT Platform', 'ML Models', 'Maintenance Management System'],
    estimatedSetupTime: '3-4 hours',
    roi: '300-500% within 8 months',
    realWorldExample: 'A manufacturing plant reduced unplanned downtime from 15% to 6% and extended equipment life by 25% using AI-driven maintenance predictions.',
    prerequisite: ['IoT sensors', 'Historical maintenance data', 'Equipment specifications'],
    successMetrics: ['Downtime reduction by 60%', 'Maintenance cost reduction by 30%', 'Equipment life extension by 20%']
  },
  {
    id: 'ai-native-003',
    title: 'Smart Inventory Optimization',
    description: 'Optimize inventory levels using demand forecasting, seasonality analysis, and supply chain intelligence.',
    businessImpact: 'Reduce inventory costs by 25% while improving stock availability and reducing stockouts by 40%.',
    priority: 'High',
    complexity: 'Advanced',
    category: 'AI-Native',
    agentsRequired: ['Demand Forecaster', 'Supply Analyzer', 'Inventory Optimizer'],
    toolsNeeded: ['Inventory Management System', 'Forecasting Models', 'Supply Chain Data'],
    estimatedSetupTime: '3-4 hours',
    roi: '250-400% within 6 months',
    realWorldExample: 'A retail chain reduced inventory carrying costs by 28% while improving product availability from 92% to 97% across all locations.',
    prerequisite: ['Inventory system', 'Sales history data', 'Supply chain information'],
    successMetrics: ['Inventory cost reduction by 25%', 'Stockout reduction by 40%', 'Forecast accuracy above 85%']
  }
];

// Goal categories for filtering
export const goalCategories = [
  'Sales',
  'Marketing', 
  'Relationship',
  'Automation',
  'Analytics',
  'Content',
  'Admin',
  'AI-Native'
];

// Priority levels
export const priorityLevels = ['High', 'Medium', 'Low'];

// Complexity levels  
export const complexityLevels = ['Simple', 'Intermediate', 'Advanced'];

// Helper functions
export const getGoalsByCategory = (category: string): Goal[] => {
  return aiGoals.filter(goal => goal.category === category);
};

export const getGoalsByPriority = (priority: string): Goal[] => {
  return aiGoals.filter(goal => goal.priority === priority);
};

export const getGoalsByComplexity = (complexity: string): Goal[] => {
  return aiGoals.filter(goal => goal.complexity === complexity);
};

export const searchGoals = (query: string): Goal[] => {
  const lowercaseQuery = query.toLowerCase();
  return aiGoals.filter(goal => 
    goal.title.toLowerCase().includes(lowercaseQuery) ||
    goal.description.toLowerCase().includes(lowercaseQuery) ||
    goal.businessImpact.toLowerCase().includes(lowercaseQuery) ||
    goal.agentsRequired.some(agent => agent.toLowerCase().includes(lowercaseQuery)) ||
    goal.toolsNeeded.some(tool => tool.toLowerCase().includes(lowercaseQuery))
  );
};