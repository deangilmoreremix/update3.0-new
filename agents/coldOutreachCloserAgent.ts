import { callOpenAI } from "../services/callOpenAI";

export async function coldOutreachCloserAgent(input: any, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const dealValue = input.value || "$10,000";
  
  setSteps?.([{ step: "Analyzing deal status..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Crafting closing sequence..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  setSteps?.(prev => [...prev, { step: "Generating urgency triggers..." }]);
  
  const closingSequence = {
    email1: {
      subject: `Next steps for ${company} (time-sensitive)`,
      body: `Hi ${name},

I wanted to follow up on our previous conversations about implementing our solution at ${company}.

Based on our discussions, I've put together a proposal that addresses your key requirements:

1. Streamlined customer data management
2. AI-powered sales insights
3. Automated follow-up sequences

To ensure you can take advantage of our Q2 pricing, we'd need to finalize the agreement by the end of this month. This would also allow us to get you onboarded before the busy season.

Would you have 15 minutes this week to discuss the final details?

Best regards,
[Your Name]`
    },
    
    email2: {
      subject: `Re: Next steps for ${company} (time-sensitive)`,
      body: `Hi ${name},

I'm following up on my previous email about finalizing your ${company} account.

Just a reminder that our Q2 pricing offer expires this Friday. After that, the investment would increase by approximately 15%.

I've also attached a case study from [Similar Company] that achieved a 32% increase in sales efficiency within the first 3 months of implementation.

Would tomorrow at 2pm work for a quick call to answer any remaining questions?

Best regards,
[Your Name]`
    },
    
    finalCall: {
      subject: `Final opportunity: ${company} + [Our Company]`,
      body: `Hi ${name},

This is my final follow-up regarding our solution for ${company}.

I understand you're busy, so I've prepared everything needed to move forward:

1. Implementation plan (attached)
2. Pricing breakdown showing ${dealValue} annual value
3. ROI calculator showing expected 3.5x return

If I don't hear back, I'll assume the timing isn't right and close this opportunity in our system.

Would you prefer to:
A) Schedule a quick call to finalize
B) Receive the agreement via email
C) Revisit this in the future

Just reply with A, B, or C and I'll take care of the rest.

Best regards,
[Your Name]`
    }
  };
  
  setSteps?.(prev => [...prev, { step: "Closing sequence generated", result: "Complete" }]);
  
  return {
    closingSequence,
    timingRecommendations: {
      email1: "Send immediately",
      email2: "Send 3 days after Email 1 if no response",
      finalCall: "Send 4 days after Email 2 if no response"
    },
    urgencyTriggers: [
      "Limited-time pricing",
      "End of quarter deadline",
      "Implementation timeline before busy season"
    ],
    closingTips: [
      "Personalize each message with specific details from previous conversations",
      "Include social proof relevant to their industry",
      "Make the final step as easy as possible with clear options"
    ]
  };
}