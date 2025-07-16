import { callOpenAI } from "../services/callOpenAI";

export async function smsCampaignerAgent(input: any, setSteps?: (steps: unknown) => void) {
  const campaignGoal = input.goal || "Schedule a meeting";
  const contactName = input.name || "";
  const context = input.context || "";
  
  setSteps?.([{ step: "Creating SMS campaign..." }]);
  
  const smsSequence = await callOpenAI(`
    Create a 3-message SMS campaign sequence for:
    Goal: ${campaignGoal}
    Contact: ${contactName}
    Context: ${context}
    
    Requirements:
    - Each message under 160 characters
    - Conversational tone
    - Clear value proposition
    - Easy call-to-action
    
    Format as JSON:
    {
      "message1": "...",
      "message2": "...",
      "message3": "..."
    }
  `);
  
  try {
    return JSON.parse(smsSequence);
  } catch {
    return {
      message1: "Hey! Quick question about improving your sales process. Got 5 minutes this week?",
      message2: "Hi again! Helped similar companies increase revenue by 30%. Worth a quick chat?",
      message3: "Last try! Free consultation on boosting your sales. Reply YES to schedule."
    };
  }
}