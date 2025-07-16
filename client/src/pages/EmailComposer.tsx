import React, { useState } from 'react';
import { Mail, Send, Save, Paperclip, Users, Eye, Wand2, CheckCircle } from 'lucide-react';

const EmailComposer = () => {
  const [email, setEmail] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: []
  });
  
  const [templates] = useState([
    { id: '1', name: 'Follow-up Email', subject: 'Following up on our conversation', type: 'follow-up' },
    { id: '2', name: 'Cold Outreach', subject: 'Introducing [Company Name] - Quick Question', type: 'cold' },
    { id: '3', name: 'Proposal Email', subject: 'Proposal for [Project Name]', type: 'proposal' },
    { id: '4', name: 'Meeting Request', subject: 'Meeting Request - [Topic]', type: 'meeting' },
    { id: '5', name: 'Thank You Email', subject: 'Thank you for your time', type: 'thank-you' }
  ]);

  const [contacts] = useState([
    { id: '1', name: 'John Smith', email: 'john@techcorp.com', company: 'TechCorp' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@innovate.com', company: 'Innovate Solutions' },
    { id: '3', name: 'Mike Chen', email: 'mike@growth.com', company: 'Growth Dynamics' },
    { id: '4', name: 'Emily Davis', email: 'emily@scale.com', company: 'ScaleUp Ventures' }
  ]);

  const [showTemplates, setShowTemplates] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleSend = () => {
    if (email.to && email.subject && email.body) {
      console.log('Sending email:', email);
      // Add send logic here
      alert('Email sent successfully!');
    }
  };

  const handleSave = () => {
    console.log('Saving draft:', email);
    // Add save logic here
    alert('Draft saved successfully!');
  };

  const loadTemplate = (template) => {
    setEmail(prev => ({
      ...prev,
      subject: template.subject,
      body: getTemplateBody(template.type)
    }));
    setShowTemplates(false);
  };

  const getTemplateBody = (type) => {
    const templates = {
      'follow-up': `Hi [Name],

I hope this email finds you well. I wanted to follow up on our conversation about [topic] and see if you had any questions or if there's anything else I can help you with.

[Add specific details about your previous conversation]

I'm here to help and would be happy to schedule a quick call to discuss further.

Best regards,
[Your Name]`,
      'cold': `Hi [Name],

I hope you're doing well. I'm reaching out because I noticed [specific observation about their company/industry].

[Company Name] helps [target audience] achieve [specific benefit]. I thought this might be relevant to [their company] because [specific reason].

Would you be open to a brief 15-minute call this week to discuss how we might be able to help [their company] [achieve specific goal]?

Best regards,
[Your Name]`,
      'proposal': `Hi [Name],

Thank you for taking the time to discuss [project/opportunity] with me. As promised, I've prepared a proposal outlining how we can help [their company] achieve [specific goals].

[Brief overview of the proposal]

I've attached the full proposal document for your review. I'd be happy to schedule a call to walk through the details and answer any questions you might have.

Looking forward to hearing your thoughts.

Best regards,
[Your Name]`,
      'meeting': `Hi [Name],

I hope you're doing well. I would like to schedule a meeting to discuss [topic/purpose].

The meeting would cover:
- [Agenda item 1]
- [Agenda item 2]
- [Agenda item 3]

I'm flexible with timing and can accommodate your schedule. Please let me know what works best for you.

Best regards,
[Your Name]`,
      'thank-you': `Hi [Name],

Thank you for taking the time to meet with me today. I really enjoyed our conversation about [topic] and learning more about [their company/project].

[Specific follow-up point from the meeting]

I'll [specific next step] and get back to you by [timeframe].

Thank you again for your time, and I look forward to continuing our conversation.

Best regards,
[Your Name]`
    };
    return templates[type] || '';
  };

  const addContact = (contact) => {
    const contactEmail = `${contact.name} <${contact.email}>`;
    setEmail(prev => ({
      ...prev,
      to: prev.to ? `${prev.to}, ${contactEmail}` : contactEmail
    }));
    setShowContacts(false);
  };

  const generateAISuggestions = async () => {
    setIsGeneratingAI(true);
    
    try {
      const response = await fetch('/api/ai/email-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: email.subject,
          body: email.body,
          to: email.to
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
      } else {
        // Fallback suggestions
        setAiSuggestions([
          "Consider adding a clear call-to-action at the end",
          "The subject line could be more specific to increase open rates",
          "Adding a personal touch about their company could improve engagement",
          "Including a meeting link would make it easier to schedule",
          "The email could benefit from a shorter, more concise opening"
        ]);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      setAiSuggestions([
        "Consider adding a clear call-to-action at the end",
        "The subject line could be more specific to increase open rates",
        "Adding a personal touch about their company could improve engagement"
      ]);
    }
    
    setIsGeneratingAI(false);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setEmail(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setEmail(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Email Composer
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Compose and send professional emails
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Templates</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email Composer */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="space-y-6">
                {/* Recipients */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                      To:
                    </label>
                    <input
                      type="text"
                      value={email.to}
                      onChange={(e) => setEmail({...email, to: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Enter email addresses"
                    />
                    <button
                      onClick={() => setShowContacts(true)}
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                      CC:
                    </label>
                    <input
                      type="text"
                      value={email.cc}
                      onChange={(e) => setEmail({...email, cc: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="CC recipients"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                      BCC:
                    </label>
                    <input
                      type="text"
                      value={email.bcc}
                      onChange={(e) => setEmail({...email, bcc: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="BCC recipients"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={email.subject}
                    onChange={(e) => setEmail({...email, subject: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter subject line"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message:
                  </label>
                  <textarea
                    value={email.body}
                    onChange={(e) => setEmail({...email, body: e.target.value})}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={12}
                    placeholder="Type your message here..."
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attachments:
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4" />
                      <span>Attach Files</span>
                    </label>
                  </div>
                  
                  {email.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {email.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSend}
                    disabled={!email.to || !email.subject || !email.body}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI Suggestions
                </h3>
                <button
                  onClick={generateAISuggestions}
                  disabled={isGeneratingAI}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Wand2 className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                  <span>Generate</span>
                </button>
              </div>
              
              {isGeneratingAI ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Analyzing your email...
                  </p>
                </div>
              ) : aiSuggestions.length > 0 ? (
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Click "Generate" to get AI suggestions for your email
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Email Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Character Count:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {email.body.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Word Count:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {email.body.split(' ').filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Attachments:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {email.attachments.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Modal */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Email Templates
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {template.subject}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Modal */}
        {showContacts && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Contacts
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => addContact(contact)}
                    className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.email} - {contact.company}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowContacts(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailComposer;