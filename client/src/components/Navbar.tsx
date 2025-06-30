import React, { useState, useEffect, useCallback } from 'react';
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
  Target,
  ChevronDown,
  LogOut,
  GripHorizontal
} from 'lucide-react';

type NavbarPosition = 'top' | 'bottom' | 'left' | 'right' | 'floating';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Position state with localStorage persistence
  const [position, setPosition] = useState<NavbarPosition>(() => {
    const saved = localStorage.getItem('navbar-position');
    return (saved as NavbarPosition) || 'floating';
  });

  // Draggable position state
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem('navbar-drag-position');
    return saved ? JSON.parse(saved) : { x: 20, y: 20 };
  });

  // Temporary mock user data for development without Clerk
  const user = { 
    firstName: 'Demo', 
    lastName: 'User', 
    emailAddresses: [{ emailAddress: 'demo@smartcrm.com' }],
    imageUrl: null 
  };
  const isSignedIn = true;
  
  const { openTool } = useAITools();

  // Snap distance threshold
  const SNAP_THRESHOLD = 50;

  // Calculate snap position
  const calculateSnapPosition = useCallback((x: number, y: number): { position: NavbarPosition; x: number; y: number } => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const navbarWidth = 280;
    const navbarHeight = 60;

    // Check if near edges
    const nearLeft = x < SNAP_THRESHOLD;
    const nearRight = x > windowWidth - navbarWidth - SNAP_THRESHOLD;
    const nearTop = y < SNAP_THRESHOLD;
    const nearBottom = y > windowHeight - navbarHeight - SNAP_THRESHOLD;

    // Determine snap position
    if (nearTop && !nearLeft && !nearRight) {
      return { position: 'top', x: 0, y: 0 };
    } else if (nearBottom && !nearLeft && !nearRight) {
      return { position: 'bottom', x: 0, y: windowHeight - navbarHeight };
    } else if (nearLeft && !nearTop && !nearBottom) {
      return { position: 'left', x: 0, y: 0 };
    } else if (nearRight && !nearTop && !nearBottom) {
      return { position: 'right', x: windowWidth - navbarWidth, y: 0 };
    }

    return { position: 'floating', x, y };
  }, []);

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    const snapResult = calculateSnapPosition(data.x, data.y);
    setDragPosition({ x: data.x, y: data.y });
    
    // Update position if snapping
    if (snapResult.position !== 'floating') {
      setPosition(snapResult.position);
    } else {
      setPosition('floating');
    }
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    const snapResult = calculateSnapPosition(data.x, data.y);
    
    if (snapResult.position !== 'floating') {
      setPosition(snapResult.position);
      setDragPosition({ x: snapResult.x, y: snapResult.y });
    } else {
      setDragPosition({ x: data.x, y: data.y });
    }
  };

  // Persist position and drag position to localStorage
  useEffect(() => {
    localStorage.setItem('navbar-position', position);
    localStorage.setItem('navbar-drag-position', JSON.stringify(dragPosition));
  }, [position, dragPosition]);

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
    { label: 'Email Analysis', action: () => openTool('email-analysis') },
    { label: 'Meeting Summary', action: () => openTool('meeting-summary') },
    { label: 'Sales Insights', action: () => openTool('sales-insights') },
    { label: 'Email Composer', action: () => openTool('email-composer') },
    { label: 'Proposal Generator', action: () => openTool('proposal-generator') },
  ];

  // Dynamic styles based on position
  const getNavbarStyles = () => {
    const baseStyles = 'bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/50 transition-all duration-300';
    
    switch (position) {
      case 'top':
        return `${baseStyles} w-full h-16 rounded-none border-b`;
      case 'bottom':
        return `${baseStyles} w-full h-16 rounded-none border-t`;
      case 'left':
        return `${baseStyles} w-64 h-screen rounded-none border-r`;
      case 'right':
        return `${baseStyles} w-64 h-screen rounded-none border-l`;
      case 'floating':
      default:
        return `${baseStyles} w-80 max-h-96 rounded-xl`;
    }
  };

  const getContainerStyles = () => {
    if (position === 'left' || position === 'right') {
      return 'flex flex-col h-full';
    }
    if (position === 'floating') {
      return 'flex flex-col h-full max-h-96';
    }
    return 'flex items-center justify-between h-16 px-4';
  };

  const getNavItemsStyles = () => {
    if (position === 'left' || position === 'right') {
      return 'flex-1 p-4 space-y-2 overflow-y-auto';
    }
    if (position === 'floating') {
      return 'flex-1 p-4 space-y-2 overflow-y-auto max-h-64';
    }
    return 'hidden md:flex items-center space-x-4';
  };

  const isHorizontal = position === 'top' || position === 'bottom';
  const isVertical = position === 'left' || position === 'right';
  const isFloating = position === 'floating';

  // For floating or docked positions, use absolute positioning
  const getPositionStyles = () => {
    if (position === 'floating') {
      return {
        position: 'fixed' as const,
        left: dragPosition.x,
        top: dragPosition.y,
        zIndex: 1000,
      };
    }
    
    // Docked positions
    switch (position) {
      case 'top':
        return {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        };
      case 'bottom':
        return {
          position: 'fixed' as const,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        };
      case 'left':
        return {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1000,
        };
      case 'right':
        return {
          position: 'fixed' as const,
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        };
      default:
        return {
          position: 'fixed' as const,
          left: dragPosition.x,
          top: dragPosition.y,
          zIndex: 1000,
        };
    }
  };

  return (
    <Draggable
      handle=".drag-handle"
      position={position === 'floating' ? dragPosition : { x: 0, y: 0 }}
      onDrag={handleDrag}
      onStop={handleDragStop}
      disabled={position !== 'floating'}
    >
      <nav 
        className={getNavbarStyles()}
        style={getPositionStyles()}
      >
        <div className={getContainerStyles()}>
          {/* Header with drag handle */}
          <div className={`flex items-center ${isVertical || isFloating ? 'justify-between p-4 border-b border-gray-200/50' : ''}`}>
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              <span>Smart</span><span>CRM</span>
            </Link>
            
            {/* Drag Handle */}
            <div className="drag-handle p-2 cursor-move text-gray-400 hover:text-gray-600 transition-colors">
              <GripHorizontal size={16} />
            </div>
          </div>

          {/* Mobile Menu Button (only for horizontal layouts) */}
          {isHorizontal && (
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}

          {/* Navigation Items */}
          <div className={getNavItemsStyles()}>
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path) || (item.path !== '/dashboard' && isActiveParent(item.path))
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                } ${isVertical || isFloating ? 'w-full' : ''}`}
              >
                <item.icon size={18} className={isVertical || isFloating ? 'mr-3' : 'mr-2'} />
                {isVertical || isFloating || !isHorizontal ? item.label : ''}
              </Link>
            ))}

            {/* AI Tools Dropdown */}
            <div className="relative">
              <button
                onClick={toggleAiMenu}
                className={`flex items-center ${isVertical || isFloating ? 'justify-between w-full' : ''} px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-md transition-colors`}
              >
                <div className="flex items-center">
                  <Brain size={18} className={isVertical || isFloating ? 'mr-3' : 'mr-2'} />
                  {isVertical || isFloating ? 'AI Tools' : ''}
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform ${aiMenuOpen ? 'rotate-180' : ''} ${isHorizontal && !isVertical && !isFloating ? 'ml-1' : ''}`} 
                />
              </button>
              
              {aiMenuOpen && (
                <div className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} ${position === 'bottom' ? 'bottom-full mb-2' : 'top-full mt-2'} bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-48 z-60 ${isVertical || isFloating ? 'ml-6' : ''}`}>
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
              } ${isVertical || isFloating ? 'w-full' : ''}`}
            >
              <Settings size={18} className={isVertical || isFloating ? 'mr-3' : 'mr-2'} />
              {isVertical || isFloating ? 'Settings' : ''}
            </Link>
          </div>

          {/* User Section */}
          {isHorizontal && (
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {getUserInitials()}
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium text-gray-900">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                   user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-gray-500">
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
          )}

          {/* User Section for Vertical/Floating Layout */}
          {(isVertical || isFloating) && (
            <div className="p-4 border-t border-gray-200/50 mt-auto">
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
          )}
        </div>

        {/* Mobile menu for horizontal layouts */}
        {isHorizontal && isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                    isActive(item.path) || (item.path !== '/dashboard' && isActiveParent(item.path))
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              ))}
              
              <Link
                to="/settings"
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive('/settings')
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Settings size={20} className="mr-3" />
                Settings
              </Link>

              {/* Mobile User Section */}
              <div className="pt-4 pb-2 border-t border-gray-200 mt-4">
                <div className="flex items-center px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 
                       user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </div>
                  </div>
                </div>
                
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
    </Draggable>
  );
};

export default Navbar;