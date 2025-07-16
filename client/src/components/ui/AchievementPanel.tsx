import React from 'react';
import { Trophy, Star, Medal, Crown, TrendingUp, Award } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useContactStore } from '../../store/contactStore';
import { Contact } from '../../types/contact';

export const AchievementPanel: React.FC = () => {
  const { contacts } = useContactStore();

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      title: 'Deal Closer',
      description: 'Closed 10 deals this month',
      icon: Trophy,
      level: 'Gold',
      progress: 100,
      unlocked: true,
      reward: '+50 XP',
      color: 'text-yellow-500'
    },
    {
      id: 2,
      title: 'Networking Pro',
      description: 'Added 25 new contacts',
      icon: Users,
      level: 'Silver',
      progress: 80,
      unlocked: false,
      reward: '+30 XP',
      color: 'text-gray-400'
    },
    {
      id: 3,
      title: 'AI Assistant',
      description: 'Used AI tools 50 times',
      icon: Sparkles,
      level: 'Bronze',
      progress: 65,
      unlocked: false,
      reward: '+20 XP',
      color: 'text-orange-400'
    },
    {
      id: 4,
      title: 'Revenue Star',
      description: 'Generated $100K revenue',
      icon: Star,
      level: 'Platinum',
      progress: 90,
      unlocked: false,
      reward: '+100 XP',
      color: 'text-purple-500'
    }
  ];

  // Team leaderboard with real contacts
  const teamMembers = contacts.slice(0, 5).map((contact, index) => ({
    ...contact,
    points: Math.floor(Math.random() * 1000) + 500,
    rank: index + 1,
    badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'none'
  }));

  return (
    <div className="space-y-6">
      {/* Personal Achievements */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Your Achievements
          </h3>
          <div className="text-sm text-gray-500">Level 12 • 2,450 XP</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <IconComponent className={`w-6 h-6 mr-3 ${achievement.color}`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Medal className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                          : 'bg-gradient-to-r from-blue-400 to-purple-400'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    achievement.unlocked
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {achievement.level}
                  </span>
                  <span className="text-xs text-green-600 font-medium">{achievement.reward}</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Team Leaderboard */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Crown className="w-5 h-5 mr-2 text-purple-500" />
            Team Leaderboard
          </h3>
          <div className="text-sm text-gray-500">This Month</div>
        </div>

        <div className="space-y-3">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* Monthly Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">127</div>
            <div className="text-sm text-gray-600">Total Deals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">$2.4M</div>
            <div className="text-sm text-gray-600">Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-gray-600">Target</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

const TeamMemberCard: React.FC<{ member: Contact }> = ({ member }) => {
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'gold':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'silver':
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 'bronze':
        return <Award className="w-4 h-4 text-orange-400" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      case 'silver':
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 'bronze':
        return 'bg-gradient-to-r from-orange-300 to-orange-400';
      default:
        return 'bg-gradient-to-r from-blue-400 to-purple-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getBadgeColor(member.badge || 'none')}`}>
            #{member.rank}
          </div>
          {member.badge !== 'none' && (
            <div className="absolute -top-1 -right-1">
              {getBadgeIcon(member.badge || 'none')}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <img
            src={member.avatarSrc}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <div className="font-medium text-gray-900">{member.name}</div>
            <div className="text-sm text-gray-600">{member.title}</div>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="font-bold text-gray-900">{member.points}</div>
        <div className="text-sm text-gray-500">points</div>
        <div className="flex items-center mt-1">
          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
          <span className="text-xs text-green-600">+{Math.floor(Math.random() * 50) + 10}</span>
        </div>
      </div>
    </div>
  );
};