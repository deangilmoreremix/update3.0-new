

export async function objectionHandlerAgent(input: unknown, setSteps?: (steps: unknown) => void) {
  const name = input.name || "the prospect";
  const company = input.company || "the company";
  const objection = input.objection || "It's too expensive";
  
  setSteps?.([{ step: "Analyzing objection..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSteps?.(prev => [...prev, { step: "Researching best responses..." }]);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  setSteps?.(prev => [...prev, { step: "Crafting personalized response..." }]);
  
  // Determine objection type
  let objectionType = "price";
  if (objection.toLowerCase().includes("time") || objection.toLowerCase().includes("busy")) {
    objectionType = "timing";
  } else if (objection.toLowerCase().includes("competitor") || objection.toLowerCase().includes("already use")) {
    objectionType = "competition";
  } else if (objection.toLowerCase().includes("need") || objection.toLowerCase().includes("why")) {
    objectionType = "need";
  }
  
  // Generate response based on objection type
  let response = "";
  
  switch (objectionType) {
    case "price":
      response = `I understand that budget is an important consideration, ${name}. Many of our current customers at companies similar to ${company} initially had the same concern.

Rather than focusing solely on the price, let's look at the ROI. Our customers typically see a 3.5x return within the first year through:

1. 32% increase in sales productivity
2. 28% higher lead conversion rates
3. 5+ hours saved per rep per week

Would it be helpful if I shared a specific case study from your industry showing the exact ROI breakdown?`;
      break;
      
    case "timing":
      response = `I completely understand that timing is crucial, ${name}. Many of our customers at ${company}'s stage were concerned about implementation timing.

What we've found is that delaying implementation often costs more in missed opportunities than the time investment itself. Our onboarding team can have you up and running in just 2 weeks with minimal time commitment from your team.

Would it make sense to discuss a phased implementation approach that works with your current priorities?`;
      break;
      
    case "competition":
      response = `I appreciate your loyalty to your current solution, ${name}. It's always good to work with tools you're comfortable with.

What we've found when working with companies like ${company} who switched from similar solutions is that our AI-powered features provided capabilities they didn't even know they were missing. Specifically, our customers report:

1. 42% more accurate sales forecasting
2. 3x faster lead qualification
3. 28% higher close rates

Would it be valuable to see a side-by-side comparison of how we differ from your current solution?`;
      break;
      
    case "need":
      response = `That's a fair question, ${name}. Understanding the specific value for ${company} is crucial.

Based on what you've shared about your current processes, I believe you could benefit most from:

1. Automated lead enrichment, saving your team hours of manual research
2. AI-powered deal insights that identify risks before deals stall
3. Integrated communication tools that keep everything in one place

Would it be helpful if I showed you specifically how these features address the challenges you mentioned around [specific challenge]?`;
      break;
      
    default:
      response = `I understand your concern about ${objection}, ${name}. This is something we hear from many prospective customers.

Let me address this directly: [personalized response]

Would it be helpful if we scheduled a quick call to discuss this specific concern in more detail?`;
  }
  
  setSteps?.(prev => [...prev, { step: "Response generated", result: "Complete" }]);
  
  return {
    objection,
    objectionType,
    response,
    followUpQuestions: [
      "What specific aspect of this concern is most important to you?",
      "How have you addressed this challenge in the past?",
      "What would need to be true for this to no longer be a concern?"
    ],
    additionalResources: [
      "ROI Calculator",
      "Customer Case Study",
      "Implementation Timeline",
      "Feature Comparison Sheet"
    ]
  };
}