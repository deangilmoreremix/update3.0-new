

export async function smartDemoBotAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "there";
  const company = input.company || "your company";
  const _dealTitle = input.title || "our solution";
  
  setSteps?.([{ step: "Creating demo script..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Generating voice narration..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  setSteps?.(prev => [...prev, { step: "Assembling video walkthrough..." }]);
  
  const demoScript = `
# Personalized Demo for ${company}

## Introduction (0:00-0:30)
"Hello ${name}, and welcome to this personalized demo of our Smart CRM platform, specifically tailored for ${company}. Today, I'll walk you through how our solution can address your specific needs in [industry] and help you achieve [specific goal]."

## Dashboard Overview (0:30-1:30)
"Let's start with the dashboard. As you can see, it provides a comprehensive overview of your sales pipeline, customer interactions, and key metrics at a glance. For a company like ${company}, this means you'll always have real-time visibility into your sales performance."

## AI Features Showcase (1:30-3:00)
"Now, let's look at the AI capabilities that make our platform unique. Our AI assistant can help with everything from drafting personalized emails to analyzing customer sentiment. This is particularly valuable for your team at ${company} as it can save each sales rep approximately 5 hours per week."

## Contact Management (3:00-4:00)
"Here's our contact management system. Notice how it automatically enriches contact data and provides AI-powered lead scoring. This would help your team prioritize the most promising leads and ensure no opportunity falls through the cracks."

## Deal Pipeline (4:00-5:00)
"The deal pipeline gives you complete visibility into your sales process. With AI-powered deal insights, you can identify risks before deals stall and get recommendations on how to move deals forward."

## Conclusion (5:00-5:30)
"To summarize, our Smart CRM platform offers ${company} a comprehensive solution that combines powerful CRM capabilities with cutting-edge AI to help you close more deals with less effort. The next step would be to discuss implementation details and pricing options."
`;

  setSteps?.(prev => [...prev, { step: "Demo video created", result: "Complete" }]);
  
  return {
    demoScript,
    videoUrl: "https://example.com/demo-videos/custom-demo-123456.mp4", // Simulated URL
    demoLength: "5:30",
    keyHighlights: [
      "AI-powered lead enrichment and scoring",
      "Automated follow-up sequences",
      "Real-time deal insights",
      "Customizable dashboard"
    ],
    callToAction: {
      type: "Schedule Implementation Call",
      url: "https://calendly.com/your-company/implementation"
    },
    trackingId: `demo-${Date.now()}`
  };
}