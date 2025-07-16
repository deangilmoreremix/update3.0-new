import { callOpenAI } from "../services/callOpenAI";

export async function personalizedEmailAgent(input: any, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "";
  const title = input.title || "";
  const context = input.context || "";
  
  setSteps?.([{ step: "Crafting personalized email..." }]);
  
  const emailContent = await callOpenAI(`
    Write a personalized business email to ${name}${title ? `, ${title}` : ''}${company ? ` at ${company}` : ''}.
    
    Context: ${context || 'Initial outreach to discuss potential partnership opportunities.'}
    
    Make it:
    - Personal and relevant to their role
    - Professional but friendly
    - Clear call-to-action
    - Under 150 words
    
    Format with Subject line and body.
  `);
  
  return emailContent;
}