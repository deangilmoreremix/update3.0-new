import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
  status?: 'online' | 'away' | 'busy' | 'offline' | 'active' | 'pending' | 'inactive' | 'success' | 'warning' | 'error';
  showStatus?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm', 
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl'
};

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500', 
  busy: 'bg-red-500',
  offline: 'bg-gray-400',
  active: 'bg-green-500',
  pending: 'bg-yellow-500',
  inactive: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
};

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  fallback,
  className = '',
  status,
  showStatus = false
}) => {
  const [imageError, setImageError] = React.useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const showFallback = !src || imageError;
  const initials = fallback || alt.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      {showFallback ? (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold`}>
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={handleImageError}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      )}
      
      {showStatus && status && (
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white dark:border-gray-900`}></div>
      )}
    </div>
  );
};

export default Avatar;