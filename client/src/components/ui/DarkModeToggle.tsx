import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export interface DarkModeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'switch' | 'dropdown';
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  size = 'md',
  variant = 'button',
  className = ''
}) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    
    const updateTheme = () => {
      if (savedTheme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemDark);
        document.documentElement.classList.toggle('dark', systemDark);
      } else {
        const darkMode = savedTheme === 'dark';
        setIsDark(darkMode);
        document.documentElement.classList.toggle('dark', darkMode);
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className={iconSizeClasses[size]} />;
    }
    return isDark ? <Moon className={iconSizeClasses[size]} /> : <Sun className={iconSizeClasses[size]} />;
  };

  const getLabel = () => {
    if (theme === 'system') return 'System';
    return isDark ? 'Dark' : 'Light';
  };

  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Sun className="w-4 h-4 text-gray-500" />
        <button
          onClick={toggleTheme}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${isDark ? 'bg-blue-600' : 'bg-gray-200'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isDark ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
        <Moon className="w-4 h-4 text-gray-500" />
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={toggleTheme}
          className={`
            ${sizeClasses[size]}
            flex items-center justify-center rounded-lg
            bg-white/10 backdrop-blur-sm border border-white/20
            hover:bg-white/20 hover:border-white/30
            transition-all duration-200
            dark:bg-gray-800/10 dark:border-gray-700/20
            dark:hover:bg-gray-800/20 dark:hover:border-gray-700/30
          `}
          title={`Theme: ${getLabel()}`}
        >
          {getIcon()}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center rounded-lg
        bg-gradient-to-r from-gray-100 to-gray-200 
        hover:from-gray-200 hover:to-gray-300
        dark:from-gray-800 dark:to-gray-900
        dark:hover:from-gray-700 dark:hover:to-gray-800
        border border-gray-300 dark:border-gray-700
        transition-all duration-200 hover:scale-105
        shadow-sm hover:shadow-md
        ${className}
      `}
      title={`Theme: ${getLabel()}`}
    >
      {getIcon()}
    </button>
  );
};