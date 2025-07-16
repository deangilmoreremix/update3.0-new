import { callOpenAI } from "../services/callOpenAI";

export async function aiDialerAgent(input: any, setSteps?: (steps: unknown) => void) {
  const callList = input.contacts || [];
  const campaign = input.campaign || "General outreach";
  const timezone = input.timezone || "EST";
  
  setSteps?.([{ step: "Optimizing call sequence..." }]);
  
  const dialerStrategy = await callOpenAI(`
    Create an AI dialer strategy for:
    Campaign: ${campaign}
    Number of contacts: ${callList.length}
    Timezone: ${timezone}
    
    Provide:
    1. Best times to call
    2. Opening script (15 seconds)
    3. Voicemail script
    4. Callback handling
    5. Objection responses
    
    Format as actionable guidance.
  `);
  
  return {
    strategy: dialerStrategy,
    callTimes: {
      optimal: ["10:00 AM - 11:30 AM", "2:00 PM - 4:00 PM"],
      avoid: ["Monday mornings", "Friday afternoons", "Lunch hours"]
    },
    metrics: {
      targetConnectRate: "25-30%",
      targetConversionRate: "5-8%",
      avgCallDuration: "3-5 minutes"
    }
  };
}