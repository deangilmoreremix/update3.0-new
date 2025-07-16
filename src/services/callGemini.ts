

export async function callGemini(prompt: string) {
  try {
    // For demo purposes, we'll simulate a response
    console.log('Calling Gemini with prompt:', prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a simulated response based on the prompt
    let response = '';
    
    if (prompt.includes('pain points') || prompt.includes('selling angles')) {
      response = `
Based on my analysis, here are potential pain points for this company:

1. Inefficient lead management processes leading to lost opportunities
2. Difficulty tracking customer interactions across multiple channels
3. Lack of visibility into sales pipeline and forecasting
4. Manual data entry taking up valuable selling time
5. Challenges with team collaboration and knowledge sharing
6. Inability to personalize outreach at scale

Their industry is facing increasing competition and pressure to digitize sales processes while maintaining a personal touch with customers.
      `;
    } else if (prompt.includes('enriched information')) {
      const name = prompt.match(/about\s+([^\s]+)/)?.[1] || 'the contact';
      const company = prompt.match(/at\s+([^\s]+)/)?.[1] || 'the company';
      
      response = `
${name} likely holds a senior position at ${company} with responsibilities including:

- Managing customer relationships and sales processes
- Overseeing CRM implementation and adoption
- Driving revenue growth through improved sales efficiency
- Reporting on sales metrics and forecasting

Key pain points likely include:
- Data silos between departments
- Inefficient lead qualification processes
- Difficulty tracking customer interactions
- Challenges with accurate sales forecasting
- Time spent on manual data entry instead of selling

They're likely evaluated on metrics like:
- Sales cycle length
- Conversion rates
- Customer retention
- Revenue growth
      `;
    }
    
    return response.trim();
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return 'Failed to get response from Gemini.';
  }
}