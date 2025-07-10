import React, { useState } from 'react';
import { TrendingUp, BarChart3, Calendar, Globe, Sparkles, Copy, Check } from 'lucide-react';

interface MarketTrendsProps {
  onClose?: () => void;
}

const MarketTrends: React.FC<MarketTrendsProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    industry: 'technology',
    timeframe: '6months',
    region: 'global',
    analysisType: 'comprehensive'
  });
  
  const [trends, setTrends] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'automotive', label: 'Automotive' }
  ];

  const timeframes = [
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: '2years', label: 'Last 2 Years' }
  ];

  const regions = [
    { value: 'global', label: 'Global' },
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia-pacific', label: 'Asia Pacific' },
    { value: 'latin-america', label: 'Latin America' }
  ];

  const analysisTypes = [
    { value: 'comprehensive', label: 'Comprehensive Analysis' },
    { value: 'emerging-trends', label: 'Emerging Trends Only' },
    { value: 'market-size', label: 'Market Size & Growth' },
    { value: 'competitive', label: 'Competitive Landscape' }
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockTrends = {
      overview: {
        marketSize: '$2.8T',
        growthRate: '+12.4% YoY',
        keyDrivers: ['Digital transformation', 'AI adoption', 'Remote work'],
        period: formData.timeframe,
        region: formData.region
      },
      emergingTrends: [
        {
          trend: 'Artificial Intelligence Integration',
          growth: '+45%',
          impact: 'High',
          description: 'Widespread adoption of AI across all business functions',
          opportunity: 'Companies offering AI-first solutions experiencing rapid growth'
        },
        {
          trend: 'Sustainability Tech',
          growth: '+38%',
          impact: 'High',
          description: 'Increased focus on carbon-neutral and green technologies',
          opportunity: 'ESG compliance driving significant investment in cleantech'
        },
        {
          trend: 'Remote Collaboration Tools',
          growth: '+28%',
          impact: 'Medium',
          description: 'Continued evolution of distributed work technologies',
          opportunity: 'Hybrid work models creating demand for new productivity tools'
        },
        {
          trend: 'Cybersecurity Solutions',
          growth: '+32%',
          impact: 'High',
          description: 'Rising security threats driving increased investment',
          opportunity: 'Zero-trust security models becoming standard'
        }
      ],
      marketSegments: [
        { segment: 'Cloud Infrastructure', size: '$89B', growth: '+15%' },
        { segment: 'AI & Machine Learning', size: '$156B', growth: '+45%' },
        { segment: 'Cybersecurity', size: '$173B', growth: '+32%' },
        { segment: 'Digital Transformation', size: '$234B', growth: '+22%' }
      ],
      keyPlayers: [
        { company: 'Microsoft', marketShare: '18%', trend: 'Growing' },
        { company: 'Amazon', marketShare: '15%', trend: 'Stable' },
        { company: 'Google', marketShare: '12%', trend: 'Growing' },
        { company: 'Apple', marketShare: '10%', trend: 'Growing' }
      ],
      predictions: [
        'AI will be integrated into 80% of business applications by 2025',
        'Remote work will stabilize at 40% of workforce by end of 2024',
        'Cybersecurity spending will reach $300B globally by 2025',
        'Cloud adoption will exceed 95% for mid-market companies'
      ],
      recommendations: [
        'Focus on AI-enabled products and services for competitive advantage',
        'Invest in cybersecurity capabilities as a key differentiator',
        'Develop sustainability-focused solutions to meet ESG demands',
        'Build remote-first collaboration tools and platforms'
      ]
    };
    
    setTrends(mockTrends);
    setIsAnalyzing(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'growing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Market Trends Analysis</h2>
              <p className="text-gray-600">Discover emerging trends and market opportunities</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {industries.map(industry => (
                    <option key={industry.value} value={industry.value}>{industry.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {timeframes.map(timeframe => (
                    <option key={timeframe.value} value={timeframe.value}>{timeframe.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {regions.map(region => (
                    <option key={region.value} value={region.value}>{region.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
                <select
                  value={formData.analysisType}
                  onChange={(e) => setFormData({ ...formData, analysisType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {analysisTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Analysis Features:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <TrendingUp className="inline h-4 w-4 mr-1" /> Emerging trend identification</li>
                <li>• <BarChart3 className="inline h-4 w-4 mr-1" /> Market size and growth analysis</li>
                <li>• <Globe className="inline h-4 w-4 mr-1" /> Regional market insights</li>
                <li>• <Calendar className="inline h-4 w-4 mr-1" /> Future predictions and opportunities</li>
              </ul>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing Market Trends...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5" />
                  <span>Analyze Market Trends</span>
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Market Analysis</h3>
              {trends && (
                <button
                  onClick={() => handleCopy(JSON.stringify(trends, null, 2))}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy All'}</span>
                </button>
              )}
            </div>
            
            {trends ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Market Overview */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Market Overview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Market Size:</span>
                      <span className="text-gray-900 ml-2">{trends.overview.marketSize}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Growth Rate:</span>
                      <span className="text-green-600 ml-2">{trends.overview.growthRate}</span>
                    </div>
                  </div>
                </div>

                {/* Emerging Trends */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Emerging Trends</h4>
                  <div className="space-y-3">
                    {trends.emergingTrends.map((trend: any, index: number) => (
                      <div key={index} className="border-l-4 border-green-500 pl-3">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-medium text-gray-900">{trend.trend}</h5>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-medium">{trend.growth}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(trend.impact)}`}>
                              {trend.impact}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{trend.description}</p>
                        <p className="text-sm text-blue-600 italic">{trend.opportunity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Segments */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Market Segments</h4>
                  <div className="space-y-2">
                    {trends.marketSegments.map((segment: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{segment.segment}</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{segment.size}</span>
                          <span className="text-green-600">{segment.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Predictions */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Market Predictions</h4>
                  <ul className="space-y-1">
                    {trends.predictions.map((prediction: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        {prediction}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-white p-4 rounded-md border">
                  <h4 className="font-semibold text-gray-900 mb-3">Strategic Recommendations</h4>
                  <ul className="space-y-1">
                    {trends.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <BarChart3 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-md border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No trends analysis yet</p>
                  <p className="text-sm text-gray-400">
                    Select your parameters and click "Analyze Market Trends" to get insights
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

export default MarketTrends;