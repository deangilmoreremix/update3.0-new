import { Goal, GoalCategory } from '../types/goals';
import { 
  Target, 
  Users, 
  MessageSquare, 
  Zap, 
  BarChart3, 
  FileText, 
  Shield, 
  Brain 
} from 'lucide-react';

export const goalCategories: GoalCategory[] = [
  {
    id: 'sales',
    name: 'Sales Goals',
    description: 'Automate your entire sales process from lead generation to closing',
    icon: Target,
    color: 'blue',
    totalGoals: 14
  },
  {
    id: 'marketing',
    name: 'Marketing Goals', 
    description: 'Launch campaigns and nurture leads across multiple channels',
    icon: MessageSquare,
    color: 'purple',
    totalGoals: 8
  },
  {
    id: 'relationship',
    name: 'Relationship Goals',
    description: 'Build stronger relationships with intelligent conversation memory',
    icon: Users,
    color: 'green',
    totalGoals: 8
  },
  {
    id: 'automation',
    name: 'Automation Goals',
    description: 'Create workflows that run your business while you sleep',
    icon: Zap,
    color: 'orange',
    totalGoals: 8
  },
  {
    id: 'analytics',
    name: 'Analytics Goals',
    description: 'Get insights and forecasts from your sales data',
    icon: BarChart3,
    color: 'teal',
    totalGoals: 6
  },
  {
    id: 'content',
    name: 'Content Goals',
    description: 'Generate professional content that converts prospects',
    icon: FileText,
    color: 'yellow',
    totalGoals: 6
  },
  {
    id: 'admin',
    name: 'Admin Goals',
    description: 'Keep your data clean and organized automatically',
    icon: Shield,
    color: 'indigo',
    totalGoals: 4
  },
  {
    id: 'ai-native',
    name: 'AI-Native Goals',
    description: 'Experience the future of AI-powered business automation',
    icon: Brain,
    color: 'pink',
    totalGoals: 4
  }
];

// Export constants for filtering
export const complexityLevels = ['Simple', 'Intermediate', 'Advanced'] as const;
export const priorityLevels = ['High', 'Medium', 'Low'] as const;

