
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'btn-modern relative overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    primary: 'btn-modern--primary',
    glass: 'btn-modern--glass',
    outline: 'border border-white/20 text-white hover:bg-white/10',
    ghost: 'text-white hover:bg-white/10'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span className="w-4 h-4">{icon}</span>}
          {children}
        </div>
      )}
    </button>
  );
};

export default ModernButton;
