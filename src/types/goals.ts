
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  requiredData: string[];
  expectedOutputs: string[];
  dependencies?: string[];
  tags?: string[];
  icon?: string;
  color?: string;
  isActive?: boolean;
  priority?: 'low' | 'medium' | 'high';
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