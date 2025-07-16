

export async function callOpenAI(prompt: string) {
  try {
    // For demo purposes, we'll simulate a response
    console.log('Calling OpenAI with prompt:', prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate a simulated response based on the prompt
    let response = '';
    
    if (prompt.includes('cold email sequence')) {
      // Extract the name and company from the prompt
      const nameMatch = prompt.match(/targeting\s+([^\n.]+)/);
      const name = nameMatch ? nameMatch[1] : 'there';
      
      // Create a JSON response for the email sequence
      response = JSON.stringify({
        "first_email": `Subject: Quick question about sales efficiency at ${name}'s company\n\nHi ${name},\n\nI noticed your team might be facing challenges with lead management and tracking customer interactions across channels - common pain points in your industry.\n\nWe've helped similar companies reduce their sales cycle by 28% through our AI-powered CRM that automates data entry and provides real-time insights.\n\nWould you be open to a quick 15-minute call to see if we might be able to help your team as well?\n\nBest regards,\nYour Name`,
        
        "follow_up": `Subject: Re: Quick question about sales efficiency\n\nHi ${name},\n\nI wanted to follow up on my previous email about improving your sales processes.\n\nOne thing I didn't mention is how our platform specifically addresses the challenge of sales forecasting accuracy. Our customers typically see a 35% improvement in forecast accuracy within the first quarter.\n\nI'd be happy to share some specific examples of how we've helped companies in your industry. Would tomorrow at 2pm work for a brief call?\n\nBest regards,\nYour Name`,
        
        "final_bump": `Subject: Re: Quick question about sales efficiency\n\nHi ${name},\n\nI'm reaching out one last time regarding ways to improve your team's sales efficiency and customer relationship management.\n\nIf you're interested in learning how we've helped companies like yours save 5+ hours per week per sales rep while increasing conversion rates, just let me know what time works best for you.\n\nIf I don't hear back, I'll assume the timing isn't right and won't bother you again.\n\nBest regards,\nYour Name`
      }, null, 2);
    } else {
      response = "I'm not sure how to respond to this prompt.";
    }
    
    return response;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return 'Failed to get response from OpenAI.';
  }
}