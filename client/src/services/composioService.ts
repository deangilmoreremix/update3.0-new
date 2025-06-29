// Composio Service - Mock implementation for client-side usage
// Note: Real Composio integration would happen on the server side

export interface ComposioConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface ComposioExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

class ComposioService {
  private config: ComposioConfig;
  private isConfigured: boolean = false;

  constructor(config: ComposioConfig = {}) {
    this.config = config;
    this.isConfigured = !!config.apiKey;
  }

  // Check if Composio is properly configured
  isReady(): boolean {
    return this.isConfigured;
  }

  // LinkedIn Integration (Real API)
  async sendLinkedInMessage(recipientId: string, message: string): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/linkedin/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientId, message }),
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'LinkedIn message sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'LinkedIn message failed'
      };
    }
  }

  // WhatsApp Integration (Real API)
  async sendWhatsAppMessage(phoneNumber: string, message: string, templateName?: string): Promise<ComposioExecutionResult> {
    try {
      const response = await fetch('/api/composio/whatsapp/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message, templateName }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.data,
        message: result.message || 'WhatsApp message sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'WhatsApp message failed'
      };
    }
  }

  // Email Integration (Mock)
  async sendEmail(to: string, subject: string, content: string, templateId?: string): Promise<ComposioExecutionResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Composio client not initialized. Please set COMPOSIO_API_KEY environment variable.'
      };
    }

    // Mock implementation for demo
    await new Promise(resolve => setTimeout(resolve, 1200));

    return {
      success: true,
      data: { to, emailId: `email_${Date.now()}`, templateId },
      message: 'Email sent successfully (demo mode)'
    };
  }

  // Calendar Integration (Mock)
  async createCalendarEvent(
    title: string, 
    description: string, 
    startTime: string, 
    endTime: string, 
    attendees?: string[], 
    meetingLink?: string
  ): Promise<ComposioExecutionResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Composio client not initialized. Please set COMPOSIO_API_KEY environment variable.'
      };
    }

    // Mock implementation for demo
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      data: { 
        eventId: `event_${Date.now()}`, 
        title, 
        startTime, 
        endTime, 
        attendees: attendees?.length || 0,
        meetingLink 
      },
      message: 'Calendar event created successfully (demo mode)'
    };
  }

  // Social Media Integration - X (Twitter) (Mock)
  async postToX(content: string, scheduledTime?: string): Promise<ComposioExecutionResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Composio client not initialized. Please set COMPOSIO_API_KEY environment variable.'
      };
    }

    // Mock implementation for demo
    await new Promise(resolve => setTimeout(resolve, 900));

    return {
      success: true,
      data: { postId: `tweet_${Date.now()}`, content, scheduledTime },
      message: 'X post published successfully (demo mode)'
    };
  }

  // Get available tools/apps (Mock)
  async getAvailableApps(): Promise<ComposioExecutionResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Composio client not initialized. Please set COMPOSIO_API_KEY environment variable.'
      };
    }

    // Mock available apps
    const mockApps = [
      { name: 'linkedin', status: 'connected' },
      { name: 'gmail', status: 'connected' },
      { name: 'google_calendar', status: 'connected' },
      { name: 'whatsapp_business', status: 'available' },
      { name: 'x', status: 'available' },
      { name: 'slack', status: 'connected' },
      { name: 'hubspot', status: 'available' }
    ];

    return {
      success: true,
      data: mockApps,
      message: 'Available apps retrieved successfully (demo mode)'
    };
  }

  // Get entity connections (Mock)
  async getConnections(): Promise<ComposioExecutionResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Composio client not initialized. Please set COMPOSIO_API_KEY environment variable.'
      };
    }

    // Mock connections
    const mockConnections = [
      { app: 'linkedin', status: 'active', connectedAt: new Date().toISOString() },
      { app: 'gmail', status: 'active', connectedAt: new Date().toISOString() },
      { app: 'google_calendar', status: 'active', connectedAt: new Date().toISOString() }
    ];

    return {
      success: true,
      data: mockConnections,
      message: 'Connections retrieved successfully (demo mode)'
    };
  }

  // Execute generic action (Mock)
  async executeAction(appName: string, actionName: string, params: any): Promise<ComposioExecutionResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Composio client not initialized. Please set COMPOSIO_API_KEY environment variable.'
      };
    }

    // Mock execution
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    return {
      success: true,
      data: { 
        app: appName, 
        action: actionName, 
        params, 
        executionId: `exec_${Date.now()}`,
        timestamp: new Date().toISOString()
      },
      message: `${appName} ${actionName} executed successfully (demo mode)`
    };
  }
}

// Export singleton instance with demo configuration
export const composioService = new ComposioService({
  apiKey: 'demo_mode',
  baseUrl: 'https://api.composio.dev'
});

// Export the class for custom instances
export { ComposioService };