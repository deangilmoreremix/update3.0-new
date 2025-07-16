import { callGemini } from "../services/callGemini";
import { callOpenAI } from "../services/callOpenAI";

export async function proposalGeneratorAgent(input: any, setSteps?: (steps: unknown) => void) {
  const dealTitle = input.title || "Business Proposal";
  const company = input.company || "Your Company";
  const value = input.value || 0;
  const contact = input.contact || "Decision Maker";
  
  setSteps?.([{ step: "Researching company needs..." }]);
  
  const companyResearch = await callGemini(
    `Research ${company} and identify key business challenges and opportunities for a ${dealTitle} worth $${value}.`
  );
  
  setSteps?.(prev => [...prev, { step: "Generating executive summary..." }]);
  
  const proposalContent = await callOpenAI(`
    Create a professional business proposal for ${company} with:
    Deal: ${dealTitle}
    Value: $${value}
    Contact: ${contact}
    Company Research: ${companyResearch}
    
    Include:
    1. Executive Summary
    2. Problem Statement
    3. Proposed Solution
    4. Implementation Timeline
    5. Investment & ROI
    6. Next Steps
    
    Make it compelling and professional.
  `);
  
  return {
    proposal: proposalContent,
    keyPoints: [
      "Customized solution for their specific needs",
      "Clear ROI within 12 months",
      "Proven track record with similar companies",
      "Dedicated support throughout implementation"
    ],
    suggestedAttachments: [
      "Case studies from similar industry",
      "Technical specifications",
      "Implementation timeline",
      "Pricing breakdown"
    ]
  };
}