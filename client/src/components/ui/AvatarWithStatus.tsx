import React from 'react';

interface AvatarWithStatusProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'pending' | 'inactive' | 'success' | 'warning' | 'error';
  showStatus?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-20 h-20'
};

const statusClasses = {
  active: 'bg-green-500',
  pending: 'bg-yellow-500',
  inactive: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
};

const statusSizes = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4', 
  xl: 'w-5 h-5'
};

export const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({
  src,
  alt,
  size = 'md',
  status = 'active',
  showStatus = true
}) => {
  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
      />
      {showStatus && (
        <div
          className={`
            absolute -bottom-0.5 -right-0.5 
            ${statusSizes[size]} 
            ${statusClasses[status]} 
            rounded-full border-2 border-white
          `}
        />
      )}
    </div>
  );
};