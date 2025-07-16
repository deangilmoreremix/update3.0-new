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
  modelUsed: 'openai' | 'gemma';
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
  private preferredModel: 'openai' | 'gemma' | 'auto' = 'auto';

  setPreferredModel(model: 'openai' | 'gemma' | 'auto') {
    this.preferredModel = model;
  }

  private selectModel(taskType: 'single' | 'bulk' | 'enrichment' = 'single'): 'openai' | 'gemma' {
    if (this.preferredModel === 'openai') return 'openai';
    if (this.preferredModel === 'gemma') return 'gemma';
    
    // Auto-selection logic based on task performance
    switch (taskType) {
      case 'bulk':
        return 'gemma'; // Gemma is faster for bulk operations
      case 'enrichment':
        return 'openai'; // OpenAI is better for structured data and enrichment
      case 'single':
      default:
        return 'openai'; // OpenAI for detailed single contact analysis
    }
  }

  async analyzeContact(contact: Contact): Promise<ContactAnalysisResult> {
    const selectedModel = this.selectModel('single');
    
    try {
      let result;
      
      if (selectedModel === 'gemma') {
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
      const fallbackModel = selectedModel === 'gemma' ? 'openai' : 'gemma';
      
      try {
        let fallbackResult;
        
        if (fallbackModel === 'gemma') {
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
    
    for (const i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      
      try {
        let analysis;
        
        if (selectedModel === 'gemma') {
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
      if (selectedModel === 'gemma') {
        return await realGeminiService.enrichContact(contact);
      } else {
        return await realOpenAIService.enrichContact(contact);
      }
      
    } catch (error) {
      console.error(`${selectedModel} enrichment failed, trying fallback:`, error);
      
      // Fallback to other model
      const fallbackModel = selectedModel === 'gemma' ? 'openai' : 'gemma';
      
      try {
        if (fallbackModel === 'gemma') {
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
  async checkAIHealth(): Promise<{ gemma: boolean; openai: boolean }> {
    const testContact = {
      id: 'test',
      name: 'Test User',
      email: 'test@example.com',
      company: 'Test Company',
      title: 'Test Title'
    };

    const results = { gemma: false, openai: false };

    try {
      await realGeminiService.analyzeContact(testContact);
      results.gemma = true;
    } catch (error) {
      console.error('Gemma health check failed:', error);
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