export interface Goal {
  id: string;
  title: string;
  description: string;
  businessImpact: string;
  priority: 'High' | 'Medium' | 'Low';
  complexity: 'Simple' | 'Intermediate' | 'Advanced';
  category: string;
  agentsRequired: string[];
  toolsNeeded: string[];
  estimatedSetupTime: string;
  roi: string;
  realWorldExample: string;
  prerequisite: string[];
  successMetrics: string[];
}