export interface Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  company?: string;
  position?: string;
  industry?: string;
  avatarSrc?: string;
  avatar?: string;
  sources?: string[];
  source?: string;
  interestLevel?: 'hot' | 'medium' | 'low' | 'cold';
  status: string;
  lastConnected?: string;
  notes?: string;
  aiScore?: number;
  tags: string[];
  isFavorite?: boolean;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  customFields?: Record<string, string>;
  createdAt: string | Date;
  updatedAt: string | Date;
  
  // Gamification features
  isTeamMember?: boolean;
  role?: string;
  gamificationStats?: {
    points: number;
    achievements: string[];
    level: number;
    totalDeals: number;
    winRate: number;
    lastAchievement?: string;
  };
}