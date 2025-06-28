import { LucideIcon } from 'lucide-react';

export interface Goal {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  agentsRequired: string[];
  toolsNeeded: string[];
  estimatedSetupTime: string;
  businessImpact: string;
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  realWorldExample: string;
  successMetrics: string[];
  prerequisite: string[];
  roi: string;
}

export interface GoalCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  totalGoals: number;
}

export interface GoalProgress {
  goalId: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  progress: number;
  steps: ExecutionStep[];
  startTime: Date;
  endTime?: Date;
  results?: any;
}

export interface ExecutionStep {
  id: string;
  name: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  progress: number;
  agent: string;
  duration?: number;
  result?: any;
}

export interface AgentGoalMapping {
  goalId: string;
  agents: {
    primary: string;
    secondary: string[];
  };
  executionOrder: string[];
  dependencies: Record<string, string[]>;
}