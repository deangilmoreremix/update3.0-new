import React from 'react';
import Avatar from 'react-avatar';

interface AvatarWithStatusProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

const sizeMap = {
  sm: '32',
  md: '48',
  lg: '64',
  xl: '80'
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500'
};

export const AvatarWithStatus: React.FC<AvatarWithStatusProps> = ({
  src,
  alt,
  size = 'md',
  status,
  className = ''
}) => {
  const avatarSize = sizeMap[size];
  
  return (
    <div className={`relative inline-block ${className}`}>
      <Avatar
        src={src}
        name={alt}
        size={avatarSize}
        round
        className="shadow-md border-2 border-white"
      />
      {status && (
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusColors[status]}`} />
      )}
    </div>
  );
};