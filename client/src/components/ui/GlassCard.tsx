import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <div 
      className={`
        bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg
        ${hover ? 'hover:shadow-xl hover:bg-white/90 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};