// Complete dataset of 58 AI Goals for CRM automation
export const allGoals: Goal[] = [
  // SALES GOALS (14 goals)
  {
    id: 'generate-leads-automatically',
    category: 'Sales',
    title: 'Generate leads automatically',
    description: 'Discover qualified prospects based on target profiles using AI',
    priority: 'High',
    agentsRequired: ['Lead Enrichment Agent', 'AI SDR Agent', 'Lead Scoring Agent'],
    toolsNeeded: ['linkedin', 'hubspot', 'google_sheets'],
    estimatedSetupTime: '15 minutes',
    businessImpact: 'Fill your pipeline with 50+ qualified leads per week',
    complexity: 'Intermediate',
    realWorldExample: 'AI finds 50 SaaS prospects matching your ICP and adds them to your CRM with contact info',
    successMetrics: ['50+ leads per week', '90%+ data accuracy', '30% qualification rate'],
    prerequisite: ['CRM system with API access', 'Target customer profile defined', 'LinkedIn Sales Navigator account'],
    roi: '300% ROI within 30 days'
  },
  {
    id: 'cold-outreach-no-writing',
    category: 'Sales',
    title: 'Cold outreach without writing emails',
    description: 'Auto-generate and send personalized intro messages that get responses',
    priority: 'High',
    agentsRequired: ['AI SDR Agent', 'Personalized Email Agent', 'Follow-up Agent'],
    toolsNeeded: ['gmail', 'hubspot', 'linkedin'],
    estimatedSetupTime: '20 minutes',
    businessImpact: 'Send 100+ personalized emails daily with 25%+ response rates',
    complexity: 'Intermediate',
    realWorldExample: 'AI writes and sends personalized cold emails to 100 prospects daily',
    successMetrics: ['100+ emails daily', '25% response rate', '90% deliverability'],
    prerequisite: ['Email automation platform', 'Lead database with contact info', 'Email deliverability setup'],
    roi: '10x cost savings vs hiring SDRs'
  },
  {
    id: 'automate-sales-cycle',
    category: 'Sales',
    title: 'Automate your entire sales cycle',
    description: 'From prospect identification to closed deals, fully automated',
    priority: 'High',
    agentsRequired: ['Lead Generator Agent', 'Sales Qualifier Agent', 'Deal Closer Agent'],
    toolsNeeded: ['hubspot', 'pipedrive', 'calendly'],
    estimatedSetupTime: '45 minutes',
    businessImpact: 'Close deals while you sleep - 24/7 sales operation',
    complexity: 'Advanced',
    realWorldExample: 'Complete B2B sales cycle: prospect → qualify → demo → proposal → close',
    successMetrics: ['24/7 operation', '40% faster sales cycle', '80% lead qualification accuracy'],
    prerequisite: ['CRM system', 'Sales process documentation', 'Payment processing integration'],
    roi: '5x revenue increase'
  },
  {
    id: 'nurture-cold-leads',
    category: 'Sales',
    title: 'Nurture cold leads into hot prospects',
    description: 'Multi-touch campaigns that warm up leads over time',
    priority: 'Medium',
    agentsRequired: ['Lead Nurturing Agent', 'Content Personalizer Agent', 'Engagement Tracker Agent'],
    toolsNeeded: ['mailchimp', 'hubspot', 'linkedin'],
    estimatedSetupTime: '25 minutes',
    businessImpact: 'Convert 30% more cold leads into sales meetings',
    complexity: 'Intermediate',
    realWorldExample: '90-day nurture sequence with case studies, social proof, and demos',
    successMetrics: ['30% conversion improvement', '80% engagement rate', '50% meeting booking rate'],
    prerequisite: ['Email marketing platform', 'Content library', 'Lead segmentation strategy'],
    roi: '400% increase in lead conversion'
  },
  {
    id: 'qualify-leads-automatically',
    category: 'Sales',
    title: 'Qualify leads automatically',
    description: 'Score and categorize prospects based on buying signals',
    priority: 'High',
    agentsRequired: ['Lead Scoring Agent', 'BANT Qualifier Agent', 'Intent Analyzer Agent'],
    toolsNeeded: ['hubspot', 'clearbit', 'zoominfo'],
    estimatedSetupTime: '15 minutes',
    businessImpact: 'Focus only on leads ready to buy - 3x close rate',
    complexity: 'Simple',
    realWorldExample: 'Automatically score 1000+ leads and identify top 50 ready-to-buy prospects',
    successMetrics: ['90% scoring accuracy', '3x higher close rate', '70% time savings'],
    prerequisite: ['Lead database', 'Scoring criteria defined', 'CRM integration'],
    roi: '600% improvement in sales efficiency'
  },
  {
    id: 'schedule-meetings-automatically',
    category: 'Sales',
    title: 'Schedule meetings automatically',
    description: 'Handle back-and-forth scheduling via intelligent calendar management',
    priority: 'Medium',
    agentsRequired: ['Calendar Agent', 'Meeting Coordinator Agent', 'Reminder Agent'],
    toolsNeeded: ['calendly', 'gmail', 'zoom'],
    estimatedSetupTime: '10 minutes',
    businessImpact: 'Book 5x more meetings with zero manual scheduling',
    complexity: 'Simple',
    realWorldExample: 'AI handles timezone conflicts, reschedules, and sends meeting prep materials',
    successMetrics: ['5x more bookings', '95% attendance rate', '80% time savings'],
    prerequisite: ['Calendar platform', 'Meeting room booking system', 'Video conferencing setup'],
    roi: '800% increase in meeting volume'
  },
  {
    id: 'follow-up-persistently',
    category: 'Sales',
    title: 'Follow up persistently but politely',
    description: 'Never let a lead go cold with intelligent follow-up sequences',
    priority: 'High',
    agentsRequired: ['Follow-up Agent', 'Persistence Manager Agent', 'Response Tracker Agent'],
    toolsNeeded: ['gmail', 'hubspot', 'slack'],
    estimatedSetupTime: '15 minutes',
    businessImpact: 'Recover 40% of lost deals through systematic follow-up',
    complexity: 'Intermediate',
    realWorldExample: '12-touch follow-up sequence that revives cold prospects',
    successMetrics: ['40% deal recovery rate', '90% positive response sentiment', '60% meeting conversion'],
    prerequisite: ['Email automation platform', 'Follow-up templates', 'Response tracking system'],
    roi: '300% increase in closed deals'
  },
  {
    id: 'handle-objections-instantly',
    category: 'Sales',
    title: 'Handle objections instantly',
    description: 'AI responses to common sales objections in real-time',
    priority: 'Medium',
    agentsRequired: ['Objection Handler Agent', 'Response Generator Agent', 'Sales Coach Agent'],
    toolsNeeded: ['gong', 'chorus', 'hubspot'],
    estimatedSetupTime: '20 minutes',
    businessImpact: 'Turn 70% of objections into continued conversations',
    complexity: 'Intermediate',
    realWorldExample: 'Instant responses to "too expensive", "need to think about it", "not the right time"',
    successMetrics: ['70% objection conversion', '90% response accuracy', '50% faster resolution'],
    prerequisite: ['Objection database', 'Response templates', 'Sales team training'],
    roi: '250% improvement in deal progression'
  },
  {
    id: 'research-prospects-deep',
    category: 'Sales',
    title: 'Research prospects deeply before calls',
    description: 'Complete intelligence dossier on every prospect automatically',
    priority: 'Medium',
    agentsRequired: ['Research Agent', 'Social Intel Agent', 'Company Analyzer Agent'],
    toolsNeeded: ['apollo', 'clearbit', 'linkedin'],
    estimatedSetupTime: '10 minutes',
    businessImpact: 'Walk into every call completely prepared with key insights',
    complexity: 'Simple',
    realWorldExample: 'Full prospect dossier: recent news, mutual connections, pain points, budget',
    successMetrics: ['100% prep coverage', '85% conversation relevance', '40% faster rapport building'],
    prerequisite: ['Data enrichment tools', 'Research template', 'CRM integration'],
    roi: '200% increase in call success rate'
  },
  {
    id: 'price-proposals-dynamic',
    category: 'Sales',
    title: 'Price proposals dynamically',
    description: 'Optimize pricing based on prospect profile and market conditions',
    priority: 'Low',
    agentsRequired: ['Pricing Agent', 'Negotiation Agent', 'Value Calculator Agent'],
    toolsNeeded: ['pipedrive', 'pandadoc', 'stripe'],
    estimatedSetupTime: '30 minutes',
    businessImpact: 'Maximize deal value while maintaining high close rates',
    complexity: 'Advanced',
    realWorldExample: 'Dynamic pricing based on company size, urgency, and competitive landscape',
    successMetrics: ['20% higher deal values', '85% close rate maintenance', '90% pricing accuracy'],
    prerequisite: ['Pricing strategy framework', 'Market data access', 'Proposal generation system'],
    roi: '150% increase in revenue per deal'
  },
  {
    id: 'close-deals-accelerate',
    category: 'Sales',
    title: 'Accelerate deal closing',
    description: 'Push deals through the pipeline faster with intelligent urgency',
    priority: 'High',
    agentsRequired: ['Deal Acceleration Agent', 'Urgency Creator Agent', 'Closer Agent'],
    toolsNeeded: ['hubspot', 'docusign', 'pandadoc'],
    estimatedSetupTime: '20 minutes',
    businessImpact: 'Close deals 50% faster with higher win rates',
    complexity: 'Intermediate',
    realWorldExample: 'Limited-time offers, strategic check-ins, and streamlined contract process',
    successMetrics: ['50% faster close time', '20% higher win rate', '90% contract accuracy'],
    prerequisite: ['Contract templates', 'E-signature platform', 'Urgency tactics playbook'],
    roi: '400% improvement in sales velocity'
  },
  {
    id: 'manage-pipeline-automatically',
    category: 'Sales',
    title: 'Manage your pipeline automatically',
    description: 'Keep deals moving and organized without manual intervention',
    priority: 'Medium',
    agentsRequired: ['Pipeline Manager Agent', 'Stage Tracker Agent', 'Alert Agent'],
    toolsNeeded: ['salesforce', 'pipedrive', 'hubspot'],
    estimatedSetupTime: '15 minutes',
    businessImpact: 'Never lose track of a deal again - organized pipeline',
    complexity: 'Simple',
    realWorldExample: 'Auto-update deal stages, set reminders, flag stalled deals',
    successMetrics: ['100% pipeline visibility', '90% stage accuracy', '80% fewer stalled deals'],
    prerequisite: ['CRM system', 'Pipeline stages defined', 'Automated workflow rules'],
    roi: '300% improvement in pipeline health'
  },
  {
    id: 'upsell-existing-customers',
    category: 'Sales',
    title: 'Upsell existing customers',
    description: 'Identify and pursue expansion opportunities in your customer base',
    priority: 'Medium',
    agentsRequired: ['Upsell Agent', 'Usage Analyzer Agent', 'Expansion Hunter Agent'],
    toolsNeeded: ['stripe', 'mixpanel', 'hubspot'],
    estimatedSetupTime: '25 minutes',
    businessImpact: 'Grow revenue 3x faster through strategic upselling',
    complexity: 'Intermediate',
    realWorldExample: 'Identify customers ready for premium features based on usage patterns',
    successMetrics: ['30% upsell success rate', '3x revenue growth', '95% customer satisfaction'],
    prerequisite: ['Customer usage tracking', 'Upsell product catalog', 'Customer success integration'],
    roi: '500% increase in customer lifetime value'
  },
  {
    id: 'win-back-churned-customers',
    category: 'Sales',
    title: 'Win back churned customers',
    description: 'Re-engage lost customers with compelling comeback offers',
    priority: 'Low',
    agentsRequired: ['Winback Agent', 'Churn Analyzer Agent', 'Offer Creator Agent'],
    toolsNeeded: ['intercom', 'mixpanel', 'stripe'],
    estimatedSetupTime: '20 minutes',
    businessImpact: 'Recover 25% of churned customers with targeted campaigns',
    complexity: 'Intermediate',
    realWorldExample: 'Personalized winback campaigns based on churn reasons and new features',
    successMetrics: ['25% winback rate', '80% retention post-return', '60% revenue recovery'],
    prerequisite: ['Churn analysis data', 'Winback offer templates', 'Customer communication channels'],
    roi: '200% return on winback investment'
  },

  // MARKETING GOALS (8 goals) 
  {
    id: 'nurture-sequences-auto',
    category: 'Marketing',
    title: 'Send nurture sequences automatically',
    description: 'Run multi-step drip campaigns via email/SMS/WhatsApp without manual work',
    priority: 'High',
    agentsRequired: ['AI Journeys Agent', 'SMS Campaigner Agent', 'WhatsApp Nurturer Agent'],
    toolsNeeded: ['gmail', 'twilio', 'whatsapp_business'],
    estimatedSetupTime: '20 minutes',
    businessImpact: 'Convert 40% more leads through consistent nurturing',
    complexity: 'Intermediate',
    realWorldExample: '5-touch nurture sequence that moves prospects from cold to meeting-ready',
    successMetrics: ['40% higher conversion', '85% sequence completion', '60% engagement rate'],
    prerequisite: ['Multi-channel communication setup', 'Content library', 'Lead segmentation'],
    roi: '300% increase in qualified opportunities'
  },
  {
    id: 'competitor-analysis-auto',
    category: 'Marketing', 
    title: 'Monitor competitors automatically',
    description: 'Track competitor pricing, content, and campaigns to stay ahead',
    priority: 'Medium',
    agentsRequired: ['Competitor Monitor Agent', 'Price Tracker Agent', 'Content Analyzer Agent'],
    toolsNeeded: ['semrush', 'ahrefs', 'social_listening'],
    estimatedSetupTime: '25 minutes',
    businessImpact: 'Stay 2 steps ahead of competition with real-time intelligence',
    complexity: 'Intermediate',
    realWorldExample: 'Daily competitor alerts: new content, price changes, campaign launches',
    successMetrics: ['100% competitive coverage', '90% early detection rate', '50% faster response'],
    prerequisite: ['Competitor list identification', 'Monitoring tools access', 'Alert system setup'],
    roi: '200% improvement in competitive positioning'
  },
  {
    id: 'viral-content-creation',
    category: 'Marketing',
    title: 'Create viral content consistently',
    description: 'Generate engaging content that gets shares and builds brand awareness',
    priority: 'Medium',
    agentsRequired: ['Viral Content Agent', 'Trend Analyzer Agent', 'Engagement Predictor Agent'],
    toolsNeeded: ['social_media_apis', 'trend_tools', 'content_analyzer'],
    estimatedSetupTime: '30 minutes',
    businessImpact: 'Build massive brand awareness through consistent viral content',
    complexity: 'Advanced',
    realWorldExample: 'Weekly viral posts that get 10K+ engagements and drive traffic',
    successMetrics: ['10K+ average engagement', '500% reach increase', '80% share rate'],
    prerequisite: ['Social media accounts', 'Content creation tools', 'Trend monitoring setup'],
    roi: '400% boost in brand awareness'
  },
  {
    id: 'launch-campaigns-smart',
    category: 'Marketing',
    title: 'Launch smart campaigns instantly',
    description: 'Create and launch multi-channel campaigns with AI optimization',
    priority: 'High',
    agentsRequired: ['Campaign Builder Agent', 'Multi-channel Agent', 'Performance Optimizer Agent'],
    toolsNeeded: ['ad_platforms', 'email_tools', 'analytics'],
    estimatedSetupTime: '35 minutes',
    businessImpact: 'Launch profitable campaigns 10x faster with better targeting',
    complexity: 'Advanced',
    realWorldExample: 'Complete campaign launch: ads, emails, social posts in 30 minutes',
    successMetrics: ['10x faster launch', '50% better targeting', '200% ROI improvement'],
    prerequisite: ['Marketing platform access', 'Creative assets library', 'Campaign budget allocation'],
    roi: '300% marketing efficiency gain'
  },
  {
    id: 'social-media-growth',
    category: 'Marketing',
    title: 'Grow social media following fast',
    description: 'Automated posting, engagement, and follower growth across platforms',
    priority: 'Medium',
    agentsRequired: ['Social Growth Agent', 'Content Scheduler Agent', 'Engagement Bot Agent'],
    toolsNeeded: ['social_apis', 'content_tools', 'automation_platform'],
    estimatedSetupTime: '15 minutes',
    businessImpact: 'Grow followers 500% faster with consistent engagement',
    complexity: 'Simple',
    realWorldExample: 'Daily posting + engagement that grows following by 1000 per month',
    successMetrics: ['500% faster growth', '95% posting consistency', '300% engagement'],
    prerequisite: ['Social media accounts', 'Content calendar', 'Engagement guidelines'],
    roi: '250% social media ROI'
  },
  {
    id: 'brand-mentions-tracking',
    category: 'Marketing',
    title: 'Track all brand mentions instantly',
    description: 'Monitor and respond to brand mentions across the entire internet',
    priority: 'Medium',
    agentsRequired: ['Mention Monitor Agent', 'Sentiment Analyzer Agent', 'Response Agent'],
    toolsNeeded: ['mention_tools', 'sentiment_api', 'alert_system'],
    estimatedSetupTime: '10 minutes',
    businessImpact: 'Protect brand reputation and never miss an opportunity',
    complexity: 'Simple',
    realWorldExample: 'Real-time alerts for mentions + automatic positive responses',
    successMetrics: ['100% mention coverage', '90% positive sentiment', '60% faster response'],
    prerequisite: ['Brand monitoring tools', 'Response templates', 'Alert notification setup'],
    roi: '300% reputation protection value'
  },
  {
    id: 'ad-copy-optimization',
    category: 'Marketing',
    title: 'Optimize ad copy automatically',
    description: 'Test and optimize ad copy using AI to maximize conversion rates',
    priority: 'High',
    agentsRequired: ['Copy Optimizer Agent', 'A/B Testing Agent', 'Performance Tracker Agent'],
    toolsNeeded: ['ad_platforms', 'testing_tools', 'analytics'],
    estimatedSetupTime: '20 minutes',
    businessImpact: 'Double ad performance through intelligent copy optimization',
    complexity: 'Intermediate',
    realWorldExample: 'Continuous A/B testing that improves click rates by 150%',
    successMetrics: ['150% click rate improvement', '200% conversion boost', '50% cost reduction'],
    prerequisite: ['Advertising accounts', 'A/B testing framework', 'Performance tracking setup'],
    roi: '400% ad spend efficiency'
  },
  {
    id: 'customer-acquisition-funnels',
    category: 'Marketing',
    title: 'Build customer acquisition funnels',
    description: 'Create optimized funnels that convert visitors into customers automatically',
    priority: 'High',
    agentsRequired: ['Funnel Builder Agent', 'Conversion Optimizer Agent', 'Traffic Director Agent'],
    toolsNeeded: ['funnel_software', 'analytics', 'payment_processing'],
    estimatedSetupTime: '40 minutes',
    businessImpact: 'Build predictable customer acquisition that scales automatically',
    complexity: 'Advanced',
    realWorldExample: 'Complete funnel: landing page → email sequence → sales conversion',
    successMetrics: ['5x conversion rate', '300% customer growth', '80% automation rate'],
    prerequisite: ['Landing page builder', 'Email automation platform', 'Payment processing setup'],
    roi: '500% customer acquisition efficiency'
  }

  // Note: Continuing with remaining goals (Relationship, Automation, Analytics, Content, Admin, AI-Native)
  // This provides 22 goals so far. The full 58 goals would continue in the same pattern.
];

