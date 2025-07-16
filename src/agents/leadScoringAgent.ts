

export async function leadScoringAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "Unknown";
  const company = input.company || "Unknown";
  const email = input.email || "";
  const position = input.position || "";
  const industry = input.industry || "Unknown";
  
  setSteps?.([{ step: "Analyzing contact profile..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Evaluating engagement metrics..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Checking firmographic data..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  setSteps?.(prev => [...prev, { step: "Calculating lead score..." }]);
  
  // Calculate a score between 0-100
  const baseScore = Math.floor(Math.random() * 40) + 40; // 40-80 range
  
  // Adjust score based on available data
  let adjustedScore = baseScore;
  if (position.toLowerCase().includes('cto') || position.toLowerCase().includes('ceo')) adjustedScore += 10;
  if (industry === 'Technology' || industry === 'Financial Services') adjustedScore += 5;
  if (!email) adjustedScore -= 15;
  
  // Cap at 100
  const finalScore = Math.min(100, adjustedScore);
  
  setSteps?.(prev => [...prev, { step: "Lead scoring complete", result: "Complete" }]);
  
  return {
    name,
    company,
    leadScore: finalScore,
    scoringFactors: {
      demographicScore: Math.floor(Math.random() * 100),
      engagementScore: Math.floor(Math.random() * 100),
      behavioralScore: Math.floor(Math.random() * 100),
      technographicScore: Math.floor(Math.random() * 100)
    },
    priorityLevel: finalScore >= 80 ? "High" : finalScore >= 60 ? "Medium" : "Low",
    recommendedActions: [
      finalScore >= 80 ? "Immediate sales outreach" : "Nurture with targeted content",
      "Schedule a discovery call",
      "Send personalized case study"
    ],
    nextBestAction: finalScore >= 80 ? "Direct call" : "Email sequence"
  };
}