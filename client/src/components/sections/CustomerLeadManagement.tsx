import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAITools } from '../AIToolsProvider';
import { Brain, Plus, UserPlus, Users } from 'lucide-react';
import { useContacts } from '../../hooks/useContacts';
import { AIContactTestButton } from '../contacts/AIContactTestButton';

const CustomerLeadManagement: React.FC = () => {
  const { isDark } = useTheme();
  const { openTool } = useAITools();
  const { contacts } = useContacts();

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mr-3">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer & Lead Management</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and nurture your prospect relationships with AI insights
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => openTool('contact-manager')}
          className={`flex items-center space-x-2 px-4 py-2 ${
          isDark ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        } rounded-lg transition-colors`}>
          <UserPlus size={16} />
          <span>Add Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact List with AI Analysis */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Brain className="h-5 w-5 text-purple-600 mr-2" />
            AI-Enhanced Contacts
          </h3>
          
          <div className="space-y-4">
            {contacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className={`p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'} border rounded-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{contact.name}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {contact.title} at {contact.company}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    contact.status === 'hot' ? 'bg-red-100 text-red-600' :
                    contact.status === 'warm' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {contact.status || 'New'}
                  </div>
                </div>
                
                <AIContactTestButton 
                  contact={contact} 
                  onResult={(result) => {
                    console.log('AI analysis result for', contact.name, ':', result);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'} backdrop-blur-xl border rounded-2xl p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Contact Insights
          </h3>
          
          <div className="space-y-4">
            <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Contacts</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{contacts.length}</span>
              </div>
            </div>
            
            <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Hot Leads</span>
                <span className="font-semibold text-red-600">
                  {contacts.filter(c => c.interestLevel === 'hot' || c.status === 'hot').length}
                </span>
              </div>
            </div>
            
            <div className={`p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI Analyzed</span>
                <span className="font-semibold text-purple-600">
                  {contacts.filter(c => c.aiScore && c.aiScore > 0).length}
                </span>
              </div>
            </div>
            
            <div className={`p-4 ${isDark ? 'bg-green-50 border-green-200' : 'bg-green-50 border-green-100'} border rounded-lg`}>
              <p className="text-green-800 text-sm font-medium">
                🎯 AI Enhancement Available
              </p>
              <p className="text-green-700 text-xs mt-1">
                Use the AI analysis buttons above to get insights on contact quality and next steps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLeadManagement;