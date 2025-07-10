import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ModernButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  children
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-indigo-600 text-white
      hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:scale-[1.02]
      focus:ring-blue-500 shadow-md
      active:from-blue-800 active:to-indigo-800
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900
      hover:from-gray-200 hover:to-gray-300 hover:shadow-md hover:scale-[1.02]
      focus:ring-gray-500 border border-gray-300
      active:from-gray-300 active:to-gray-400
    `,
    outline: `
      border-2 border-blue-600 text-blue-600 bg-transparent
      hover:bg-blue-600 hover:text-white hover:shadow-lg hover:scale-[1.02]
      focus:ring-blue-500
      active:bg-blue-700 active:border-blue-700
    `,
    ghost: `
      text-gray-700 bg-transparent
      hover:bg-gray-100 hover:text-gray-900 hover:scale-[1.02]
      focus:ring-gray-500
      active:bg-gray-200
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 text-white
      hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:scale-[1.02]
      focus:ring-red-500 shadow-md
      active:from-red-800 active:to-red-900
    `,
    success: `
      bg-gradient-to-r from-green-600 to-emerald-600 text-white
      hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:scale-[1.02]
      focus:ring-green-500 shadow-md
      active:from-green-800 active:to-emerald-800
    `,
    glass: `
      backdrop-blur-sm bg-white/10 border border-white/20 text-white
      hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:scale-[1.02]
      focus:ring-white/50
      active:bg-white/30
    `
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `;

  const iconClasses = iconSizeClasses[size];

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconClasses}`} />
          {children && <span>Loading...</span>}
        </>
      );
    }

    const iconElement = Icon ? <Icon className={iconClasses} /> : null;

    if (!children) {
      return iconElement;
    }

    if (iconPosition === 'right') {
      return (
        <>
          <span>{children}</span>
          {iconElement}
        </>
      );
    }

    return (
      <>
        {iconElement}
        <span>{children}</span>
      </>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {renderContent()}
    </button>
  );
};