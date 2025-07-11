import React from 'react';

export interface GlassCardProps {
  variant?: 'default' | 'strong' | 'subtle' | 'dark';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  blur = 'md',
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  const baseClasses = `
    rounded-xl border transition-all duration-300
    ${onClick || hoverable ? 'cursor-pointer' : ''}
  `;

  const variantClasses = {
    default: `
      backdrop-blur-md bg-white/60 border-white/20
      hover:bg-white/70 hover:border-white/30
      dark:bg-gray-900/60 dark:border-gray-700/20
      dark:hover:bg-gray-900/70 dark:hover:border-gray-700/30
    `,
    strong: `
      backdrop-blur-lg bg-white/80 border-white/40
      hover:bg-white/90 hover:border-white/50
      dark:bg-gray-900/80 dark:border-gray-700/40
      dark:hover:bg-gray-900/90 dark:hover:border-gray-700/50
    `,
    subtle: `
      backdrop-blur-sm bg-white/40 border-white/10
      hover:bg-white/50 hover:border-white/20
      dark:bg-gray-900/40 dark:border-gray-700/10
      dark:hover:bg-gray-900/50 dark:hover:border-gray-700/20
    `,
    dark: `
      backdrop-blur-md bg-gray-900/60 border-gray-700/20 text-white
      hover:bg-gray-900/70 hover:border-gray-700/30
    `
  };

  const blurClasses = {
    none: '',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const hoverClasses = hoverable || onClick ? `
    hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1
    active:scale-[1.01] active:translate-y-0
  ` : '';

  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${blurClasses[blur]}
    ${hoverClasses}
    ${className}
  `;

  return (
    <div
      className={cardClasses}
      onClick={onClick}
    >
      {children}
    </div>
  );
};