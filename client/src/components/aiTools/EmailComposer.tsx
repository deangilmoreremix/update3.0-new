import React, { useState } from 'react';
import { Mail, Sparkles, User, Building, MessageSquare, Zap, Copy, Check } from 'lucide-react';

interface EmailComposerProps {
  onClose?: () => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientCompany: '',
    subject: '',
    emailType: 'followup',
    tone: 'professional',
    keyPoints: '',
    context: ''
  });
  
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const emailTypes = [
    { value: 'followup', label: 'Follow-up Email' },
    { value: 'intro', label: 'Introduction Email' },
    { value: 'proposal', label: 'Proposal Email' },
    { value: 'thank-you', label: 'Thank You Email' },
    { value: 'meeting-request', label: 'Meeting Request' },
    { value: 'cold-outreach', label: 'Cold Outreach' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientName: formData.recipientName,
          recipientCompany: formData.recipientCompany,
          subject: formData.subject,
          emailType: formData.emailType,
          tone: formData.tone,
          keyPoints: formData.keyPoints,
          context: formData.context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setGeneratedEmail(data.email);
    } catch (error) {
      console.error('Error generating email:', error);
      // Fallback to sample emails if API fails
      const sampleEmails = {
      followup: `Subject: ${formData.subject || 'Following up on our conversation'}

Hi ${formData.recipientName || 'there'},

I hope this email finds you well. I wanted to follow up on our recent conversation about ${formData.context || 'your business needs'}.

${formData.keyPoints || 'Based on our discussion, I believe we have a great opportunity to work together.'}

I'd love to schedule a brief call to discuss how we can move forward. Would you be available for a 15-minute conversation this week?

Looking forward to hearing from you.

Best regards,
[Your Name]`,
      
      intro: `Subject: ${formData.subject || 'Introduction and Partnership Opportunity'}

Dear ${formData.recipientName || 'Team'},

I hope this email finds you well. My name is [Your Name], and I'm reaching out from [Your Company] regarding a potential partnership opportunity with ${formData.recipientCompany || 'your organization'}.

${formData.keyPoints || 'We specialize in helping businesses like yours achieve their goals through innovative solutions.'}

${formData.context || 'I believe there may be a great fit between our organizations and would love to explore how we might work together.'}

Would you be interested in a brief 15-minute call to discuss this further?

Best regards,
[Your Name]`,
      
      proposal: `Subject: ${formData.subject || 'Proposal for Partnership'}

Dear ${formData.recipientName || 'Decision Maker'},

Thank you for your interest in our services. I'm excited to present our proposal for ${formData.context || 'your project'}.

${formData.keyPoints || 'Based on our discussion, here are the key benefits you can expect:'}

• Customized solution tailored to your specific needs
• Proven track record of success with similar clients
• Dedicated support throughout the implementation process
• Measurable ROI within the first quarter

I've attached a detailed proposal for your review. I'd be happy to schedule a call to discuss any questions you may have.

Best regards,
[Your Name]`
    };

      const selectedEmail = sampleEmails[formData.emailType as keyof typeof sampleEmails] || sampleEmails.followup;
      setGeneratedEmail(selectedEmail);
    }
    
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Email Composer</h2>
              <p className="text-gray-600">Generate professional emails in seconds</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Powered by AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Company
                </label>
                <input
                  type="text"
                  value={formData.recipientCompany}
                  onChange={(e) => setFormData({ ...formData, recipientCompany: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Acme Corporation"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                Subject Line
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email subject"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
                <select
                  value={formData.emailType}
                  onChange={(e) => setFormData({ ...formData, emailType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {emailTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tones.map(tone => (
                    <option key={tone.value} value={tone.value}>{tone.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Points</label>
              <textarea
                value={formData.keyPoints}
                onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Main points to include in the email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
              <textarea
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional context or background information"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Generate Email</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Email Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Email</h3>
              {generatedEmail && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
            
            {generatedEmail ? (
              <div className="bg-white p-4 rounded-md border min-h-64">
                <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
                  {generatedEmail}
                </pre>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-md border min-h-64 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Fill in the form and click "Generate Email" to see your personalized email
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;