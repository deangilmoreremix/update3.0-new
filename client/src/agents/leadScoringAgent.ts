import { callOpenAI } from "../services/callOpenAI";

export async function leadScoringAgent(input: any, setSteps?: (steps: unknown) => void) {
  const contact = input;
  
  setSteps?.([{ step: "Analyzing lead quality..." }]);
  
  const scoringPrompt = `
    Score this lead from 0-100 based on:
    Name: ${contact.name}
    Title: ${contact.title}
    Company: ${contact.company}
    Email: ${contact.email}
    Industry: ${contact.industry || 'Unknown'}
    Recent Activity: ${contact.lastConnected || 'No recent activity'}
    
    Consider:
    - Title seniority (decision-making power)
    - Company size and industry fit
    - Engagement level
    - Email domain quality
    
    Return as JSON:
    {
      "score": number,
      "factors": {
        "title_score": number,
        "company_score": number,
        "engagement_score": number,
        "overall_fit": number
      },
      "reasoning": "explanation",
      "recommendations": ["action1", "action2"]
    }
  `;
  
  const scoringResult = await callOpenAI(scoringPrompt);
  
  try {
    return JSON.parse(scoringResult);
  } catch {
    return {
      score: 65,
      factors: {
        title_score: 70,
        company_score: 60,
        engagement_score: 50,
        overall_fit: 65
      },
      reasoning: "Mid-level prospect with moderate engagement potential",
      recommendations: [
        "Nurture with educational content",
        "Schedule follow-up in 2 weeks",
        "Connect on LinkedIn"
      ]
    };
  }
}