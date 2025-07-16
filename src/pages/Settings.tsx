import React, { useState } from 'react';
import { useApiStore } from '../store/apiStore';
import { Eye, EyeOff, Key, Database, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { composioApps, composioAuthMap } from '../agents/useOpenAIAgentSuite';

const Settings: React.FC = () => {
  const { apiKeys, setOpenAiKey, setGeminiKey } = useApiStore();
  const [showOpenAiKey, setShowOpenAiKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [openAiInput, setOpenAiInput] = useState(apiKeys.openai || '');
  const [geminiInput, setGeminiInput] = useState(apiKeys.gemini || '');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, 'connected' | 'disconnected' | 'connecting'>>({});

  const toggleOpenAiVisibility = () => setShowOpenAiKey(!showOpenAiKey);
  const toggleGeminiVisibility = () => setShowGeminiKey(!showGeminiKey);
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleOpenAiSave = () => {
    setOpenAiKey(openAiInput);
    alert('OpenAI API key saved successfully!');
  };

  const handleGeminiSave = () => {
    setGeminiKey(geminiInput);
    alert('Gemini API key saved successfully!');
  };

  const handleConnectApp = async (app: string) => {
    const appKey = app.replace(/(^|_)(\w)/g, (_, p1, p2) => p2.toUpperCase());
    const authFunction = composioAuthMap[`connect${appKey}OAuth`];
    
    if (!authFunction) {
      console.error(`Auth function not found for ${app}`);
      return;
    }
    
    setIntegrationStatus(prev => ({...prev, [app]: 'connecting'}));
    
    try {
      await authFunction();
      setIntegrationStatus(prev => ({...prev, [app]: 'connected'}));
    } catch (error) {
      console.error(`Error connecting to ${app}:`, error);
      setIntegrationStatus(prev => ({...prev, [app]: 'disconnected'}));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your AI CRM platform</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">API Configuration</h2>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Key size={18} className="mr-2 text-gray-500" />
            <h3 className="text-lg font-medium">OpenAI API Key</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Used for email drafting and sentiment analysis. Get your API key from the{' '}
            <a 
              href="https://platform.openai.com/account/api-keys" 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-600 hover:underline"
            >
              OpenAI dashboard
            </a>.
          </p>
          
          <div className="flex">
            <div className="relative flex-1">
              <input
                type={showOpenAiKey ? 'text' : 'password'}
                value={openAiInput}
                onChange={(e) => setOpenAiInput(e.target.value)}
                placeholder="sk-..."
                className="w-full p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={toggleOpenAiVisibility}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showOpenAiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              onClick={handleOpenAiSave}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md transition-colors"
            >
              Save
            </button>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <Key size={18} className="mr-2 text-gray-500" />
            <h3 className="text-lg font-medium">Gemini API Key</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Used for follow-up suggestions and task prioritization. Get your API key from the{' '}
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-600 hover:underline"
            >
              Google AI Studio
            </a>.
          </p>
          
          <div className="flex">
            <div className="relative flex-1">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiInput}
                onChange={(e) => setGeminiInput(e.target.value)}
                placeholder="AI..."
                className="w-full p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={toggleGeminiVisibility}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showGeminiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              onClick={handleGeminiSave}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      
      {/* Composio Integrations Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <button 
          className="w-full flex items-center justify-between"
          onClick={() => toggleSection('composio')}
        >
          <div className="flex items-center">
            <Database size={18} className="mr-2 text-indigo-500" />
            <h2 className="text-xl font-semibold">Composio Integrations</h2>
          </div>
          <div className="text-gray-400">
            {expandedSection === 'composio' ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
        </button>
        
        {expandedSection === 'composio' && (
          <div className="mt-4 border-t pt-4">
            <p className="text-gray-600 mb-6">
              Connect third-party applications to enhance your AI agents' capabilities. These connections allow your AI agents to perform actions like sending emails, scheduling meetings, and managing tasks.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {composioApps.map(app => (
                <div 
                  key={app} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {app.replace(/_/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {integrationStatus[app] === 'connected' 
                          ? 'Connected and ready to use' 
                          : 'Not connected'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleConnectApp(app)}
                      disabled={integrationStatus[app] === 'connecting'}
                      className={`px-3 py-1.5 rounded text-sm font-medium ${
                        integrationStatus[app] === 'connected'
                          ? 'bg-green-100 text-green-700 flex items-center'
                          : integrationStatus[app] === 'connecting'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {integrationStatus[app] === 'connected' ? (
                        <>
                          <Check size={16} className="mr-1" />
                          Connected
                        </>
                      ) : integrationStatus[app] === 'connecting' ? (
                        'Connecting...'
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">About Composio Integrations</h4>
              <p className="text-sm text-gray-600">
                Composio provides secure, OAuth-based connections to third-party applications. No API keys are stored in our system, and you can revoke access at any time. These integrations enable your AI agents to perform real-world actions on your behalf.
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-gray-600">
          AI CRM Platform v0.1.0 - A powerful customer relationship management system enhanced with AI capabilities.
        </p>
        <p className="text-gray-600 mt-2">
          Built with React, Vite, and powered by OpenAI and Google Gemini.
        </p>
      </div>
    </div>
  );
};

export default Settings;