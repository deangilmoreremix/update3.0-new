// Composio Service for AI Goals Execution
// This service handles integrations with external tools and APIs

interface ComposioConfig {
  apiKey?: string;
  baseUrl: string;
  timeout: number;
}

interface ComposioAction {
  tool: string;
  action: string;
  parameters: Record<string, any>;
}

interface ComposioResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

class ComposioClient {
  private config: ComposioConfig;
  private isDemo: boolean;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_COMPOSIO_API_KEY,
      baseUrl: 'https://api.composio.dev/v1',
      timeout: 30000
    };
    this.isDemo = !this.config.apiKey;
  }

  async executeAction(action: ComposioAction): Promise<ComposioResult> {
    const startTime = Date.now();
    
    if (this.isDemo) {
      return this.simulateAction(action, startTime);
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(action),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`Composio API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      };
    }
  }

  private async simulateAction(action: ComposioAction, startTime: number): Promise<ComposioResult> {
    // Simulate realistic API delays
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, delay));

    // Generate realistic demo results based on tool type
    const demoResults = {
      'linkedin': {
        success: true,
        data: {
          message: 'LinkedIn outreach message sent successfully',
          connectionRequests: 5,
          responses: 2,
          profileViews: 12
        }
      },
      'email': {
        success: true,
        data: {
          emailsSent: 10,
          openRate: 0.45,
          clickRate: 0.12,
          responses: 3
        }
      },
      'calendar': {
        success: true,
        data: {
          meetingsScheduled: 3,
          availabilityChecked: true,
          remindersSet: 3
        }
      },
      'crm': {
        success: true,
        data: {
          recordsUpdated: 15,
          leadsScored: 25,
          activitiesLogged: 8
        }
      },
      'database': {
        success: true,
        data: {
          recordsProcessed: 150,
          dataEnriched: 45,
          duplicatesRemoved: 3
        }
      }
    };

    const toolKey = action.tool.toLowerCase() as keyof typeof demoResults;
    const result = demoResults[toolKey] || {
      success: true,
      data: { message: `${action.tool} action completed successfully`, status: 'executed' }
    };

    return {
      ...result,
      executionTime: Date.now() - startTime
    };
  }

  // LinkedIn specific actions
  async sendLinkedInMessage(targetProfile: string, message: string): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'linkedin',
      action: 'send_message',
      parameters: { targetProfile, message }
    });
  }

  async sendConnectionRequest(targetProfile: string, personalNote?: string): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'linkedin',
      action: 'send_connection_request',
      parameters: { targetProfile, personalNote }
    });
  }

  // Email actions
  async sendEmail(to: string, subject: string, body: string, template?: string): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'email',
      action: 'send',
      parameters: { to, subject, body, template }
    });
  }

  async scheduleEmail(to: string, subject: string, body: string, sendAt: Date): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'email',
      action: 'schedule',
      parameters: { to, subject, body, sendAt: sendAt.toISOString() }
    });
  }

  // Calendar actions
  async scheduleMeeting(attendees: string[], title: string, startTime: Date, duration: number): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'calendar',
      action: 'schedule_meeting',
      parameters: { attendees, title, startTime: startTime.toISOString(), duration }
    });
  }

  // CRM actions
  async updateContactScore(contactId: string, score: number, reasoning: string): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'crm',
      action: 'update_lead_score',
      parameters: { contactId, score, reasoning }
    });
  }

  async logActivity(contactId: string, activityType: string, description: string): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'crm',
      action: 'log_activity',
      parameters: { contactId, activityType, description }
    });
  }

  async createTask(assignedTo: string, title: string, description: string, dueDate: Date): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'crm',
      action: 'create_task',
      parameters: { assignedTo, title, description, dueDate: dueDate.toISOString() }
    });
  }

  // Database actions
  async enrichContactData(contactId: string, dataSource: string): Promise<ComposioResult> {
    return this.executeAction({
      tool: 'database',
      action: 'enrich_contact',
      parameters: { contactId, dataSource }
    });
  }

  getDemoMode(): boolean {
    return this.isDemo;
  }

  getAvailableTools(): string[] {
    return ['linkedin', 'email', 'calendar', 'crm', 'database', 'analytics', 'content'];
  }
}

export const composioClient = new ComposioClient();

// Helper functions for specific use cases
export const executeGoalWithComposio = async (
  goal: any, 
  contextData: any,
  progressCallback?: (progress: string) => void
): Promise<ComposioResult> => {
  const tools = goal.toolsNeeded || [];
  const results: any[] = [];

  for (const tool of tools) {
    if (progressCallback) {
      progressCallback(`Executing ${tool} integration...`);
    }

    let result: ComposioResult;

    switch (tool.toLowerCase()) {
      case 'linkedin':
        result = await composioClient.sendLinkedInMessage(
          contextData?.linkedinProfile || 'target-profile',
          `Personalized message for ${contextData?.name || 'prospect'}`
        );
        break;
      
      case 'email':
        result = await composioClient.sendEmail(
          contextData?.email || 'prospect@example.com',
          `${goal.title} - Follow Up`,
          `Personalized email content based on ${goal.title}`
        );
        break;
      
      case 'crm':
        result = await composioClient.updateContactScore(
          contextData?.id || 'contact-id',
          85,
          `Updated based on ${goal.title} execution`
        );
        break;
      
      default:
        result = await composioClient.executeAction({
          tool: tool.toLowerCase(),
          action: 'execute',
          parameters: { goal: goal.title, context: contextData }
        });
    }

    results.push(result);
  }

  return {
    success: results.every(r => r.success),
    data: results,
    executionTime: results.reduce((sum, r) => sum + r.executionTime, 0)
  };
};