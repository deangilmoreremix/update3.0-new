
import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  position = 'bottom-right',
  size = 'md',
  tooltip,
  className
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <button
      className={cn(
        'fab fixed z-50 flex items-center justify-center',
        'bg-gradient-to-r from-blue-500 to-purple-600',
        'hover:from-blue-600 hover:to-purple-700',
        'text-white rounded-full shadow-xl',
        'transition-all duration-300 hover:-translate-y-1 hover:scale-105',
        'focus:outline-none focus:ring-4 focus:ring-blue-500/50',
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      title={tooltip}
    >
      <span className="w-6 h-6">{icon}</span>
    </button>
  );
};

export default FloatingActionButton;
