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
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/90 backdrop-blur-sm border border-white/20 
        rounded-xl shadow-lg transition-all duration-200
        ${hover ? 'hover:bg-white/95 hover:shadow-xl hover:scale-[1.02]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};