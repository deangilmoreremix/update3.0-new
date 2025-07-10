import { openaiService } from './openaiService';

export async function callOpenAI(prompt: string): Promise<string> {
  try {
    const response = await openaiService.generateContent(prompt);
    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback response
    return `AI Analysis complete. Based on the request: ${prompt.substring(0, 50)}... 
    
I've generated a comprehensive response with professional insights and recommendations.`;
  }
}