import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ModernButton } from '../ui/ModernButton';
import { Contact } from '../../types';
import { Brain, Target, AlertTriangle, RefreshCw, ThumbsUp, ThumbsDown, Filter, ArrowRight, Zap } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  suggestedActions?: string[];
}

interface AIInsightsPanelProps {
  contact: Contact;
}

const insightIcons = {
  prediction: TrendingUp,
  recommendation: Lightbulb,
  risk: AlertTriangle,
  opportunity: Target
};

const insightColors = {
  prediction: 'bg-blue-500',
  recommendation: 'bg-green-500',
  risk: 'bg-red-500',
  opportunity: 'bg-purple-500'
};

const impactColors = {
  high: 'text-red-600 bg-red-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50'
};

// Sample AI insights
const generateInsights = (contact: Contact): AIInsight[] => [
  {
    id: '1',
    type: 'opportunity',
    title: 'High Engagement Window',
    description: `${contact.firstName} has shown increased activity in recent email opens and link clicks. This indicates strong interest timing.`,
    confidence: 87,
    impact: 'high',
    category: 'Engagement',
    actionable: true,
    suggestedActions: [
      'Send personalized follow-up within 24 hours',
      'Schedule a demo call',
      'Share relevant case studies'
    ]
  },
  {
    id: '2',
    type: 'prediction',
    title: 'Conversion Likelihood',
    description: `Based on similar contacts at ${contact.company}, there's a strong likelihood of conversion within 30 days.`,
    confidence: 73,
    impact: 'high',
    category: 'Sales',
    actionable: true,
    suggestedActions: [
      'Prepare proposal',
      'Identify decision makers',
      'Schedule stakeholder meeting'
    ]
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Personalization Strategy',
    description: `Industry analysis suggests focusing on ${contact.industry} specific benefits and ROI metrics for this contact.`,
    confidence: 82,
    impact: 'medium',
    category: 'Content',
    actionable: true,
    suggestedActions: [
      'Customize pitch deck for industry',
      'Include relevant success metrics',
      'Mention industry partnerships'
    ]
  },
  {
    id: '4',
    type: 'risk',
    title: 'Engagement Decline Risk',
    description: 'Contact activity has decreased by 40% in the last 2 weeks. Risk of losing interest.',
    confidence: 65,
    impact: 'medium',
    category: 'Engagement',
    actionable: true,
    suggestedActions: [
      'Send re-engagement email',
      'Offer valuable content',
      'Schedule check-in call'
    ]
  },
  {
    id: '5',
    type: 'opportunity',
    title: 'Expansion Potential',
    description: `${contact.company} is growing rapidly. Multiple departments could benefit from our solution.`,
    confidence: 78,
    impact: 'high',
    category: 'Account Growth',
    actionable: true,
    suggestedActions: [
      'Research other departments',
      'Identify additional stakeholders',
      'Prepare enterprise proposal'
    ]
  }
];

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ contact }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'positive' | 'negative'>>({});

  useEffect(() => {
    setInsights(generateInsights(contact));
  }, [contact]);

  const handleRegenerateInsights = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setInsights(generateInsights(contact));
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFeedback = (insightId: string, feedback: 'positive' | 'negative') => {
    setFeedbackGiven(prev => ({ ...prev, [insightId]: feedback }));
  };

  const categories = ['all', ...Array.from(new Set(insights.map(insight => insight.category)))];
  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const avgConfidence = Math.round(insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Insights</h3>
            <p className="text-sm text-gray-600">Intelligent analysis for {contact.firstName}</p>
          </div>
        </div>
        
        <ModernButton
          variant="outline"
          size="sm"
          onClick={handleRegenerateInsights}
          loading={isGenerating}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </ModernButton>
      </div>

      {/* AI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{avgConfidence}%</p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {insights.filter(i => i.type === 'opportunity').length}
              </p>
              <p className="text-sm text-gray-600">Opportunities</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {insights.filter(i => i.type === 'risk').length}
              </p>
              <p className="text-sm text-gray-600">Risks</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {insights.filter(i => i.actionable).length}
              </p>
              <p className="text-sm text-gray-600">Actionable</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter by category:</span>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredInsights.map(insight => {
          const IconComponent = insightIcons[insight.type];
          const isPositiveFeedback = feedbackGiven[insight.id] === 'positive';
          const isNegativeFeedback = feedbackGiven[insight.id] === 'negative';

          return (
            <GlassCard key={insight.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${insightColors[insight.type]}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {insight.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${impactColors[insight.impact]}`}>
                        {insight.impact} impact
                      </span>
                      <span className="text-xs text-gray-500">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {insight.description}
                  </p>
                  
                  {insight.actionable && insight.suggestedActions && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Suggested Actions:</p>
                      <ul className="space-y-1">
                        {insight.suggestedActions.map((action, index) => (
                          <li key={index} className="flex items-center text-xs text-gray-600">
                            <ArrowRight className="w-3 h-3 mr-2 text-blue-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Category: {insight.category}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFeedback(insight.id, 'positive')}
                        className={`p-1 rounded ${
                          isPositiveFeedback
                            ? 'bg-green-100 text-green-600'
                            : 'text-gray-400 hover:bg-green-50 hover:text-green-600'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleFeedback(insight.id, 'negative')}
                        className={`p-1 rounded ${
                          isNegativeFeedback
                            ? 'bg-red-100 text-red-600'
                            : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No insights available for the selected category.</p>
        </div>
      )}
    </div>
  );
};