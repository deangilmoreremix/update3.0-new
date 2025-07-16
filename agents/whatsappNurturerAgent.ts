import { callGemini } from "../services/callGemini";

export async function whatsappNurturerAgent(input: any, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const nurturePath = input.nurturePath || "educational";
  
  setSteps?.([{ step: "Creating WhatsApp nurture sequence..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Generating message content..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate WhatsApp sequence based on nurture path
  let whatsappSequence = [];
  
  switch (nurturePath) {
    case "educational":
      whatsappSequence = [
        {
          day: 1,
          message: `Hi ${name}, thanks for your interest in learning more about how we help companies like ${company}. Over the next few weeks, I'll share some insights that might be valuable for you. Feel free to ask questions anytime!`
        },
        {
          day: 3,
          message: `${name}, did you know that companies in your industry typically face these 3 challenges?\n\n1. [Challenge 1]\n2. [Challenge 2]\n3. [Challenge 3]\n\nWhich of these resonates most with ${company}?`
        },
        {
          day: 7,
          message: `Here's a quick 2-minute video explaining how our solution addresses [Challenge]: [Video Link]\n\nWould this approach work for ${company}?`
        },
        {
          day: 10,
          message: `${name}, I thought you might find this case study interesting. It shows how [Similar Company] achieved [Specific Result] in just [Timeframe]: [Link]\n\nWhat do you think?`
        },
        {
          day: 14,
          message: `Quick question, ${name} - what's the biggest obstacle preventing ${company} from improving [Relevant Metric] right now?`
        }
      ];
      break;
      
    case "promotional":
      whatsappSequence = [
        {
          day: 1,
          message: `Hi ${name}, thanks for your interest in [Your Company]. I wanted to let you know about our special offer for new customers: [Special Offer]. This could be particularly valuable for ${company}.`
        },
        {
          day: 3,
          message: `${name}, here's a quick overview of what makes our solution unique:\n\n✅ [Unique Feature 1]\n✅ [Unique Feature 2]\n✅ [Unique Feature 3]\n\nWhich of these would be most valuable for ${company}?`
        },
        {
          day: 5,
          message: `Just a reminder that our special offer ends on [Date]. Would you like to schedule a quick call to discuss how it could benefit ${company}?`
        },
        {
          day: 7,
          message: `${name}, I wanted to share this testimonial from one of our customers:\n\n"[Testimonial Quote]" - [Customer Name], [Customer Position]\n\nThey faced similar challenges to ${company} before working with us.`
        },
        {
          day: 9,
          message: `Last chance, ${name}! Our special offer ends tomorrow. Would you like to take advantage of it for ${company}?`
        }
      ];
      break;
      
    case "relationship":
      whatsappSequence = [
        {
          day: 1,
          message: `Hi ${name}, it was great connecting with you about ${company}'s needs. I'm here as a resource whenever you have questions about [Your Industry].`
        },
        {
          day: 7,
          message: `${name}, I came across this article that discusses trends in [Your Industry] and thought of you: [Article Link]\n\nI found the section on [Specific Topic] particularly relevant to what we discussed about ${company}.`
        },
        {
          day: 14,
          message: `How are things going at ${company}, ${name}? Any progress with the [Specific Challenge] we discussed?`
        },
        {
          day: 21,
          message: `${name}, we're hosting a small roundtable discussion with leaders from companies like ${company} next month. The topic is [Relevant Topic]. Would you be interested in joining?`
        },
        {
          day: 28,
          message: `I was thinking about our conversation regarding ${company}'s [Specific Need], and I wanted to share how one of our customers approached a similar situation: [Brief Story]\n\nWould an approach like this work for you?`
        }
      ];
      break;
      
    default:
      whatsappSequence = [
        {
          day: 1,
          message: `Hi ${name}, thanks for connecting! I'm looking forward to learning more about ${company} and how we might be able to help.`
        },
        {
          day: 3,
          message: `${name}, I wanted to check in and see if you had any questions about our solution and how it might fit with ${company}'s needs?`
        },
        {
          day: 7,
          message: `I thought you might find this resource helpful: [Link]\n\nIt addresses some of the challenges we discussed regarding ${company}.`
        },
        {
          day: 10,
          message: `${name}, would you be interested in a quick demo to see how our solution could work specifically for ${company}?`
        },
        {
          day: 14,
          message: `Just checking in, ${name}. Is there any specific information about our solution that would be helpful for you and the team at ${company}?`
        }
      ];
  }
  
  setSteps?.(prev => [...prev, { step: "WhatsApp nurture sequence created", result: "Complete" }]);
  
  return {
    nurturePath,
    whatsappSequence,
    bestPractices: [
      "Keep messages concise and conversational",
      "Include clear questions to encourage responses",
      "Use emojis sparingly to add personality",
      "Respect business hours in recipient's timezone",
      "Pause sequence if recipient responds"
    ],
    responseTemplates: {
      askingForMoreInfo: `I'd be happy to provide more information about [Topic]. Specifically, what aspects are you most interested in?`,
      requestingCall: `I'd be glad to discuss this in more detail. Would you prefer a call or would continuing our chat here work better for you?`,
      objectionHandling: `I understand your concern about [Objection]. Many of our customers initially felt the same way. Here's how we addressed it: [Response]`
    },
    mediaRecommendations: [
      "Include 1-2 images or short videos in the sequence",
      "Keep videos under 60 seconds",
      "Ensure all media is mobile-friendly"
    ]
  };
}