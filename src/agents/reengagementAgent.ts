

export async function reengagementAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const lastInteractionDate = input.lastInteractionDate || "3 months ago";
  
  setSteps?.([{ step: "Analyzing contact history..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Researching industry updates..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Creating reengagement campaign..." }]);
  
  // Generate reengagement sequence
  const reengagementSequence = [
    {
      channel: "email",
      subject: `Reconnecting with ${company}`,
      content: `Hi ${name},

It's been a while since we last connected (${lastInteractionDate}), and I wanted to reach out to see how things are going at ${company}.

Since we last spoke, we've introduced several new features that I think would be particularly valuable for you:

1. [New Feature 1]: This addresses [specific pain point]
2. [New Feature 2]: This helps with [specific benefit]
3. [New Feature 3]: This provides [specific value]

I'd love to reconnect and share how these updates might benefit ${company}. Would you be open to a quick 15-minute catch-up call next week?

Best regards,
[Your Name]`
    },
    {
      channel: "email",
      subject: `New insights for ${company}`,
      content: `Hi ${name},

I hope you're doing well. I recently came across some interesting data about [relevant industry trend] that I thought might be valuable for ${company}.

[Brief insight about the trend and its implications]

This reminded me of our previous conversations about [specific topic], and I wondered if this is still a priority for your team?

I'd be happy to share more insights and discuss how our latest solutions might help. Would you have time for a quick call next week?

Best regards,
[Your Name]`
    },
    {
      channel: "linkedin",
      subject: "LinkedIn Connection Message",
      content: `Hi ${name}, I noticed some exciting developments at ${company} recently. I'd love to reconnect and learn more about your current priorities and how we might be able to support your goals. Would you be open to a quick conversation?`
    },
    {
      channel: "email",
      subject: `Special offer for ${company}`,
      content: `Hi ${name},

I wanted to reach out with a special offer exclusively for previous contacts like yourself.

For a limited time, we're offering [special incentive] for companies that re-engage with us. This could be particularly valuable for ${company} given your interest in [specific area].

This offer expires on [date], so I'd love to connect soon to discuss how we can help you achieve [specific goal].

Best regards,
[Your Name]`
    },
    {
      channel: "phone",
      subject: "Final Outreach Call",
      content: `
# Reengagement Call Script

## Introduction
"Hi ${name}, this is [Your Name] from [Your Company]. We haven't spoken in a while, and I wanted to reconnect. Do you have a few minutes to chat?"

## Reason for Call
"The reason I'm calling is that we've introduced several new features and offerings that I think could be valuable for ${company} based on our previous conversations."

## Value Proposition
"Specifically, our new [feature/solution] has been helping companies like yours to [specific benefit]. For example, [similar company] was able to [specific result]."

## Gauging Interest
"Is this something that would still be relevant for ${company}?"

## Special Offer
"We're currently offering [special incentive] for previous contacts who re-engage with us. This is available until [date]."

## Next Steps
"Would it make sense to schedule a more detailed conversation to explore how these new offerings might benefit ${company}?"

## Closing
"Thank you for your time today, ${name}. I'll [follow-up action] by [specific date]."
`
    }
  ];
  
  setSteps?.(prev => [...prev, { step: "Reengagement campaign created", result: "Complete" }]);
  
  return {
    reengagementSequence,
    timingRecommendations: [
      "Send first email immediately",
      "Wait 5-7 days before second email",
      "Send LinkedIn message 3 days after second email",
      "Send special offer email 5 days after LinkedIn message",
      "Make phone call 3-4 days after special offer email"
    ],
    personalizationTips: [
      "Reference specific previous interactions or interests",
      "Mention recent company news or achievements",
      "Tailor value proposition to their specific industry challenges",
      "Use mutual connections where possible"
    ],
    successMetrics: {
      expectedResponseRate: "15-20%",
      conversionGoal: "Schedule discovery call",
      followUpStrategy: "If no response after complete sequence, move to quarterly check-in schedule"
    }
  };
}