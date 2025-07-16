import { callOpenAI } from "../services/callOpenAI";

export async function meetingsAgent(input: any, setSteps?: (steps: unknown) => void) {
  const meetingType = input.type || "Discovery call";
  const attendees = input.attendees || ["Prospect"];
  const duration = input.duration || "30 minutes";
  const objective = input.objective || "Understand their needs";
  
  setSteps?.([{ step: "Preparing meeting agenda..." }]);
  
  const meetingPrep = await callOpenAI(`
    Prepare a comprehensive meeting plan for:
    Type: ${meetingType}
    Attendees: ${attendees.join(", ")}
    Duration: ${duration}
    Objective: ${objective}
    
    Include:
    1. Pre-meeting checklist
    2. Detailed agenda with time allocation
    3. Key questions to ask
    4. Potential objections to prepare for
    5. Success metrics
    6. Follow-up actions
    
    Make it actionable and specific.
  `);
  
  return {
    preparation: meetingPrep,
    icebreakers: [
      "How's your week going so far?",
      "I saw on LinkedIn that you...",
      "How long have you been with [company]?"
    ],
    closingStatements: [
      "Based on our discussion, the next logical step would be...",
      "I'll send you a summary of what we discussed along with...",
      "When would be a good time to reconnect next week?"
    ]
  };
}