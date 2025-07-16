// Types for contact enrichment data
export interface ContactEnrichmentData {
  firstName: string;
  lastName?: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  industry?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  bio?: string;
  confidence: number;
  notes?: string;
  [key: string]: unknown;
}

// AI Enrichment Service Implementation
class AIEnrichmentService {
  private async callAIFunction(functionName: string, data: any): Promise<any> {
    try {
      const response = await fetch('/api/ai/contact-enrichment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI function call failed:', error);
      throw error;
    }
  }

  async enrichContactByEmail(email: string): Promise<ContactEnrichmentData> {
    try {
      const result = await this.callAIFunction('contact-enrichment', {
        email,
        enrichmentType: 'email'
      });

      return {
        firstName: result.firstName || 'Unknown',
        lastName: result.lastName || '',
        name: result.name || result.firstName || 'Unknown',
        email,
        company: result.company || 'Unknown Company',
        title: result.title || 'Professional',
        industry: result.industry,
        location: result.location,
        socialProfiles: result.socialProfiles,
        bio: result.bio,
        confidence: result.confidence || 0.85,
        notes: result.notes || 'Enriched via AI research'
      };
    } catch (error) {
      console.error('Contact enrichment by email failed:', error);
      // Return basic structure with available data
      return {
        firstName: 'Unknown',
        name: 'Unknown',
        email,
        company: 'Unknown Company',
        title: 'Professional',
        confidence: 0.1,
        notes: 'API enrichment unavailable. Using estimated data. To enable AI features, please set up API keys for OpenAI or Gemini.'
      };
    }
  }

  async enrichContactByName(firstName: string, lastName: string, company?: string): Promise<ContactEnrichmentData> {
    try {
      const result = await this.callAIFunction('contact-enrichment', {
        firstName,
        lastName,
        company,
        enrichmentType: 'name'
      });

      return {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        company: result.company || company || 'Unknown Company',
        title: result.title || 'Professional',
        industry: result.industry,
        location: result.location,
        socialProfiles: result.socialProfiles,
        bio: result.bio,
        confidence: result.confidence || 0.75,
        notes: result.notes || 'Enriched via AI research'
      };
    } catch (error) {
      console.error('Contact enrichment by name failed:', error);
      // Return basic structure with available data
      return {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        company: company || 'Unknown Company',
        title: 'Professional',
        confidence: 0.1,
        notes: 'API enrichment unavailable. Using estimated data. To enable AI features, please set up API keys for OpenAI or Gemini.'
      };
    }
  }

  async enrichContactByLinkedIn(linkedinUrl: string): Promise<ContactEnrichmentData> {
    try {
      const result = await this.callAIFunction('contact-enrichment', {
        linkedinUrl,
        enrichmentType: 'linkedin'
      });

      return {
        firstName: result.firstName || 'Unknown',
        lastName: result.lastName || '',
        name: result.name || result.firstName || 'Unknown',
        company: result.company || 'Unknown Company',
        title: result.title || 'Professional',
        industry: result.industry,
        location: result.location,
        socialProfiles: {
          linkedin: linkedinUrl,
          ...result.socialProfiles
        },
        bio: result.bio,
        confidence: result.confidence || 0.90,
        notes: result.notes || 'Enriched via AI research'
      };
    } catch (error) {
      console.error('Contact enrichment by LinkedIn failed:', error);
      // Return basic structure with available data
      return {
        firstName: 'Unknown',
        lastName: '',
        name: 'Unknown',
        company: 'Unknown Company',
        title: 'Professional',
        socialProfiles: {
          linkedin: linkedinUrl
        },
        confidence: 0.1,
        notes: 'API enrichment unavailable. Using estimated data. To enable AI features, please set up API keys for OpenAI or Gemini.'
      };
    }
  }

  async enrichContact(contactData: Partial<ContactEnrichmentData>): Promise<ContactEnrichmentData> {
    try {
      const result = await this.callAIFunction('contact-enrichment', {
        ...contactData,
        enrichmentType: 'full'
      });

      return {
        firstName: result.firstName || contactData.firstName || 'Unknown',
        lastName: result.lastName || contactData.lastName || '',
        name: result.name || contactData.name || `${contactData.firstName} ${contactData.lastName}` || 'Unknown',
        email: result.email || contactData.email,
        phone: result.phone || contactData.phone,
        company: result.company || contactData.company || 'Unknown Company',
        title: result.title || contactData.title || 'Professional',
        industry: result.industry || contactData.industry,
        location: result.location || contactData.location,
        socialProfiles: {
          ...contactData.socialProfiles,
          ...result.socialProfiles
        },
        bio: result.bio || contactData.bio,
        confidence: result.confidence || 0.80,
        notes: result.notes || 'Enriched via AI research'
      };
    } catch (error) {
      console.error('Contact enrichment failed:', error);
      // Return basic structure with available data
      return {
        firstName: contactData.firstName || 'Unknown',
        lastName: contactData.lastName || '',
        name: contactData.name || `${contactData.firstName} ${contactData.lastName}` || 'Unknown',
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company || 'Unknown Company',
        title: contactData.title || 'Professional',
        industry: contactData.industry,
        location: contactData.location,
        socialProfiles: contactData.socialProfiles,
        bio: contactData.bio,
        confidence: 0.1,
        notes: 'API enrichment unavailable. Using estimated data. To enable AI features, please set up API keys for OpenAI or Gemini.'
      };
    }
  }
}

export const aiEnrichmentService = new AIEnrichmentService();

// This service would contain the actual implementation of contact enrichment
// For now, it's just a type definition file