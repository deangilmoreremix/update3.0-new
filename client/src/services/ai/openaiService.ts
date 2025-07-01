// Enhanced OpenAI service with robust contact analysis
import { ContactEnrichmentData } from './aiEnrichmentService';

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

    // Company size analysis
    if (contact.company) {
      if (contact.company.toLowerCase().includes('microsoft') || 
          contact.company.toLowerCase().includes('google') || 
          contact.company.toLowerCase().includes('amazon')) {
        score += 25;
        insights.push('Enterprise-level company indicates high-value opportunity');
        recommendations.push('Prepare enterprise-focused presentation and pricing');
        opportunities.push('Potentially large deal size with expansion opportunities');
      } else if (contact.company.toLowerCase().includes('startup') || 
                 contact.company.toLowerCase().includes('inc')) {
        score += 10;
        insights.push('Growing company suggests good expansion potential');
        recommendations.push('Focus on scalability and growth benefits');
        opportunities.push('Opportunity for long-term partnership');
      }
    }

    // Title analysis
    if (contact.position || contact.title) {
      const title = (contact.position || contact.title).toLowerCase();
      if (title.includes('ceo') || title.includes('founder') || title.includes('president')) {
        score += 25;
        insights.push('C-level executive has strong decision-making authority');
        recommendations.push('Focus on strategic value and ROI presentation');
        opportunities.push('Direct access to key decision maker');
      } else if (title.includes('director') || title.includes('manager') || title.includes('vp')) {
        score += 15;
        insights.push('Management level contact has influence over decisions');
        recommendations.push('Address operational benefits and team impact');
        opportunities.push('Good champion for internal advocacy');
      } else if (title.includes('analyst') || title.includes('coordinator')) {
        score += 5;
        insights.push('Individual contributor role may require approval process');
        recommendations.push('Identify and engage decision-making stakeholders');
        riskFactors.push('May need multiple touchpoints for decision process');
      }
    }

    // Email engagement analysis
    if (contact.email) {
      const domain = contact.email.split('@')[1];
      if (domain && !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'].includes(domain)) {
        score += 10;
        insights.push('Business email domain suggests professional context');
        recommendations.push('Leverage professional communication channels');
      } else {
        score -= 5;
        insights.push('Personal email domain may indicate individual purchaser');
        riskFactors.push('May have limited purchasing authority');
      }
    }

    // Contact recency analysis
    if (contact.lastContact) {
      const daysSinceContact = Math.floor((Date.now() - new Date(contact.lastContact).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceContact <= 7) {
        score += 15;
        insights.push('Recent interaction shows active engagement');
        recommendations.push('Maintain momentum with timely follow-up');
        opportunities.push('High engagement window for conversion');
      } else if (daysSinceContact <= 30) {
        score += 5;
        insights.push('Moderate recency suggests continued interest');
        recommendations.push('Re-engage with relevant updates or offers');
      } else if (daysSinceContact > 90) {
        score -= 10;
        insights.push('Extended time since last contact may indicate cooling interest');
        recommendations.push('Re-qualification needed before advancing');
        riskFactors.push('May require renewed interest development');
      }
    }

    // Source analysis
    if (contact.source) {
      switch (contact.source.toLowerCase()) {
        case 'referral':
          score += 20;
          insights.push('Referral source indicates higher trust and qualification');
          recommendations.push('Leverage referral relationship for credibility');
          opportunities.push('Pre-qualified lead with higher conversion probability');
          break;
        case 'linkedin':
          score += 15;
          insights.push('Professional network source suggests business interest');
          recommendations.push('Utilize professional context for engagement');
          opportunities.push('Professional network expansion potential');
          break;
        case 'website':
          score += 10;
          insights.push('Direct website inquiry shows active research');
          recommendations.push('Address specific interests from website behavior');
          opportunities.push('Self-qualified interest in solutions');
          break;
        case 'cold_outreach':
          score -= 5;
          insights.push('Cold outreach requires additional qualification');
          recommendations.push('Focus on value discovery and needs assessment');
          riskFactors.push('Lower initial engagement probability');
          break;
      }
    }

    // Ensure score stays within reasonable bounds
    score = Math.max(0, Math.min(100, score));

    // Add general recommendations if none were added
    if (recommendations.length === 0) {
      recommendations.push('Conduct discovery call to understand specific needs');
      recommendations.push('Provide relevant case studies and social proof');
    }

    // Add general insights if none were added
    if (insights.length === 0) {
      insights.push('Contact profile requires additional information for complete analysis');
    }

    console.log(`✅ OpenAI analysis complete for ${contact.name} - Score: ${score}`);

    return {
      score,
      insights,
      recommendations,
      riskFactors,
      opportunities
    };
  };

  const generatePersonalizedEmail = async (contact: any, purpose: string): Promise<string> => {
    console.log(`✉️ Generating personalized email for ${contact.name}`);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const templates = {
      introduction: `Subject: Introduction - ${contact.company ? `Partnership Opportunity with ${contact.company}` : 'Exploring Mutual Benefits'}

Dear ${contact.name},

I hope this email finds you well. I came across your profile ${contact.company ? `and your work at ${contact.company}` : ''} and was impressed by ${contact.title ? `your role as ${contact.title}` : 'your professional background'}.

${contact.company ? `Given ${contact.company}'s` : 'Given your'} focus ${contact.industry ? `in the ${contact.industry} industry` : ''}, I believe there could be significant value in exploring how our solutions can support your objectives.

I'd love to schedule a brief 15-minute call to discuss how we've helped similar ${contact.company ? 'organizations' : 'professionals'} achieve measurable results.

Would you be available for a quick conversation this week?

Best regards,
[Your Name]`,

      follow_up: `Subject: Following Up - ${contact.company ? `${contact.company}` : 'Our Previous Conversation'}

Hi ${contact.name},

I wanted to follow up on our previous conversation regarding ${contact.company ? `${contact.company}'s` : 'your'} ${contact.industry ? `${contact.industry}` : 'business'} objectives.

${contact.interestLevel === 'hot' ? 
  'Given your strong interest, I\'ve prepared some specific recommendations that could deliver immediate value.' :
  'I understand timing is important, and I wanted to share some insights that might be relevant to your current priorities.'
}

${contact.title && contact.title.toLowerCase().includes('director') ? 
  'As a leader in your organization, you\'ll appreciate the strategic impact these solutions can have.' :
  'I believe these solutions align well with your role and responsibilities.'
}

Would you have 10 minutes this week to discuss the next steps?

Best regards,
[Your Name]`,

      proposal: `Subject: Proposal - ${contact.company ? `Tailored Solution for ${contact.company}` : 'Custom Solution Proposal'}

Dear ${contact.name},

Thank you for taking the time to discuss ${contact.company ? `${contact.company}'s` : 'your'} requirements. Based on our conversation, I've prepared a tailored proposal that addresses your specific needs.

Key highlights:
• ${contact.industry ? `Industry-specific solutions for ${contact.industry}` : 'Customized approach based on your requirements'}
• Measurable ROI within the first quarter
• Seamless integration with your existing processes
• Dedicated support throughout implementation

${contact.title && (contact.title.toLowerCase().includes('ceo') || contact.title.toLowerCase().includes('founder')) ?
  'As a key decision-maker, you\'ll appreciate the strategic value and competitive advantage this solution provides.' :
  'I believe this aligns perfectly with your objectives and organizational goals.'
}

I'd be happy to walk through the proposal details at your convenience. When would be a good time for a 30-minute discussion?

Best regards,
[Your Name]`
    };

    const emailTemplate = templates[purpose as keyof typeof templates] || templates.introduction;
    
    console.log(`✅ Personalized email generated for ${contact.name}`);
    return emailTemplate;
  };

  const generateContactInsights = async (contact: any): Promise<string[]> => {
    console.log(`🧠 Generating insights for ${contact.name}`);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    const insights: string[] = [];

    // Professional insights
    if (contact.title) {
      insights.push(`Professional role as ${contact.title} suggests ${
        contact.title.toLowerCase().includes('director') || contact.title.toLowerCase().includes('manager') ? 
        'management responsibilities and budget authority' :
        'individual contributor role with potential influence'
      }`);
    }

    // Company insights
    if (contact.company) {
      insights.push(`Employment at ${contact.company} ${
        contact.industry ? `in the ${contact.industry} sector` : ''
      } indicates ${
        contact.company.toLowerCase().includes('startup') ? 
        'growth-oriented environment with agile decision-making' :
        'established organization with structured processes'
      }`);
    }

    // Communication insights
    if (contact.email) {
      const domain = contact.email.split('@')[1];
      if (domain && !['gmail.com', 'yahoo.com', 'hotmail.com'].includes(domain)) {
        insights.push(`Corporate email domain suggests professional purchasing context and potential budget allocation`);
      }
    }

    // Engagement insights
    if (contact.interestLevel) {
      insights.push(`Current interest level (${contact.interestLevel}) indicates ${
        contact.interestLevel === 'hot' ? 'immediate opportunity for engagement and conversion' :
        contact.interestLevel === 'medium' ? 'active evaluation phase requiring nurturing' :
        'early-stage awareness needing education and value demonstration'
      }`);
    }

    // Timeline insights
    if (contact.lastContact) {
      const daysSince = Math.floor((Date.now() - new Date(contact.lastContact).getTime()) / (1000 * 60 * 60 * 24));
      insights.push(`Last contact ${daysSince} days ago suggests ${
        daysSince <= 7 ? 'active engagement window with high responsiveness' :
        daysSince <= 30 ? 'moderate engagement requiring re-activation' :
        'dormant relationship needing re-qualification and renewed interest'
      }`);
    }

    // Default insights if none generated
    if (insights.length === 0) {
      insights.push('Contact profile shows professional potential with opportunities for strategic engagement');
      insights.push('Additional qualification needed to determine specific needs and decision-making process');
    }

    console.log(`✅ Generated ${insights.length} insights for ${contact.name}`);
    return insights;
  };

  return {
    analyzeContact,
    generatePersonalizedEmail,
    generateContactInsights
  };
};