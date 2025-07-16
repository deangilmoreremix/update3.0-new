// AI Calendar Service with Mock Implementation for Demo
// In production, replace with actual API implementations

interface SchedulingIntent {
  title: string;
  type: 'meeting' | 'call' | 'demo' | 'other';
  duration: number;
  attendees: string[];
  preferredDate?: Date;
  preferredTime?: string;
  urgency: 'low' | 'medium' | 'high';
  description?: string;
}

interface MeetingPrep {
  talkingPoints: string[];
  agenda: string[];
  backgroundInfo: string;
  recommendedDuration: number;
  suggestedFollowUp: string[];
}

interface CalendarInsight {
  busyPeriods: Array<{ start: Date; end: Date; intensity: number }>;
  optimalTimes: Array<{ time: string; score: number; reasoning: string }>;
  conflicts: Array<{ id: string; severity: 'low' | 'medium' | 'high' }>;
  recommendations: string[];
}

export class AICalendarService {
  /**
   * Parse natural language input to extract scheduling intent
   */
  async parseSchedulingIntent(input: string): Promise<SchedulingIntent> {
    try {
      // Mock implementation with intelligent parsing
      return this.createFallbackIntent(input);
    } catch (error) {
      console.error('Error parsing scheduling intent:', error);
      // Return intelligent fallback based on input analysis
      return this.createFallbackIntent(input);
    }
  }

  /**
   * Create fallback intent from natural language analysis
   */
  private createFallbackIntent(input: string): SchedulingIntent {
    const lowerInput = input.toLowerCase();
    
    // Extract meeting type
    let type: 'meeting' | 'call' | 'demo' | 'other' = 'meeting';
    if (lowerInput.includes('call') || lowerInput.includes('phone')) type = 'call';
    if (lowerInput.includes('demo') || lowerInput.includes('demonstration')) type = 'demo';
    if (lowerInput.includes('interview') || lowerInput.includes('review')) type = 'other';

    // Extract duration
    let duration = 30; // default
    const durationMatch = lowerInput.match(/(\d+)\s*(minute|min|hour|hr)/);
    if (durationMatch) {
      const num = parseInt(durationMatch[1]);
      const unit = durationMatch[2];
      duration = unit.startsWith('hour') || unit.startsWith('hr') ? num * 60 : num;
    }

    // Extract urgency
    let urgency: 'low' | 'medium' | 'high' = 'medium';
    if (lowerInput.includes('urgent') || lowerInput.includes('asap') || lowerInput.includes('immediately')) {
      urgency = 'high';
    } else if (lowerInput.includes('whenever') || lowerInput.includes('no rush')) {
      urgency = 'low';
    }

    // Extract attendees (basic email pattern matching)
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const attendees = input.match(emailRegex) || [];

    // Generate title
    let title = 'Meeting';
    if (lowerInput.includes('product demo')) title = 'Product Demo';
    else if (lowerInput.includes('discovery')) title = 'Discovery Call';
    else if (lowerInput.includes('standup')) title = 'Team Standup';
    else if (lowerInput.includes('review')) title = 'Review Meeting';
    else if (lowerInput.includes('planning')) title = 'Planning Session';
    else if (lowerInput.includes('interview')) title = 'Interview';

    return {
      title,
      type,
      duration,
      attendees,
      urgency,
      description: input,
    };
  }

  /**
   * Generate AI-powered meeting preparation suggestions
   */
  async generateMeetingPrep(
    title: string,
    attendees: string[],
    context?: string
  ): Promise<MeetingPrep> {
    // Mock implementation with realistic suggestions
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing

    const meetingType = title.toLowerCase();
    
    if (meetingType.includes('demo')) {
      return {
        talkingPoints: [
          'Highlight key product features and benefits',
          'Address specific client pain points',
          'Showcase ROI and business impact',
          'Prepare for common objections',
          'Present relevant case studies'
        ],
        agenda: [
          'Welcome and introductions (5 min)',
          'Company overview and challenges (10 min)',
          'Product demonstration (20 min)',
          'Q&A session (10 min)',
          'Next steps discussion (5 min)'
        ],
        backgroundInfo: 'Product demonstration meeting focusing on showcasing core features and addressing client-specific requirements.',
        recommendedDuration: 50,
        suggestedFollowUp: [
          'Send demo recording and presentation materials',
          'Schedule technical deep-dive session',
          'Provide pricing proposal',
          'Connect with technical team if needed'
        ]
      };
    } else if (meetingType.includes('discovery')) {
      return {
        talkingPoints: [
          'Understand current challenges and pain points',
          'Identify decision-making process',
          'Explore budget and timeline constraints',
          'Assess technical requirements',
          'Determine success criteria'
        ],
        agenda: [
          'Introductions and rapport building (10 min)',
          'Current state assessment (15 min)',
          'Challenge identification (15 min)',
          'Solution exploration (10 min)',
          'Next steps planning (10 min)'
        ],
        backgroundInfo: 'Discovery call to understand client needs and qualify the opportunity.',
        recommendedDuration: 60,
        suggestedFollowUp: [
          'Send summary of key insights',
          'Prepare customized proposal',
          'Schedule product demonstration',
          'Share relevant case studies'
        ]
      };
    } else {
      return {
        talkingPoints: [
          'Review agenda and objectives',
          'Ensure all stakeholders are aligned',
          'Address any open questions',
          'Discuss action items and next steps'
        ],
        agenda: [
          'Welcome and agenda review (5 min)',
          'Main discussion topics (35 min)',
          'Action items and next steps (10 min)',
          'Scheduling follow-up (5 min)'
        ],
        backgroundInfo: 'General business meeting to discuss project progress and alignment.',
        recommendedDuration: 45,
        suggestedFollowUp: [
          'Send meeting summary',
          'Distribute action items',
          'Schedule follow-up meetings',
          'Share relevant documents'
        ]
      };
    }
  }

