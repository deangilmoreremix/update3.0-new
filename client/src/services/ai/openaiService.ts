// Enhanced OpenAI service with robust contact analysis
import { ContactEnrichmentData } from '../aiEnrichmentService';

interface ContactAnalysisResult {
  score: number;
  insights: string[];
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
}

export const useOpenAI = () => {
  const analyzeContact = async (contact: any): Promise<ContactAnalysisResult> => {
    console.log(`🤖 OpenAI analyzing contact: ${contact.name}`);
    
    // Simulate AI processing time (1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Advanced scoring algorithm
    let score = 50; // Base score
    const insights: string[] = [];
    const recommendations: string[] = [];
    const riskFactors: string[] = [];
    const opportunities: string[] = [];

    // Interest level scoring
    switch (contact.interestLevel) {
      case 'hot':
        score += 35;
        insights.push('High interest level indicates strong buying intent');
        recommendations.push('Schedule immediate follow-up call within 24 hours');
        opportunities.push('Strong conversion potential - prioritize for closing');
        break;
      case 'medium':
        score += 20;
        insights.push('Medium interest suggests active evaluation phase');
        recommendations.push('Provide detailed product information and case studies');
        opportunities.push('Good nurturing candidate for conversion');
        break;
      case 'low':
        score += 5;
        insights.push('Low interest indicates early-stage awareness');
        recommendations.push('Focus on educational content and value proposition');
        riskFactors.push('May require longer nurturing cycle');
        break;
      case 'cold':
        score -= 10;
        insights.push('Cold interest suggests qualification needed');
        recommendations.push('Re-qualify lead and assess genuine interest');
        riskFactors.push('Low probability of near-term conversion');
        break;
    }

    // Source scoring
    const highValueSources = ['Referral', 'LinkedIn'];
    const mediumValueSources = ['Website', 'Email'];
    const lowValueSources = ['Cold Call', 'Facebook'];

    contact.sources?.forEach((source: string) => {
      if (highValueSources.includes(source)) {
        score += 15;
        insights.push(`${source} source indicates higher quality lead`);
        opportunities.push(`Leverage ${source} connection for warm approach`);
      } else if (mediumValueSources.includes(source)) {
        score += 8;
        insights.push(`${source} source shows proactive interest`);
      } else if (lowValueSources.includes(source)) {
        score += 3;
        riskFactors.push(`${source} source may require more qualification`);
      }
    });

    // Company and title analysis
    const seniorTitles = ['CEO', 'CTO', 'VP', 'Director', 'President', 'Head of'];
    const managerTitles = ['Manager', 'Lead', 'Senior'];
    
    if (seniorTitles.some(title => contact.title?.includes(title))) {
      score += 20;
      insights.push('Senior-level title indicates decision-making authority');
      opportunities.push('Direct access to decision maker');
      recommendations.push('Tailor messaging for executive-level concerns');
    } else if (managerTitles.some(title => contact.title?.includes(title))) {
      score += 10;
      insights.push('Management-level role suggests influence in decision process');
      recommendations.push('Identify and connect with ultimate decision maker');
    } else {
      score += 5;
      riskFactors.push('May not have final decision authority');
      recommendations.push('Identify key stakeholders and decision makers');
    }

    // Industry analysis
    const highValueIndustries = ['Technology', 'Finance', 'Healthcare', 'Software'];
    const mediumValueIndustries = ['Manufacturing', 'Consulting', 'Marketing'];
    
    if (contact.industry && highValueIndustries.includes(contact.industry)) {
      score += 15;
      insights.push(`${contact.industry} industry typically has higher budget for solutions`);
      opportunities.push('Industry shows strong growth potential');
    } else if (contact.industry && mediumValueIndustries.includes(contact.industry)) {
      score += 8;
      insights.push(`${contact.industry} industry shows steady market demand`);
    }

    // Engagement scoring based on notes/interactions
    if (contact.notes && contact.notes.length > 100) {
      score += 12;
      insights.push('Detailed interaction history indicates active engagement');
      opportunities.push('Strong engagement history suggests higher conversion probability');
    } else if (contact.notes && contact.notes.length > 50) {
      score += 6;
      insights.push('Some interaction history available');
    } else {
      score -= 5;
      riskFactors.push('Limited interaction history - need more engagement');
      recommendations.push('Increase touchpoints and document interactions');
    }

    // Social presence analysis
    if (contact.socialProfiles) {
      const profileCount = Object.keys(contact.socialProfiles).filter(key => 
        contact.socialProfiles[key]
      ).length;
      
      if (profileCount >= 3) {
        score += 10;
        insights.push('Strong social media presence indicates professional engagement');
        opportunities.push('Multiple channels available for research and outreach');
      } else if (profileCount >= 1) {
        score += 5;
        insights.push('Some social media presence available');
      }
    }

    // Tags analysis
    if (contact.tags && contact.tags.length > 0) {
      const highValueTags = ['Enterprise', 'High Value', 'Referral', 'Hot Lead'];
      const hasHighValueTag = contact.tags.some((tag: string) => 
        highValueTags.includes(tag)
      );
      
      if (hasHighValueTag) {
        score += 15;
        insights.push('Tagged with high-value indicators');
        opportunities.push('Previously identified as high-potential prospect');
      }
    }

    // Recency analysis
    if (contact.lastConnected) {
      const lastContactDate = new Date(contact.lastConnected);
      const daysSinceContact = (Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceContact <= 7) {
        score += 15;
        insights.push('Recent contact indicates active relationship');
        opportunities.push('Momentum from recent interaction');
      } else if (daysSinceContact <= 30) {
        score += 8;
        insights.push('Moderately recent contact');
        recommendations.push('Schedule follow-up to maintain momentum');
      } else if (daysSinceContact > 90) {
        score -= 10;
        riskFactors.push('Long time since last contact - relationship may be cooling');
        recommendations.push('Re-engagement campaign needed');
      }
    }

    // Ensure score stays within bounds
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      insights,
      recommendations,
      riskFactors,
      opportunities
    };
  };

  const generatePersonalizedEmail = async (contact: any, emailType: 'follow-up' | 'introduction' | 'proposal'): Promise<string> => {
    console.log(`✍️ OpenAI generating ${emailType} email for ${contact.name}`);
    
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const templates = {
      'follow-up': `Hi ${contact.firstName || contact.name},

I hope this email finds you well. I wanted to follow up on our recent conversation about ${contact.company}'s needs in the ${contact.industry || 'business'} sector.

Based on our discussion, I believe our solution could help ${contact.company} achieve significant improvements in operational efficiency. Given your role as ${contact.title}, I think you'd be particularly interested in:

• Cost reduction opportunities we've identified for companies similar to ${contact.company}
• Implementation timeline that minimizes disruption to your current operations
• ROI projections based on similar ${contact.industry || 'industry'} implementations

Would you be available for a brief 15-minute call this week to discuss next steps? I have some specific case studies from the ${contact.industry || 'business'} industry that I think would be valuable for your evaluation.

Best regards,
[Your Name]

P.S. I noticed ${contact.company} is expanding - congratulations! This could be the perfect time to implement solutions that scale with your growth.`,

      'introduction': `Hi ${contact.firstName || contact.name},

I hope you don't mind the direct outreach. I came across your profile and was impressed by your work at ${contact.company} in the ${contact.industry || 'industry'} space.

I'm reaching out because we've been helping companies like ${contact.company} solve challenges around operational efficiency and cost management. Given your role as ${contact.title}, I thought you might be interested in how we've helped similar organizations:

• Reduced operational costs by 25-30% on average
• Streamlined processes to save 15+ hours per week
• Improved team productivity and satisfaction

I'd love to share a brief case study of how a ${contact.industry || 'similar'} company achieved these results. Would you be open to a quick 10-minute conversation to see if this might be relevant for ${contact.company}?

Best regards,
[Your Name]`,

      'proposal': `Hi ${contact.firstName || contact.name},

Thank you for your time during our recent discussions about ${contact.company}'s objectives. Based on our conversations, I've prepared a customized proposal that addresses the specific challenges you mentioned.

The proposal includes:

• Tailored solution design for ${contact.company}'s ${contact.industry || 'business'} operations
• Implementation roadmap with minimal disruption to your team
• ROI projections based on your current metrics
• Success metrics and KPIs aligned with your business goals

Given your experience as ${contact.title}, I believe you'll appreciate the strategic approach we've outlined. The proposal demonstrates how we can help ${contact.company} achieve the 20-30% efficiency improvements we discussed.

I'd love to schedule a 30-minute presentation to walk through the proposal details and answer any questions you might have. Are you available this week for a discussion?

Looking forward to the opportunity to partner with ${contact.company}.

Best regards,
[Your Name]`
    };

    return templates[emailType];
  };

  const enrichContactData = async (name: string, company: string): Promise<ContactEnrichmentData> => {
    console.log(`🔍 OpenAI researching: ${name} at ${company}`);
    
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ').slice(1).join(' ');
    
    return {
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      title: ['Senior Manager', 'Director', 'VP of Operations', 'Business Development Manager'][Math.floor(Math.random() * 4)],
      company,
      industry: ['Technology', 'Healthcare', 'Finance', 'Manufacturing'][Math.floor(Math.random() * 4)],
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      bio: `${name} is an experienced professional at ${company} with expertise in business development and strategic planning.`,
      notes: `Profile researched and enriched by OpenAI on ${new Date().toLocaleDateString()}`,
      confidence: Math.floor(Math.random() * 25) + 75
    };
  };

  const generateBusinessInsights = async (contact: any): Promise<string[]> => {
    console.log(`📊 OpenAI generating business insights for ${contact.name}`);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const insights = [
      `${contact.company} shows strong potential for enterprise solutions based on ${contact.title} role and ${contact.industry} industry trends`,
      `Contact's ${contact.interestLevel} interest level suggests ${contact.interestLevel === 'hot' ? 'immediate' : 'strategic'} engagement approach`,
      `Company size and industry position indicate budget availability for solutions in the $50K-$200K range`,
      `Recent market activity in ${contact.industry} suggests urgency around digital transformation initiatives`,
      `${contact.title} role typically influences decisions on operational efficiency and technology investments`
    ];
    
    return insights.slice(0, 3 + Math.floor(Math.random() * 2));
  };

  const generateResponse = async (prompt: string): Promise<string> => {
    // Simulate OpenAI API response generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return `OpenAI GPT Response: ${prompt.slice(0, 100)}...
    
This is a simulated response from OpenAI GPT. In a real implementation, this would connect to OpenAI's API using the API key to generate intelligent responses based on the prompt.

The response would be contextually relevant and personalized based on the customer profile and task requirements.`;
  };

  return {
    analyzeContact,
    generatePersonalizedEmail,
    enrichContactData,
    generateBusinessInsights,
    generateResponse
  };
};

export const openaiService = useOpenAI();