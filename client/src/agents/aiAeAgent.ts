import { callGemini } from "../services/callGemini";
import { callOpenAI } from "../services/callOpenAI";

export async function aiAeAgent(input: any, setSteps?: (steps: unknown) => void) {
  const dealTitle = input.title || "Product Demo";
  const company = input.company || "Company";
  const contact = input.contact || "Stakeholder";
  const value = input.value || 0;
  
  setSteps?.([{ step: "Preparing demo strategy..." }]);
  
  const demoStrategy = await callGemini(
    `Create a demo strategy for ${dealTitle} at ${company} for ${contact}. Deal value: $${value}. Include key features to highlight and potential objections to address.`
  );
  
  setSteps?.(prev => [...prev, { step: "Generating demo script..." }]);
  
  const demoScript = await callOpenAI(`
    Create a compelling demo script for ${dealTitle} based on this strategy:
    ${demoStrategy}
    
    Include:
    1. Opening hook (30 seconds)
    2. Problem agitation (1 minute)
    3. Solution demonstration (5 minutes)
    4. Value proposition (2 minutes)
    5. Q&A preparation
    6. Strong close with next steps
    
    Make it conversational and engaging.
  `);
  
  return {
    demoScript,
    keyTalkingPoints: [
      "ROI within 6 months",
      "50% time savings on average",
      "Integration with existing tools",
      "24/7 support included"
    ],
    objectionHandlers: {
      "Too expensive": "Let's discuss the ROI and how this investment pays for itself...",
      "Need to think about it": "I understand. What specific concerns can I address right now?",
      "Happy with current solution": "Many of our customers said the same thing before seeing the difference..."
    }
  };
}