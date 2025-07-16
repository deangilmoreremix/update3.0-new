import { callOpenAI } from "../services/callOpenAI";

export async function proposalGeneratorAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const company = input.company || "Unknown";
  const value = input.value || 0;
  const title = input.title || "Unknown";
  
  // Simulate steps for UI feedback
  setSteps?.([{ step: "Analyzing deal information..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Researching industry solutions..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  setSteps?.(prev => [...prev, { step: "Creating proposal structure..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Call OpenAI API (simulated)
  const _proposalContent = await callOpenAI(
    `Generate a proposal for ${company} for the "${title}" deal worth ${value}. Include executive summary, understanding of needs, solution details, and pricing.`
  );
  
  setSteps?.(prev => [...prev, { step: "Finalizing proposal...", result: "Complete" }]);
  
  return {
    title: `${title} - Proposal for ${company}`,
    executiveSummary: `This proposal presents a tailored solution for ${company}'s needs, addressing key challenges while providing exceptional value.`,
    understandingOfNeeds: "Based on our discussions, we understand your organization is seeking to streamline operations, improve customer engagement, and drive growth through digital transformation.",
    proposedSolution: "Our comprehensive platform offers seamless integration with your existing systems, AI-powered analytics, and customizable workflows that adapt to your unique processes.",
    pricing: {
      implementation: Math.round(value * 0.2),
      subscription: Math.round(value * 0.8),
      total: value,
      paymentTerms: "Net 30"
    },
    nextSteps: [
      "Review proposal details",
      "Schedule technical deep dive",
      "Finalize implementation timeline",
      "Sign agreement"
    ]
  };
}