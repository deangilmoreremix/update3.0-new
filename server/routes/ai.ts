import express from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize OpenAI client (will fallback to mock responses if no API key)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// Initialize Gemini client
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Smart AI Analysis endpoint
router.post('/smart-analysis', async (req, res) => {
  try {
    const { model, prompt, useCase, urgency } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Mock response for development (replace with actual AI service calls)
    const mockResponse = {
      results: {
        score: Math.floor(Math.random() * 30) + 70, // 70-100 score
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
        category: ['High-value', 'Decision-maker', 'Technical buyer', 'Budget holder'][Math.floor(Math.random() * 4)],
        insights: [
          'Strong engagement potential based on company size and role',
          'Technical background suggests good product fit',
          'Recent company growth indicates budget availability'
        ],
        recommendations: [
          'Schedule technical demo within 48 hours',
          'Prepare enterprise pricing proposal',
          'Connect with technical team for POC discussion'
        ]
      },
      confidence: Math.floor(Math.random() * 20) + 80,
      cost: Math.random() * 0.05 + 0.01, // $0.01-$0.06
      modelUsed: model,
      processingTime: Math.floor(Math.random() * 3000) + 1000 // 1-4 seconds
    };

    // Simulate processing delay based on urgency
    const delay = urgency === 'high' ? 500 : urgency === 'medium' ? 1000 : 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    res.json(mockResponse);
  } catch (error) {
    console.error('Smart analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to perform AI analysis'
    });
  }
});

// Email generation endpoint
router.post('/generate-email', async (req, res) => {
  try {
    const { recipientName, recipientCompany, subject, emailType, tone, keyPoints, context } = req.body;

    if (openai) {
      // Use real OpenAI API
      const prompt = `Generate a professional ${emailType} email with the following details:
- Recipient: ${recipientName || 'the recipient'}
- Company: ${recipientCompany || 'their company'}
- Subject: ${subject || 'Follow up'}
- Tone: ${tone || 'professional'}
- Key Points: ${keyPoints || 'Standard business communication'}
- Context: ${context || 'Business correspondence'}

Please generate only the email content without any additional formatting or explanations.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional email writing assistant. Generate clear, concise, and effective business emails.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const generatedEmail = response.choices[0]?.message?.content || 'Failed to generate email';
      res.json({ email: generatedEmail });
    } else {
      // Fallback to sample emails if no API key
      const sampleEmails = {
        followup: `Subject: ${subject || 'Following up on our conversation'}

Hi ${recipientName || 'there'},

I hope this email finds you well. I wanted to follow up on our recent conversation about ${context || 'potential collaboration'}.

${keyPoints || 'I believe our solution could significantly benefit your organization and would love to discuss this further.'}

${context || 'Based on our discussion, I think there may be a great fit between our organizations.'}

Would you be interested in a brief 15-minute call to discuss this further?

Best regards,
[Your Name]`,
        intro: `Subject: ${subject || 'Introduction and Partnership Opportunity'}

Dear ${recipientName || 'there'},

I hope this email finds you well. My name is [Your Name] and I'm reaching out from [Your Company].

${keyPoints || 'We specialize in helping businesses like yours achieve their goals through innovative solutions.'}

${context || 'I believe there may be a great fit between our organizations and would love to explore how we might work together.'}

Would you be available for a brief call next week to discuss this opportunity?

Best regards,
[Your Name]`,
        proposal: `Subject: ${subject || 'Proposal for Partnership'}

Dear ${recipientName || 'Decision Maker'},

Thank you for your interest in our services. I'm excited to present our proposal for ${context || 'your project'}.

${keyPoints || 'Based on our discussion, here are the key benefits you can expect:'}

• Customized solution tailored to your specific needs
• Proven track record of success with similar clients
• Dedicated support throughout the implementation process
• Measurable ROI within the first quarter

I've attached a detailed proposal for your review. I'd be happy to schedule a call to discuss any questions you may have.

Best regards,
[Your Name]`
      };

      const selectedEmail = sampleEmails[emailType as keyof typeof sampleEmails] || sampleEmails.followup;
      res.json({ email: selectedEmail });
    }
  } catch (error) {
    console.error('Email generation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to generate email'
    });
  }
});

// Script generation endpoint
router.post('/generate-script', async (req, res) => {
  try {
    const { prospectName, company, callType, tone, keyPoints, context } = req.body;

    if (openai) {
      const prompt = `Generate a professional ${callType} call script with the following details:
- Prospect: ${prospectName || 'the prospect'}
- Company: ${company || 'their company'}
- Call Type: ${callType || 'sales call'}
- Tone: ${tone || 'professional'}
- Key Points: ${keyPoints || 'Standard business communication'}
- Context: ${context || 'Business call'}

Please generate only the script content with clear sections and talking points.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional sales script writer. Generate clear, effective call scripts that help sales professionals engage prospects successfully.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      const generatedScript = response.choices[0]?.message?.content || 'Failed to generate script';
      res.json({ script: generatedScript });
    } else {
      // Fallback script
      const mockScript = `**${callType.toUpperCase()} CALL SCRIPT**

**Opening (30 seconds):**
"Hi ${prospectName || '[Prospect Name]'}, this is [Your Name] from [Your Company]. I hope I'm not catching you at a bad time. I'm calling because ${context || 'I believe we may have a solution that could benefit your business'}.

**Qualification (2 minutes):**
"Before I share more about what we do, could you tell me a bit about your current challenges with ${keyPoints || 'your business operations'}?"

**Presentation (3 minutes):**
"Based on what you've shared, I think our solution could really help ${company || 'your company'}. Here's how..."

**Closing (1 minute):**
"Does this sound like something that could benefit your team? I'd love to schedule a brief demo to show you exactly how this would work for ${company || 'your company'}.

**Next Steps:**
- Schedule follow-up demo
- Send information packet
- Connect with decision makers"`;

      res.json({ script: mockScript });
    }
  } catch (error) {
    console.error('Script generation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to generate script'
    });
  }
});

