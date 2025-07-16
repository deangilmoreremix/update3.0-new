import { callOpenAI } from "../services/callOpenAI";

export async function coldOutreachCloserAgent(input: any, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "";
  const previousInteractions = input.previousInteractions || "No previous interactions";
  
  setSteps?.([{ step: "Crafting closing sequence..." }]);
  
  const closingEmail = await callOpenAI(`
    Write a compelling closing email for a cold outreach sequence to ${name} at ${company}.
    
    Previous interactions: ${previousInteractions}
    
    This is the final attempt to get a response. Make it:
    - Short and punchy
    - Create urgency without being pushy
    - Offer clear value
    - Easy yes/no decision
    
    Include subject line.
  `);
  
  return closingEmail;
}