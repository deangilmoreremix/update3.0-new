import React, { useState } from 'react';
import { Mail, BarChart3, TrendingUp, Heart, AlertTriangle, CheckCircle, Sparkles, Copy, Check } from 'lucide-react';

interface EmailAnalysisProps {
  onClose?: () => void;
}

const EmailAnalysis: React.FC<EmailAnalysisProps> = ({ onClose }) => {
  const [emailContent, setEmailContent] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = {
      sentiment: {
        score: 0.72,
        label: 'Positive',
        confidence: 85
      },
      tone: {
        primary: 'Professional',
        secondary: 'Friendly',
        confidence: 78
      },
      priority: {
        level: 'High',
        urgency: 'Medium',
        importance: 'High'
      },
      keyPoints: [
        'Customer expressing interest in upgrading service',
        'Deadline mentioned for Q1 implementation',
        'Budget approval process mentioned',
        'Technical requirements discussion needed'
      ],
      actionItems: [
        'Schedule follow-up call within 24 hours',
        'Prepare technical requirements document',
        'Send pricing proposal for upgrade options',
        'Connect with technical team for implementation timeline'
      ],
      entities: {
        people: ['John Smith', 'Sarah Johnson'],
        companies: ['Acme Corporation'],
        dates: ['Q1 2025', 'Next Friday'],
        amounts: ['$50,000', '$75,000']
      },
      responseRecommendations: [
        'Acknowledge their interest and timeline urgency',
        'Provide clear next steps and timeline',
        'Include relevant case studies or references',
        'Suggest a discovery call to understand technical needs'
      ]
    };
    
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Email Analysis</h2>
              <p className="text-gray-600">Extract insights and action items from customer emails</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Powered by AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={16}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Paste the email content you want to analyze...

Example:
Hi Team,

I wanted to follow up on our conversation about upgrading our current system. We're looking at implementing this by Q1 2025 and have budget approval for around $50-75K.

Could we schedule a call next Friday to discuss the technical requirements? Our CTO John Smith and Project Manager Sarah Johnson would like to join.

Looking forward to moving this forward.

Best regards,
Customer Name"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Analysis Features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <Heart className="inline h-4 w-4 mr-1" /> Sentiment & tone analysis</li>
                <li>• <AlertTriangle className="inline h-4 w-4 mr-1" /> Priority & urgency assessment</li>
                <li>• <CheckCircle className="inline h-4 w-4 mr-1" /> Key points & action items</li>
                <li>• <TrendingUp className="inline h-4 w-4 mr-1" /> Response recommendations</li>
              </ul>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !emailContent.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing Email...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5" />
                  <span>Analyze Email</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Results Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
            </div>
            
            {analysis ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Sentiment & Tone */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Sentiment & Tone</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Sentiment</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(analysis.sentiment.label)}`}>
                        {analysis.sentiment.label} ({analysis.sentiment.confidence}%)
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tone</p>
                      <p className="font-medium text-gray-900">{analysis.tone.primary}</p>
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Priority Assessment</h4>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(analysis.priority.level)}`}>
                      {analysis.priority.level} Priority
                    </span>
                    <span className="text-sm text-gray-600">
                      Urgency: {analysis.priority.urgency}
                    </span>
                  </div>
                </div>

                {/* Key Points */}
                <div className="bg-white p-4 rounded-md border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Key Points</h4>
                    <button
                      onClick={() => handleCopy(analysis.keyPoints.join('\n• '))}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {analysis.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div className="bg-white p-4 rounded-md border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Action Items</h4>
                    <button
                      onClick={() => handleCopy(analysis.actionItems.join('\n• '))}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {analysis.actionItems.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Entities */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Extracted Entities</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">People:</p>
                      <p className="text-gray-600">{analysis.entities.people.join(', ')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Companies:</p>
                      <p className="text-gray-600">{analysis.entities.companies.join(', ')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Dates:</p>
                      <p className="text-gray-600">{analysis.entities.dates.join(', ')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Amounts:</p>
                      <p className="text-gray-600">{analysis.entities.amounts.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Response Recommendations */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Response Recommendations</h4>
                  <ul className="space-y-1">
                    {analysis.responseRecommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-md border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No analysis results yet</p>
                  <p className="text-sm text-gray-400">
                    Paste an email and click "Analyze Email" to get detailed insights
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAnalysis;