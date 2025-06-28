import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useAITools } from '../components/AIToolsProvider';
import { 
  Home, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Settings, 
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
  Package,
  Receipt,
  Building,
  Music,
  Headphones,
  Image,
  HelpCircle,
  User,
  LogOut
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [salesMenuOpen, setSalesMenuOpen] = useState(false);
  const [marketingMenuOpen, setMarketingMenuOpen] = useState(false);
  const [contentMenuOpen, setContentMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const { openTool } = useAITools();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAiMenu = () => setAiMenuOpen(!aiMenuOpen);
  const toggleSalesMenu = () => setSalesMenuOpen(!salesMenuOpen);
  const toggleMarketingMenu = () => setMarketingMenuOpen(!marketingMenuOpen);
  const toggleContentMenu = () => setContentMenuOpen(!contentMenuOpen);
  
  // Fetch profile if not already loaded
  React.useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, profile, fetchProfile]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const isActiveParent = (path: string) => location.pathname.startsWith(path);

  if (!isAuthenticated) {
    return null;
  }
  
  // Get user's initials for avatar
  const getInitials = () => {
    if (profile?.fullName) {
      const names = profile.fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return profile.fullName.charAt(0).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              <span>Smart</span>
              <span>CRM</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-1">
            {/* Main nav items */}
            <Link 
              to="/dashboard" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/dashboard') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              } transition-colors duration-200`}
            >
              <Home size={20} className="mr-2" />
              <span className="ml-2">Dashboard</span>
            </Link>
            
            <Link 
              to="/contacts" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActiveParent('/contacts') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              } transition-colors duration-200`}
            >
              <Users size={20} className="mr-2" />
              <span className="ml-2">Contacts</span>
            </Link>
            
            <Link 
              to="/pipeline" 
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActiveParent('/pipeline') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              } transition-colors duration-200`}
            >
              <Briefcase size={20} className="mr-2" />
              <span className="ml-2">Pipeline</span>
            </Link>
            
            {/* AI Tools dropdown */}
            <div className="relative group inline-block">
              <Link 
                to="/ai-tools"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActiveParent('/ai-tools') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                } transition-colors duration-200`}
              >
                <Brain size={20} className="mr-2" />
                <span className="ml-2">AI Tools</span>
                <ChevronDown size={16} className="ml-1" />
              </Link>
              
              <div className="hidden group-hover:block absolute z-10 w-56 mt-1 bg-white rounded-md shadow-lg border border-gray-100">
                <div className="py-1">
                  {/* Example AI tool items */}
                  <button
                    onClick={() => openTool('email-analysis')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Mail size={18} className="mr-2" />
                    <span className="ml-2">Email Analysis</span>
                  </button>
                  
                  <button
                    onClick={() => openTool('meeting-summary')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <MessageSquare size={18} className="mr-2" />
                    <span className="ml-2">Meeting Summarizer</span>
                  </button>
                  
                  {/* More AI tools... */}
                </div>
              </div>
            </div>
          </div>
          
          {/* User profile/logout */}
          <div className="hidden md:flex items-center ml-4 relative">
            <button 
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600" 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {profile?.avatarUrl ? (
                <img 
                  src={profile.avatarUrl}
                  alt={profile.fullName || 'User profile'} 
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {getInitials()}
                </div>
              )}
              <span className="font-medium text-sm">{profile?.fullName || user?.email?.split('@')[0] || 'User'}</span>
              <ChevronDown size={16} />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {profile?.email || user?.email}
                  </p>
                </div>
                
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings size={16} className="inline mr-2 text-gray-500" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="inline mr-2 text-gray-500" />
                  Sign out
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActive('/dashboard') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Home size={20} className="mr-3" />
              Dashboard
            </Link>
            
            <Link
              to="/contacts"
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActiveParent('/contacts') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Users size={20} className="mr-3" />
              Contacts
            </Link>
            
            <Link
              to="/pipeline"
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActiveParent('/pipeline') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Briefcase size={20} className="mr-3" />
              Pipeline
            </Link>
            
            <div>
              <div 
                className={`flex justify-between items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActiveParent('/ai-tools') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={toggleAiMenu}
              >
                <div className="flex items-center">
                  <Brain size={20} className="mr-3" />
                  <span>AI Tools</span>
                </div>
                {aiMenuOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
              
              {aiMenuOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  <button
                    onClick={() => {
                      openTool('email-analysis');
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <Mail size={18} className="mr-3" />
                    Email Analysis
                  </button>
                  
                  <button
                    onClick={() => {
                      openTool('meeting-summary');
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <MessageSquare size={18} className="mr-3" />
                    Meeting Summarizer
                  </button>
                </div>
              )}
            </div>
            
            {/* User profile on mobile */}
            <div className="pt-4 mt-2 border-t border-gray-200">
              <div className="flex items-center px-3 py-2">
                {profile?.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl}
                    alt={profile.fullName || 'User profile'} 
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium mr-3">
                    {getInitials()}
                  </div>
                )}
                <div>
                  <div className="font-medium">{profile?.fullName || user?.email?.split('@')[0] || 'User'}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
              </div>
              
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 mt-1 text-base font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={20} className="mr-3" />
                Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 mt-1 text-base font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <LogOut size={20} className="mr-3" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;