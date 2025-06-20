import React, { useState } from 'react';
import { Phone, User, Target, MessageSquare, Lightbulb, Copy, RefreshCw } from 'lucide-react';

interface CallScriptContentProps {
  onGenerate?: (content: string) => void;
}

export default function CallScriptContent({ onGenerate }: CallScriptContentProps) {
  const [formData, setFormData] = useState({
    prospect: '',
    company: '',
    industry: '',
    callObjective: '',
    painPoints: '',
    valueProposition: '',
    tone: 'professional'
  });
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateScript = async () => {
    setIsGenerating(true);
    
    // Simulate API call - replace with actual AI service call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const script = `Hi ${formData.prospect || '[Prospect Name]'},

This is [Your Name] from [Your Company]. I hope I'm catching you at a good time.

OPENING:
I'm reaching out because I noticed ${formData.company || '[Company Name]'} is in the ${formData.industry || '[Industry]'} space, and we've been helping similar companies ${formData.callObjective || 'achieve their goals'}.

PAIN POINT IDENTIFICATION:
Many companies like yours are dealing with ${formData.painPoints || 'common industry challenges'}. Is this something you've experienced as well?

VALUE PROPOSITION:
What we've found is that ${formData.valueProposition || 'our solution helps companies overcome these challenges by providing specific benefits'}.

DISCOVERY QUESTIONS:
- How are you currently handling [relevant process]?
- What's working well, and what could be improved?
- What would success look like for you in this area?

NEXT STEPS:
Based on what you've shared, I'd love to show you how we've helped companies like [Similar Company] achieve [specific result]. 

Would you be open to a brief 15-minute conversation next week to explore this further? I have some time available on [Day] at [Time] or [Alternative Time].

CLOSING:
Great! I'll send you a calendar invite right after our call. In the meantime, is there anything specific you'd like me to prepare or any questions you have about what we do?

Thank you for your time, ${formData.prospect || '[Prospect Name]'}. I look forward to our conversation!`;

    setGeneratedScript(script);
    if (onGenerate) {
      onGenerate(script);
    }
    setIsGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'direct', label: 'Direct' },
    { value: 'consultative', label: 'Consultative' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Call Script Generator</h1>
        <p className="text-gray-600">Create personalized call scripts that convert prospects into customers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Call Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Prospect Name
              </label>
              <input
                type="text"
                name="prospect"
                value={formData.prospect}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ABC Corporation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Technology, Healthcare, Manufacturing..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Objective
              </label>
              <input
                type="text"
                name="callObjective"
                value={formData.callObjective}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Schedule a demo, qualify lead, close deal..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pain Points
              </label>
              <textarea
                name="painPoints"
                value={formData.painPoints}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What challenges is the prospect facing?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value Proposition
              </label>
              <textarea
                name="valueProposition"
                value={formData.valueProposition}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How does your solution help solve their problems?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Tone
              </label>
              <select
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {toneOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateScript}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Script...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Generate Call Script
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Script */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Generated Call Script
            </h2>
            {generatedScript && (
              <button
                onClick={copyToClipboard}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {generatedScript ? (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {generatedScript}
              </pre>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Fill out the form and click "Generate Call Script" to create your personalized script
              </p>
            </div>
          )}
        </div>
      </div>

      {generatedScript && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Pro Tips for Your Call
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm list-disc list-inside">
            <li>Practice the script beforehand but keep it conversational</li>
            <li>Listen actively and be prepared to deviate based on their responses</li>
            <li>Take notes during the call for follow-up actions</li>
            <li>Always confirm next steps before ending the call</li>
            <li>Follow up within 24 hours with promised information</li>
          </ul>
        </div>
      )}
    </div>
  );
}