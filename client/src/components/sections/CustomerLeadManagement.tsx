import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { Users, UserPlus, Search, Filter, Star, TrendingUp } from 'lucide-react';

const CustomerLeadManagement: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  
  const contactsList = Object.values(contacts);
  const totalContacts = contactsList.length;
  const activeContacts = contactsList.filter(contact => contact.status === 'active').length;
  const leadContacts = contactsList.filter(contact => contact.status === 'lead').length;
  const prospectContacts = contactsList.filter(contact => contact.status === 'prospect').length;

  const contactStats = [
    {
      title: 'Total Contacts',
      value: totalContacts,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%'
    },
    {
      title: 'Active Contacts',
      value: activeContacts,
      icon: UserPlus,
      color: 'from-green-500 to-emerald-500',
      change: '+8%'
    },
    {
      title: 'Leads',
      value: leadContacts,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      change: '+15%'
    },
    {
      title: 'Prospects',
      value: prospectContacts,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: '+6%'
    }
  ];

  const recentContacts = contactsList.slice(0, 5);

  return (
    <div className={`mb-8 p-6 rounded-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/90 border-gray-200'} border shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer & Lead Management</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Manage and nurture your prospect relationships</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className={`p-2 rounded-lg transition-colors ${
            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Filter className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <button className={`p-2 rounded-lg transition-colors ${
            isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Search className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Contact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {contactStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                {stat.value}
              </p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Recent Contacts
          </h3>
          <div className="space-y-3">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} flex items-center justify-center`}>
                    <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {contact.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {contact.email}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    contact.status === 'active' 
                      ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
                      : contact.status === 'lead'
                      ? (isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
                      : (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
                  }`}>
                    {contact.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Conversion Funnel */}
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Lead Conversion Funnel
          </h3>
          <div className="space-y-4">
            {[
              { stage: 'Leads', count: leadContacts, percentage: 100, color: 'from-red-500 to-pink-500' },
              { stage: 'Prospects', count: prospectContacts, percentage: Math.round((prospectContacts / Math.max(leadContacts, 1)) * 100), color: 'from-yellow-500 to-orange-500' },
              { stage: 'Active', count: activeContacts, percentage: Math.round((activeContacts / Math.max(leadContacts, 1)) * 100), color: 'from-green-500 to-emerald-500' }
            ].map((stage, index) => (
              <div
                key={stage.stage}
                className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stage.stage}
                  </span>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stage.count}
                    </span>
                    <span className={`text-xs ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
                <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${stage.color}`}
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isDark 
            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}>
          Add New Contact
        </button>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isDark 
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}>
          Import Contacts
        </button>
        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isDark 
            ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        }`}>
          Lead Scoring
        </button>
      </div>
    </div>
  );
};

export default CustomerLeadManagement;