import { emailCampaignService } from './emailCampaignService';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

interface ScheduledEmail {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  templateId: string;
  scheduledAt: Date;
  variables: Record<string, string>;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
}

class EmailScheduler {
  private scheduledEmails: Map<string, ScheduledEmail> = new Map();
  private isRunning = false;

  constructor() {
    this.startScheduler();
  }

  private startScheduler() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    // Check for scheduled emails every 5 minutes
    setInterval(() => {
      this.processScheduledEmails();
    }, 5 * 60 * 1000);
  }

  private async processScheduledEmails() {
    const now = new Date();
    
    for (const [id, scheduledEmail] of this.scheduledEmails) {
      if (scheduledEmail.status === 'pending' && scheduledEmail.scheduledAt <= now) {
        try {
          const result = await emailCampaignService.sendEmail(
            scheduledEmail.email,
            scheduledEmail.templateId,
            scheduledEmail.variables
          );
          
          if (result.success) {
            scheduledEmail.status = 'sent';
            console.log(`Scheduled email sent to ${scheduledEmail.email}`);
          } else {
            scheduledEmail.status = 'failed';
            console.error(`Failed to send scheduled email to ${scheduledEmail.email}:`, result.error);
          }
        } catch (error) {
          scheduledEmail.status = 'failed';
          console.error(`Error sending scheduled email to ${scheduledEmail.email}:`, error);
        }
      }
    }
  }

  scheduleEmail(
    userId: string,
    email: string,
    firstName: string,
    templateId: string,
    scheduledAt: Date,
    variables: Record<string, string> = {}
  ): string {
    const id = `scheduled_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const scheduledEmail: ScheduledEmail = {
      id,
      userId,
      email,
      firstName,
      templateId,
      scheduledAt,
      variables: {
        firstName,
        companyName: 'Smart CRM',
        supportEmail: 'support@smartcrm.com',
        ...variables
      },
      status: 'pending',
      createdAt: new Date()
    };

    this.scheduledEmails.set(id, scheduledEmail);
    return id;
  }

  cancelScheduledEmail(id: string): boolean {
    const scheduledEmail = this.scheduledEmails.get(id);
    if (scheduledEmail && scheduledEmail.status === 'pending') {
      this.scheduledEmails.delete(id);
      return true;
    }
    return false;
  }

  getScheduledEmails(userId?: string): ScheduledEmail[] {
    const emails = Array.from(this.scheduledEmails.values());
    return userId ? emails.filter(email => email.userId === userId) : emails;
  }

  // Schedule onboarding sequence for new users
  async scheduleOnboardingSequence(userId: string, email: string, firstName: string) {
    const baseUrl = process.env.BASE_URL || 'https://smartcrm.com';
    
    // Day 3: Feature Discovery
    const day3 = new Date();
    day3.setDate(day3.getDate() + 3);
    
    this.scheduleEmail(
      userId,
      email,
      firstName,
      'onboarding-day-3',
      day3,
      {
        featuresLink: `${baseUrl}/features`,
        supportEmail: 'support@smartcrm.com'
      }
    );

    // Week 1: Check-in
    const week1 = new Date();
    week1.setDate(week1.getDate() + 7);
    
    this.scheduleEmail(
      userId,
      email,
      firstName,
      'onboarding-week-1',
      week1,
      {
        helpLink: `${baseUrl}/help`,
        communityLink: `${baseUrl}/community`
      }
    );

    console.log(`Onboarding sequence scheduled for ${email}`);
  }

  // Cancel onboarding sequence (if user becomes inactive)
  cancelOnboardingSequence(userId: string) {
    const userEmails = this.getScheduledEmails(userId);
    const cancelledCount = 0;;
    
    for (const email of userEmails) {
      if (email.templateId.includes('onboarding') && email.status === 'pending') {
        this.cancelScheduledEmail(email.id);
        cancelledCount++;
      }
    }
    
    console.log(`Cancelled ${cancelledCount} onboarding emails for user ${userId}`);
  }

  // Schedule password reset follow-up
  schedulePasswordResetFollowUp(email: string, firstName: string, resetToken: string) {
    const followUpTime = new Date();
    followUpTime.setHours(followUpTime.getHours() + 2); // 2 hours later
    
    this.scheduleEmail(
      'system',
      email,
      firstName,
      'password-reset',
      followUpTime,
      {
        resetLink: `${process.env.BASE_URL || 'https://smartcrm.com'}/reset-password?token=${resetToken}`,
        expiryTime: '22 hours' // Updated expiry time
      }
    );
  }

  // Get campaign statistics
  getCampaignStats() {
    const emails = Array.from(this.scheduledEmails.values());
    
    return {
      total: emails.length,
      pending: emails.filter(e => e.status === 'pending').length,
      sent: emails.filter(e => e.status === 'sent').length,
      failed: emails.filter(e => e.status === 'failed').length,
      byTemplate: emails.reduce((acc, email) => {
        acc[email.templateId] = (acc[email.templateId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const emailScheduler = new EmailScheduler();