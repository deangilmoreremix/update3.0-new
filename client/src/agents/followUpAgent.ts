import { callOpenAI } from "../services/callOpenAI";

export async function followUpAgent(input: any, setSteps?: (steps: unknown) => void) {
  const taskDescription = input.description || "Follow up on previous conversation";
  const contact = input.contact || "Contact";
  const context = input.context || "";
  const daysElapsed = input.daysElapsed || 3;
  
  setSteps?.([{ step: "Generating follow-up message..." }]);
  
  const followUpMessage = await callOpenAI(`
    Create a professional follow-up message for:
    Task: ${taskDescription}
    Contact: ${contact}
    Days since last contact: ${daysElapsed}
    Context: ${context}
    
    Make it:
    - Friendly but professional
    - Reference previous conversation
    - Add value (tip, resource, or insight)
    - Clear next step
    
    Format as email with subject line.
  `);
  
  return followUpMessage;
}