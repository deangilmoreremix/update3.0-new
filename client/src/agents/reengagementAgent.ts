import { callOpenAI } from "../services/callOpenAI";

export async function reengagementAgent(input: any, setSteps?: (steps: unknown) => void) {
  const contactName = input.name || "valued customer";
  const daysSinceLastContact = input.daysSinceLastContact || 90;
  const previousPurchase = input.previousPurchase || "our solution";
  const company = input.company || "";
  
  setSteps?.([{ step: "Crafting re-engagement campaign..." }]);
  
  const reengagementCampaign = await callOpenAI(`
    Create a re-engagement email campaign for:
    Contact: ${contactName}
    Company: ${company}
    Days inactive: ${daysSinceLastContact}
    Previous purchase: ${previousPurchase}
    
    Create 3 emails:
    1. Friendly check-in (nostalgic, value-add)
    2. Success story / What's new (FOMO)
    3. Special offer / Direct ask
    
    Make them progressively more direct.
    Include subject lines.
  `);
  
  return {
    campaign: reengagementCampaign,
    tactics: [
      "Reference specific past success",
      "Share what they're missing",
      "Exclusive 'welcome back' offer",
      "Ask for feedback on why they left"
    ],
    timing: "Send emails 7 days apart",
    successMetrics: {
      openRate: "Target 25%+",
      clickRate: "Target 5%+",
      reactivationRate: "Target 10%+"
    }
  };
}