  /**
   * Analyze calendar and suggest optimal meeting times
   */
  async suggestOptimalTimes(
    date: Date,
    duration: number,
    attendeeEmails: string[],
    existingAppointments: unknown[]
  ): Promise<Array<{ time: Date; score: number; reasoning: string }>> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800));

    const suggestions = [];
    const baseDate = new Date(date);
    
    // Generate time slots from 9 AM to 5 PM
    for (const hour = 9; hour <= 17; hour += 0.5) {
      const timeSlot = new Date(baseDate);
      timeSlot.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
      
      // Skip if conflicts with existing appointments
      const hasConflict = existingAppointments.some(apt => {
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);
        const slotEnd = new Date(timeSlot.getTime() + duration * 60000);
        
        return (timeSlot >= aptStart && timeSlot < aptEnd) ||
               (slotEnd > aptStart && slotEnd <= aptEnd) ||
               (timeSlot <= aptStart && slotEnd >= aptEnd);
      });

      if (!hasConflict) {
        const score = 80; // Base score;
        let reasoning = 'Available time slot';
        
        // Prefer mid-morning and early afternoon
        if (hour >= 10 && hour <= 11) {
          score += 15;
          reasoning = 'Optimal morning time - high energy and focus';
        } else if (hour >= 14 && hour <= 15) {
          score += 10;
          reasoning = 'Good afternoon time - post-lunch clarity';
        } else if (hour < 9 || hour > 16) {
          score -= 20;
          reasoning = 'Outside standard business hours';
        }
        
        // Avoid lunch time
        if (hour >= 12 && hour <= 13) {
          score -= 15;
          reasoning = 'Lunch time - may conflict with meals';
        }
        
        // Prefer slots that don't split blocks
        const nextHour = hour + duration / 60;
        if (nextHour === Math.floor(nextHour)) {
          score += 5;
          reasoning += ' - clean time boundary';
        }

        suggestions.push({
          time: timeSlot,
          score: Math.max(0, Math.min(100, score)),
          reasoning
        });
      }
    }

    // Sort by score and return top 5
    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  /**
   * Generate meeting options based on scheduling intent
   */
  async generateMeetingOptions(
    intent: SchedulingIntent,
    existingAppointments: unknown[]
  ): Promise<Array<{ time: Date; score: number; reasoning: string; conflicts: string[] }>> {
    try {
      // Mock implementation that generates smart time suggestions
      await new Promise(resolve => setTimeout(resolve, 1000));

      const suggestions = [];
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      // Generate suggestions for next few days
      for (const dayOffset = 1; dayOffset <= 7; dayOffset++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + dayOffset);
        
        // Skip weekends unless urgency is high
        if (intent.urgency !== 'high' && (targetDate.getDay() === 0 || targetDate.getDay() === 6)) {
          continue;
        }
        
        // Generate time slots for this day
        const timeSlots = await this.suggestOptimalTimes(
          targetDate,
          intent.duration,
          intent.attendees,
          existingAppointments
        );
        
        // Add conflicts analysis
        const slotsWithConflicts = timeSlots.map(slot => ({
          ...slot,
          conflicts: this.analyzeConflicts(slot.time, intent.duration, existingAppointments)
        }));
        
        suggestions.push(...slotsWithConflicts);
      }
      
      // Sort by score and return top suggestions
      return suggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
    } catch (error) {
      console.error('Error generating meeting options:', error);
      // Return fallback suggestions
      return this.generateFallbackOptions(intent);
    }
  }

  /**
   * Analyze potential conflicts for a time slot
   */
  private analyzeConflicts(
    startTime: Date,
    duration: number,
    existingAppointments: unknown[]
  ): string[] {
    const conflicts = [];
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    for (const apt of existingAppointments) {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      
      // Check for overlaps
      if ((startTime >= aptStart && startTime < aptEnd) ||
          (endTime > aptStart && endTime <= aptEnd) ||
          (startTime <= aptStart && endTime >= aptEnd)) {
        conflicts.push(`Conflicts with "${apt.title}" (${aptStart.toLocaleTimeString()} - ${aptEnd.toLocaleTimeString()})`);
      }
    }
    
    return conflicts;
  }

  /**
   * Generate fallback options when AI processing fails
   */
  private generateFallbackOptions(intent: SchedulingIntent): Array<{ time: Date; score: number; reasoning: string; conflicts: string[] }> {
    const fallbackOptions = [];
    const today = new Date();
    
    // Generate basic time slots for tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const timeSlots = [
      { hour: 10, minute: 0, score: 85, reasoning: 'Mid-morning slot - high productivity' },
      { hour: 14, minute: 0, score: 80, reasoning: 'Early afternoon - post-lunch clarity' },
      { hour: 11, minute: 0, score: 75, reasoning: 'Late morning - consistent focus' },
      { hour: 15, minute: 30, score: 70, reasoning: 'Mid-afternoon - good availability' },
      { hour: 9, minute: 30, score: 65, reasoning: 'Early morning - fresh start' }
    ];
    
    for (const slot of timeSlots) {
      const timeOption = new Date(tomorrow);
      timeOption.setHours(slot.hour, slot.minute, 0, 0);
      
      fallbackOptions.push({
        time: timeOption,
        score: slot.score,
        reasoning: slot.reasoning,
        conflicts: []
      });
    }
    
    return fallbackOptions;
  }

  /**
   * Analyze calendar for insights and recommendations
   */
  async analyzeCalendar(appointments: unknown[]): Promise<CalendarInsight> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 600));

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    const busyPeriods = appointments
      .filter(apt => new Date(apt.startTime) >= startOfWeek)
      .map(apt => ({
        start: new Date(apt.startTime),
        end: new Date(apt.endTime),
        intensity: apt.priority === 'high' ? 90 : apt.priority === 'medium' ? 60 : 30
      }));

    const optimalTimes = [
      { time: '10:00 AM', score: 95, reasoning: 'Peak productivity window - high energy levels' },
      { time: '2:00 PM', score: 85, reasoning: 'Post-lunch clarity period - good for focused discussions' },
      { time: '9:30 AM', score: 80, reasoning: 'Early morning freshness - minimal distractions' },
      { time: '3:30 PM', score: 75, reasoning: 'Mid-afternoon slot - before energy decline' },
      { time: '11:00 AM', score: 70, reasoning: 'Late morning productivity - consistent performance' }
    ];

    const conflicts = appointments
      .filter(apt => {
        const aptDate = new Date(apt.startTime);
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        return aptDate >= now && aptDate <= tomorrow;
      })
      .map(apt => ({
        id: apt.id,
        severity: apt.priority === 'high' ? 'high' as const : 
                 apt.priority === 'medium' ? 'medium' as const : 'low' as const
      }));

    const recommendations = [
      'Schedule important meetings during 10-11 AM for optimal performance',
      'Avoid back-to-back meetings - leave 15-minute buffers',
      'Block calendar time for deep work between 9-10 AM',
      'Consider shorter meetings (25/45 min) instead of 30/60 min',
      'Group similar meeting types together for better context switching'
    ];

    return {
      busyPeriods,
      optimalTimes,
      conflicts,
      recommendations
    };
  }

  /**
   * Generate voice-to-text meeting notes
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `Meeting transcription (mock):
    
• Discussed Q1 objectives and key results
• Reviewed project timeline and milestones  
• Identified potential risks and mitigation strategies
• Assigned action items to team members
• Scheduled follow-up meeting for next week

Action Items:
- Sarah: Finalize technical specifications by Friday
- Mike: Coordinate with design team on UI mockups
- Lisa: Prepare budget analysis for next quarter

Next Meeting: Same time next week to review progress`;
  }

  /**
   * Generate AI-powered meeting summary
   */
  async generateMeetingSummary(
    meetingTitle: string,
    attendees: string[],
    duration: number,
    notes?: string
  ): Promise<string> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500));

    return `# ${meetingTitle} - Meeting Summary

**Date:** ${new Date().toLocaleDateString()}
**Duration:** ${duration} minutes
**Attendees:** ${attendees.join(', ')}

## Key Discussion Points
• Reviewed current project status and milestones
• Discussed upcoming deliverables and timelines
• Addressed any blocking issues or concerns
• Aligned on next steps and priorities

## Decisions Made
• Approved the proposed timeline for Q1 deliverables
• Agreed to weekly check-ins moving forward
• Decided to expand the project scope to include additional features

## Action Items
• Follow up on outstanding deliverables
• Schedule technical architecture review
• Prepare detailed project proposal
• Coordinate with stakeholder teams

## Next Steps
The team will reconvene next week to review progress on assigned action items and discuss any emerging priorities.

---
*This summary was generated with AI assistance for accuracy and completeness.*`;
  }
}

// Export singleton instance
export const aiCalendarService = new AICalendarService();