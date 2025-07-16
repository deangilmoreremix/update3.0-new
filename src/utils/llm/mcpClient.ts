// MCP Client - Model Context Protocol integration for AI function calling

export interface MCPFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPCallRequest {
  functionName: string;
  parameters: Record<string, any>;
  model?: 'gemini' | 'openai';
  temperature?: number;
}

export interface MCPCallResponse {
  success: boolean;
  result?: unknown;
  error?: string;
  executionTime?: number;
  modelUsed?: string;
}

// Available MCP functions for AI Goals system
export const AVAILABLE_MCP_FUNCTIONS: MCPFunction[] = [
  {
    name: 'analyzeLeadScore',
    description: 'Analyze and score leads based on CRM data and behavioral patterns',
    parameters: {
      type: 'object',
      properties: {
        contactId: { type: 'string', description: 'Contact ID from CRM' },
        includeEnrichment: { type: 'boolean', description: 'Whether to include data enrichment' }
      },
      required: ['contactId']
    }
  },
  {
    name: 'generatePersonalizedEmail',
    description: 'Generate highly personalized email content based on contact profile',
    parameters: {
      type: 'object',
      properties: {
        contactId: { type: 'string', description: 'Target contact ID' },
        campaignType: { type: 'string', enum: ['cold_outreach', 'follow_up', 'nurture', 'reengagement'] },
        tone: { type: 'string', enum: ['professional', 'casual', 'friendly', 'urgent'] },
        includeOffers: { type: 'boolean', description: 'Whether to include promotional offers' }
      },
      required: ['contactId', 'campaignType']
    }
  },
  {
    name: 'optimizeSalesSequence',
    description: 'Optimize multi-touch sales sequence based on performance data',
    parameters: {
      type: 'object',
      properties: {
        sequenceId: { type: 'string', description: 'Existing sequence ID to optimize' },
        targetAudience: { type: 'string', description: 'Target audience segment' },
        performanceMetrics: { type: 'object', description: 'Current performance data' }
      },
      required: ['sequenceId']
    }
  },
  {
    name: 'analyzeCustomerHealth',
    description: 'Analyze customer health and churn risk prediction',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Customer ID for analysis' },
        timeframe: { type: 'string', enum: ['30d', '60d', '90d', '180d'], description: 'Analysis timeframe' },
        includeRecommendations: { type: 'boolean', description: 'Include intervention recommendations' }
      },
      required: ['customerId']
    }
  },
  {
    name: 'generateProposal',
    description: 'Generate detailed business proposal based on client requirements',
    parameters: {
      type: 'object',
      properties: {
        clientId: { type: 'string', description: 'Client ID from CRM' },
        requirements: { type: 'array', items: { type: 'string' }, description: 'Client requirements' },
        budget: { type: 'number', description: 'Client budget range' },
        timeline: { type: 'string', description: 'Project timeline' },
        includeTemplates: { type: 'boolean', description: 'Use proposal templates' }
      },
      required: ['clientId', 'requirements']
    }
  },
  {
    name: 'predictDealClosure',
    description: 'Predict deal closure probability and optimal closing strategies',
    parameters: {
      type: 'object',
      properties: {
        dealId: { type: 'string', description: 'Deal ID from CRM' },
        includeCompetitorAnalysis: { type: 'boolean', description: 'Include competitor analysis' },
        suggestActions: { type: 'boolean', description: 'Suggest next best actions' }
      },
      required: ['dealId']
    }
  }
];

export class MCPClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = '/api/mcp', apiKey: string = 'demo') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async callFunction(request: MCPCallRequest): Promise<MCPCallResponse> {
    const startTime = Date.now();
    
    try {
      // Call the real MCP API endpoint
      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`MCP call failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        result: result.data || result.result,
        executionTime: Date.now() - startTime,
        modelUsed: request.model || 'gemini'
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'MCP function call failed',
        executionTime: Date.now() - startTime
      };
    }
  }



  getAvailableFunctions(): MCPFunction[] {
    return AVAILABLE_MCP_FUNCTIONS;
  }

  validateFunctionCall(functionName: string, parameters: Record<string, any>): { valid: boolean; errors?: string[] } {
    const func = AVAILABLE_MCP_FUNCTIONS.find(f => f.name === functionName);
    
    if (!func) {
      return { valid: false, errors: [`Function ${functionName} not found`] };
    }

    const errors: string[] = [];
    
    // Check required parameters
    if (func.parameters.required) {
      for (const requiredParam of func.parameters.required) {
        if (!(requiredParam in parameters)) {
          errors.push(`Missing required parameter: ${requiredParam}`);
        }
      }
    }

    // Basic type validation could be added here
    
    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
  }
}

// Export singleton client instance
export const mcpClient = new MCPClient();

// Convenience function for making MCP calls
export async function callMCP(functionName: string, parameters: Record<string, any>, options?: {
  model?: 'gemini' | 'openai';
  temperature?: number;
}): Promise<MCPCallResponse> {
  return mcpClient.callFunction({
    functionName,
    parameters,
    model: options?.model || 'gemini',
    temperature: options?.temperature || 0.3
  });
}