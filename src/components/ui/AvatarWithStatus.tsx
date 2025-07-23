
import React from 'react';
import { StatusIndicator } from './StatusIndicator';

export const AvatarWithStatus: FC<AvatarWithStatusProps> = ({
  src,
  alt,
  size = 'md',
  status = 'active',
  showStatus = true
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-20 h-20';
      case 'md':
      default:
        return 'w-12 h-12';
    }
  };

  return (
    <div className="relative inline-block">
      <img
        src={src}
        alt={alt}
        className={`${getSizeClass()} rounded-full object-cover border-2 border-white shadow-md`}
      />
      {showStatus && (
        <div className="absolute -bottom-1 -right-1">
          <StatusIndicator status={status} size="sm" pulse />
        </div>
      )}
    </div>
  );
};