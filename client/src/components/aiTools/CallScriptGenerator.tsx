import React, { useState } from 'react';
import { Phone, Target, User, Building, MessageSquare, Sparkles, Copy, Check } from 'lucide-react';

interface CallScriptGeneratorProps {
  onClose?: () => void;
}

const CallScriptGenerator: React.FC<CallScriptGeneratorProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    prospectName: '',
    prospectCompany: '',
    callType: 'cold-call',
    objective: '',
    painPoints: '',
    tone: 'professional',
    duration: '5-10'
  });
  
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const callTypes = [
    { value: 'cold-call', label: 'Cold Call' },
    { value: 'warm-call', label: 'Warm Call' },
    { value: 'follow-up', label: 'Follow-up Call' },
    { value: 'demo-call', label: 'Demo Call' },
    { value: 'closing-call', label: 'Closing Call' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'consultative', label: 'Consultative' },
    { value: 'direct', label: 'Direct' },
    { value: 'empathetic', label: 'Empathetic' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const scripts = {
      'cold-call': `
**COLD CALL SCRIPT**
Target: ${formData.prospectName || '[Prospect Name]'} at ${formData.prospectCompany || '[Company]'}
Duration: ${formData.duration} minutes
Tone: ${formData.tone}

**OPENING (30 seconds)**
"Hi ${formData.prospectName || '[Name]'}, this is [Your Name] from [Your Company]. I know you're busy, so I'll be brief. 

The reason I'm calling is that I've been working with other ${formData.prospectCompany ? 'companies like ' + formData.prospectCompany : 'businesses in your industry'} to help them ${formData.objective || 'solve common challenges and improve their operations'}.

Do you have 2-3 minutes for me to share what I mean?"

**QUALIFYING QUESTIONS (2-3 minutes)**
"Great! Let me ask you a few quick questions to see if this might be relevant:

1. How are you currently handling ${formData.painPoints || 'your main business processes'}?
2. What's your biggest challenge when it comes to ${formData.objective || 'achieving your goals'}?
3. Have you looked into solutions for this before?"

**VALUE PROPOSITION (1-2 minutes)**
"Based on what you've shared, here's what we've been able to do for similar companies:

• ${formData.objective || 'Increase efficiency by 30-40%'}
• ${formData.painPoints || 'Reduce manual work and errors'}
• Save 10-15 hours per week on routine tasks
• Provide better insights for decision-making

The companies we work with typically see results within the first 30 days."

**OBJECTION HANDLING**
Common objections and responses:

"We're not interested right now"
→ "I understand timing is important. When would be a better time to revisit this? Many of our clients initially felt the same way but were glad they took a closer look."

"We're happy with our current solution"
→ "That's great to hear! Even if you're satisfied, it might be worth seeing what else is available. Can I send you some information to review when you have time?"

"We don't have the budget"
→ "Budget is always a consideration. The investment typically pays for itself within 90 days. Would it help if I showed you some ROI examples?"

**CLOSING (1 minute)**
"Based on our conversation, it sounds like this could be a good fit. What I'd like to do is set up a brief 15-minute call next week where I can show you exactly how this would work for ${formData.prospectCompany || 'your company'}.

Would Tuesday at 2 PM or Wednesday at 10 AM work better for you?"

**FOLLOW-UP**
"Perfect! I'll send you a calendar invite and some background information. Is ${formData.prospectName || '[Name]'}@${formData.prospectCompany || '[company]'}.com the best email to reach you?"

**KEY REMINDERS**
• Listen more than you talk (80/20 rule)
• Ask permission before going into your pitch
• Focus on their problems, not your solution
• Always end with a clear next step
• Take notes throughout the call
`,
      'follow-up': `
**FOLLOW-UP CALL SCRIPT**
Target: ${formData.prospectName || '[Prospect Name]'} at ${formData.prospectCompany || '[Company]'}
Duration: ${formData.duration} minutes
Tone: ${formData.tone}

**OPENING (30 seconds)**
"Hi ${formData.prospectName || '[Name]'}, this is [Your Name] from [Your Company]. We spoke last week about ${formData.objective || 'your business challenges'}.

I wanted to follow up on our conversation and share some additional information I promised to send over. Do you have a few minutes to chat?"

**RECAP & UPDATE (1-2 minutes)**
"Just to recap our last conversation, you mentioned that ${formData.painPoints || 'you were facing some challenges with your current processes'}.

Since we spoke, I've put together some specific examples of how we've helped similar companies address exactly these issues. 

Have you had a chance to think about what we discussed?"

**NEW INFORMATION (2-3 minutes)**
"I have some great news to share. We just helped [similar company] achieve:
• ${formData.objective || 'A 40% improvement in efficiency'}
• Reduced their processing time by 50%
• Saved $15,000 per month in operational costs

The approach we used is very similar to what I outlined for your situation."

**ADDRESSING CONCERNS**
"Last time we spoke, you mentioned [specific concern]. Let me address that:

[Provide specific solution or example]

Does that help clarify things?"

**NEXT STEPS (1 minute)**
"Based on everything we've discussed, I think the next logical step would be to schedule a brief demo where I can show you exactly how this would work for ${formData.prospectCompany || 'your team'}.

The demo takes about 15 minutes and will give you a clear picture of the potential impact. When would be a good time for you this week?"

**CLOSING**
"Excellent! I'll send you the meeting details and prepare a custom demo based on your specific needs. Looking forward to showing you what's possible!"
`,
      'demo-call': `
**DEMO CALL SCRIPT**
Target: ${formData.prospectName || '[Prospect Name]'} at ${formData.prospectCompany || '[Company]'}
Duration: ${formData.duration} minutes
Tone: ${formData.tone}

**OPENING (1 minute)**
"Hi ${formData.prospectName || '[Name]'}, thanks for taking time for this demo today. I'm excited to show you exactly how this would work for ${formData.prospectCompany || 'your company'}.

Before we dive in, let me quickly confirm - you're primarily interested in ${formData.objective || 'solving your main business challenge'}, correct?

Great! I've customized today's demo to focus specifically on that."

**DEMO STRUCTURE (8-12 minutes)**
"What I'm going to show you falls into three main areas:

1. **Current State Analysis** (2-3 minutes)
   - "This is what your current process looks like..."
   - "Here are the pain points we identified..."
   - "And here's the impact on your business..."

2. **Solution Demonstration** (5-7 minutes)
   - "Now let me show you how our solution addresses each of these..."
   - "As you can see, this eliminates the need for..."
   - "This feature specifically handles your concern about..."

3. **Results & ROI** (2-3 minutes)
   - "Based on your current volume, you'd see..."
   - "The time savings alone would be..."
   - "Most clients see ROI within..."

**ENGAGEMENT QUESTIONS**
Throughout the demo, ask:
- "Does this make sense so far?"
- "How does this compare to your current process?"
- "What questions do you have about this feature?"
- "Can you see this working for your team?"

**ADDRESSING OBJECTIONS**
Common demo objections:
- "This looks complicated" → "I understand it might seem that way, but watch this..."
- "Will my team adopt this?" → "Great question. Let me show you the training program..."
- "What about security?" → "Security is critical. Here's how we handle that..."

**CLOSING (2-3 minutes)**
"So ${formData.prospectName || '[Name]'}, based on what you've seen today, what are your thoughts?

[Listen to response]

The way I see it, you have three options:
1. Continue with your current approach
2. Look at other solutions
3. Move forward with us

Given what you've shared about ${formData.painPoints || 'your current challenges'}, option 3 seems like the best fit. 

What do you think?"

**NEXT STEPS**
"Perfect! Let's get the paperwork started. I'll send you the contract today, and we can have you up and running within two weeks. 

Are you the decision-maker, or do we need to include anyone else in this conversation?"
`
    };

    const selectedScript = scripts[formData.callType as keyof typeof scripts] || scripts['cold-call'];
    setGeneratedScript(selectedScript);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Phone className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Call Script Generator</h2>
              <p className="text-gray-600">Generate effective sales call scripts for any scenario</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Powered by AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Prospect Name
                </label>
                <input
                  type="text"
                  value={formData.prospectName}
                  onChange={(e) => setFormData({ ...formData, prospectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  value={formData.prospectCompany}
                  onChange={(e) => setFormData({ ...formData, prospectCompany: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Acme Corporation"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
                <select
                  value={formData.callType}
                  onChange={(e) => setFormData({ ...formData, callType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {callTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {tones.map(tone => (
                    <option key={tone.value} value={tone.value}>{tone.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="inline h-4 w-4 mr-1" />
                Call Objective
              </label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What do you want to achieve with this call?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                Pain Points to Address
              </label>
              <textarea
                value={formData.painPoints}
                onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What problems does your prospect face?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="2-5">2-5 minutes</option>
                <option value="5-10">5-10 minutes</option>
                <option value="10-15">10-15 minutes</option>
                <option value="15-20">15-20 minutes</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Script...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Call Script</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Script</h3>
              {generatedScript && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
            
            {generatedScript ? (
              <div className="bg-white p-4 rounded-md border max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                  {generatedScript}
                </pre>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-md border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No script generated yet</p>
                  <p className="text-sm text-gray-400">
                    Fill in the details and click "Generate Call Script" to create your personalized script
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallScriptGenerator;