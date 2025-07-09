import { MailService } from '@sendgrid/mail';
import { storage } from '../storage';

const mailService = new MailService();

// Only initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  category: 'password' | 'onboarding' | 'general';
  variables: string[];
}

export interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  triggerType: 'manual' | 'signup' | 'password_reset' | 'schedule';
  status: 'active' | 'paused' | 'completed';
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  createdAt: Date;
  scheduledAt?: Date;
}

export interface EmailJob {
  id: string;
  campaignId: string;
  recipientEmail: string;
  templateId: string;
  variables: Record<string, string>;
  status: 'pending' | 'sent' | 'failed' | 'delivered' | 'opened' | 'clicked';
  scheduledAt: Date;
  sentAt?: Date;
  errorMessage?: string;
}

class EmailCampaignService {
  private emailTemplates: Map<string, EmailTemplate> = new Map();
  private campaigns: Map<string, EmailCampaign> = new Map();
  private emailJobs: Map<string, EmailJob> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates() {
    const templates: EmailTemplate[] = [
      {
        id: 'password-reset',
        name: 'Password Reset',
        subject: 'Reset Your Password - {{companyName}}',
        category: 'password',
        variables: ['firstName', 'resetLink', 'companyName', 'expiryTime'],
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
              .security-note { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
                <p>We received a request to reset your password</p>
              </div>
              <div class="content">
                <p>Hello {{firstName}},</p>
                <p>You recently requested to reset your password for your {{companyName}} account. Click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                  <a href="{{resetLink}}" class="button">Reset Password</a>
                </div>
                
                <div class="security-note">
                  <h3>🔒 Security Information</h3>
                  <ul>
                    <li>This link will expire in {{expiryTime}}</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>For security, this link can only be used once</li>
                  </ul>
                </div>
                
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="color: #667eea; word-break: break-all;">{{resetLink}}</p>
                
                <p>Need help? Contact our support team anytime.</p>
                
                <p>Best regards,<br>The {{companyName}} Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 {{companyName}}. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          Password Reset Request
          
          Hello {{firstName}},
          
          You recently requested to reset your password for your {{companyName}} account. 
          
          Click this link to reset your password: {{resetLink}}
          
          Security Information:
          - This link will expire in {{expiryTime}}
          - If you didn't request this reset, please ignore this email
          - For security, this link can only be used once
          
          Need help? Contact our support team anytime.
          
          Best regards,
          The {{companyName}} Team
        `
      },
      {
        id: 'welcome-onboarding',
        name: 'Welcome & Onboarding',
        subject: 'Welcome to {{companyName}} - Let\'s Get Started! 🚀',
        category: 'onboarding',
        variables: ['firstName', 'companyName', 'dashboardLink', 'supportEmail'],
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to {{companyName}}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 40px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
              .feature-card { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
              .next-steps { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to {{companyName}}!</h1>
                <p>You're now part of our amazing community</p>
              </div>
              <div class="content">
                <p>Hello {{firstName}},</p>
                <p>Welcome to {{companyName}}! We're thrilled to have you on board. Your account has been successfully created and you're ready to explore all the powerful features we have to offer.</p>
                
                <div style="text-align: center;">
                  <a href="{{dashboardLink}}" class="button">Access Your Dashboard</a>
                </div>
                
                <div class="next-steps">
                  <h3>📋 Next Steps</h3>
                  <ol>
                    <li><strong>Complete your profile</strong> - Add your details and preferences</li>
                    <li><strong>Explore the dashboard</strong> - Familiarize yourself with the interface</li>
                    <li><strong>Set up your first project</strong> - Start using our tools</li>
                    <li><strong>Join our community</strong> - Connect with other users</li>
                  </ol>
                </div>
                
                <div class="feature-grid">
                  <div class="feature-card">
                    <h4>🚀 AI-Powered Tools</h4>
                    <p>Access 29+ AI tools to boost your productivity</p>
                  </div>
                  <div class="feature-card">
                    <h4>📊 Analytics</h4>
                    <p>Track your progress with detailed insights</p>
                  </div>
                  <div class="feature-card">
                    <h4>🔧 Automation</h4>
                    <p>Automate repetitive tasks and save time</p>
                  </div>
                </div>
                
                <p><strong>Need help getting started?</strong> Our support team is here to help! Reply to this email or contact us at {{supportEmail}}.</p>
                
                <p>We can't wait to see what you'll accomplish with {{companyName}}!</p>
                
                <p>Best regards,<br>The {{companyName}} Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 {{companyName}}. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          Welcome to {{companyName}}!
          
          Hello {{firstName}},
          
          Welcome to {{companyName}}! We're thrilled to have you on board. Your account has been successfully created and you're ready to explore all the powerful features we have to offer.
          
          Access Your Dashboard: {{dashboardLink}}
          
          Next Steps:
          1. Complete your profile - Add your details and preferences
          2. Explore the dashboard - Familiarize yourself with the interface
          3. Set up your first project - Start using our tools
          4. Join our community - Connect with other users
          
          Key Features:
          - AI-Powered Tools: Access 29+ AI tools to boost your productivity
          - Analytics: Track your progress with detailed insights
          - Automation: Automate repetitive tasks and save time
          
          Need help getting started? Our support team is here to help! Reply to this email or contact us at {{supportEmail}}.
          
          We can't wait to see what you'll accomplish with {{companyName}}!
          
          Best regards,
          The {{companyName}} Team
        `
      },
      {
        id: 'onboarding-day-3',
        name: 'Day 3 - Feature Discovery',
        subject: 'Discover Your New Favorite Features - {{companyName}}',
        category: 'onboarding',
        variables: ['firstName', 'companyName', 'featuresLink', 'supportEmail'],
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Feature Discovery</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .feature-highlight { background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
              .tips-box { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔍 Discover Amazing Features</h1>
                <p>Let's explore what makes {{companyName}} special</p>
              </div>
              <div class="content">
                <p>Hi {{firstName}},</p>
                <p>It's been 3 days since you joined {{companyName}}, and we wanted to highlight some features that could transform your workflow:</p>
                
                <div class="feature-highlight">
                  <h3>⚡ AI-Powered Automation</h3>
                  <p>Save hours every week with our smart automation tools. Set up workflows that handle repetitive tasks automatically.</p>
                </div>
                
                <div class="feature-highlight">
                  <h3>📈 Advanced Analytics</h3>
                  <p>Get deep insights into your data with our powerful analytics dashboard. Make data-driven decisions with confidence.</p>
                </div>
                
                <div class="feature-highlight">
                  <h3>🤖 Smart AI Assistant</h3>
                  <p>Our AI assistant can help you with everything from writing emails to analyzing complex data patterns.</p>
                </div>
                
                <div style="text-align: center;">
                  <a href="{{featuresLink}}" class="button">Explore All Features</a>
                </div>
                
                <div class="tips-box">
                  <h3>💡 Pro Tips</h3>
                  <ul>
                    <li>Use keyboard shortcuts to navigate faster</li>
                    <li>Customize your dashboard for your workflow</li>
                    <li>Set up notifications for important updates</li>
                    <li>Connect your favorite tools via integrations</li>
                  </ul>
                </div>
                
                <p>Questions about any features? Just reply to this email - we're here to help!</p>
                
                <p>Happy exploring!<br>The {{companyName}} Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 {{companyName}}. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          Discover Amazing Features
          
          Hi {{firstName}},
          
          It's been 3 days since you joined {{companyName}}, and we wanted to highlight some features that could transform your workflow:
          
          ⚡ AI-Powered Automation
          Save hours every week with our smart automation tools. Set up workflows that handle repetitive tasks automatically.
          
          📈 Advanced Analytics
          Get deep insights into your data with our powerful analytics dashboard. Make data-driven decisions with confidence.
          
          🤖 Smart AI Assistant
          Our AI assistant can help you with everything from writing emails to analyzing complex data patterns.
          
          Explore All Features: {{featuresLink}}
          
          Pro Tips:
          - Use keyboard shortcuts to navigate faster
          - Customize your dashboard for your workflow
          - Set up notifications for important updates
          - Connect your favorite tools via integrations
          
          Questions about any features? Just reply to this email - we're here to help!
          
          Happy exploring!
          The {{companyName}} Team
        `
      },
      {
        id: 'onboarding-week-1',
        name: 'Week 1 - Check-in & Tips',
        subject: 'How\'s Your First Week Going? - {{companyName}}',
        category: 'onboarding',
        variables: ['firstName', 'companyName', 'helpLink', 'communityLink'],
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Week 1 Check-in</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
              .success-metrics { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
              .community-box { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎯 Week 1 Check-in</h1>
                <p>How's your {{companyName}} journey going?</p>
              </div>
              <div class="content">
                <p>Hello {{firstName}},</p>
                <p>It's been a week since you joined {{companyName}}! We hope you're settling in well and discovering the power of our platform.</p>
                
                <div class="success-metrics">
                  <h3>🏆 Success Metrics</h3>
                  <p>Here's what most successful users accomplish in their first week:</p>
                  <ul>
                    <li>✅ Complete profile setup</li>
                    <li>✅ Create first project or workflow</li>
                    <li>✅ Try at least 3 AI tools</li>
                    <li>✅ Set up integrations with existing tools</li>
                    <li>✅ Customize dashboard preferences</li>
                  </ul>
                </div>
                
                <p><strong>Need a hand with anything?</strong> Our success team is standing by to help you get the most out of {{companyName}}.</p>
                
                <div style="text-align: center;">
                  <a href="{{helpLink}}" class="button">Get Help</a>
                  <a href="{{communityLink}}" class="button">Join Community</a>
                </div>
                
                <div class="community-box">
                  <h3>🤝 Join Our Community</h3>
                  <p>Connect with other {{companyName}} users, share tips, and get inspiration from success stories. Our community is full of helpful people just like you!</p>
                </div>
                
                <p><strong>What's next?</strong> Keep exploring, and don't hesitate to reach out if you need anything. We're here to support your success!</p>
                
                <p>Cheering you on,<br>The {{companyName}} Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 {{companyName}}. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          Week 1 Check-in
          
          Hello {{firstName}},
          
          It's been a week since you joined {{companyName}}! We hope you're settling in well and discovering the power of our platform.
          
          Success Metrics - Here's what most successful users accomplish in their first week:
          ✅ Complete profile setup
          ✅ Create first project or workflow
          ✅ Try at least 3 AI tools
          ✅ Set up integrations with existing tools
          ✅ Customize dashboard preferences
          
          Need a hand with anything? Our success team is standing by to help you get the most out of {{companyName}}.
          
          Get Help: {{helpLink}}
          Join Community: {{communityLink}}
          
          Join Our Community:
          Connect with other {{companyName}} users, share tips, and get inspiration from success stories. Our community is full of helpful people just like you!
          
          What's next? Keep exploring, and don't hesitate to reach out if you need anything. We're here to support your success!
          
          Cheering you on,
          The {{companyName}} Team
        `
      },
      {
        id: 'password-change-confirmation',
        name: 'Password Change Confirmation',
        subject: 'Password Successfully Changed - {{companyName}}',
        category: 'password',
        variables: ['firstName', 'companyName', 'changeTime', 'supportEmail'],
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Changed</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
              .content { background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .security-note { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
              .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Password Changed Successfully</h1>
                <p>Your account security has been updated</p>
              </div>
              <div class="content">
                <p>Hello {{firstName}},</p>
                <p>This is to confirm that your password for {{companyName}} was successfully changed on {{changeTime}}.</p>
                
                <div class="security-note">
                  <h3>⚠️ Security Notice</h3>
                  <p><strong>If you didn't make this change:</strong></p>
                  <ul>
                    <li>Contact our support team immediately at {{supportEmail}}</li>
                    <li>Your account may have been compromised</li>
                    <li>We'll help you secure your account right away</li>
                  </ul>
                </div>
                
                <p><strong>Security Tips:</strong></p>
                <ul>
                  <li>Use a unique, strong password for your {{companyName}} account</li>
                  <li>Enable two-factor authentication for extra security</li>
                  <li>Never share your password with anyone</li>
                  <li>Log out of shared or public devices</li>
                </ul>
                
                <p>Thank you for keeping your {{companyName}} account secure!</p>
                
                <p>Best regards,<br>The {{companyName}} Security Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 {{companyName}}. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        textContent: `
          Password Changed Successfully
          
          Hello {{firstName}},
          
          This is to confirm that your password for {{companyName}} was successfully changed on {{changeTime}}.
          
          Security Notice:
          If you didn't make this change:
          - Contact our support team immediately at {{supportEmail}}
          - Your account may have been compromised
          - We'll help you secure your account right away
          
          Security Tips:
          - Use a unique, strong password for your {{companyName}} account
          - Enable two-factor authentication for extra security
          - Never share your password with anyone
          - Log out of shared or public devices
          
          Thank you for keeping your {{companyName}} account secure!
          
          Best regards,
          The {{companyName}} Security Team
        `
      }
    ];

    templates.forEach(template => {
      this.emailTemplates.set(template.id, template);
    });
  }

  // Template management
  getTemplate(templateId: string): EmailTemplate | undefined {
    return this.emailTemplates.get(templateId);
  }

  getTemplatesByCategory(category: string): EmailTemplate[] {
    return Array.from(this.emailTemplates.values()).filter(template => template.category === category);
  }

  // Variable replacement
  private replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  // Email sending
  async sendEmail(
    to: string,
    templateId: string,
    variables: Record<string, string>,
    fromEmail: string = 'noreply@smartcrm.com',
    fromName: string = 'Smart CRM'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Check if SendGrid API key is available
      if (!process.env.SENDGRID_API_KEY) {
        console.log(`[DEMO MODE] Would send email to ${to} using template ${templateId}`);
        return {
          success: true,
          messageId: `demo_${Date.now()}`
        };
      }

      const template = this.getTemplate(templateId);
      if (!template) {
        return { success: false, error: 'Template not found' };
      }

      const subject = this.replaceVariables(template.subject, variables);
      const html = this.replaceVariables(template.htmlContent, variables);
      const text = this.replaceVariables(template.textContent, variables);

      const msg = {
        to,
        from: {
          email: fromEmail,
          name: fromName
        },
        subject,
        html,
        text
      };

      const [response] = await mailService.send(msg);
      
      return {
        success: true,
        messageId: response.headers['x-message-id'] as string
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Password reset email
  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    resetToken: string,
    baseUrl: string = 'https://smartcrm.com'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    
    return this.sendEmail(email, 'password-reset', {
      firstName,
      resetLink,
      companyName: 'Smart CRM',
      expiryTime: '24 hours'
    });
  }

  // Password change confirmation
  async sendPasswordChangeConfirmation(
    email: string,
    firstName: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const changeTime = new Date().toLocaleString();
    
    return this.sendEmail(email, 'password-change-confirmation', {
      firstName,
      companyName: 'Smart CRM',
      changeTime,
      supportEmail: 'support@smartcrm.com'
    });
  }

  // Onboarding sequence
  async sendWelcomeEmail(
    email: string,
    firstName: string,
    dashboardLink: string = 'https://smartcrm.com/dashboard'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendEmail(email, 'welcome-onboarding', {
      firstName,
      companyName: 'Smart CRM',
      dashboardLink,
      supportEmail: 'support@smartcrm.com'
    });
  }

  async sendOnboardingFollowUp(
    email: string,
    firstName: string,
    dayNumber: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    let templateId: string;
    let variables: Record<string, string>;

    switch (dayNumber) {
      case 3:
        templateId = 'onboarding-day-3';
        variables = {
          firstName,
          companyName: 'Smart CRM',
          featuresLink: 'https://smartcrm.com/features',
          supportEmail: 'support@smartcrm.com'
        };
        break;
      case 7:
        templateId = 'onboarding-week-1';
        variables = {
          firstName,
          companyName: 'Smart CRM',
          helpLink: 'https://smartcrm.com/help',
          communityLink: 'https://smartcrm.com/community'
        };
        break;
      default:
        return { success: false, error: 'Invalid day number for onboarding sequence' };
    }

    return this.sendEmail(email, templateId, variables);
  }

  // Campaign management
  async createCampaign(
    name: string,
    description: string,
    templateId: string,
    triggerType: 'manual' | 'signup' | 'password_reset' | 'schedule',
    scheduledAt?: Date
  ): Promise<{ success: boolean; campaignId?: string; error?: string }> {
    try {
      const campaign: EmailCampaign = {
        id: `campaign_${Date.now()}`,
        name,
        description,
        templateId,
        triggerType,
        status: 'active',
        recipientCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        openedCount: 0,
        clickedCount: 0,
        createdAt: new Date(),
        scheduledAt
      };

      this.campaigns.set(campaign.id, campaign);
      
      return {
        success: true,
        campaignId: campaign.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getCampaigns(): EmailCampaign[] {
    return Array.from(this.campaigns.values());
  }

  getCampaign(campaignId: string): EmailCampaign | undefined {
    return this.campaigns.get(campaignId);
  }

  // Batch email sending
  async sendBatchEmails(
    recipients: Array<{
      email: string;
      variables: Record<string, string>;
    }>,
    templateId: string,
    campaignId?: string
  ): Promise<{
    success: boolean;
    results: Array<{
      email: string;
      success: boolean;
      messageId?: string;
      error?: string;
    }>;
  }> {
    const results = [];

    for (const recipient of recipients) {
      const result = await this.sendEmail(recipient.email, templateId, recipient.variables);
      results.push({
        email: recipient.email,
        ...result
      });

      // Update campaign stats if provided
      if (campaignId && this.campaigns.has(campaignId)) {
        const campaign = this.campaigns.get(campaignId)!;
        campaign.recipientCount++;
        if (result.success) {
          campaign.sentCount++;
        }
      }
    }

    return {
      success: true,
      results
    };
  }
}

export const emailCampaignService = new EmailCampaignService();