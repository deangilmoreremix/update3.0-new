import { Contact } from '../types';

export interface EnrichmentResult {
  success: boolean;
  enrichedData?: Partial<Contact>;
  confidence?: number;
  sources?: string[];
  error?: string;
}

export interface AIInsight {
  type: 'personality' | 'interests' | 'business' | 'communication' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

export class AIEnrichmentService {
  private static instance: AIEnrichmentService;
  private apiKey: string | null = null;

  private constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
  }

  static getInstance(): AIEnrichmentService {
    if (!AIEnrichmentService.instance) {
      AIEnrichmentService.instance = new AIEnrichmentService();
    }
    return AIEnrichmentService.instance;
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async enrichContact(contact: Contact): Promise<EnrichmentResult> {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'OpenAI API key not configured'
        };
      }

      // Call the backend enrichment service
      const response = await fetch('/api/ai/enrich-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        enrichedData: result.enrichedData,
        confidence: result.confidence || 0.8,
        sources: result.sources || ['AI Analysis']
      };
    } catch (error) {
      console.error('Contact enrichment failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Enrichment failed'
      };
    }
  }

  async generateInsights(contact: Contact): Promise<AIInsight[]> {
    try {
      const response = await fetch('/api/ai/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.insights || [];
    } catch (error) {
      console.error('Insight generation failed:', error);
      return this.getFallbackInsights(contact);
    }
  }

  async scoreContact(contact: Contact): Promise<number> {
    try {
      const response = await fetch('/api/ai/score-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.score || 50;
    } catch (error) {
      console.error('Contact scoring failed:', error);
      return this.calculateBasicScore(contact);
    }
  }

  async researchContact(contact: Contact): Promise<EnrichmentResult> {
    try {
      const response = await fetch('/api/ai/research-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: contact.name,
          company: contact.company,
          email: contact.email
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        enrichedData: result.researchData,
        confidence: result.confidence || 0.7,
        sources: result.sources || ['Web Research']
      };
    } catch (error) {
      console.error('Contact research failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Research failed'
      };
    }
  }

  private getFallbackInsights(contact: Contact): AIInsight[] {
    const insights: AIInsight[] = [];

    // Generate basic insights based on available data
    if (contact.company) {
      insights.push({
        type: 'business',
        title: 'Company Analysis',
        description: `Works at ${contact.company}. Consider researching their industry and recent company news.`,
        confidence: 0.6,
        actionable: true,
        priority: 'medium'
      });
    }

    if (contact.annualRevenue && contact.annualRevenue > 1000000) {
      insights.push({
        type: 'opportunity',
        title: 'High-Value Prospect',
        description: 'Company has significant annual revenue. Prioritize for enterprise solutions.',
        confidence: 0.8,
        actionable: true,
        priority: 'high'
      });
    }

    if (contact.lastContact && new Date().getTime() - new Date(contact.lastContact).getTime() > 30 * 24 * 60 * 60 * 1000) {
      insights.push({
        type: 'communication',
        title: 'Follow-up Needed',
        description: 'No recent communication. Consider reaching out with valuable content.',
        confidence: 0.9,
        actionable: true,
        priority: 'medium'
      });
    }

    return insights;
  }

  private calculateBasicScore(contact: Contact): number {
    let score = 50; // Base score

    // Positive factors
    if (contact.email) score += 10;
    if (contact.phone) score += 10;
    if (contact.company) score += 15;
    if (contact.position) score += 10;
    if (contact.annualRevenue && contact.annualRevenue > 1000000) score += 20;
    if (contact.employeeCount && contact.employeeCount > 100) score += 15;
    if (contact.lastContact && new Date().getTime() - new Date(contact.lastContact).getTime() < 7 * 24 * 60 * 60 * 1000) score += 15;

    // Status-based scoring
    switch (contact.status) {
      case 'customer':
        score += 30;
        break;
      case 'prospect':
        score += 20;
        break;
      case 'lead':
        score += 10;
        break;
      case 'churned':
        score -= 20;
        break;
    }

    return Math.min(Math.max(score, 0), 100);
  }
}

export const aiEnrichmentService = AIEnrichmentService.getInstance();