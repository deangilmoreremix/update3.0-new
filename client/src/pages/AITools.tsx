import React, { useState } from 'react';
import { useAITools } from '../components/AIToolsProvider';
import { Brain, Mail, MessageSquare, FileText, Phone, Target, FileSearch, TrendingUp, BarChart3, PieChart, ChevronRight, Search, Users, Eye, Image, Mic, Zap, MessagesSquare, CheckCircle, Sparkles, Shield, Volume2, Reply, Calendar } from 'lucide-react';


const AITools: React.FC = () => {
  const { openTool } = useAITools();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');


  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'email', name: 'Email Tools' },
    { id: 'sales', name: 'Sales Tools' },
    { id: 'meeting', name: 'Meeting Tools' },
    { id: 'content', name: 'Content Tools' },
    { id: 'analysis', name: 'Analysis Tools' },
    { id: 'voice', name: 'Voice & Audio' },
    { id: 'vision', name: 'Vision & Image' },
    { id: 'advanced', name: 'Advanced AI' },
    { id: 'realtime', name: 'Real-time' }
  ];
  
  const aiFeatures = [
    // Core AI Tools
    {
      title: "Smart Email Composer",
      description: "Generate personalized, professional emails for your contacts in seconds",
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      id: "email-composer" as const,
      categories: ['email']
    },
    {
      title: "Email Analysis",
      description: "Extract key insights, sentiment, and action items from customer emails",
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      id: "email-analysis" as const,
      categories: ['email', 'analysis']
    },
    {
      title: "Meeting Summary",
      description: "Transform meeting transcripts into concise, actionable summaries",
      icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
      id: "meeting-summary" as const,
      categories: ['meeting']
    },
    {
      title: "Smart Proposal Generator",
      description: "Create professional, customized sales proposals in seconds",
      icon: <FileText className="h-6 w-6 text-emerald-600" />,
      id: "proposal-generator" as const,
      categories: ['content', 'sales']
    },
    {
      title: "Call Script Generator",
      description: "Create personalized sales call scripts for more effective conversations",
      icon: <Phone className="h-6 w-6 text-indigo-600" />,
      id: "call-script" as const,
      categories: ['sales']
    },
    {
      title: "Subject Line Optimizer",
      description: "Generate high-converting email subject lines with performance predictions",
      icon: <Target className="h-6 w-6 text-rose-600" />,
      id: "subject-optimizer" as const,
      categories: ['email']
    },
    {
      title: "Competitor Analysis",
      description: "Analyze competitors and develop effective differentiation strategies",
      icon: <FileSearch className="h-6 w-6 text-amber-600" />,
      id: "competitor-analysis" as const,
      categories: ['analysis']
    },
    {
      title: "Market Trend Analysis",
      description: "Get insights on industry trends and market opportunities",
      icon: <TrendingUp className="h-6 w-6 text-cyan-600" />,
      id: "market-trends" as const,
      categories: ['analysis']
    },
    {
      title: "Sales Insights Generator",
      description: "AI-powered insights and recommendations based on your CRM data",
      icon: <BarChart3 className="h-6 w-6 text-green-600" />,
      id: "sales-insights" as const,
      categories: ['sales', 'analysis']
    },
    {
      title: "Sales Forecasting",
      description: "Revenue projections and deal closure probability analysis",
      icon: <PieChart className="h-6 w-6 text-blue-600" />,
      id: "sales-forecast" as const,
      categories: ['sales', 'analysis']
    },
    {
      title: "Objection Handler",
      description: "Get expert strategies for handling sales objections effectively",
      icon: <Shield className="h-6 w-6 text-indigo-600" />,
      id: "objection-handler" as const,
      categories: ['sales']
    },
    {
      title: "Customer Persona Generator",
      description: "Create detailed, data-driven customer personas for targeted sales",
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      id: "customer-persona" as const,
      categories: ['sales']
    },
    {
      title: "Voice Tone Optimizer",
      description: "Perfect your communication tone for different audiences and purposes",
      icon: <Volume2 className="h-6 w-6 text-purple-600" />,
      id: "voice-tone-optimizer" as const,
      categories: ['content', 'voice']
    },
    {
      title: "Email Response Generator",
      description: "Quickly create personalized responses to customer and prospect emails",
      icon: <Reply className="h-6 w-6 text-teal-600" />,
      id: "email-response" as const,
      categories: ['email']
    },
    {
      title: "Visual Content Generator",
      description: "Generate professional visual content ideas for sales presentations",
      icon: <Image className="h-6 w-6 text-rose-600" />,
      id: "visual-content-generator" as const,
      categories: ['content']
    },
    {
      title: "Meeting Agenda Generator",
      description: "Create structured, effective meeting agendas for your sales meetings",
      icon: <Calendar className="h-6 w-6 text-amber-600" />,
      id: "meeting-agenda" as const,
      categories: ['meeting']
    },
    
    // Advanced AI features
    {
      title: "AI Assistant",
      description: "Interact with a persistent AI assistant for various sales tasks",
      icon: <Brain className="h-6 w-6 text-violet-600" />,
      id: "ai-assistant" as const,
      categories: ['advanced', 'sales'],
      new: true
    },
    {
      title: "Vision Analyzer",
      description: "Analyze images, screenshots, and visual content to extract insights",
      icon: <Eye className="h-6 w-6 text-fuchsia-600" />,
      id: "vision-analyzer" as const,
      categories: ['vision', 'analysis'],
      new: true
    },
    {
      title: "Image Generator",
      description: "Create professional images for presentations and marketing",
      icon: <Image className="h-6 w-6 text-emerald-600" />,
      id: "image-generator" as const,
      categories: ['vision', 'content'],
      new: true
    },
    {
      title: "Semantic Search",
      description: "Find anything in your CRM with natural language queries",
      icon: <Search className="h-6 w-6 text-blue-600" />,
      id: "semantic-search" as const,
      categories: ['advanced', 'analysis'],
      new: true
    },
    
    // Real-time features
    {
      title: "Real-time Chat",
      description: "Experience real-time AI responses with streaming chat interface",
      icon: <MessagesSquare className="h-6 w-6 text-blue-600" />,
      id: "streaming-chat" as const,
      categories: ['advanced', 'realtime'],
      new: true
    },
    {
      title: "Function Assistant",
      description: "Chat with an AI that can perform real CRM actions",
      icon: <Zap className="h-6 w-6 text-yellow-600" />,
      id: "function-assistant" as const,
      categories: ['advanced', 'realtime'],
      new: true
    },
    {
      title: "Real-time Form Validation",
      description: "Get instant feedback on form fields with AI-powered validation",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      id: "form-validation" as const,
      categories: ['analysis', 'realtime'],
      new: true
    },
    {
      title: "Live Deal Analysis",
      description: "Get real-time insights and recommendations on your deals",
      icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
      id: "live-deal-analysis" as const,
      categories: ['sales', 'analysis', 'realtime'],
      new: true
    },
    {
      title: "Instant Response Generator",
      description: "Generate immediate responses to customer inquiries",
      icon: <Sparkles className="h-6 w-6 text-sky-600" />,
      id: "instant-response" as const,
      categories: ['email', 'realtime'],
      new: true
    },
    {
      title: "Document Analyzer",
      description: "Real-time analysis of uploaded documents and files",
      icon: <FileText className="h-6 w-6 text-indigo-600" />,
      id: "document-analyzer-realtime" as const,
      categories: ['analysis', 'realtime'],
      new: true
    },
    {
      title: "Real-time Email Composer",
      description: "Compose emails with live AI assistance and suggestions",
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      id: "realtime-email-composer" as const,
      categories: ['email', 'realtime'],
      new: true
    },
    {
      title: "Real-time Voice Analysis",
      description: "Analyze voice calls in real-time for sentiment and coaching",
      icon: <Mic className="h-6 w-6 text-purple-600" />,
      id: "voice-analysis-realtime" as const,
      categories: ['voice', 'analysis', 'realtime'],
      new: true
    },
    {
      title: "Smart Search with Typeahead",
      description: "Semantic search with AI-powered suggestions as you type",
      icon: <Search className="h-6 w-6 text-cyan-600" />,
      id: "smart-search-realtime" as const,
      categories: ['advanced', 'realtime'],
      new: true
    },
    {
      title: "AI Form Auto-completion",
      description: "Automatically fill forms using AI-powered suggestions",
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      id: "auto-form-completer" as const,
      categories: ['content', 'realtime'],
      new: true
    }
  ];

  // Filter tools based on search and category
  const filteredTools = aiFeatures.filter(tool => {
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'all' || 
      tool.categories.includes(activeCategory);
    
    return matchesSearch && matchesCategory;
  });
  


  // Helper function to get gradient colors based on tool ID
  const getGradientColors = (id: string): string => {
    switch(id) {
      case 'email-analysis':
      case 'email-composer':
      case 'email-response':
      case 'realtime-email-composer':
        return 'rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2)';
      case 'meeting-summary':
      case 'meeting-agenda':
      case 'voice-tone-optimizer':
        return 'rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.2)';
      case 'proposal-generator':
      case 'customer-persona':
        return 'rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)';
      case 'call-script':
      case 'objection-handler':
        return 'rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0.2)';
      case 'subject-optimizer':
      case 'visual-content-generator':
        return 'rgba(244, 63, 94, 0.1), rgba(244, 63, 94, 0.2)';
      case 'competitor-analysis':
        return 'rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2)';
      case 'market-trends':
        return 'rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.2)';
      case 'sales-insights':
        return 'rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)';
      case 'sales-forecast':
        return 'rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2)';
      case 'ai-assistant':
        return 'rgba(124, 58, 237, 0.1), rgba(124, 58, 237, 0.2)';
      case 'vision-analyzer':
        return 'rgba(217, 70, 239, 0.1), rgba(217, 70, 239, 0.2)';
      case 'image-generator':
        return 'rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.2)';
      case 'semantic-search':
      case 'smart-search-realtime':
        return 'rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2)';
      case 'streaming-chat':
        return 'rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2)';
      case 'function-assistant':
        return 'rgba(250, 204, 21, 0.1), rgba(250, 204, 21, 0.2)';
      case 'form-validation':
      case 'auto-form-completer':
        return 'rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2)';
      case 'live-deal-analysis':
        return 'rgba(147, 51, 234, 0.1), rgba(147, 51, 234, 0.2)';
      case 'instant-response':
        return 'rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.2)';
      case 'document-analyzer-realtime':
        return 'rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0.2)';
      case 'voice-analysis-realtime':
        return 'rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.2)';
      default:
        return 'rgba(107, 114, 128, 0.1), rgba(107, 114, 128, 0.2)';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Tools</h1>
          <p className="text-xl text-gray-600">Supercharge your sales and productivity with our AI-powered tools</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-xl shadow-sm mb-8 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white shadow-lg">
              <Zap className="h-8 w-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                AI-Powered Business Tools
              </h2>
              <p className="text-gray-700 text-lg">
                Access our comprehensive suite of AI tools designed to boost your sales performance and productivity. 
                Click on any tool to get started instantly!
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => openTool(tool.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 p-3 rounded-lg bg-gradient-to-r transition-all duration-300 group-hover:scale-105 relative" 
                        style={{backgroundImage: `linear-gradient(to right, ${getGradientColors(tool.id)})`}}>
                    {tool.icon}
                    {tool.new && (
                      <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{tool.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1 text-sm leading-relaxed">{tool.description}</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      Open Tool
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <Brain className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No matching tools found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default AITools;