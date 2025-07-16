import { callOpenAI } from "../services/callOpenAI";

export async function whatsappNurturerAgent(input: any, setSteps?: (steps: unknown) => void) {
  const contactName = input.name || "there";
  const lastInteraction = input.lastInteraction || "No previous interaction";
  const interests = input.interests || "General business topics";
  
  setSteps?.([{ step: "Creating WhatsApp nurture sequence..." }]);
  
  const whatsappMessages = await callOpenAI(`
    Create a WhatsApp nurture campaign for ${contactName}.
    Last interaction: ${lastInteraction}
    Interests: ${interests}
    
    Create 5 messages spread over 2 weeks:
    - Mix of value content, questions, and soft CTAs
    - Use emojis appropriately
    - Keep casual but professional
    - Each message under 100 words
    
    Format as JSON array with day and message.
  `);
  
  try {
    return JSON.parse(whatsappMessages);
  } catch {
    return [
      { day: 1, message: "Hey! 👋 Saw this article about sales automation and thought of you. [link] Worth a quick read!" },
      { day: 3, message: "Quick question - what's your biggest sales challenge right now? Always curious to learn from pros like you 🎯" },
      { day: 6, message: "Just helped a client increase conversions by 40% with one simple change. Want to hear about it? ☕" },
      { day: 10, message: "Free resource alert! 📊 Our Sales Playbook template is getting great feedback. Should I send it over?" },
      { day: 14, message: "Been 2 weeks! How's that project going? If you need any help with sales optimization, I'm here 🚀" }
    ];
  }
}