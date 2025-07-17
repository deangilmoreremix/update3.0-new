import { corsHeaders } from '../_shared/cors.ts';

interface RequestPayload {
  contentType: string;
  purpose: string;
  data: unknown;
  apiKey?: string;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { contentType, purpose, data, apiKey }: RequestPayload = await req.json();
    
    // Get OpenAI API key from headers or environment
    const openaiApiKey = req.headers.get('OPENAI_API_KEY') || 
                        apiKey || 
                        Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is required');
    }

    let prompt = '';
    let systemMessage = '';

    // Generate prompts based on content type
    switch (contentType) {
      case 'salesForecast':
        systemMessage = 'You are a sales forecasting expert. Analyze deal data and provide accurate revenue projections with insights.';
        prompt = generateSalesForecastPrompt(data);
        break;
      
      case 'email':
        systemMessage = 'You are a professional email writer. Create engaging, personalized emails.';
        prompt = generateEmailPrompt(data, purpose);
        break;
      
      case 'text':
        systemMessage = 'You are a text message expert. Create concise, engaging messages.';
        prompt = generateTextPrompt(data, purpose);
        break;
      
      case 'call':
        systemMessage = 'You are a sales call expert. Create effective call scripts.';
        prompt = generateCallScriptPrompt(data, purpose);
        break;
      
      case 'marketTrend':
        systemMessage = 'You are a market research analyst. Provide detailed market trend analysis.';
        prompt = generateMarketTrendPrompt(data);
        break;
      
      case 'competitor':
        systemMessage = 'You are a competitive intelligence expert. Analyze competitors thoroughly.';
        prompt = generateCompetitorPrompt(data);
        break;
      
      case 'proposal':
        systemMessage = 'You are a business proposal expert. Create compelling proposals.';
        prompt = generateProposalPrompt(data, purpose);
        break;
      
      default:
        throw new Error(`Unsupported content type: ${contentType}`);
    }

    // Call OpenAI API
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await openaiResponse.json();
    const generatedContent = result.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated from OpenAI');
    }

    return new Response(
      JSON.stringify({ 
        result: generatedContent,
        success: true 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in ai-content-generator:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

// Helper functions for generating prompts
function generateSalesForecastPrompt(data: any): string {
  const { deals, timeframe } = data;
  
  const dealsText = deals.map((deal: unknown) =>
    `- ${deal.title}: $${deal.value?.toLocaleString() || 0} (${deal.stage || 'unknown'}, ${Math.round((deal.probability || 0) * 100)}% probability)`
  ).join('\n');

  return `
Analyze the following sales pipeline and generate a comprehensive forecast for ${timeframe}:

Current Pipeline:
${dealsText}

Please provide:
1. Total pipeline value
2. Probability-weighted forecast
3. Best case, worst case, and most likely scenarios
4. Key insights and recommendations
5. Potential risks and opportunities
6. Suggested actions to improve close rates

Format the response in a clear, professional manner with specific numbers and actionable insights.
`;
}

function generateEmailPrompt(data: any, purpose: string): string {
  const { contactName } = data;
  
  return `
Write a professional email for ${purpose} to ${contactName || 'the contact'}.

The email should be:
- Professional but personable
- Clear and concise
- Include a compelling subject line
- Have a clear call-to-action
- Be appropriate for a business context

Please provide both the subject line and email body.
`;
}

function generateTextPrompt(data: any, purpose: string): string {
  const { contactName } = data;
  
  return `
Write a professional text message for ${purpose} to ${contactName || 'the contact'}.

The message should be:
- Concise and to the point (under 160 characters if possible)
- Professional but friendly
- Include a clear next step or call-to-action
- Be appropriate for business SMS communication
`;
}

function generateCallScriptPrompt(data: any, purpose: string): string {
  const { contact, previousInteractions } = data;
  
  const contactInfo = contact ? `
Contact: ${contact.name || 'Unknown'}
Company: ${contact.company || 'N/A'}
Email: ${contact.email || 'N/A'}
` : '';

  const interactions = previousInteractions?.length > 0 ? 
    `Previous interactions: ${previousInteractions.join(', ')}` : 
    'No previous interactions recorded';

  return `
Create a professional call script for ${purpose}.

${contactInfo}
${interactions}

The script should include:
1. Opening introduction
2. Purpose of the call
3. Key talking points
4. Potential objections and responses
5. Clear next steps/call-to-action
6. Professional closing

Make it conversational and natural, not robotic.
`;
}

function generateMarketTrendPrompt(data: any): string {
  const { industry, targetMarket, timeframe } = data;
  
  return `
Provide a comprehensive market trend analysis for:

Industry: ${industry}
Target Market: ${targetMarket}
Timeframe: ${timeframe}

Please include:
1. Current market size and growth projections
2. Key trends and drivers
3. Emerging opportunities
4. Potential challenges and threats
5. Competitive landscape overview
6. Recommendations for businesses in this space
7. Key metrics to monitor

Base your analysis on general market knowledge and provide specific, actionable insights.
`;
}

function generateCompetitorPrompt(data: any): string {
  const { competitorName, industry, strengths } = data;
  
  const strengthsList = strengths?.length > 0 ? 
    `Known strengths: ${strengths.join(', ')}` : 
    'Strengths to be analyzed';

  return `
Provide a comprehensive competitive analysis for:

Competitor: ${competitorName}
Industry: ${industry}
${strengthsList}

Please analyze:
1. Company overview and market position
2. Key strengths and competitive advantages
3. Potential weaknesses or vulnerabilities
4. Product/service offerings
5. Pricing strategy (if known)
6. Marketing and sales approach
7. Opportunities to differentiate against them
8. Strategic recommendations

Provide actionable insights for competing effectively.
`;
}

function generateProposalPrompt(data: any, purpose: string): string {
  const { contact, dealDetails, previousInteractions } = data;
  
  const contactInfo = contact ? `
Client: ${contact.name || 'Unknown'}
Company: ${contact.company || 'N/A'}
` : '';

  const interactions = previousInteractions?.length > 0 ? 
    `Previous discussions: ${previousInteractions.join(', ')}` : 
    'No previous interactions recorded';

  return `
Create a professional business proposal for ${purpose}.

${contactInfo}
Deal Details: ${dealDetails || 'To be specified'}
${interactions}

The proposal should include:
1. Executive summary
2. Understanding of client needs
3. Proposed solution
4. Benefits and value proposition
5. Implementation timeline
6. Investment/pricing structure
7. Next steps
8. Professional closing

Make it compelling, specific, and focused on the client's business value.
`;
}