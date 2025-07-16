

export async function followUpAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const lastInteraction = input.lastInteraction || "our previous conversation";
  const daysElapsed = input.daysElapsed || 7;
  
  setSteps?.([{ step: "Analyzing previous interactions..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Determining optimal follow-up approach..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Generating follow-up message..." }]);
  
  // Determine follow-up type based on days elapsed
  let followUpType = "gentle";
  if (daysElapsed > 14) {
    followUpType = "reengagement";
  } else if (daysElapsed > 7) {
    followUpType = "value-add";
  }
  
  // Generate follow-up message based on type
  let followUpMessage = "";
  
  switch (followUpType) {
    case "gentle":
      followUpMessage = `
Subject: Quick follow-up regarding ${lastInteraction}

Hi ${name},

I hope you've been having a productive week. I wanted to follow up on ${lastInteraction} and see if you had any questions or if there's anything I can help clarify.

I'm available for a quick call this week if that would be helpful.

Best regards,
[Your Name]
      `;
      break;
      
    case "value-add":
      followUpMessage = `
Subject: Thought you might find this useful, ${name}

Hi ${name},

I was thinking about our discussion regarding ${lastInteraction} and came across this resource that I thought might be valuable for ${company}:

[Link to relevant industry report/case study/article]

This addresses some of the challenges we discussed, particularly around [specific challenge].

I'm happy to discuss how these insights might apply to your specific situation at ${company}. Would you have 15 minutes this week for a quick call?

Best regards,
[Your Name]
      `;
      break;
      
    case "reengagement":
      followUpMessage = `
Subject: Reconnecting with ${company}

Hi ${name},

It's been a while since we discussed ${lastInteraction}, and I wanted to check in to see how things have progressed at ${company}.

Have you made any decisions regarding the challenges we discussed? I'd be happy to share some updated information on how we've helped similar companies in your industry achieve [specific result].

Would it make sense to reconnect briefly this week?

Best regards,
[Your Name]
      `;
      break;
  }
  
  setSteps?.(prev => [...prev, { step: "Follow-up message generated", result: "Complete" }]);
  
  return {
    followUpType,
    followUpMessage,
    recommendedChannel: daysElapsed > 10 ? "email + phone" : "email",
    bestTimeToSend: "Tuesday or Wednesday morning between 9-11am",
    nextStepRecommendation: daysElapsed > 14 ? "Schedule a call if no response" : "Wait 3-5 days before next follow-up",
    alternateApproaches: [
      "Connect on LinkedIn with a personalized message",
      "Share a relevant case study",
      "Introduce a mutual connection if available"
    ]
  };
}