import { callOpenAI } from "../services/callOpenAI";

export async function meetingsAgent(input: any, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const meetingType = input.meetingType || "discovery";
  
  setSteps?.([{ step: "Checking calendar availability..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Generating meeting invitation..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate meeting details based on type
  let meetingDetails = {
    subject: "",
    description: "",
    duration: 30,
    proposedTimes: []
  };
  
  switch (meetingType) {
    case "discovery":
      meetingDetails = {
        subject: `${company} + [Your Company]: Discovery Call`,
        description: `Hi ${name},

I'm looking forward to our conversation about ${company}'s needs and how our solution might help.

During this call, I'd like to:
1. Learn more about your current processes
2. Understand your key challenges
3. Discuss how our platform might address those challenges
4. Answer any questions you have

Please feel free to invite any colleagues who might benefit from joining.

Best regards,
[Your Name]`,
        duration: 30,
        proposedTimes: [
          new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
          new Date(Date.now() + 86400000 * 4).toISOString()  // 4 days from now
        ]
      };
      break;
      
    case "demo":
      meetingDetails = {
        subject: `${company}: Personalized Product Demo`,
        description: `Hi ${name},

I'm excited to show you how our platform can specifically help ${company}.

During this demo, I'll:
1. Provide a tailored walkthrough of features relevant to your needs
2. Show real-world examples of how similar companies use our solution
3. Discuss implementation and onboarding details
4. Answer any questions you have

Please feel free to invite any stakeholders who should see the demo.

Best regards,
[Your Name]`,
        duration: 45,
        proposedTimes: [
          new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
          new Date(Date.now() + 86400000 * 4).toISOString()  // 4 days from now
        ]
      };
      break;
      
    case "proposal":
      meetingDetails = {
        subject: `${company}: Proposal Review`,
        description: `Hi ${name},

I'm looking forward to reviewing our proposal for ${company}.

During this meeting, we'll:
1. Walk through the proposed solution
2. Discuss pricing and implementation timeline
3. Address any questions or concerns
4. Outline next steps

Please feel free to invite any decision-makers who should be part of this conversation.

Best regards,
[Your Name]`,
        duration: 60,
        proposedTimes: [
          new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
          new Date(Date.now() + 86400000 * 4).toISOString()  // 4 days from now
        ]
      };
      break;
      
    default:
      meetingDetails = {
        subject: `Meeting with ${company}`,
        description: `Hi ${name},

I'm looking forward to our upcoming meeting.

Best regards,
[Your Name]`,
        duration: 30,
        proposedTimes: [
          new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
          new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
          new Date(Date.now() + 86400000 * 4).toISOString()  // 4 days from now
        ]
      };
  }
  
  setSteps?.(prev => [...prev, { step: "Meeting invitation created", result: "Complete" }]);
  
  return {
    meetingDetails,
    calendarLink: "https://calendly.com/your-company/30min", // Simulated URL
    zoomDetails: {
      link: "https://zoom.us/j/123456789",
      password: "123456"
    },
    preparationNotes: [
      "Review company website and LinkedIn profile before the call",
      "Check recent news about the company",
      "Prepare specific examples relevant to their industry"
    ],
    followUpReminder: {
      timing: "1 hour after meeting",
      template: "Thank you for your time today. Here's a summary of what we discussed..."
    }
  };
}