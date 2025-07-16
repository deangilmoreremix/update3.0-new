import { callOpenAI } from "../services/callOpenAI";

export async function objectionHandlerAgent(input: any, setSteps?: (steps: unknown) => void) {
  const objection = input.objection || "I need to think about it";
  const context = input.context || "";
  const dealValue = input.value || 0;
  const company = input.company || "";
  
  setSteps?.([{ step: "Analyzing objection..." }]);
  
  const response = await callOpenAI(`
    You are a master sales professional. Handle this objection professionally:
    
    Objection: "${objection}"
    Company: ${company}
    Deal Value: $${dealValue}
    Context: ${context}
    
    Provide:
    1. Empathetic acknowledgment
    2. Reframe the objection
    3. Provide evidence/social proof
    4. Bridge to value
    5. Suggest next step
    
    Keep it natural and conversational, not pushy.
  `);
  
  return {
    response,
    additionalTactics: [
      "Share relevant case study",
      "Offer risk-free trial period",
      "Connect them with happy customer",
      "Provide ROI calculator"
    ],
    followUpActions: [
      "Send supporting materials",
      "Schedule follow-up call",
      "Add to nurture sequence"
    ]
  };
}