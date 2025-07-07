import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  variant?: 'default' | 'strong' | 'subtle';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hover = true,
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'strong':
        return 'bg-white/10 backdrop-blur-md border border-white/20';
      case 'subtle':
        return 'bg-white/5 backdrop-blur-sm border border-white/10';
      case 'default':
      default:
        return 'bg-white/90 backdrop-blur-sm border border-white/20';
    }
  };

  const getHoverClasses = () => {
    if (!hover) return '';
    
    switch (variant) {
      case 'strong':
        return 'hover:bg-white/15 hover:border-white/30 hover:scale-[1.02]';
      case 'subtle':
        return 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]';
      case 'default':
      default:
        return 'hover:bg-white/95 hover:shadow-xl hover:scale-[1.02]';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        ${getVariantClasses()}
        rounded-2xl shadow-lg transition-all duration-300
        ${getHoverClasses()}
        ${onClick ? 'cursor-pointer' : ''}
        animate-float-up
        ${className}
      `}
    >
      {children}
    </div>
  );
};