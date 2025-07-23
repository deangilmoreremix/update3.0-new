
export interface AgentGoalMapping {
  goalId: string;
  agents: {
    primary: string;
    secondary: string[];
  };
  executionOrder: string[];
  dependencies: Record<string, string[]>;
}