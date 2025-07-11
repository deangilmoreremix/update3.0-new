import React, { useState } from 'react';
import { Shield, TrendingUp, BarChart3, Target, Sparkles, Copy, Check, Search } from 'lucide-react';

interface CompetitorAnalysisProps {
  onClose?: () => void;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    competitorName: '',
    competitorUrl: '',
    industryFocus: '',
    analysisType: 'comprehensive'
  });
  
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const analysisTypes = [
    { value: 'comprehensive', label: 'Comprehensive Analysis' },
    { value: 'pricing', label: 'Pricing Strategy' },
    { value: 'marketing', label: 'Marketing Approach' },
    { value: 'product', label: 'Product Features' },
    { value: 'seo', label: 'SEO & Content' }
  ];

  const handleAnalyze = async () => {
    if (!formData.competitorName.trim()) return;
    
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis = {
      overview: {
        companySize: 'Mid-market (250-500 employees)',
        founded: '2018',
        funding: '$45M Series B',
        revenue: '$15-25M ARR',
        marketPosition: 'Strong competitor in mid-market segment'
      },
      strengths: [
        'Strong brand recognition and market presence',
        'Comprehensive feature set with advanced analytics',
        'Excellent customer support and onboarding',
        'Well-established partner ecosystem',
        'Strong mobile app with high user ratings'
      ],
      weaknesses: [
        'Higher pricing compared to emerging competitors',
        'Complex interface that may intimidate new users',
        'Limited customization options for enterprise clients',
        'Slower release cycle for new features',
        'No free tier available'
      ],
      pricing: {
        model: 'Tiered SaaS subscription',
        startingPrice: '$49/user/month',
        averagePrice: '$89/user/month',
        enterprise: 'Custom pricing (typically $150+/user/month)',
        notes: 'Annual billing required for lower tiers'
      },
      marketingStrategy: {
        channels: ['Content marketing', 'Webinars', 'Trade shows', 'Partner referrals'],
        messaging: 'Focus on ROI and business transformation',
        targeting: 'Mid-market companies with 100-1000 employees',
        contentStrategy: 'Educational content, case studies, industry reports'
      },
      opportunities: [
        'Target their high-priced market segment with competitive pricing',
        'Develop simpler UI/UX for better user adoption',
        'Create industry-specific solutions they lack',
        'Offer more flexible pricing models including freemium',
        'Focus on faster implementation and time-to-value'
      ],
      threats: [
        'Strong market position and brand loyalty',
        'Significant funding for competitive response',
        'Established customer relationships and contracts',
        'Potential for aggressive pricing or feature matching',
        'Well-funded marketing and sales organization'
      ],
      recommendations: [
        'Position as more cost-effective alternative with better UX',
        'Target smaller companies they may underserve',
        'Emphasize speed of implementation and simpler onboarding',
        'Develop unique features or integrations they lack',
        'Create compelling migration tools and incentives'
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Competitor Analysis</h2>
              <p className="text-gray-600">Comprehensive competitive intelligence and analysis</p>
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
                Competitor Name
              </label>
              <input
                type="text"
                value={formData.competitorName}
                onChange={(e) => setFormData({ ...formData, competitorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter competitor company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Competitor Website (Optional)
              </label>
              <input
                type="url"
                value={formData.competitorUrl}
                onChange={(e) => setFormData({ ...formData, competitorUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://competitor.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Focus
              </label>
              <input
                type="text"
                value={formData.industryFocus}
                onChange={(e) => setFormData({ ...formData, industryFocus: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., SaaS, E-commerce, Healthcare"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
              <select
                value={formData.analysisType}
                onChange={(e) => setFormData({ ...formData, analysisType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {analysisTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">Analysis Features:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• <Target className="inline h-4 w-4 mr-1" /> Strengths & weaknesses analysis</li>
                <li>• <BarChart3 className="inline h-4 w-4 mr-1" /> Pricing strategy insights</li>
                <li>• <TrendingUp className="inline h-4 w-4 mr-1" /> Market positioning assessment</li>
                <li>• <Search className="inline h-4 w-4 mr-1" /> Strategic recommendations</li>
              </ul>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !formData.competitorName.trim()}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing Competitor...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Analyze Competitor</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Results Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
              {analysis && (
                <button
                  onClick={() => handleCopy(JSON.stringify(analysis, null, 2))}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy All'}</span>
                </button>
              )}
            </div>
            
            {analysis ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Overview */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Company Overview</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(analysis.overview).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                        <span className="text-gray-600">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3 text-green-800">Strengths</h4>
                  <ul className="space-y-1">
                    {analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3 text-red-800">Weaknesses</h4>
                  <ul className="space-y-1">
                    {analysis.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Pricing Strategy</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Model:</span> {analysis.pricing.model}</div>
                    <div><span className="font-medium">Starting Price:</span> {analysis.pricing.startingPrice}</div>
                    <div><span className="font-medium">Average Price:</span> {analysis.pricing.averagePrice}</div>
                    <div><span className="font-medium">Enterprise:</span> {analysis.pricing.enterprise}</div>
                    <div className="text-gray-600 italic">{analysis.pricing.notes}</div>
                  </div>
                </div>

                {/* Opportunities */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3 text-blue-800">Opportunities</h4>
                  <ul className="space-y-1">
                    {analysis.opportunities.map((opportunity: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3 text-purple-800">Strategic Recommendations</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <Target className="h-4 w-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-md border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No analysis results yet</p>
                  <p className="text-sm text-gray-400">
                    Enter a competitor name and click "Analyze Competitor" to get detailed insights
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

export default CompetitorAnalysis;