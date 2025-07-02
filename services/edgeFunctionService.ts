import { Contact, Deal } from '../types';

// Interface for API options
interface ApiOptions {
  apiKey?: string;
}

// Generic API request helper for Express endpoints
const apiRequest = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`/api/ai/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.result;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
};

// Email generation
const generateEmailContent = async (contactName: string, purpose: string): Promise<string> => {
  try {
    return await apiRequest('generate-content', {
      contentType: 'email',
      purpose,
      data: { contactName }
    });
  } catch (error) {
    console.error('Error generating email content:', error);
    throw error;
  }
};

// Text message generation
const generateTextMessage = async (contactName: string, purpose: string): Promise<string> => {
  try {
    return await apiRequest('generate-content', {
      contentType: 'text',
      purpose,
      data: { contactName }
    });
  } catch (error) {
    console.error('Error generating text message:', error);
    throw error;
  }
};

// Call script generation
export const generateCallScript = async (
  contact: Partial<Contact>, 
  callPurpose: string, 
  previousInteractions: string[]
): Promise<string> => {
  try {
    return await apiRequest('generate-content', {
      contentType: 'call',
      purpose: callPurpose,
      data: { 
        contact,
        previousInteractions
      }
    });
  } catch (error) {
    console.error('Error generating call script:', error);
    throw error;
  }
};

// Market trend analysis
export const analyzeMarketTrends = async (
  industry: string, 
  targetMarket: string, 
  timeframe: string,
  options?: ApiOptions
): Promise<string> => {
  try {
    return await apiRequest('generate-content', {
      contentType: 'marketTrend',
      purpose: 'Market Analysis',
      data: { 
        industry,
        targetMarket,
        timeframe
      },
      apiKey: options?.apiKey // Pass the API key if provided
    });
  } catch (error) {
    console.error('Error analyzing market trends:', error);
    throw error;
  }
};

// Competitor analysis
export const analyzeCompetitor = async (
  competitorName: string, 
  industry: string, 
  strengths: string[]
): Promise<string> => {
  try {
    return await apiRequest('generate-content', {
      contentType: 'competitor',
      purpose: 'Competitive Analysis',
      data: { 
        competitorName,
        industry,
        strengths
      }
    });
  } catch (error) {
    console.error('Error analyzing competitor:', error);
    throw error;
  }
};

// Sales forecast
export const generateSalesForecast = async (
  deals: Partial<Deal>[], 
  timeframe: string
): Promise<string> => {
  try {
    return await apiRequest('generate-content', {
      contentType: 'salesForecast',
      purpose: 'Sales Forecast',
      data: { 
        deals,
        timeframe
      }
    });
  } catch (error) {
    console.error('Error generating sales forecast:', error);
    throw error;
  }
};

// Proposal generator
const generateProposal = async (
  contact: Partial<Contact>, 
  dealDetails: string, 
  previousInteractions: string[]
): Promise<string> => {
  try {
    return await apiRequest('generate-content', {
      contentType: 'proposal',
      purpose: 'Sales Proposal',
      data: { 
        contact,
        dealDetails,
        previousInteractions
      }
    });
  } catch (error) {
    console.error('Error generating proposal:', error);
    throw error;
  }
};

// Email analysis
export const analyzeCustomerEmail = async (emailContent: string): Promise<string> => {
  try {
    return await apiRequest('email-analyzer', {
      emailContent
    });
  } catch (error) {
    console.error('Error analyzing customer email:', error);
    throw error;
  }
};

// Meeting summarization
export const generateMeetingSummary = async (transcript: string): Promise<string> => {
  try {
    return await apiRequest('meeting-summarizer', {
      transcript
    });
  } catch (error) {
    console.error('Error generating meeting summary:', error);
    throw error;
  }
};

// Business analysis
export const analyzeBusinessData = async (
  businessData: any, 
  userId?: string
): Promise<string> => {
  try {
    return await apiRequest('business-analyzer', {
      businessData,
      userId
    });
  } catch (error) {
    console.error('Error analyzing business:', error);
    throw new Error('Failed to analyze business. Please try again later or check your data.');
  }
};

// Sales insights generation
export const generateSalesInsights = async (
  contacts: Partial<Contact>[], 
  deals: Partial<Deal>[]
): Promise<string> => {
  try {
    return await apiRequest('sales-insights', {
      contacts,
      deals
    });
  } catch (error) {
    console.error('Error generating sales insights:', error);
    throw error;
  }
};

// Real-time analysis functions
const analyzeSentimentRealTime = async (text: string): Promise<any> => {
  try {
    return await apiRequest('realtime-analysis', {
      analysisType: 'sentiment',
      content: text
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};

const provideEmailFeedback = async (emailContent: string): Promise<string> => {
  try {
    return await apiRequest('realtime-analysis', {
      analysisType: 'email-feedback',
      content: emailContent
    });
  } catch (error) {
    console.error('Error providing email feedback:', error);
    throw error;
  }
};

const validateFormField = async (
  fieldName: string, 
  fieldValue: string, 
  formContext: string = 'general'
): Promise<any> => {
  try {
    return await apiRequest('realtime-analysis', {
      analysisType: 'form-validation',
      content: {
        fieldName,
        fieldValue,
        formContext
      }
    });
  } catch (error) {
    console.error('Error validating form field:', error);
    throw error;
  }
};

const analyzeCallRealTime = async (transcript: string): Promise<any> => {
  try {
    return await apiRequest('realtime-analysis', {
      analysisType: 'call-insights',
      content: transcript
    });
  } catch (error) {
    console.error('Error analyzing call:', error);
    throw error;
  }
};

const summarizeMeetingRealTime = async (partialTranscript: string): Promise<string> => {
  try {
    return await apiRequest('realtime-analysis', {
      analysisType: 'meeting-summary-realtime',
      content: partialTranscript
    });
  } catch (error) {
    console.error('Error summarizing meeting:', error);
    throw error;
  }
};