import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAITools } from '../components/AIToolsProvider';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
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
  Lightbulb,
  TrendingUp,
  BarChart3,
  Zap,
  Headphones,
  Video,
  Globe,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users as UsersIcon,
  BookOpen,
  Mic,
  Search,
  ChevronDown,
  LogOut,
  User
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  isActive?: (path: string) => boolean;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Temporary mock user data for development without Clerk
  const user = { 
    firstName: 'Demo', 
    lastName: 'User', 
    emailAddresses: [{ emailAddress: 'demo@smartcrm.com' }],
    imageUrl: null 
  };
  const isSignedIn = true;
  
  const { openTool } = useAITools();
  
  // Draggable position state with localStorage persistence
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem('navbar-position');
    return saved ? JSON.parse(saved) : { x: 20, y: 20 };
  });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setDragPosition({ x: data.x, y: data.y });
  };

  // Persist position to localStorage
  useEffect(() => {
    localStorage.setItem('navbar-position', JSON.stringify(dragPosition));
  }, [dragPosition]);

  const toggleAiMenu = () => setAiMenuOpen(!aiMenuOpen);
  
  const handleLogout = async () => {
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;
  const isActiveParent = (path: string) => location.pathname.startsWith(path);

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  if (!isSignedIn) {
    return null;
  }

  // Main navigation items
  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Contacts', path: '/contacts', icon: Users },
    { label: 'Deals', path: '/deals', icon: Briefcase },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'AI Goals', path: '/ai-goals', icon: Target },
  ];

  // AI Tools for dropdown
  const aiTools = [
    { label: 'Email Analysis', action: () => openTool('email-analyzer') },
    { label: 'Meeting Summary', action: () => openTool('meeting-summarizer') },
    { label: 'Sales Insights', action: () => openTool('sales-insights') },
    { label: 'Smart Search', action: () => openTool('smart-search') },
    { label: 'Content Generator', action: () => openTool('content-generator') },
  ];

  return (
    <Draggable
      handle=".drag-handle"
      position={dragPosition}
      onDrag={handleDrag}
    >
      <nav 
        className="drag-handle fixed bg-white shadow-lg rounded-lg cursor-move overflow-hidden"
        style={{ width: 280, maxHeight: '80vh', zIndex: 1000 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              <span>Smart</span><span>CRM</span>
            </Link>
            <div className="text-xs text-gray-500 mt-1">Drag to move</div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path) || (item.path !== '/dashboard' && isActiveParent(item.path))
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                <item.icon size={18} className="mr-3" />
                {item.label}
              </Link>
            ))}

            {/* AI Tools Dropdown */}
            <div className="relative">
              <button
                onClick={toggleAiMenu}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Brain size={18} className="mr-3" />
                  AI Tools
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform ${aiMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {aiMenuOpen && (
                <div className="mt-2 ml-6 space-y-1">
                  {aiTools.map((tool, index) => (
                    <button
                      key={index}
                      onClick={tool.action}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-md transition-colors"
                    >
                      {tool.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/settings')
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              <Settings size={18} className="mr-3" />
              Settings
            </Link>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {getUserInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                   user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </Draggable>
  );
};

export default Navbar;