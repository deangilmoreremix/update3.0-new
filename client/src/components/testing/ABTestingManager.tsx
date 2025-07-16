import React, { useState, useEffect } from 'react';
import { TestTube, TrendingUp, Target, Play, Pause, BarChart3 } from 'lucide-react';

interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  type: 'headline' | 'cta' | 'layout' | 'color' | 'content';
  startDate: string;
  endDate?: string;
  variants: Array<{
    id: string;
    name: string;
    description: string;
    content: string;
    traffic: number;
    conversions: number;
    visitors: number;
    conversionRate: number;
    confidence: number;
    isControl: boolean;
  }>;
  targetMetric: 'conversions' | 'clicks' | 'engagement' | 'signups';
  domain: string;
  page: string;
}

interface ABTestingManagerProps {
  tenantId: string;
  domains: Array<{ id: string; domain: string; isActive: boolean }>;
  salesPages: Array<{ id: string; name: string; domain: string; isActive: boolean }>;
}

export default function ABTestingManager({ tenantId, domains, salesPages }: ABTestingManagerProps) {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTest, setNewTest] = useState<Partial<ABTest>>({
    name: '',
    description: '',
    type: 'headline',
    targetMetric: 'conversions',
    domain: '',
    page: '',
    variants: [
      { id: '1', name: 'Control', description: 'Original version', content: '', traffic: 50, conversions: 0, visitors: 0, conversionRate: 0, confidence: 0, isControl: true },
      { id: '2', name: 'Variant A', description: 'Test version', content: '', traffic: 50, conversions: 0, visitors: 0, conversionRate: 0, confidence: 0, isControl: false }
    ]
  });

  useEffect(() => {
    fetchTests();
  }, [tenantId]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      
      // Generate mock A/B tests
      const mockTests: ABTest[] = [
        {
          id: '1',
          name: 'Homepage Headline Test',
          description: 'Testing different value propositions in the main headline',
          status: 'running',
          type: 'headline',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          variants: [
            {
              id: '1',
              name: 'Control',
              description: 'Original headline',
              content: 'Transform Your Business Today',
              traffic: 50,
              conversions: 89,
              visitors: 1247,
              conversionRate: 7.1,
              confidence: 95,
              isControl: true
            },
            {
              id: '2',
              name: 'Variant A',
              description: 'Benefit-focused headline',
              content: 'Increase Sales by 300% with AI',
              traffic: 50,
              conversions: 134,
              visitors: 1289,
              conversionRate: 10.4,
              confidence: 98,
              isControl: false
            }
          ],
          targetMetric: 'conversions',
          domain: domains[0]?.domain || 'demo.com',
          page: '/landing'
        },
        {
          id: '2',
          name: 'CTA Button Color Test',
          description: 'Testing green vs blue CTA buttons',
          status: 'completed',
          type: 'cta',
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          variants: [
            {
              id: '1',
              name: 'Control',
              description: 'Blue CTA button',
              content: 'Get Started Now',
              traffic: 50,
              conversions: 45,
              visitors: 892,
              conversionRate: 5.0,
              confidence: 89,
              isControl: true
            },
            {
              id: '2',
              name: 'Variant A',
              description: 'Green CTA button',
              content: 'Get Started Now',
              traffic: 50,
              conversions: 67,
              visitors: 856,
              conversionRate: 7.8,
              confidence: 95,
              isControl: false
            }
          ],
          targetMetric: 'clicks',
          domain: domains[0]?.domain || 'demo.com',
          page: '/pricing'
        }
      ];

      setTests(mockTests);
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTest = async () => {
    if (!newTest.name || !newTest.domain) return;

    const test: ABTest = {
      id: Date.now().toString(),
      name: newTest.name,
      description: newTest.description || '',
      status: 'draft',
      type: newTest.type || 'headline',
      startDate: new Date().toISOString(),
      variants: newTest.variants || [],
      targetMetric: newTest.targetMetric || 'conversions',
      domain: newTest.domain,
      page: newTest.page || '/landing'
    };

    setTests(prev => [...prev, test]);
    setShowCreateForm(false);
    setNewTest({
      name: '',
      description: '',
      type: 'headline',
      targetMetric: 'conversions',
      domain: '',
      page: '',
      variants: [
        { id: '1', name: 'Control', description: 'Original version', content: '', traffic: 50, conversions: 0, visitors: 0, conversionRate: 0, confidence: 0, isControl: true },
        { id: '2', name: 'Variant A', description: 'Test version', content: '', traffic: 50, conversions: 0, visitors: 0, conversionRate: 0, confidence: 0, isControl: false }
      ]
    });
  };

  const startTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' as const } : test
    ));
  };

  const pauseTest = (testId: string) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'paused' as const } : test
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getWinnerVariant = (variants: ABTest['variants']) => {
    return variants.reduce((winner, variant) => 
      variant.conversionRate > winner.conversionRate ? variant : winner
    );
  };

  const runningTests = tests.filter(test => test.status === 'running').length;
  const completedTests = tests.filter(test => test.status === 'completed').length;
  const avgConversionRate = tests.length > 0 
    ? tests.reduce((sum, test) => sum + Math.max(...test.variants.map(v => v.conversionRate)), 0) / tests.length
    : 0;

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TestTube className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">A/B Testing Manager</h2>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
          >
            <TestTube className="w-4 h-4" />
            <span>Create Test</span>
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Running Tests</p>
                <p className="text-2xl font-bold text-green-400">{runningTests}</p>
              </div>
              <Play className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-400">{completedTests}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Avg. Conversion</p>
                <p className="text-2xl font-bold text-purple-400">{avgConversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Test Form */}
      {showCreateForm && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Create New A/B Test</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Test Name</label>
              <input
                type="text"
                value={newTest.name}
                onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="e.g., Homepage Headline Test"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Test Type</label>
              <select
                value={newTest.type}
                onChange={(e) => setNewTest(prev => ({ ...prev, type: e.target.value as ABTest['type'] }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="headline">Headline</option>
                <option value="cta">Call to Action</option>
                <option value="layout">Layout</option>
                <option value="color">Color</option>
                <option value="content">Content</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Domain</label>
              <select
                value={newTest.domain}
                onChange={(e) => setNewTest(prev => ({ ...prev, domain: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="">Select Domain</option>
                {domains.map(domain => (
                  <option key={domain.id} value={domain.domain}>{domain.domain}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Target Metric</label>
              <select
                value={newTest.targetMetric}
                onChange={(e) => setNewTest(prev => ({ ...prev, targetMetric: e.target.value as ABTest['targetMetric'] }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="conversions">Conversions</option>
                <option value="clicks">Clicks</option>
                <option value="engagement">Engagement</option>
                <option value="signups">Signups</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-white/70 text-sm mb-2">Description</label>
            <textarea
              value={newTest.description}
              onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              rows={3}
              placeholder="Describe what you're testing..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createTest}
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
            >
              Create Test
            </button>
          </div>
        </div>
      )}

      {/* Test List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Active Tests</h3>
        
        <div className="space-y-4">
          {tests.map(test => (
            <div key={test.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{test.name}</span>
                      <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(test.status)}`}>
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">{test.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-white/70">
                      <span>{test.domain}{test.page}</span>
                      <span>Target: {test.targetMetric}</span>
                      <span>Started: {new Date(test.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {test.status === 'draft' && (
                    <button
                      onClick={() => startTest(test.id)}
                      className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30 hover:bg-green-500/30 transition-colors text-sm"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </button>
                  )}
                  
                  {test.status === 'running' && (
                    <button
                      onClick={() => pauseTest(test.id)}
                      className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors text-sm"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>View Results</span>
                  </button>
                </div>
              </div>

              {/* Variants Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {test.variants.map(variant => (
                  <div key={variant.id} className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{variant.name}</span>
                      {variant.isControl && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                          Control
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-white/70">Visitors</p>
                        <p className="text-white font-medium">{variant.visitors}</p>
                      </div>
                      <div>
                        <p className="text-white/70">Conversions</p>
                        <p className="text-white font-medium">{variant.conversions}</p>
                      </div>
                      <div>
                        <p className="text-white/70">Rate</p>
                        <p className="text-white font-medium">{variant.conversionRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedTest.name} - Results</h3>
              <button
                onClick={() => setSelectedTest(null)}
                className="text-white/70 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedTest.variants.map(variant => (
                <div key={variant.id} className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{variant.name}</h4>
                    {variant.conversionRate === Math.max(...selectedTest.variants.map(v => v.conversionRate)) && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        Winner
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Visitors</span>
                      <span className="text-white font-medium">{variant.visitors.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Conversions</span>
                      <span className="text-white font-medium">{variant.conversions}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Conversion Rate</span>
                      <span className="text-white font-medium">{variant.conversionRate}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Confidence</span>
                      <span className={`font-medium ${variant.confidence > 95 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {variant.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}