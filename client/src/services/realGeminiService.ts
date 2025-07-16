import { GoogleGenerativeAI } from '@google/generative-ai';

interface ContactAnalysisResult {
  score: number;
  category: 'hot' | 'warm' | 'cold' | 'qualified';
  insights: string[];
  recommendations: string[];
  confidence: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  industry?: string;
  notes?: string;
  lastConnected?: string;
  interestLevel?: string;
  status?: string;
}

class RealGeminiService {
  private genAI: GoogleGenerativeAI;
  private geminiModel: unknown;
  private gemmaModel: unknown;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY not found in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.geminiModel = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.gemmaModel = this.genAI.getGenerativeModel({ model: 'gemma-2-9b-it' });
  }

  private selectModel(taskType: 'analysis' | 'enrichment' | 'bulk' = 'analysis') {
    // Use Gemini for complex analysis and Gemma for faster processing
    switch (taskType) {
      case 'bulk':
        return { model: this.gemmaModel, name: 'gemma-2-9b-it' };
      case 'enrichment':
        return { model: this.geminiModel, name: 'gemini-2.5-flash' };
      case 'analysis':
      default:
        // Use Gemma for general analysis (this service represents Gemma)
        return { model: this.gemmaModel, name: 'gemma-2-9b-it' };
    }
  }

  async analyzeContact(contact: Contact): Promise<ContactAnalysisResult> {
    try {
      const selectedModel = this.selectModel('analysis');
      
      const prompt = `
        Analyze this contact for sales potential and provide actionable insights:
        
        Contact Details:
        - Name: ${contact.name}
        - Email: ${contact.email}
        - Company: ${contact.company || 'Not provided'}
        - Title: ${contact.title || 'Not provided'}
        - Industry: ${contact.industry || 'Not provided'}
        - Phone: ${contact.phone || 'Not provided'}
        - Notes: ${contact.notes || 'No notes'}
        - Last Connected: ${contact.lastConnected || 'Never'}
        - Interest Level: ${contact.interestLevel || 'Unknown'}
        - Status: ${contact.status || 'Unknown'}
        
        Please provide a comprehensive analysis in the following JSON format:
        {
          "score": <number between 1-100>,
          "category": "<hot|warm|cold|qualified>",
          "insights": ["insight1", "insight2", "insight3"],
          "recommendations": ["recommendation1", "recommendation2"],
          "confidence": <number between 0-1>
        }
        
        Base your analysis on:
        1. Company size and industry potential
        2. Job title and decision-making authority
        3. Engagement history and interest level
        4. Contact completeness and quality
        5. Sales potential and fit
        
        Return only the JSON response without any markdown formatting.
      `;

      console.log(`Using ${selectedModel.name} for contact analysis`);
      const result = await selectedModel.model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Parse the JSON response
      const analysis = JSON.parse(responseText);
      
      return {
        score: Math.min(100, Math.max(0, analysis.score)),
        category: analysis.category,
        insights: Array.isArray(analysis.insights) ? analysis.insights : [],
        recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
        confidence: Math.min(1, Math.max(0, analysis.confidence))
      };
      
    } catch (error) {
      console.error('Google AI API error:', error);
      throw new Error(`Contact analysis failed: ${error.message}`);
    }
  }

  async bulkAnalyzeContacts(contacts: Contact[]): Promise<ContactAnalysisResult[]> {
    const results: ContactAnalysisResult[] = [];
    
    for (const contact of contacts) {
      try {
        const analysis = await this.analyzeContact(contact);
        results.push(analysis);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to analyze contact ${contact.id}:`, error);
        results.push({
          score: 0,
          category: 'cold',
          insights: ['Analysis failed'],
          recommendations: ['Try again later'],
          confidence: 0
        });
      }
    }
    
    return results;
  }

  async enrichContact(contact: Contact): Promise<Partial<Contact>> {
    try {
      const selectedModel = this.selectModel('enrichment');
      
      const prompt = `
        Based on the provided contact information, suggest enrichment data that would be realistic for a contact in their industry and role:
        
        Contact: ${contact.name}
        Company: ${contact.company || 'Unknown'}
        Title: ${contact.title || 'Unknown'}
        Industry: ${contact.industry || 'Unknown'}
        
        Provide realistic enrichment suggestions in JSON format:
        {
          "suggestedTitle": "realistic job title",
          "suggestedIndustry": "industry name",
          "suggestedCompanySize": "company size category",
          "suggestedInterestLevel": "hot|warm|cold",
          "suggestedTags": ["tag1", "tag2"],
          "suggestedNotes": "professional note about this contact"
        }
        
        Return only the JSON response without markdown formatting.
      `;

      console.log(`Using ${selectedModel.name} for contact enrichment`);
      const result = await selectedModel.model.generateContent(prompt);
      const responseText = result.response.text();
      const enrichment = JSON.parse(responseText);
      
      return {
        title: enrichment.suggestedTitle || contact.title,
        industry: enrichment.suggestedIndustry || contact.industry,
        interestLevel: enrichment.suggestedInterestLevel || contact.interestLevel,
        notes: enrichment.suggestedNotes || contact.notes
      };
      
    } catch (error) {
      console.error('Contact enrichment failed:', error);
      return {};
    }
  }
}

export const realGeminiService = new RealGeminiService();