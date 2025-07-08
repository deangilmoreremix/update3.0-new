import React, { useState } from 'react';
import { useAITools } from './AIToolsProvider';
import { useTheme } from '../contexts/ThemeContext';
import { useVideoCall } from '../contexts/VideoCallContext';
import { 
  Home, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Menu, 
  X,
  Brain,
  Mail,
  MessageSquare,
  FileText,
  Phone,
  Target,
  FileSearch,
  TrendingUp,
  BarChart3,
  PieChart,
  ChevronDown,
  ChevronRight,
  Video,
  MessageCircle,
  CalendarDays,
  Map,
  FileSpreadsheet,
  Zap,
  Sun,
  Moon,
  Settings,
  User,
  LogOut,
  Bell,
  Search,
  Plus
} from 'lucide-react';

const SimpleNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Temporary mock user data for development
  const user = { 
    firstName: 'Demo', 
    lastName: 'User', 
    emailAddresses: [{ emailAddress: 'demo@smartcrm.com' }],
    imageUrl: null 
  };
  const isSignedIn = true;
  
  const { openTool } = useAITools();
  const { theme, toggleTheme } = useTheme();
  const { startCall } = useVideoCall();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAiMenu = () => setAiMenuOpen(!aiMenuOpen);

  const handleToolOpen = (toolName: string) => {
    openTool(toolName);
    setAiMenuOpen(false);
    setIsOpen(false);
  };

  const handleVideoCall = () => {
    startCall({
      id: '1',
      name: 'Demo Participant',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      email: 'demo@example.com',
      phone: '+1 (555) 123-4567'
    });
  };

  const aiTools = [
    {
      name: 'Business Analyzer',
      description: 'AI-powered business insights',
      icon: BarChart3,
      toolKey: 'business-analyzer',
      color: 'text-blue-600'
    },
    {
      name: 'Email Composer',
      description: 'AI email generation',
      icon: Mail,
      toolKey: 'email-composer',
      color: 'text-green-600'
    },
    {
      name: 'Smart Search',
      description: 'Semantic search across data',
      icon: Search,
      toolKey: 'semantic-search',
      color: 'text-purple-600'
    },
    {
      name: 'Content Creator',
      description: 'AI content generation',
      icon: FileText,
      toolKey: 'content-creator',
      color: 'text-orange-600'
    }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Smart CRM</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* AI Tools Dropdown */}
            <div className="relative">
              <button
                onClick={toggleAiMenu}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Brain className="w-4 h-4 mr-1" />
                AI Tools
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${aiMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {aiMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-2">
                    <div className="grid grid-cols-1 gap-1">
                      {aiTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <button
                            key={tool.toolKey}
                            onClick={() => handleToolOpen(tool.toolKey)}
                            className="flex items-center space-x-3 w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Icon className={`w-5 h-5 ${tool.color}`} />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <button
              onClick={handleVideoCall}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Video className="w-4 h-4 mr-1" />
              Video Call
            </button>

            <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Bell className="w-4 h-4 mr-1" />
              Notifications
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {isSignedIn && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user.firstName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.emailAddresses[0].emailAddress}</div>
                      </div>
                      <button className="flex items-center space-x-2 w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                      </button>
                      <button className="flex items-center space-x-2 w-full p-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <LogOut className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            {aiTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.toolKey}
                  onClick={() => handleToolOpen(tool.toolKey)}
                  className="flex items-center space-x-3 w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon className={`w-5 h-5 ${tool.color}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default SimpleNavbar;