import { callGemini } from "../services/callGemini";
import { callOpenAI } from "../services/callOpenAI";

export async function aiJourneysAgent(input: any, setSteps?: (steps: unknown) => void) {
  const customerType = input.customerType || "B2B SaaS";
  const journeyStage = input.stage || "Awareness";
  const persona = input.persona || "Decision Maker";
  
  setSteps?.([{ step: "Mapping customer journey..." }]);
  
  const journeyInsights = await callGemini(
    `Map the customer journey for ${customerType} ${persona} currently in ${journeyStage} stage. Include touchpoints, emotions, and opportunities.`
  );
  
  setSteps?.(prev => [...prev, { step: "Creating personalized journey..." }]);
  
  const personalizedJourney = await callOpenAI(`
    Based on these insights: ${journeyInsights}
    
    Create a personalized customer journey with:
    1. Next best actions (3-5)
    2. Content recommendations
    3. Timing for each touchpoint
    4. Success metrics
    5. Potential roadblocks
    
    Make it specific and actionable.
  `);
  
  return {
    journey: personalizedJourney,
    touchpoints: [
      { stage: "Awareness", action: "Educational content", timing: "Week 1" },
      { stage: "Consideration", action: "Case studies", timing: "Week 2-3" },
      { stage: "Decision", action: "Demo + Trial", timing: "Week 4" },
      { stage: "Purchase", action: "Onboarding", timing: "Week 5+" }
    ],
    automations: [
      "Welcome email series",
      "Behavior-triggered content",
      "Re-engagement campaigns",
      "Milestone celebrations"
    ]
  };
}