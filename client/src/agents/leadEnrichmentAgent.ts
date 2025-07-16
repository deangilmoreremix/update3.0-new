import { callGemini } from "../services/callGemini";
import { callOpenAI } from "../services/callOpenAI";

export async function leadEnrichmentAgent(input: any, setSteps?: (steps: unknown) => void) {
  const name = input.name || "Unknown";
  const company = input.company || "Unknown Company";
  const email = input.email || "";
  const title = input.title || "";

  setSteps?.([{ step: "Analyzing contact information..." }]);
  
  const enrichmentPrompt = `
    Research and enrich this contact profile:
    Name: ${name}
    Company: ${company}
    Email: ${email}
    Title: ${title}
    
    Provide insights about their role, company, and potential business needs.
  `;
  
  const enrichedProfile = await callGemini(enrichmentPrompt);
  
  setSteps?.(prev => [...prev, { step: "Identifying pain points..." }]);
  
  const painPointsPrompt = `
    Based on this profile: ${enrichedProfile}
    List 3-5 potential pain points or challenges this person might face in their role.
  `;
  
  const painPointsResponse = await callOpenAI(painPointsPrompt);
  
  // Parse pain points from response
  const painPoints = painPointsResponse.split('\n').filter(point => point.trim());
  
  return {
    enrichedProfile,
    potentialPainPoints: painPoints,
    recommendations: [
      "Schedule a discovery call to validate pain points",
      "Send relevant case studies",
      "Connect with their team members"
    ]
  };
}