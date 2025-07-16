import React, { useState } from 'react';
import { Megaphone, Plus, Play, Pause, Eye, Trash2, Mail, TrendingUp, Calendar, Target } from 'lucide-react';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      name: 'Q1 Product Launch',
      type: 'email',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-03-31',
      targetAudience: 'Enterprise Customers',
      sent: 2450,
      opened: 1235,
      clicked: 345,
      converted: 67,
      budget: 15000,
      spent: 8500,
      description: 'Comprehensive campaign for new product launch targeting enterprise customers'
    },
    {
      id: '2',
      name: 'Summer Sale Promotion',
      type: 'sms',
      status: 'paused',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      targetAudience: 'Existing Customers',
      sent: 1200,
      opened: 980,
      clicked: 156,
      converted: 23,
      budget: 8000,
      spent: 3200,
      description: 'SMS campaign for summer sale promotion targeting existing customers'
    },
    {
      id: '3',
      name: 'Lead Nurturing Sequence',
      type: 'email',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      targetAudience: 'Cold Leads',
      sent: 5600,
      opened: 2240,
      clicked: 448,
      converted: 112,
      budget: 20000,
      spent: 12000,
      description: 'Automated email sequence for nurturing cold leads'
    },
    {
      id: '4',
      name: 'Webinar Registration',
      type: 'mixed',
      status: 'completed',
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      targetAudience: 'Prospects',
      sent: 850,
      opened: 510,
      clicked: 127,
      converted: 45,
      budget: 5000,
      spent: 4800,
      description: 'Multi-channel campaign for webinar registration'
    }
  ]);

  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email',
    startDate: '',
    endDate: '',
    targetAudience: '',
    budget: '',
    description: ''
  });

  const campaignTypes = [
    { value: 'email', label: 'Email Campaign', icon: Mail },
    { value: 'sms', label: 'SMS Campaign', icon: MessageSquare },
    { value: 'mixed', label: 'Multi-channel', icon: Megaphone }
  ];

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800'
  };

  const calculateMetrics = (campaign) => {
    const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0;
    const clickRate = campaign.opened > 0 ? ((campaign.clicked / campaign.opened) * 100).toFixed(1) : 0;
    const conversionRate = campaign.clicked > 0 ? ((campaign.converted / campaign.clicked) * 100).toFixed(1) : 0;
    const budgetUsed = campaign.budget > 0 ? ((campaign.spent / campaign.budget) * 100).toFixed(1) : 0;
    
    return { openRate, clickRate, conversionRate, budgetUsed };
  };

  const toggleCampaignStatus = (id) => {
    setCampaigns(campaigns.map(campaign => {
      if (campaign.id === id) {
        return {
          ...campaign,
          status: campaign.status === 'active' ? 'paused' : 'active'
        };
      }
      return campaign;
    }));
  };

  const deleteCampaign = (id) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
  };

  const addCampaign = () => {
    if (newCampaign.name && newCampaign.startDate && newCampaign.endDate) {
      const campaign = {
        ...newCampaign,
        id: Date.now().toString(),
        status: 'draft',
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        spent: 0,
        budget: parseInt(newCampaign.budget) || 0
      };
      setCampaigns([...campaigns, campaign]);
      setNewCampaign({
        name: '',
        type: 'email',
        startDate: '',
        endDate: '',
        targetAudience: '',
        budget: '',
        description: ''
      });
      setShowNewCampaign(false);
    }
  };

  const getTotalMetrics = () => {
    return campaigns.reduce((totals, campaign) => ({
      sent: totals.sent + campaign.sent,
      opened: totals.opened + campaign.opened,
      clicked: totals.clicked + campaign.clicked,
      converted: totals.converted + campaign.converted,
      budget: totals.budget + campaign.budget,
      spent: totals.spent + campaign.spent
    }), { sent: 0, opened: 0, clicked: 0, converted: 0, budget: 0, spent: 0 });
  };

  const totals = getTotalMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Megaphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Campaigns
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage marketing campaigns and track performance
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewCampaign(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totals.sent.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Sent</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totals.opened.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Opened</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totals.converted.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Converted</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totals.spent.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Active Campaigns
          </h3>
          
          <div className="space-y-4">
            {campaigns.map(campaign => {
              const metrics = calculateMetrics(campaign);
              const TypeIcon = campaignTypes.find(t => t.value === campaign.type)?.icon || Mail;
              
              return (
                <div key={campaign.id} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <TypeIcon className="w-6 h-6 text-blue-500" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {campaign.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {campaign.targetAudience}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                        {campaign.status}
                      </span>
                      <button
                        onClick={() => toggleCampaignStatus(campaign.id)}
                        className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCampaign(campaign.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {campaign.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {campaign.sent.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {metrics.openRate}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {metrics.clickRate}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {metrics.conversionRate}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Conversion</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {metrics.budgetUsed}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Budget Used</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      Budget: ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* New Campaign Modal */}
        {showNewCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Campaign
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter campaign name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {campaignTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={newCampaign.targetAudience}
                    onChange={(e) => setNewCampaign({...newCampaign, targetAudience: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., Enterprise Customers"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter budget amount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Campaign description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewCampaign(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCampaign}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;