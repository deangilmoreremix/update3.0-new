import { callGemini } from "../services/callGemini";

export async function smsCampaignerAgent(input: any, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const campaignType = input.campaignType || "follow-up";
  
  setSteps?.([{ step: "Creating SMS campaign..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Generating message sequence..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate SMS sequence based on campaign type
  let smsSequence = [];
  
  switch (campaignType) {
    case "follow-up":
      smsSequence = [
        `Hi ${name}, just following up on our conversation about helping ${company} improve sales efficiency. Would you have 15 mins this week for a quick call? [Your Name]`,
        
        `Hi ${name}, I wanted to check if you received my previous message about our solution for ${company}. I'm available to answer any questions you might have. [Your Name]`,
        
        `${name}, this is my final follow-up. If you're interested in learning how we've helped companies like ${company} increase sales by 30%, just reply "interested". Otherwise, I won't bother you again. [Your Name]`
      ];
      break;
      
    case "event-reminder":
      smsSequence = [
        `Hi ${name}, just a reminder that our webinar on "AI for Sales Teams" is tomorrow at 2pm ET. We'll be covering strategies that could benefit ${company}. [Your Name]`,
        
        `${name}, our "AI for Sales Teams" webinar starts in 2 hours. Join us to learn strategies that have helped companies like ${company} increase efficiency by 35%. Here's the link: [LINK] [Your Name]`,
        
        `Hi ${name}, sorry you missed our webinar! I've attached a recording that highlights key points relevant to ${company}: [LINK]. Let me know if you'd like to discuss further. [Your Name]`
      ];
      break;
      
    case "nurture":
      smsSequence = [
        `Hi ${name}, thought you might find this article on industry trends relevant to ${company}'s challenges: [LINK]. Hope it's helpful! [Your Name]`,
        
        `${name}, based on your interest in [Topic], I wanted to share this case study about how a company similar to ${company} achieved [Result]: [LINK]. [Your Name]`,
        
        `Hi ${name}, we're hosting an exclusive roundtable for leaders in your industry next month. Would you be interested in joining? It could be valuable for ${company}'s growth strategy. [Your Name]`
      ];
      break;
      
    default:
      smsSequence = [
        `Hi ${name}, this is [Your Name] from [Your Company]. I'd love to discuss how we can help ${company} improve sales performance. Are you available for a quick call this week?`,
        
        `Hi ${name}, just checking in. I'd still love to connect about how we can help ${company}. Let me know what works for you.`,
        
        `${name}, I wanted to reach out one last time. If you're interested in learning more about our solution for ${company}, just reply "yes" and I'll send over some information.`
      ];
  }
  
  setSteps?.(prev => [...prev, { step: "SMS campaign created", result: "Complete" }]);
  
  return {
    smsSequence,
    timingRecommendations: [
      "Send first message on Tuesday or Wednesday",
      "Wait 3 days before sending follow-up",
      "Send final message 4-5 days after second message"
    ],
    bestPractices: [
      "Keep messages under 160 characters when possible",
      "Include clear call-to-action",
      "Personalize with recipient's name and company",
      "Send during business hours (9am-5pm local time)"
    ],
    complianceNotes: [
      "Ensure opt-out option is available",
      "Honor do-not-contact requests immediately",
      "Maintain records of consent"
    ]
  };
}