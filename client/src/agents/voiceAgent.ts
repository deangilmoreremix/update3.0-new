import { callOpenAI } from "../services/callOpenAI";

export async function voiceAgent(input: any, setSteps?: (steps: unknown) => void) {
  const callPurpose = input.purpose || "Discovery call";
  const contact = input.contact || "Prospect";
  const company = input.company || "";
  
  setSteps?.([{ step: "Preparing call script..." }]);
  
  const callScript = await callOpenAI(`
    Create a voice call script for:
    Purpose: ${callPurpose}
    Contact: ${contact}
    Company: ${company}
    
    Include:
    1. Opening (build rapport)
    2. Purpose statement
    3. Discovery questions (3-5)
    4. Value proposition
    5. Closing with next steps
    
    Make it conversational, not robotic.
  `);
  
  return {
    script: callScript,
    keyQuestions: [
      "What's your biggest challenge right now?",
      "How are you currently handling this?",
      "What would success look like for you?",
      "What's your timeline for making a change?"
    ],
    callTips: [
      "Listen more than you speak",
      "Take notes on pain points",
      "Mirror their energy level",
      "Always confirm next steps"
    ]
  };
}