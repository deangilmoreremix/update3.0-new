import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useContactStore } from '../store/contactStore';
import { Contact } from '../types/contact';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked?: boolean;
  unlockedAt?: Date;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  endDate: Date;
}

interface LeaderboardEntry {
  contactId: string;
  name: string;
  role: string;
  avatarSrc?: string;
  score: number;
  recentAchievement?: string;
}

interface GamificationContextType {
  achievements: Achievement[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  teamMembers: Contact[];
  isTeamMember: (contactId: string) => boolean;
  addTeamMember: (contactId: string) => Promise<void>;
  removeTeamMember: (contactId: string) => Promise<void>;
  updateTeamMemberStats: (contactId: string, updates: Partial<Contact['gamificationStats']>) => Promise<void>;
  awardAchievement: (contactId: string, achievementId: string) => Promise<void>;
}

// Create the context with default values
const GamificationContext = createContext<GamificationContextType>({
  achievements: [],
  challenges: [],
  leaderboard: [],
  teamMembers: [],
  isTeamMember: () => false,
  addTeamMember: async () => {},
  removeTeamMember: async () => {},
  updateTeamMemberStats: async () => {},
  awardAchievement: async () => {},
});

// Sample achievements data
const sampleAchievements: Achievement[] = [
  {
    id: 'first-deal',
    name: 'First Deal',
    description: 'Closed your first deal',
    icon: '🎯',
    points: 100,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'deal-streak-5',
    name: '5 Deal Streak',
    description: 'Closed 5 deals in a row',
    icon: '🔥',
    points: 250,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'revenue-milestone-100k',
    name: '$100K Milestone',
    description: 'Generated $100,000 in revenue',
    icon: '💰',
    points: 500,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'pipeline-master',
    name: 'Pipeline Master',
    description: 'Manage 10+ active deals simultaneously',
    icon: '🧠',
    points: 300,
    unlocked: false
  },
  {
    id: 'quick-closer',
    name: 'Quick Closer',
    description: 'Close a deal in under 14 days',
    icon: '⚡',
    points: 200,
    unlocked: false
  }
];

// Sample challenges data
const sampleChallenges: Challenge[] = [
  {
    id: 'weekly-revenue-push',
    title: 'Weekly Revenue Push',
    description: 'Close $50,000 in deals this week',
    target: 50000,
    current: 32500,
    reward: '500 points + Top Closer badge',
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'team-qualification-sprint',
    title: 'Qualification Sprint',
    description: 'Team goal: Qualify 20 new leads this month',
    target: 20,
    current: 12,
    reward: '300 points + Team bonus',
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  }
];

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { contacts, updateContact } = useContactStore();
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [teamMembers, setTeamMembers] = useState<Contact[]>([]);

  // Update team members whenever contacts change
  useEffect(() => {
    // Ensure contacts is an array before filtering
    const contactsArray = Array.isArray(contacts) ? contacts : [];
    const filteredTeamMembers = contactsArray.filter(contact => contact.isTeamMember);
    setTeamMembers(filteredTeamMembers);
    
    // Update leaderboard
    const leaderboardData = filteredTeamMembers
      .map(member => ({
        contactId: member.id,
        name: member.name,
        role: member.role || 'sales-rep',
        avatarSrc: member.avatarSrc || member.avatar,
        score: member.gamificationStats?.points || 0,
        recentAchievement: member.gamificationStats?.achievements?.length 
          ? member.gamificationStats.achievements[member.gamificationStats.achievements.length - 1] 
          : undefined
      }))
      .sort((a, b) => b.score - a.score);
    
    setLeaderboard(leaderboardData);
  }, [contacts]);

  const isTeamMember = (contactId: string): boolean => {
    const contactsArray = Array.isArray(contacts) ? contacts : [];
    return contactsArray.find(contact => contact.id === contactId)?.isTeamMember || false;
  };

  const addTeamMember = async (contactId: string): Promise<void> => {
    const contactsArray = Array.isArray(contacts) ? contacts : [];
    const contact = contactsArray.find(c => c.id === contactId);
    if (contact) {
      await updateContact(contactId, { 
        isTeamMember: true,
        gamificationStats: contact.gamificationStats || {
          points: 0,
          achievements: [],
          level: 1,
          totalDeals: 0,
          winRate: 0,
          lastAchievement: undefined
        }
      });
    }
  };

  const removeTeamMember = async (contactId: string): Promise<void> => {
    await updateContact(contactId, { isTeamMember: false });
  };

  const updateTeamMemberStats = async (contactId: string, updates: Partial<Contact['gamificationStats']>): Promise<void> => {
    const contactsArray = Array.isArray(contacts) ? contacts : [];
    const contact = contactsArray.find(c => c.id === contactId);
    if (contact && contact.gamificationStats) {
      await updateContact(contactId, {
        gamificationStats: {
          ...contact.gamificationStats,
          ...updates
        }
      });
    }
  };

  const awardAchievement = async (contactId: string, achievementId: string): Promise<void> => {
    const contactsArray = Array.isArray(contacts) ? contacts : [];
    const contact = contactsArray.find(c => c.id === contactId);
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (contact && achievement && contact.gamificationStats) {
      const currentAchievements = contact.gamificationStats.achievements || [];
      if (!currentAchievements.includes(achievementId)) {
        await updateTeamMemberStats(contactId, {
          achievements: [...currentAchievements, achievementId],
          points: (contact.gamificationStats.points || 0) + achievement.points,
          lastAchievement: achievementId
        });
      }
    }
  };

  return (
    <GamificationContext.Provider 
      value={{ 
        achievements, 
        challenges, 
        leaderboard,
        teamMembers,
        isTeamMember,
        addTeamMember,
        removeTeamMember,
        updateTeamMemberStats,
        awardAchievement
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);