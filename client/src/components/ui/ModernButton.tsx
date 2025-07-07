import React from 'react';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  title,
  type = 'button'
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30';
      case 'outline':
        return 'bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30';
      case 'ghost':
        return 'bg-transparent text-white hover:bg-white/10';
      case 'secondary':
        return 'bg-gray-500/20 border border-gray-400/30 text-gray-300 hover:bg-gray-500/30 hover:text-white';
      case 'primary':
      default:
        return 'bg-blue-500/80 backdrop-blur-sm border border-blue-400/30 text-white hover:bg-blue-500 hover:border-blue-400/50';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'md':
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      type={type}
      onClick={(e) => onClick?.(e)}
      disabled={disabled || loading}
      title={title}
      className={`
        ${getVariantClass()}
        ${getSizeClass()}
        rounded-xl font-medium transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        shadow-lg hover:shadow-xl hover:scale-105
        ${className}
      `}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};