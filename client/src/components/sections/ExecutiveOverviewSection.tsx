import React from 'react';
import { Brain, Zap, Target, Sparkles } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, gradient }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:scale-105 animate-scale-up">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient} backdrop-blur-sm`}>
          {icon}
        </div>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <h4 className="text-lg font-semibold text-gray-200 mb-1">{title}</h4>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
};

interface ExecutiveOverviewProps {
  aiMetrics: {
    activeSuggestions: number;
    efficiency: number;
    qualityScore: number;
    automatedTasks: number;
  };
}

export const ExecutiveOverviewSection: React.FC<ExecutiveOverviewProps> = ({ aiMetrics }) => {
  const metrics = [
    {
      title: 'AI Suggestions',
      value: aiMetrics.activeSuggestions.toString(),
      subtitle: 'Active recommendations',
      icon: <Brain className="h-6 w-6 text-blue-300" />,
      gradient: 'bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-blue-400/40'
    },
    {
      title: 'Efficiency Boost',
      value: `${aiMetrics.efficiency}%`,
      subtitle: 'Performance improvement',
      icon: <Zap className="h-6 w-6 text-yellow-300" />,
      gradient: 'bg-gradient-to-br from-yellow-500/30 to-orange-600/30 border border-yellow-400/40'
    },
    {
      title: 'Quality Score',
      value: `${aiMetrics.qualityScore}/100`,
      subtitle: 'AI accuracy rating',
      icon: <Target className="h-6 w-6 text-emerald-300" />,
      gradient: 'bg-gradient-to-br from-emerald-500/30 to-teal-600/30 border border-emerald-400/40'
    },
    {
      title: 'Automated Tasks',
      value: aiMetrics.automatedTasks.toString(),
      subtitle: 'Completed this week',
      icon: <Sparkles className="h-6 w-6 text-purple-300" />,
      gradient: 'bg-gradient-to-br from-purple-500/30 to-pink-600/30 border border-purple-400/40'
    }
  ];

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Executive Overview</h2>
        <p className="text-gray-300">Real-time AI performance and business metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            subtitle={metric.subtitle}
            icon={metric.icon}
            gradient={metric.gradient}
          />
        ))}
      </div>
    </section>
  );
};