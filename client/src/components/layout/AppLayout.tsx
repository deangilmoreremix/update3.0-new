import React from 'react';
import { useNavbarPositionContext } from './NavbarPositionProvider';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isTop, isLeft, isRight } = useNavbarPositionContext();

  // Dynamic main content class based on navbar position
  const getMainContentClasses = () => {
    if (isLeft) {
      return "ml-64 min-h-screen app-content-left";
    }
    
    if (isRight) {
      return "mr-64 min-h-screen app-content-right";
    }
    
    // Top position is default - no margin needed
    return "min-h-screen app-content-top";
  };

  return (
    <div className={`transition-all duration-300 ${getMainContentClasses()}`}>
      {children}
    </div>
  );
}