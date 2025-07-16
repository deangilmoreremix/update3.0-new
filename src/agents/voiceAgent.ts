

export async function voiceAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const messageType = input.messageType || "follow-up";
  
  setSteps?.([{ step: "Creating voice message script..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Generating voice audio..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate script based on message type
  let messageScript = "";
  
  switch (messageType) {
    case "follow-up":
      messageScript = `Hey ${name}, this is [Your Name] from [Your Company]. I wanted to follow up on our conversation about how we might be able to help ${company} with your CRM needs. I'd love to answer any questions you might have. Feel free to call me back at [Your Phone] or reply to my email. Looking forward to speaking with you soon!`;
      break;
      
    case "thank-you":
      messageScript = `Hey ${name}, this is [Your Name] from [Your Company]. I just wanted to say thank you for taking the time to meet with me today. I really enjoyed learning more about ${company} and your specific needs. I'll be sending over the information we discussed, but wanted to personally thank you for your time. If you need anything at all, don't hesitate to reach out.`;
      break;
      
    case "meeting-reminder":
      messageScript = `Hey ${name}, this is [Your Name] from [Your Company]. Just a quick reminder about our meeting tomorrow at [Time]. I'm looking forward to discussing how we can help ${company} with [Specific Need]. If you need to reschedule, just let me know. Otherwise, I'll see you tomorrow!`;
      break;
      
    default:
      messageScript = `Hey ${name}, this is [Your Name] from [Your Company]. I'm reaching out regarding ${company} and wanted to connect with you. Please give me a call back at [Your Phone] when you get a chance. Looking forward to speaking with you!`;
  }
  
  setSteps?.(prev => [...prev, { step: "Voice message created", result: "Complete" }]);
  
  return {
    messageScript,
    audioUrl: "https://example.com/voice-messages/message-123456.mp3", // Simulated URL
    duration: "0:32",
    voiceType: "professional-male", // or professional-female, casual-male, casual-female
    deliveryRecommendations: {
      bestTimeToSend: "Between 9am-11am or 2pm-4pm local time",
      followUpAction: "Send email if no response within 24 hours"
    },
    transcription: messageScript // For accessibility and record-keeping
  };
}