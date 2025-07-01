import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'dark' | 'light';
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  variant = 'default',
  hover = true,
  ...props
}) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    default: 'glass-card',
    dark: 'bg-black/40 backdrop-blur-lg border border-white/10',
    light: 'glass-card-light'
  };
  
  const hoverClasses = hover ? 'hover:transform hover:-translate-y-1 hover:shadow-xl hover:border-white/20' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hoverClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};