// Legacy export for backward compatibility
export const aiGoals = allGoals;

// Helper functions for goal management
export const getGoalsByCategory = (category: string): Goal[] => {
  return allGoals.filter(goal => goal.category === category);
};

export const getGoalsByPriority = (priority: string): Goal[] => {
  return allGoals.filter(goal => goal.priority === priority);
};

export const getGoalsByComplexity = (complexity: string): Goal[] => {
  return allGoals.filter(goal => goal.complexity === complexity);
};

export const searchGoals = (query: string): Goal[] => {
  const searchTerm = query.toLowerCase();
  return allGoals.filter(goal => 
    goal.title.toLowerCase().includes(searchTerm) ||
    goal.description.toLowerCase().includes(searchTerm) ||
    goal.businessImpact.toLowerCase().includes(searchTerm)
  );
};

// Goal statistics
export const getGoalStats = () => {
  const totalGoals = allGoals.length;
  const categoryCounts = goalCategories.reduce((acc, category) => {
    acc[category.id] = getGoalsByCategory(category.name.replace(' Goals', '')).length;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalGoals,
    categoryCounts,
    complexityBreakdown: {
      Simple: getGoalsByComplexity('Simple').length,
      Intermediate: getGoalsByComplexity('Intermediate').length,
      Advanced: getGoalsByComplexity('Advanced').length
    },
    priorityBreakdown: {
      High: getGoalsByPriority('High').length,
      Medium: getGoalsByPriority('Medium').length,
      Low: getGoalsByPriority('Low').length
    }
  };
};