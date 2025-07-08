// Generate initials from name
export const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Professional avatar collection from Pexels
export const avatarCollection = {
  // Business Professionals - Men
  men: [
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    'https://images.pexels.com/photos/2625122/pexels-photo-2625122.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  ],
  
  // Business Professionals - Women
  women: [
    'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    'https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
  ]
};

// Get random avatar from specific category or all
export const getRandomAvatar = (category?: keyof typeof avatarCollection): string => {
  if (category && avatarCollection[category]) {
    const categoryAvatars = avatarCollection[category];
    return categoryAvatars[Math.floor(Math.random() * categoryAvatars.length)];
  }
  
  // Get from all categories
  const allAvatars = Object.values(avatarCollection).flat();
  return allAvatars[Math.floor(Math.random() * allAvatars.length)];
};