// Business analysis endpoint
router.post('/business-analysis', async (req, res) => {
  try {
    const { prompt, analysisType } = req.body;

    if (openai) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a business analysis expert. Provide detailed insights and recommendations based on the given information.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      });

      const analysis = response.choices[0]?.message?.content || 'Failed to generate analysis';
      res.json({ analysis });
    } else {
      // Mock analysis response
      const mockAnalysis = `
**Executive Summary:**
Based on the provided information, here's a comprehensive business analysis:

**Key Findings:**
• Market opportunity shows strong potential for growth
• Current positioning aligns well with market trends
• Competitive landscape presents both challenges and opportunities

**Recommendations:**
1. Focus on digital transformation initiatives
2. Strengthen customer relationship management
3. Expand market reach through strategic partnerships
4. Invest in data analytics capabilities

**Risk Assessment:**
• Low to moderate risk profile
• Market volatility should be monitored
• Operational efficiency improvements needed

**Next Steps:**
• Conduct detailed market research
• Develop implementation timeline
• Allocate resources for priority initiatives
      `;
      
      res.json({ analysis: mockAnalysis });
    }
  } catch (error) {
    console.error('Business analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to perform business analysis'
    });
  }
});

// Content generation endpoint (Gemini)
router.post('/generate-content', async (req, res) => {
  try {
    const { contentType, topic, tone, length, context } = req.body;

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Generate ${contentType} content about ${topic} with a ${tone} tone. 
      Length: ${length}
      Context: ${context}
      
      Please create engaging, professional content that is relevant and valuable.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const content = response.text();

      res.json({ content });
    } else {
      // Fallback content
      const mockContent = `**${contentType.toUpperCase()}: ${topic}**

This is a well-crafted piece of content about ${topic}. The content is designed to be ${tone} and provides valuable insights for the reader.

**Key Points:**
• Comprehensive coverage of ${topic}
• ${tone} approach to communication
• Practical actionable insights
• Industry-relevant examples

**Conclusion:**
This content effectively addresses the key aspects of ${topic} and provides readers with valuable information they can apply immediately.`;

      res.json({ content: mockContent });
    }
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to generate content'
    });
  }
});

// Chat completion endpoint (OpenAI)
router.post('/chat', async (req, res) => {
  try {
    const { messages, model = 'gpt-4o-mini' } = req.body;

    if (openai) {
      const response = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: 1000,
        temperature: 0.7
      });

      const reply = response.choices[0]?.message?.content || 'No response generated';
      res.json({ reply });
    } else {
      // Mock chat response
      const mockReply = "I'm a helpful AI assistant. I can help you with various tasks including content creation, analysis, and business strategy. How can I assist you today?";
      res.json({ reply: mockReply });
    }
  } catch (error) {
    console.error('Chat completion error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process chat'
    });
  }
});

export default router;