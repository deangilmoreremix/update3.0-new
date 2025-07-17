import React from 'react';

export const AnimatedFeatureIcon: React.FC<{ icon: any; className?: string }> = ({ icon: Icon, className = '' }) => {
  return <Icon className={className} />;
};

export default AnimatedFeatureIcon;
