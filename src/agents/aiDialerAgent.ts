

export async function aiDialerAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const callPurpose = input.callPurpose || "follow-up";
  
  setSteps?.([{ step: "Preparing call script..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Researching contact information..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Generating call preparation notes..." }]);
  
  // Generate call script based on purpose
  let callScript = "";
  
  switch (callPurpose) {
    case "introduction":
      callScript = `
# Introduction Call Script for ${name} at ${company}

## Opening (0:00-0:30)
"Hi, is this ${name}? This is [Your Name] from [Your Company]. Do you have a few minutes to chat?"

[If yes, continue. If no, ask when would be a better time to call back.]

"Great! I'm reaching out because we help companies like ${company} [brief value proposition]. I noticed that you [personalized observation about their role or company]."

## Discovery Questions (0:30-3:00)
1. "Could you tell me a bit about your current process for [relevant business process]?"
2. "What are the biggest challenges you're facing with your current approach?"
3. "How are these challenges impacting your business?"
4. "What would solving these challenges mean for you and ${company}?"

## Value Proposition (3:00-5:00)
"Based on what you've shared, I think we could help ${company} by:
1. [Benefit 1 tailored to their challenges]
2. [Benefit 2 tailored to their challenges]
3. [Benefit 3 tailored to their challenges]"

## Next Steps (5:00-6:00)
"Would it make sense to schedule a more detailed conversation where I can show you exactly how we've helped similar companies?"

[If yes, schedule meeting]
[If no, ask about objections and address them]

## Closing (6:00-6:30)
"Thank you for your time today, ${name}. I'll send you an email with some more information and [next step]. Is there anything else you'd like me to include?"
`;
      break;
      
    case "follow-up":
      callScript = `
# Follow-Up Call Script for ${name} at ${company}

## Opening (0:00-0:30)
"Hi ${name}, this is [Your Name] from [Your Company]. I'm following up on [previous interaction]. Is now still a good time to talk?"

[If yes, continue. If no, ask when would be a better time to call back.]

## Recap (0:30-1:00)
"Last time we spoke, we discussed [key points from previous conversation]. You mentioned that [specific challenge or goal they mentioned]."

## Progress Update (1:00-2:30)
"Since then, I've [action you've taken, e.g., prepared a proposal, researched their specific issue, etc.]. I wanted to share what I found and discuss next steps."

## Value Reinforcement (2:30-4:00)
"Based on what we've discussed, I believe we can help ${company} [specific value proposition tailored to their situation]. This would mean [tangible outcome for them]."

## Addressing Concerns (4:00-5:00)
"Last time, you mentioned [concern or objection]. I wanted to address that by explaining [response to concern]."

## Next Steps (5:00-6:00)
"What do you think would be the best next step for us? Would it make sense to [proposed next action]?"

## Closing (6:00-6:30)
"Thank you for your time today, ${name}. I'll [follow-up action] by [specific date]. Is there anything else you need from me in the meantime?"
`;
      break;
      
    case "closing":
      callScript = `
# Closing Call Script for ${name} at ${company}

## Opening (0:00-0:30)
"Hi ${name}, this is [Your Name] from [Your Company]. I'm calling to follow up on the proposal I sent over. Is now a good time to talk?"

[If yes, continue. If no, ask when would be a better time to call back.]

## Proposal Recap (0:30-1:30)
"I wanted to make sure you had a chance to review the proposal and see if you had any questions. To recap, we proposed [brief summary of proposal] at an investment of [price], which would help ${company} [key benefit]."

## Addressing Final Concerns (1:30-3:00)
"Before we move forward, I wanted to check if you have any remaining questions or concerns that I can address?"

[Listen and address each concern]

## Value Reinforcement (3:00-4:00)
"As we discussed, implementing our solution would help ${company} [key benefit 1], [key benefit 2], and [key benefit 3], resulting in [expected outcome]."

## Asking for the Business (4:00-5:00)
"Based on our discussions, I believe we have a solution that meets your needs. Are you ready to move forward with this?"

[If yes, explain next steps]
[If no, identify objections and address them]

## Next Steps (5:00-6:00)
"Great! Here's what happens next: [outline implementation process, timeline, etc.]"

## Closing (6:00-6:30)
"Thank you for your business, ${name}. I'm excited to start working with ${company}. I'll send over the agreement right after this call, and you can expect [first deliverable] by [date]."
`;
      break;
      
    default:
      callScript = `
# Call Script for ${name} at ${company}

## Opening (0:00-0:30)
"Hi ${name}, this is [Your Name] from [Your Company]. How are you today?"

## Purpose (0:30-1:00)
"The reason for my call is [state purpose clearly and concisely]."

## Value Proposition (1:00-2:00)
"We help companies like ${company} to [brief value proposition]."

## Questions (2:00-4:00)
[Ask relevant questions about their needs and challenges]

## Next Steps (4:00-5:00)
[Propose clear next steps based on the conversation]

## Closing (5:00-5:30)
"Thank you for your time today, ${name}. I'll [follow-up action] by [specific date]."
`;
  }
  
  setSteps?.(prev => [...prev, { step: "Call preparation complete", result: "Complete" }]);
  
  return {
    callScript,
    contactInfo: {
      name,
      company,
      phone: "+1 (555) 123-4567", // Simulated phone number
      email: `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(' ', '')}.com`, // Simulated email
      timezone: "Eastern Time (ET)"
    },
    bestTimeToCall: "Tuesday-Thursday, 9am-11am or 2pm-4pm",
    preparationNotes: [
      "Review LinkedIn profile before calling",
      "Check recent company news",
      "Review previous interactions and notes"
    ],
    postCallActions: [
      "Send follow-up email with discussed information",
      "Update CRM with call notes",
      "Schedule follow-up task for 3 days later"
    ]
  };
}