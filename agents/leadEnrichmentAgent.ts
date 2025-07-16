import { callGemini } from "../services/callGemini";

export async function leadEnrichmentAgent(input: any, setSteps?: (steps: unknown) => void) {
  const name = input.name || "Unknown";
  const company = input.company || "Unknown";
  
  // Simulate steps for UI feedback
  setSteps?.([{ step: "Researching contact information..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  setSteps?.(prev => [...prev, { step: "Analyzing company data..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Call Gemini API (simulated for demo)
  const enrichedData = await callGemini(
    `Provide enriched information about ${name} who works at ${company}. Include likely job responsibilities, potential pain points, and business challenges they might face.`
  );
  
  setSteps?.(prev => [...prev, { step: "Generating insights...", result: "Complete" }]);
  
  return {
    name,
    company,
    enrichedProfile: enrichedData || `${name} works at ${company}. They likely focus on business growth and operational efficiency.`,
    potentialPainPoints: [
      "Managing customer relationships at scale",
      "Tracking sales pipeline effectively",
      "Generating accurate forecasts"
    ],
    recommendedApproach: "Focus on how our solution can streamline their sales process and provide better visibility into customer relationships."
  };
}