import { GoogleGenerativeAI } from '@google/generative-ai';
import { Contact } from '../types';

// Custom hook for Gemini API integration
export function useGemini() {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // Use gemini-pro instead of gemini-2.5-flash which doesn't exist in the v1 API
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Generate a customer persona
  const generateCustomerPersona = async (industry: string, companySize: string, interests: string[]) => {
    try {
      const prompt = `
        Generate a comprehensive customer persona for a ${companySize} company in the ${industry} industry.
        They are interested in: ${interests.join(', ')}.
        
        Structure the response as follows:
        - Key business goals
        - Main pain points and challenges
        - Buying preferences
        - Common objections
        - Communication style preferences
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  // Analyze market trends
  const analyzeMarketTrends = async (industry: string, audience: string, timeframe: string) => {
    try {
      const prompt = `
        Analyze market trends for the ${industry} industry, focusing on ${audience} for the ${timeframe}.
        
        Include:
        - Current market dynamics and trends
        - Opportunities and challenges
        - Economic factors impacting the market
        - Predictions for the specified timeframe
        - Strategic recommendations
        
        Format the response as a concise, professional insight that would be valuable for sales and marketing professionals.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  // Optimize voice tone for different contexts
  const optimizeVoiceTone = async (content: string, audience: string, purpose: string) => {
    try {
      const prompt = `
        Optimize the following content for tone of voice:
        "${content}"
        
        Target audience: ${audience}
        Purpose: ${purpose}
        
        Rewrite the content to better resonate with the audience while maintaining the original message.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  // For real-time analysis
  const analyzeSentimentRealTime = async (text: string) => {
    try {
      const prompt = `
        Analyze the sentiment of the following text. 
        Respond with sentiment score between -1 and 1, 
        emotions detected, and key phrases:
        "${text}"
      `;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const responseText = response.text();
      
      // Parse the response to extract sentiment information
      // This is a simplified implementation - in production would be more robust
      const lines = responseText.split('\n');
      let sentiment = 0;
      let emotions: string[] = [];
      let keyPhrases: string[] = [];
      
      for (const line of lines) {
        if (line.toLowerCase().includes('sentiment') && !isNaN(parseFloat(line.split(':')[1]?.trim() || '0'))) {
          sentiment = parseFloat(line.split(':')[1]?.trim() || '0');
        } else if (line.toLowerCase().includes('emotion')) {
          emotions = line.split(':')[1]?.split(',').map(e => e.trim()) || [];
        } else if (line.toLowerCase().includes('key phrase') || line.toLowerCase().includes('important phrase')) {
          keyPhrases = line.split(':')[1]?.split(',').map(p => p.trim()) || [];
        }
      }
      
      return {
        sentiment: sentiment,
        emotions: emotions.length > 0 ? emotions : ['neutral'],
        keyPhrases: keyPhrases
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        sentiment: 0,
        emotions: ['neutral'],
        keyPhrases: []
      };
    }
  };

  // Access the underlying generative model instance directly
  const getGenerativeModel = ({ model }: { model: string }) => {
    // Always use gemini-pro if gemini-2.5-flash is requested
    if (model === 'gemini-2.5-flash') {
      return genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    return genAI.getGenerativeModel({ model });
  };

  // Suggest personalization for customer interactions
  const suggestPersonalization = async (contact: Partial<Contact>, previousInteractions: string[] = []) => {
    try {
      // Format the contact information
      const contactDetails = Object.entries(contact)
        .filter(([key, value]) => value !== undefined && !['id', 'createdAt', 'updatedAt'].includes(key))
        .map(([key, value]) => {
          if (key === 'lastContact' && value instanceof Date) {
            return `${key}: ${value.toISOString().split('T')[0]}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n');

      // Format the previous interactions
      const interactionsText = previousInteractions.length > 0 
        ? previousInteractions.map((interaction, idx) => `Interaction ${idx + 1}: ${interaction}`).join('\n\n')
        : "No previous interactions";
      
      const prompt = `
        You are an expert in personalized sales communication. Use the following contact information and 
        previous interactions to provide specific, actionable recommendations for personalizing future 
        communications with this contact.
        
        CONTACT INFORMATION:
        ${contactDetails}
        
        PREVIOUS INTERACTIONS:
        ${interactionsText}
        
        Based on this information, provide:
        1. 3-5 personalization recommendations for future communications
        2. Key topics or pain points to address
        3. Communication style suggestions (tone, formality, level of detail)
        4. Any specific value propositions that would resonate with this contact
        5. Optimal timing and frequency for follow-ups
        
        Focus on being specific and actionable, not generic. Use the actual information provided about this
        contact to craft truly personalized recommendations.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error in personalization suggestions:', error);
      throw error;
    }
  };

  // NEW: Generate content with reasoning capabilities
  const generateContentWithReasoning = async (
    contentType: string,
    topic: string,
    audience: string,
    additionalContext?: string
  ) => {
    try {
      const prompt = `
        Generate high-quality ${contentType} content about "${topic}" for ${audience}.
        
        Additional context: ${additionalContext || 'None provided'}
        
        Use step-by-step reasoning to:
        1. Analyze the audience needs and preferences
        2. Determine the most effective structure for this content type
        3. Identify key points that should be included
        4. Consider tone and style appropriate for the audience
        5. Generate the final content with clear reasoning for your choices
        
        Format your response with:
        - A brief explanation of your reasoning process
        - The final content in a professional, ready-to-use format
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error in content generation with reasoning:', error);
      throw error;
    }
  };

  // NEW: Generate blog post with reasoning
  const generateBlogPostWithReasoning = async (
    topic: string,
    targetAudience: string,
    keyPoints: string[],
    tone: string = 'professional'
  ) => {
    try {
      const prompt = `
        Generate a comprehensive blog post about "${topic}" for ${targetAudience}.
        
        Key points to include:
        ${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}
        
        Tone: ${tone}
        
        Use step-by-step reasoning to:
        1. Analyze what makes this topic relevant to the target audience
        2. Determine the most effective structure for this blog post
        3. Develop a compelling headline and introduction
        4. Expand on each key point with supporting evidence or examples
        5. Create a strong conclusion with call-to-action
        
        Format your response with:
        - Your reasoning process for creating this content
        - The complete blog post with headline, introduction, sections, and conclusion
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error in blog post generation:', error);
      throw error;
    }
  };

  // NEW: Generate social media content with reasoning
  const generateSocialMediaWithReasoning = async (
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram',
    topic: string,
    purpose: string,
    brandVoice: string
  ) => {
    try {
      const prompt = `
        Generate engaging social media content for ${platform} about "${topic}".
        
        Purpose: ${purpose}
        Brand voice: ${brandVoice}
        
        Use step-by-step reasoning to:
        1. Analyze what content performs well on ${platform}
        2. Determine the optimal length, tone, and format for this platform
        3. Craft attention-grabbing opening lines
        4. Include appropriate hashtags and calls-to-action
        5. Consider how to maximize engagement (likes, shares, comments)
        
        Format your response with:
        - Your reasoning process for creating this content
        - The complete social media post ready to publish
        - Suggested hashtags (if applicable)
        - Best time to post recommendation
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error in social media generation:', error);
      throw error;
    }
  };

  // NEW: Generate email campaign with reasoning
  const generateEmailCampaignWithReasoning = async (
    campaignType: string,
    audience: string,
    productInfo: string,
    goal: string
  ) => {
    try {
      const prompt = `
        Generate a complete email campaign for a ${campaignType} targeting ${audience}.
        
        Product/Service Information:
        ${productInfo}
        
        Campaign Goal: ${goal}
        
        Use step-by-step reasoning to:
        1. Analyze what motivates this audience and what objections they might have
        2. Craft a compelling subject line with high open rate potential
        3. Structure the email body with attention-grabbing opening, value proposition, and clear CTA
        4. Determine the appropriate length, tone, and formatting
        5. Consider follow-up strategy and timing
        
        Format your response with:
        - Your reasoning process for creating this campaign
        - Subject line options (at least 3)
        - Complete email body
        - Recommended send time and follow-up strategy
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error in email campaign generation:', error);
      throw error;
    }
  };

  // NEW: Generate sales script with reasoning
  const generateSalesScriptWithReasoning = async (
    productName: string,
    targetCustomer: string,
    painPoints: string[],
    competitiveAdvantages: string[]
  ) => {
    try {
      const prompt = `
        Generate a comprehensive sales script for ${productName} targeting ${targetCustomer}.
        
        Customer Pain Points:
        ${painPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}
        
        Our Competitive Advantages:
        ${competitiveAdvantages.map((advantage, index) => `${index + 1}. ${advantage}`).join('\n')}
        
        Use step-by-step reasoning to:
        1. Analyze the most effective opening to grab attention
        2. Develop questions to uncover and validate pain points
        3. Create a compelling value proposition that addresses specific needs
        4. Anticipate and prepare for common objections
        5. Craft an effective closing with clear next steps
        
        Format your response with:
        - Your reasoning process for creating this script
        - Complete sales script with sections for:
          - Opening
          - Discovery questions
          - Value proposition
          - Objection handling
          - Closing
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error in sales script generation:', error);
      throw error;
    }
  };

  return {
    generateCustomerPersona,
    optimizeVoiceTone,
    analyzeSentimentRealTime,
    getGenerativeModel,
    analyzeMarketTrends,
    suggestPersonalization,
    // New reasoning-based content generation functions
    generateContentWithReasoning,
    generateBlogPostWithReasoning,
    generateSocialMediaWithReasoning,
    generateEmailCampaignWithReasoning,
    generateSalesScriptWithReasoning
  };
}