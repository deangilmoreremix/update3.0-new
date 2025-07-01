
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = true,
  elevated = false,
  onClick
}) => {
  return (
    <div
      className={cn(
        'glass-card',
        hover && 'hover:bg-white/15 hover:-translate-y-1 hover:shadow-xl',
        elevated && 'shadow-2xl',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
