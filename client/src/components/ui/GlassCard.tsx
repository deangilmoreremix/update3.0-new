import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hover = true 
}) => {
  const baseClasses = 'bg-white/90 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg';
  const hoverClasses = hover ? 'hover:bg-white/95 dark:hover:bg-white/10 hover:shadow-xl transition-all duration-200' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};