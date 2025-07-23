
export interface AIModel {
  id: string;
  name: string;
  version: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
  pricing: {
    input: number;
    output: number;
  };
  recommended?: boolean;
}