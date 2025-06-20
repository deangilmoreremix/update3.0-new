import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// Use the updated model name
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface ContactPersonalization {
  personalizedMessage: string;
  talkingPoints: string[];
  iceBreakers: string[];
  followUpSuggestions: string[];
}

export interface BusinessInsight {
  companyOverview: string;
  keyDecisionMakers: string[];
  businessChallenges: string[];
  opportunities: string[];
  competitiveAdvantages: string[];
}

export interface EmailSuggestion {
  subject: string;
  body: string;
  tone: 'professional' | 'casual' | 'persuasive' | 'urgent';
  followUpTiming: string;
}

export interface ProposalContent {
  executiveSummary: string;
  problemStatement: string;
  proposedSolution: string;
  benefitsAndValue: string[];
  implementation: string;
  timeline: string;
  nextSteps: string[];
}

export const geminiService = {
  async suggestPersonalization(contact: any): Promise<ContactPersonalization> {
    try {
      const prompt = `
        Based on the following contact information, suggest personalized communication strategies:
        
        Name: ${contact.name}
        Email: ${contact.email}
        Company: ${contact.company || 'Not specified'}
        Position: ${contact.position || 'Not specified'}
        Industry: ${contact.industry || 'Not specified'}
        Location: ${contact.location || 'Not specified'}
        Notes: ${contact.notes || 'No additional notes'}
        Status: ${contact.status || 'lead'}
        
        Please provide:
        1. A personalized message approach
        2. 3-5 relevant talking points
        3. 3-4 ice breaker suggestions
        4. 3-4 follow-up suggestions
        
        Format the response as JSON with keys: personalizedMessage, talkingPoints, iceBreakers, followUpSuggestions
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse as JSON, fallback to structured response
      try {
        return JSON.parse(text);
      } catch {
        return {
          personalizedMessage: text.substring(0, 200) + '...',
          talkingPoints: ['Personalized approach based on their role', 'Industry-specific insights', 'Value proposition alignment'],
          iceBreakers: ['Reference their recent work', 'Mention mutual connections', 'Industry trend discussion'],
          followUpSuggestions: ['Schedule a brief call', 'Share relevant case study', 'Invite to industry event']
        };
      }
    } catch (error) {
      console.error('Gemini API error in personalization suggestions:', error);
      throw error;
    }
  },

  async analyzeBusinessInsights(company: string, industry?: string): Promise<BusinessInsight> {
    try {
      const prompt = `
        Analyze the following company and provide business insights:
        
        Company: ${company}
        Industry: ${industry || 'Not specified'}
        
        Please provide:
        1. Company overview
        2. Key decision makers (roles/titles)
        3. Common business challenges in this industry
        4. Potential opportunities
        5. Competitive advantages they might value
        
        Format as JSON with keys: companyOverview, keyDecisionMakers, businessChallenges, opportunities, competitiveAdvantages
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          companyOverview: `Analysis for ${company} in the ${industry || 'business'} sector.`,
          keyDecisionMakers: ['CEO/President', 'CTO/VP Technology', 'VP Sales', 'Director of Operations'],
          businessChallenges: ['Market competition', 'Digital transformation', 'Cost optimization', 'Customer retention'],
          opportunities: ['Technology adoption', 'Process improvement', 'Market expansion', 'Strategic partnerships'],
          competitiveAdvantages: ['Innovation', 'Customer service', 'Cost efficiency', 'Market expertise']
        };
      }
    } catch (error) {
      console.error('Gemini API error in business insights:', error);
      throw error;
    }
  },

  async generateEmailSuggestions(
    contact: any,
    purpose: string,
    context?: string
  ): Promise<EmailSuggestion[]> {
    try {
      const prompt = `
        Generate 3 different email suggestions for the following scenario:
        
        Contact: ${contact.name} (${contact.position || 'Unknown position'}) at ${contact.company || 'Unknown company'}
        Purpose: ${purpose}
        Context: ${context || 'General outreach'}
        Industry: ${contact.industry || 'Not specified'}
        
        Create 3 emails with different tones:
        1. Professional and formal
        2. Casual and friendly
        3. Persuasive and value-focused
        
        For each email, provide:
        - Subject line
        - Body content (2-3 paragraphs)
        - Recommended follow-up timing
        
        Format as JSON array with objects containing: subject, body, tone, followUpTiming
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return [
          {
            subject: `Following up on our conversation - ${contact.name}`,
            body: `Hi ${contact.name},\n\nI wanted to follow up on our recent discussion about ${purpose}. Based on your role at ${contact.company}, I believe our solution could provide significant value.\n\nWould you be available for a brief call this week to explore this further?\n\nBest regards,`,
            tone: 'professional' as const,
            followUpTiming: '3-5 business days'
          }
        ];
      }
    } catch (error) {
      console.error('Gemini API error in email suggestions:', error);
      throw error;
    }
  },

  async generateProposal(
    dealInfo: any,
    requirements?: string
  ): Promise<ProposalContent> {
    try {
      const prompt = `
        Generate a comprehensive business proposal based on the following information:
        
        Deal: ${dealInfo.title}
        Company: ${dealInfo.company}
        Value: $${dealInfo.value}
        Stage: ${dealInfo.stage}
        Requirements: ${requirements || 'Standard business solution'}
        Notes: ${dealInfo.notes || 'No additional notes'}
        
        Create a structured proposal with:
        1. Executive Summary
        2. Problem Statement
        3. Proposed Solution
        4. Benefits and Value
        5. Implementation Plan
        6. Timeline
        7. Next Steps
        
        Format as JSON with keys: executiveSummary, problemStatement, proposedSolution, benefitsAndValue (array), implementation, timeline, nextSteps (array)
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch {
        return {
          executiveSummary: `This proposal outlines a comprehensive solution for ${dealInfo.company} to address their business needs.`,
          problemStatement: 'Current business challenges require a strategic solution to improve efficiency and growth.',
          proposedSolution: 'Our integrated approach combines technology and expertise to deliver measurable results.',
          benefitsAndValue: ['Increased efficiency', 'Cost reduction', 'Improved ROI', 'Strategic advantage'],
          implementation: 'Phased approach with dedicated project management and support throughout the process.',
          timeline: '3-6 months for full implementation with key milestones at 30, 60, and 90 days.',
          nextSteps: ['Schedule detailed requirements session', 'Finalize project scope', 'Begin implementation planning']
        };
      }
    } catch (error) {
      console.error('Gemini API error in proposal generation:', error);
      throw error;
    }
  },

  async analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    keyPhrases: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `
        Analyze the sentiment and provide insights for the following text:
        
        "${text}"
        
        Provide:
        1. Overall sentiment (positive, negative, or neutral)
        2. Confidence score (0-1)
        3. Key phrases that influenced the sentiment
        4. Recommendations for response or action
        
        Format as JSON with keys: sentiment, confidence, keyPhrases (array), recommendations (array)
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      try {
        return JSON.parse(responseText);
      } catch {
        return {
          sentiment: 'neutral' as const,
          confidence: 0.5,
          keyPhrases: ['business discussion', 'professional communication'],
          recommendations: ['Follow up with additional information', 'Schedule a meeting to discuss further']
        };
      }
    } catch (error) {
      console.error('Gemini API error in sentiment analysis:', error);
      throw error;
    }
  },

  async generateMeetingAgenda(
    purpose: string,
    attendees: string[],
    previousNotes?: string
  ): Promise<string> {
    try {
      const prompt = `
        You're an expert sales assistant. Create a structured meeting agenda with clear sections based on:

        - Purpose: ${purpose}
        - Attendees: ${attendees.join(', ')}
        - Previous notes: ${previousNotes || 'N/A'}

        Use headings like "Introduction", "Client Needs", "Demo", "Q&A", "Next Steps".
        Keep it short, clear, and business-ready.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Gemini API error in meeting agenda generation:', error);
      throw error;
    }
  },

  async generateReasoning(prompt: string): Promise<string> {
    try {
      const reasoningPrompt = `
        You're an AI strategist. ${prompt}

        Briefly explain the rationale, section structure, and strategic importance of the agenda. Keep it under 150 words.
      `;

      const result = await model.generateContent(reasoningPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Gemini API error in reasoning generation:', error);
      throw error;
    }
  }
};

// React hook for components to use Gemini service
export const useGemini = () => {
  return geminiService;
};

export default geminiService;