import { realGeminiService } from './realGeminiService';
import { realOpenAIService } from './realOpenAIService';

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

interface ContactAnalysisResult {
  score: number;
  category: 'hot' | 'warm' | 'cold' | 'qualified';
  insights: string[];
  recommendations: string[];
  confidence: number;
  modelUsed: 'gemini' | 'openai';
}

interface BulkAnalysisResult {
  results: ContactAnalysisResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageScore: number;
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
    qualifiedLeads: number;
  };
}

class SmartAIService {
  private preferredModel: 'gemini' | 'openai' | 'auto' = 'auto';

  setPreferredModel(model: 'gemini' | 'openai' | 'auto') {
    this.preferredModel = model;
  }

  private selectModel(taskType: 'single' | 'bulk' | 'enrichment' = 'single'): 'gemini' | 'openai' {
    if (this.preferredModel === 'gemini') return 'gemini';
    if (this.preferredModel === 'openai') return 'openai';
    
    // Auto-selection logic
    switch (taskType) {
      case 'bulk':
        return 'gemini'; // Gemini is faster for bulk operations
      case 'enrichment':
        return 'openai'; // OpenAI is better for structured data
      case 'single':
      default:
        return Math.random() > 0.5 ? 'gemini' : 'openai'; // Random selection for load balancing
    }
  }

  async analyzeContact(contact: Contact): Promise<ContactAnalysisResult> {
    const selectedModel = this.selectModel('single');
    
    try {
      let result;
      
      if (selectedModel === 'gemini') {
        result = await realGeminiService.analyzeContact(contact);
      } else {
        result = await realOpenAIService.analyzeContact(contact);
      }
      
      return {
        ...result,
        modelUsed: selectedModel
      };
      
    } catch (error) {
      console.error(`${selectedModel} analysis failed, trying fallback:`, error);
      
      // Fallback to other model
      const fallbackModel = selectedModel === 'gemini' ? 'openai' : 'gemini';
      
      try {
        let fallbackResult;
        
        if (fallbackModel === 'gemini') {
          fallbackResult = await realGeminiService.analyzeContact(contact);
        } else {
          fallbackResult = await realOpenAIService.analyzeContact(contact);
        }
        
        return {
          ...fallbackResult,
          modelUsed: fallbackModel
        };
        
      } catch (fallbackError) {
        console.error('Both AI models failed:', fallbackError);
        throw new Error(`Contact analysis failed with both models: ${error.message}`);
      }
    }
  }

  async bulkAnalyzeContacts(contacts: Contact[]): Promise<BulkAnalysisResult> {
    const selectedModel = this.selectModel('bulk');
    const results: ContactAnalysisResult[] = [];
    
    console.log(`Starting bulk analysis of ${contacts.length} contacts using ${selectedModel}`);
    
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      
      try {
        let analysis;
        
        if (selectedModel === 'gemini') {
          analysis = await realGeminiService.analyzeContact(contact);
        } else {
          analysis = await realOpenAIService.analyzeContact(contact);
        }
        
        results.push({
          ...analysis,
          modelUsed: selectedModel
        });
        
        // Progress logging
        if ((i + 1) % 5 === 0) {
          console.log(`Analyzed ${i + 1}/${contacts.length} contacts`);
        }
        
      } catch (error) {
        console.error(`Failed to analyze contact ${contact.id}:`, error);
        results.push({
          score: 0,
          category: 'cold',
          insights: ['Analysis failed'],
          recommendations: ['Try again later'],
          confidence: 0,
          modelUsed: selectedModel
        });
      }
    }
    
    // Calculate summary statistics
    const successful = results.filter(r => r.score > 0).length;
    const failed = results.length - successful;
    const averageScore = successful > 0 ? results.reduce((sum, r) => sum + r.score, 0) / successful : 0;
    const hotLeads = results.filter(r => r.category === 'hot').length;
    const warmLeads = results.filter(r => r.category === 'warm').length;
    const coldLeads = results.filter(r => r.category === 'cold').length;
    const qualifiedLeads = results.filter(r => r.category === 'qualified').length;
    
    return {
      results,
      summary: {
        total: contacts.length,
        successful,
        failed,
        averageScore: Math.round(averageScore),
        hotLeads,
        warmLeads,
        coldLeads,
        qualifiedLeads
      }
    };
  }

  async enrichContact(contact: Contact): Promise<Partial<Contact>> {
    const selectedModel = this.selectModel('enrichment');
    
    try {
      if (selectedModel === 'gemini') {
        return await realGeminiService.enrichContact(contact);
      } else {
        return await realOpenAIService.enrichContact(contact);
      }
      
    } catch (error) {
      console.error(`${selectedModel} enrichment failed, trying fallback:`, error);
      
      // Fallback to other model
      const fallbackModel = selectedModel === 'gemini' ? 'openai' : 'gemini';
      
      try {
        if (fallbackModel === 'gemini') {
          return await realGeminiService.enrichContact(contact);
        } else {
          return await realOpenAIService.enrichContact(contact);
        }
        
      } catch (fallbackError) {
        console.error('Both AI models failed for enrichment:', fallbackError);
        return {};
      }
    }
  }

  // Health check method
  async checkAIHealth(): Promise<{ gemini: boolean; openai: boolean }> {
    const testContact = {
      id: 'test',
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      title: 'Test Title'
    };

    const results = { gemini: false, openai: false };

    try {
      await realGeminiService.analyzeContact(testContact);
      results.gemini = true;
    } catch (error) {
      console.error('Gemini health check failed:', error);
    }

    try {
      await realOpenAIService.analyzeContact(testContact);
      results.openai = true;
    } catch (error) {
      console.error('OpenAI health check failed:', error);
    }

    return results;
  }
}

export const smartAIService = new SmartAIService();