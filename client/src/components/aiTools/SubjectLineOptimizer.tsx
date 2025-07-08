import React, { useState } from 'react';
import { Mail, Zap, TrendingUp, Target, Copy, Check, Sparkles } from 'lucide-react';

interface SubjectLineOptimizerProps {
  onClose?: () => void;
}

const SubjectLineOptimizer: React.FC<SubjectLineOptimizerProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    originalSubject: '',
    emailType: 'sales',
    industry: 'technology',
    tone: 'professional',
    goal: 'open-rate'
  });
  
  const [optimizedSubjects, setOptimizedSubjects] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const emailTypes = [
    { value: 'sales', label: 'Sales Outreach' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'reminder', label: 'Reminder' }
  ];

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' }
  ];

  const goals = [
    { value: 'open-rate', label: 'Maximize Open Rate' },
    { value: 'click-rate', label: 'Maximize Click Rate' },
    { value: 'response-rate', label: 'Maximize Response Rate' },
    { value: 'engagement', label: 'Maximize Engagement' }
  ];

  const handleOptimize = async () => {
    if (!formData.originalSubject.trim()) return;
    
    setIsOptimizing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockSubjects = [
      {
        subject: 'Quick question about your Q1 goals',
        score: 92,
        reason: 'High personalization, curiosity-driven, time-sensitive',
        improvements: ['Added personalization', 'Created curiosity gap', 'Shortened length'],
        category: 'Curiosity'
      },
      {
        subject: '5-minute chat about [Company] growth?',
        score: 89,
        reason: 'Specific time commitment, personalized, question format',
        improvements: ['Clear time investment', 'Bracket personalization', 'Question engagement'],
        category: 'Time-Specific'
      },
      {
        subject: '[Company]: Increase revenue by 30% in 90 days',
        score: 87,
        reason: 'Clear benefit, specific numbers, urgency',
        improvements: ['Added company name', 'Specific metrics', 'Clear timeline'],
        category: 'Benefit-Driven'
      },
      {
        subject: 'Your competitors are doing this (are you?)',
        score: 85,
        reason: 'FOMO trigger, competitive angle, engagement hook',
        improvements: ['Competitive positioning', 'Fear trigger', 'Direct question'],
        category: 'FOMO'
      },
      {
        subject: 'Re: Our conversation about scaling',
        score: 82,
        reason: 'Familiar format, conversation reference, specific topic',
        improvements: ['Reply format', 'Conversation continuity', 'Relevant topic'],
        category: 'Familiar'
      }
    ];
    
    setOptimizedSubjects(mockSubjects);
    setIsOptimizing(false);
  };

  const handleCopy = (subject: string) => {
    navigator.clipboard.writeText(subject);
    setCopied(subject);
    setTimeout(() => setCopied(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Curiosity': 'bg-purple-100 text-purple-800',
      'Time-Specific': 'bg-blue-100 text-blue-800',
      'Benefit-Driven': 'bg-green-100 text-green-800',
      'FOMO': 'bg-orange-100 text-orange-800',
      'Familiar': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Subject Line Optimizer</h2>
              <p className="text-gray-600">Optimize email subject lines for maximum engagement</p>
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
                Original Subject Line
              </label>
              <input
                type="text"
                value={formData.originalSubject}
                onChange={(e) => setFormData({ ...formData, originalSubject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your current subject line..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
                <select
                  value={formData.emailType}
                  onChange={(e) => setFormData({ ...formData, emailType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {emailTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {industries.map(industry => (
                    <option key={industry.value} value={industry.value}>{industry.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {tones.map(tone => (
                    <option key={tone.value} value={tone.value}>{tone.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {goals.map(goal => (
                    <option key={goal.value} value={goal.value}>{goal.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Optimization Features:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <Target className="inline h-4 w-4 mr-1" /> A/B testing recommendations</li>
                <li>• <TrendingUp className="inline h-4 w-4 mr-1" /> Industry-specific optimization</li>
                <li>• <Mail className="inline h-4 w-4 mr-1" /> Engagement score prediction</li>
                <li>• <Zap className="inline h-4 w-4 mr-1" /> Psychological triggers analysis</li>
              </ul>
            </div>

            <button
              onClick={handleOptimize}
              disabled={isOptimizing || !formData.originalSubject.trim()}
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  <span>Optimize Subject Line</span>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Optimized Subject Lines</h3>
            </div>
            
            {optimizedSubjects.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {optimizedSubjects.map((subject, index) => (
                  <div key={index} className="bg-white p-4 rounded-md border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(subject.score)}`}>
                            {subject.score}% Score
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(subject.category)}`}>
                            {subject.category}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 mb-1">{subject.subject}</p>
                        <p className="text-sm text-gray-600 mb-2">{subject.reason}</p>
                        <div className="flex flex-wrap gap-1">
                          {subject.improvements.map((improvement: string, i: number) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {improvement}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(subject.subject)}
                        className="ml-2 text-yellow-600 hover:text-yellow-700 flex-shrink-0"
                        title="Copy subject line"
                      >
                        {copied === subject.subject ? 
                          <Check className="h-4 w-4" /> : 
                          <Copy className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-md border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No optimizations yet</p>
                  <p className="text-sm text-gray-400">
                    Enter a subject line and click "Optimize" to get improved variations
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

export default SubjectLineOptimizer;