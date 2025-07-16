import { callOpenAI } from "../services/callOpenAI";

export async function smartDemoBotAgent(input: any, setSteps?: (steps: unknown) => void) {
  const question = input.question || "";
  const productContext = input.productContext || "Our product is a comprehensive CRM solution";
  const askedBy = input.contact || "Prospect";
  
  setSteps?.([{ step: "Processing demo question..." }]);
  
  const answer = await callOpenAI(`
    You are a smart demo assistant. Answer this question during a product demo:
    
    Question: "${question}"
    Asked by: ${askedBy}
    Product context: ${productContext}
    
    Provide a clear, concise answer that:
    - Directly addresses the question
    - Highlights product value
    - Uses simple language
    - Suggests next action if relevant
    
    Keep it under 100 words.
  `);
  
  return {
    answer,
    relatedFeatures: [
      "Advanced reporting dashboard",
      "Integration capabilities",
      "Mobile app access",
      "Customization options"
    ],
    suggestedFollowUp: "Would you like me to show you how this works in practice?"
  };
}