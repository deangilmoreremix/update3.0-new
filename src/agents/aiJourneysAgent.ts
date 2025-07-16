

export async function aiJourneysAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const journeyType = input.journeyType || "onboarding";
  
  setSteps?.([{ step: "Creating customer journey..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Mapping touchpoints..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  setSteps?.(prev => [...prev, { step: "Generating content for each stage..." }]);
  
  // Generate journey based on type
  let journey = [];
  
  switch (journeyType) {
    case "onboarding":
      journey = [
        {
          day: 1,
          channel: "email",
          subject: `Welcome to [Your Company], ${name}!`,
          content: `Hi ${name},

Welcome to [Your Company]! We're excited to have ${company} on board.

Here's what you can expect over the next few weeks:

1. Initial setup and configuration (Days 1-3)
2. Team training session (Days 4-7)
3. First success check-in (Day 14)
4. Advanced features walkthrough (Day 21)

Your dedicated Customer Success Manager, [CSM Name], will be reaching out shortly to schedule your kickoff call.

In the meantime, here are some resources to help you get started:
- [Quick Start Guide]
- [Video Tutorials]
- [Knowledge Base]

If you have any questions, please don't hesitate to reach out.

Best regards,
[Your Name]
[Your Company]`
        },
        {
          day: 3,
          channel: "email",
          subject: `${company}'s Kickoff Call - Schedule Now`,
          content: `Hi ${name},

I hope you've had a chance to explore our platform. It's time to schedule your kickoff call where we'll:

1. Configure your account settings
2. Import your initial data
3. Set up your first automation
4. Answer any questions you have

Please use this link to schedule a time that works for you: [Calendly Link]

Looking forward to helping you get started!

Best regards,
[CSM Name]
Customer Success Manager`
        },
        {
          day: 7,
          channel: "email",
          subject: `How's your experience with [Your Company] so far?`,
          content: `Hi ${name},

It's been a week since you started with us, and I wanted to check in on your experience so far.

Have you been able to [key action 1] and [key action 2] yet?

If you're running into any challenges, please let me know, and I'd be happy to help.

Also, I've attached a guide on [relevant feature] that might be helpful for your team at ${company}.

Best regards,
[CSM Name]`
        },
        {
          day: 14,
          channel: "call",
          subject: "14-Day Success Check-In",
          content: `
# 14-Day Success Check-In Call Script

## Introduction
"Hi ${name}, this is [CSM Name] from [Your Company]. Today marks two weeks since you started using our platform, and I wanted to check in on your progress."

## Questions to Ask
1. "How has your experience been so far?"
2. "Have you been able to [key action 1] and [key action 2]?"
3. "Are there any features you're finding particularly valuable?"
4. "Are there any challenges or roadblocks you're facing?"

## Value Reinforcement
"I noticed that your team has already [positive observation]. That's great progress! Many of our customers see [typical result] after implementing this feature."

## Next Steps
"Based on our conversation today, I recommend focusing on [recommendation]. I'll send you some resources on this after our call."

## Closing
"Thank you for your time today. Our next check-in will be in two weeks, but please reach out if you need anything before then."
`
        },
        {
          day: 21,
          channel: "email",
          subject: `Unlock Advanced Features for ${company}`,
          content: `Hi ${name},

Now that you've been using our platform for a few weeks, I wanted to introduce you to some advanced features that could be valuable for ${company}:

1. [Advanced Feature 1]: This could help you [specific benefit]
2. [Advanced Feature 2]: Many companies like yours use this to [specific benefit]
3. [Advanced Feature 3]: This could save your team [time/money/resources]

Would you be interested in a quick 30-minute session to explore these features?

Best regards,
[CSM Name]`
        },
        {
          day: 30,
          channel: "email",
          subject: `Your First Month with [Your Company] - Review & Next Steps`,
          content: `Hi ${name},

Congratulations on completing your first month with [Your Company]!

Here's a summary of what you've accomplished:
- [Achievement 1]
- [Achievement 2]
- [Achievement 3]

Based on your usage patterns, here are some recommendations for your next steps:
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

I'd love to schedule a 30-minute review call to discuss your experience and plan for the next quarter. Would any of these times work for you?
- [Proposed Time 1]
- [Proposed Time 2]
- [Proposed Time 3]

Best regards,
[CSM Name]`
        }
      ];
      break;
      
    case "reactivation":
      journey = [
        {
          day: 1,
          channel: "email",
          subject: `We miss you at [Your Company], ${name}`,
          content: `Hi ${name},

I noticed that it's been a while since you've used our platform at ${company}, and I wanted to check in.

We've made several improvements that I think would be valuable for your team:

1. [New Feature 1]: This addresses [specific pain point]
2. [New Feature 2]: This could help you [specific benefit]
3. [New Feature 3]: This has helped similar companies achieve [specific result]

Would you be open to a quick 15-minute call to discuss how these new features might benefit ${company}?

Best regards,
[Your Name]`
        },
        {
          day: 5,
          channel: "email",
          subject: `${company}: Special offer for returning customers`,
          content: `Hi ${name},

I wanted to follow up on my previous email and let you know that we're currently offering [special incentive] for returning customers.

This would be a great opportunity to revisit our platform and see how our new features could help ${company} [achieve specific goal].

This offer is available until [date], so I'd love to reconnect soon.

Best regards,
[Your Name]`
        },
        {
          day: 10,
          channel: "call",
          subject: "Reactivation Call",
          content: `
# Reactivation Call Script

## Introduction
"Hi ${name}, this is [Your Name] from [Your Company]. I've been trying to reach you regarding your account with us. Do you have a few minutes to chat?"

## Reason for Call
"The reason I'm calling is that we've noticed you haven't been using our platform recently, and I wanted to understand if there were any specific reasons or challenges that led to that."

## Listen and Address Concerns
[Listen to their feedback and address any concerns they raise]

## Value Proposition
"Since you last used our platform, we've made several improvements that I think would be valuable for ${company}, including [new feature 1] and [new feature 2]."

## Special Offer
"We're currently offering [special incentive] for returning customers, which would give you [specific benefit]."

## Next Steps
"Would you be interested in a quick demo of the new features to see if they address your needs?"

## Closing
"Thank you for your time today. I'll send you an email with the information we discussed, and I look forward to helping you get the most out of our platform."
`
        },
        {
          day: 14,
          channel: "email",
          subject: `Last chance: Special offer for ${company}`,
          content: `Hi ${name},

I wanted to send one final note regarding our special offer for ${company}.

The [special incentive] I mentioned is only available until [date], which is just a few days away.

Many companies like yours have returned to our platform and are seeing great results with our new features:

- [Company Example 1] achieved [specific result]
- [Company Example 2] improved [specific metric]

If you're interested in learning more, please let me know and I'd be happy to schedule a quick call.

Best regards,
[Your Name]`
        }
      ];
      break;
      
    case "nurture":
      journey = [
        {
          day: 1,
          channel: "email",
          subject: `Resources for ${company} based on our conversation`,
          content: `Hi ${name},

Thank you for our recent conversation about ${company}'s needs.

As promised, here are some resources that might be helpful:

1. [Resource 1]: This addresses [specific topic you discussed]
2. [Resource 2]: This provides more information about [another topic]
3. [Case Study]: This shows how [similar company] achieved [specific result]

Please let me know if you have any questions or if there's anything else I can help with.

Best regards,
[Your Name]`
        },
        {
          day: 7,
          channel: "email",
          subject: `Thought you might find this interesting, ${name}`,
          content: `Hi ${name},

I came across this [article/report/webinar] about [relevant topic] and thought it might be interesting for you given your role at ${company}.

Here's the link: [Link]

One key insight I found particularly relevant to your situation was [specific insight].

Would love to hear your thoughts if you get a chance to check it out.

Best regards,
[Your Name]`
        },
        {
          day: 14,
          channel: "email",
          subject: `Quick question about ${company}'s [specific challenge]`,
          content: `Hi ${name},

In our previous conversation, you mentioned that ${company} is facing challenges with [specific challenge].

I've been thinking about this, and I wanted to share how some of our customers have addressed similar challenges:

1. [Company Example 1] implemented [solution] and saw [result]
2. [Company Example 2] approached it by [approach] and achieved [result]

Would you be interested in learning more about how these approaches might work for ${company}?

Best regards,
[Your Name]`
        },
        {
          day: 21,
          channel: "email",
          subject: `Invitation: Exclusive webinar for ${company}`,
          content: `Hi ${name},

I'd like to invite you to an exclusive webinar we're hosting on [date] about [relevant topic].

This would be particularly relevant for ${company} because:

1. You'll learn about [specific benefit 1]
2. Our industry expert will discuss [specific benefit 2]
3. You'll have the opportunity to ask questions specific to your situation

Here's the registration link: [Link]

I hope you can join us!

Best regards,
[Your Name]`
        },
        {
          day: 28,
          channel: "call",
          subject: "Check-in Call",
          content: `
# Nurture Check-in Call Script

## Introduction
"Hi ${name}, this is [Your Name] from [Your Company]. I've been sharing some resources with you over the past few weeks, and I wanted to check in to see if you found them helpful."

## Value-Add
"I also wanted to let you know about [new development] that might be relevant to ${company} given your interest in [topic]."

## Gauging Interest
"Has anything changed in terms of your priorities or challenges since we last spoke?"

## Soft Close
"Would it make sense to schedule a more detailed conversation about how we might be able to help with [specific challenge]?"

## Closing
"Thank you for your time today. I'll continue to share relevant resources, and please don't hesitate to reach out if anything comes up."
`
        }
      ];
      break;
      
    default:
      journey = [
        {
          day: 1,
          channel: "email",
          subject: `Following up with ${company}`,
          content: `Hi ${name},

Thank you for your interest in [Your Company].

I'd love to learn more about ${company}'s needs and discuss how we might be able to help.

Would you be available for a quick 15-minute call this week?

Best regards,
[Your Name]`
        },
        {
          day: 3,
          channel: "email",
          subject: `Re: Following up with ${company}`,
          content: `Hi ${name},

I wanted to follow up on my previous email about connecting to discuss ${company}'s needs.

I'd be happy to share some insights on how companies similar to yours have [achieved specific result].

Would any of these times work for a quick call?
- [Proposed Time 1]
- [Proposed Time 2]
- [Proposed Time 3]

Best regards,
[Your Name]`
        },
        {
          day: 7,
          channel: "email",
          subject: `One last follow-up for ${company}`,
          content: `Hi ${name},

I wanted to send one final note regarding [Your Company] and how we might be able to help ${company}.

If you're interested in learning more, please let me know and I'd be happy to schedule a call at your convenience.

If I don't hear back, I'll assume the timing isn't right and won't bother you again.

Best regards,
[Your Name]`
        }
      ];
  }
  
  setSteps?.(prev => [...prev, { step: "Customer journey created", result: "Complete" }]);
  
  return {
    journeyType,
    journey,
    automationRules: {
      pauseIf: "Reply received or meeting scheduled",
      skipTo: "If specific action taken, skip to appropriate stage",
      reschedule: "If email bounces, retry in 24 hours"
    },
    performanceMetrics: {
      expectedOpenRate: "30-40%",
      expectedResponseRate: "10-15%",
      expectedConversionRate: "3-5%"
    },
    customizationNotes: [
      "Personalize each message with specific details about the recipient and company",
      "Adjust timing based on recipient engagement",
      "A/B test subject lines for optimal performance"
    ]
  };
}