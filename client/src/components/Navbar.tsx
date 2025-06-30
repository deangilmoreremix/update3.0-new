import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Target,
  ChevronDown,
  LogOut,
  MoveVertical,
  MoveHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

type NavbarPosition = 'top' | 'bottom' | 'left' | 'right';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Position state with localStorage persistence
  const [position, setPosition] = useState<NavbarPosition>(() => {
    const saved = localStorage.getItem('navbar-position');
    return (saved as NavbarPosition) || 'top';
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

  // Persist position to localStorage
  useEffect(() => {
    localStorage.setItem('navbar-position', position);
  }, [position]);

  const toggleAiMenu = () => setAiMenuOpen(!aiMenuOpen);
  const togglePositionMenu = () => setShowPositionMenu(!showPositionMenu);
  
  const handleLogout = async () => {
    navigate('/');
  };

  const handlePositionChange = (newPosition: NavbarPosition) => {
    setPosition(newPosition);
    setShowPositionMenu(false);
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

  // Position options with icons
  const positionOptions = [
    { position: 'top' as NavbarPosition, label: 'Top', icon: ArrowUp },
    { position: 'bottom' as NavbarPosition, label: 'Bottom', icon: ArrowDown },
    { position: 'left' as NavbarPosition, label: 'Left', icon: ArrowLeft },
    { position: 'right' as NavbarPosition, label: 'Right', icon: ArrowRight },
  ];

  // Dynamic styles based on position
  const getNavbarStyles = () => {
    const baseStyles = 'fixed bg-white shadow-lg transition-all duration-300 z-50';
    
    switch (position) {
      case 'top':
        return `${baseStyles} top-0 left-0 right-0 border-b border-gray-200`;
      case 'bottom':
        return `${baseStyles} bottom-0 left-0 right-0 border-t border-gray-200`;
      case 'left':
        return `${baseStyles} top-0 left-0 bottom-0 w-64 border-r border-gray-200`;
      case 'right':
        return `${baseStyles} top-0 right-0 bottom-0 w-64 border-l border-gray-200`;
      default:
        return `${baseStyles} top-0 left-0 right-0 border-b border-gray-200`;
    }
  };

  const getContainerStyles = () => {
    if (position === 'left' || position === 'right') {
      return 'flex flex-col h-full';
    }
    return 'flex items-center justify-between h-16 px-4';
  };

  const getNavItemsStyles = () => {
    if (position === 'left' || position === 'right') {
      return 'flex-1 p-4 space-y-2 overflow-y-auto';
    }
    return 'hidden md:flex items-center space-x-4';
  };

  const isHorizontal = position === 'top' || position === 'bottom';
  const isVertical = position === 'left' || position === 'right';

  return (
    <>
      <nav className={getNavbarStyles()}>
        <div className={getContainerStyles()}>
          {/* Logo and Position Controls */}
          <div className={`flex items-center ${isVertical ? 'justify-between p-4 border-b border-gray-200' : ''}`}>
            <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              <span>Smart</span><span>CRM</span>
            </Link>
            
            {/* Position Control Button */}
            <div className="relative">
              <button
                onClick={togglePositionMenu}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Change navbar position"
              >
                {isHorizontal ? <MoveHorizontal size={16} /> : <MoveVertical size={16} />}
              </button>
              
              {showPositionMenu && (
                <div className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} ${position === 'bottom' ? 'bottom-full mb-2' : 'top-full mt-2'} bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-32 z-60`}>
                  {positionOptions.map((option) => (
                    <button
                      key={option.position}
                      onClick={() => handlePositionChange(option.position)}
                      className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                        position === option.position 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <option.icon size={14} className="mr-2" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
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
                } ${isVertical ? 'w-full' : ''}`}
              >
                <item.icon size={18} className={isVertical ? 'mr-3' : 'mr-2'} />
                {isVertical || !isHorizontal ? item.label : ''}
              </Link>
            ))}

            {/* AI Tools Dropdown */}
            <div className="relative">
              <button
                onClick={toggleAiMenu}
                className={`flex items-center ${isVertical ? 'justify-between w-full' : ''} px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-md transition-colors`}
              >
                <div className="flex items-center">
                  <Brain size={18} className={isVertical ? 'mr-3' : 'mr-2'} />
                  {isVertical ? 'AI Tools' : ''}
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform ${aiMenuOpen ? 'rotate-180' : ''} ${isHorizontal && !isVertical ? 'ml-1' : ''}`} 
                />
              </button>
              
              {aiMenuOpen && (
                <div className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} ${position === 'bottom' ? 'bottom-full mb-2' : 'top-full mt-2'} bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-48 z-60 ${isVertical ? 'ml-6' : ''}`}>
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
              } ${isVertical ? 'w-full' : ''}`}
            >
              <Settings size={18} className={isVertical ? 'mr-3' : 'mr-2'} />
              {isVertical ? 'Settings' : ''}
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

          {/* User Section for Vertical Layout */}
          {isVertical && (
            <div className="p-4 border-t border-gray-200 mt-auto">
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

      {/* Content Spacer */}
      <div className={
        position === 'top' ? 'h-16' :
        position === 'bottom' ? 'h-16' :
        position === 'left' ? 'w-64 h-screen fixed top-0 left-0 pointer-events-none' :
        'w-64 h-screen fixed top-0 right-0 pointer-events-none'
      } />
    </>
  );
};

export default Navbar;