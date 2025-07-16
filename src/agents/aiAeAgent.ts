

export async function aiAeAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const dealTitle = input.title || "our solution";
  
  setSteps?.([{ step: "Preparing demo script..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Analyzing prospect needs..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Generating personalized demo flow..." }]);
  
  const demoScript = `
# Demo Script for ${company}: ${dealTitle}

## Introduction (2 minutes)
- Thank ${name} for their time
- Confirm the agenda and their specific interests
- Brief overview of what we'll cover today

## Company Overview (3 minutes)
- Quick introduction to our company and mission
- Highlight relevant customer success stories in ${input.industry || "their industry"}
- Mention our unique approach to solving their challenges

## Product Demo (15 minutes)
1. Start with the dashboard overview
   - Show how it provides immediate value and insights
   - Highlight the AI-powered features

2. Demonstrate the contact management system
   - Show how it automatically enriches lead data
   - Demonstrate the AI lead scoring functionality

3. Present the deal pipeline
   - Show how it provides visibility and forecasting
   - Highlight the AI deal insights feature

4. Showcase the AI assistant capabilities
   - Demonstrate how it can generate emails, call scripts, etc.
   - Show how it integrates with their workflow

## Value Proposition (5 minutes)
- Summarize key benefits specific to ${company}'s needs
- Present ROI metrics and expected outcomes
- Address anticipated objections

## Next Steps (5 minutes)
- Discuss implementation timeline
- Review pricing options
- Agree on follow-up actions

## Q&A
- Be prepared for questions about:
  - Security and compliance
  - Integration with existing tools
  - Customization options
  - Support and training
`;

  setSteps?.(prev => [...prev, { step: "Demo script generated", result: "Complete" }]);
  
  return {
    demoScript,
    keyTalkingPoints: [
      "AI-powered lead enrichment and scoring",
      "Automated follow-up sequences",
      "Real-time deal insights and recommendations",
      "Time savings of 5+ hours per week"
    ],
    anticipatedQuestions: [
      "How does your pricing compare to competitors?",
      "What kind of onboarding support do you provide?",
      "How long does implementation typically take?",
      "Can we integrate with our existing tools?"
    ],
    objectionHandling: {
      "Too expensive": "Focus on ROI and time savings",
      "We already have a CRM": "Highlight AI capabilities that their current solution lacks",
      "Not the right time": "Discuss implementation timeline flexibility"
    }
  };
}