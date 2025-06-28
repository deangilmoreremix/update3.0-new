import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Settings,
  Shield,
  Globe,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Database,
  Camera,
  Music,
  Video,
  Monitor,
  Smartphone,
  Wifi,
  Lock,
  Key,
  RefreshCw
} from 'lucide-react';
// Using regular button instead of importing Button component

interface ComposioIntegration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'connected' | 'available' | 'premium' | 'unavailable';
  actions: string[];
  setupComplexity: 'Simple' | 'Intermediate' | 'Advanced';
  requiredPermissions: string[];
  useCases: string[];
}

interface ComposioIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: any;
  onIntegrationSelect?: (integration: ComposioIntegration) => void;
}

const ComposioIntegrationsModal: React.FC<ComposioIntegrationsModalProps> = ({
  isOpen,
  onClose,
  goal,
  onIntegrationSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [integrations, setIntegrations] = useState<ComposioIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock integrations data - replace with real Composio API call
  const mockIntegrations: ComposioIntegration[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Professional networking, lead generation, and business connections',
      category: 'Social Media',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      status: 'connected',
      actions: ['Post Content', 'Send Messages', 'Connect with Users', 'Extract Profiles', 'Search Companies'],
      setupComplexity: 'Simple',
      requiredPermissions: ['Profile Access', 'Network Access', 'Messaging'],
      useCases: ['Lead Generation', 'Content Marketing', 'Network Building', 'Recruitment']
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      description: 'Social media engagement, content distribution, and brand monitoring',
      category: 'Social Media',
      icon: <MessageSquare className="h-6 w-6 text-sky-500" />,
      status: 'available',
      actions: ['Tweet', 'Reply', 'Retweet', 'Follow/Unfollow', 'Search Tweets', 'Analyze Sentiment'],
      setupComplexity: 'Simple',
      requiredPermissions: ['Tweet Access', 'Follow Access', 'Direct Messages'],
      useCases: ['Brand Monitoring', 'Customer Support', 'Content Distribution', 'Lead Generation']
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Email automation, campaign management, and communication workflows',
      category: 'Communication',
      icon: <Mail className="h-6 w-6 text-red-500" />,
      status: 'connected',
      actions: ['Send Emails', 'Read Emails', 'Create Drafts', 'Manage Labels', 'Search Messages'],
      setupComplexity: 'Intermediate',
      requiredPermissions: ['Email Access', 'Send Access', 'Modify Access'],
      useCases: ['Email Marketing', 'Lead Nurturing', 'Customer Support', 'Sales Outreach']
    },
    {
      id: 'reddit',
      name: 'Reddit',
      description: 'Community engagement, content sharing, and audience research',
      category: 'Social Media',
      icon: <Globe className="h-6 w-6 text-orange-500" />,
      status: 'available',
      actions: ['Post Content', 'Comment', 'Vote', 'Search Posts', 'Monitor Subreddits'],
      setupComplexity: 'Simple',
      requiredPermissions: ['Read Access', 'Submit Access', 'Vote Access'],
      useCases: ['Community Building', 'Market Research', 'Content Marketing', 'Brand Awareness']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication, workflow automation, and collaboration tools',
      category: 'Communication',
      icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
      status: 'premium',
      actions: ['Send Messages', 'Create Channels', 'File Sharing', 'Integration Management'],
      setupComplexity: 'Intermediate',
      requiredPermissions: ['Workspace Access', 'Channel Management', 'User Management'],
      useCases: ['Team Collaboration', 'Project Management', 'Automated Notifications', 'Workflow Integration']
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Calendar management, meeting scheduling, and event automation',
      category: 'Productivity',
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      status: 'available',
      actions: ['Create Events', 'Update Events', 'Send Invites', 'Check Availability', 'Sync Calendars'],
      setupComplexity: 'Simple',
      requiredPermissions: ['Calendar Access', 'Event Management', 'Attendee Management'],
      useCases: ['Meeting Scheduling', 'Event Management', 'Time Blocking', 'Availability Checking']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'CRM integration, lead management, and sales automation',
      category: 'CRM',
      icon: <Database className="h-6 w-6 text-orange-600" />,
      status: 'premium',
      actions: ['Manage Contacts', 'Create Deals', 'Send Emails', 'Track Activities', 'Generate Reports'],
      setupComplexity: 'Advanced',
      requiredPermissions: ['CRM Access', 'Contact Management', 'Deal Management', 'Email Access'],
      useCases: ['Lead Management', 'Sales Pipeline', 'Email Marketing', 'Customer Analytics']
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'E-commerce automation, order management, and inventory control',
      category: 'E-commerce',
      icon: <Monitor className="h-6 w-6 text-green-600" />,
      status: 'available',
      actions: ['Manage Products', 'Process Orders', 'Update Inventory', 'Customer Management', 'Analytics'],
      setupComplexity: 'Advanced',
      requiredPermissions: ['Store Access', 'Product Management', 'Order Management', 'Customer Access'],
      useCases: ['Inventory Management', 'Order Processing', 'Customer Service', 'Sales Analytics']
    }
  ];

  const categories = [
    'all',
    'Social Media',
    'Communication',
    'Productivity',
    'CRM',
    'E-commerce',
    'Analytics',
    'Marketing'
  ];

  useEffect(() => {
    // Simulate API call to fetch integrations
    setLoading(true);
    setTimeout(() => {
      setIntegrations(mockIntegrations);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100 border-green-300';
      case 'available': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'premium': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'unavailable': return 'text-gray-600 bg-gray-100 border-gray-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'available': return <Zap className="h-4 w-4" />;
      case 'premium': return <Lock className="h-4 w-4" />;
      case 'unavailable': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleIntegrationConnect = (integration: ComposioIntegration) => {
    // Handle integration connection logic
    console.log('Connecting to:', integration.name);
    if (onIntegrationSelect) {
      onIntegrationSelect(integration);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Composio Integrations</h2>
              <p className="text-blue-100">
                Connect your favorite tools and automate workflows with real-time integrations
              </p>
              {goal && (
                <div className="mt-3 text-sm text-blue-200">
                  Required for: <span className="font-semibold">{goal.title}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="h-12 w-12 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group"
                >
                  {/* Integration Icon and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{integration.name}</h3>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                          {getStatusIcon(integration.status)}
                          {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {integration.description}
                  </p>

                  {/* Setup Complexity */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">Setup Complexity</div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      integration.setupComplexity === 'Simple' ? 'bg-green-100 text-green-700' :
                      integration.setupComplexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      <Settings className="h-3 w-3" />
                      {integration.setupComplexity}
                    </div>
                  </div>

                  {/* Key Actions */}
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2">Key Actions</div>
                    <div className="flex flex-wrap gap-1">
                      {integration.actions.slice(0, 3).map((action, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border"
                        >
                          {action}
                        </span>
                      ))}
                      {integration.actions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded border">
                          +{integration.actions.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Connect Button */}
                  <button
                    onClick={() => handleIntegrationConnect(integration)}
                    disabled={integration.status === 'unavailable'}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      integration.status === 'connected'
                        ? 'bg-green-600 hover:bg-green-700'
                        : integration.status === 'premium'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : integration.status === 'unavailable'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {integration.status === 'connected' ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Connected
                        </>
                      ) : integration.status === 'premium' ? (
                        <>
                          <Lock className="h-4 w-4" />
                          Upgrade Required
                        </>
                      ) : integration.status === 'unavailable' ? (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          Unavailable
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Connect
                        </>
                      )}
                    </div>
                  </Button>

                  {/* External Link */}
                  <button className="w-full mt-2 text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    View Documentation
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Database className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Integrations Found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure OAuth 2.0</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span>Real-time Sync</span>
              </div>
            </div>
            <div className="text-gray-500">
              Powered by Composio API
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposioIntegrationsModal;