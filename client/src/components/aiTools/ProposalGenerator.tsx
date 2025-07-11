import React, { useState } from 'react';
import { FileText, Sparkles, Building, DollarSign, Calendar, User, Copy, Check, Download } from 'lucide-react';

interface ProposalGeneratorProps {
  onClose?: () => void;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientCompany: '',
    projectTitle: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    serviceType: 'consulting',
    deliverables: '',
    terms: '30'
  });
  
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const serviceTypes = [
    { value: 'consulting', label: 'Consulting Services' },
    { value: 'development', label: 'Software Development' },
    { value: 'design', label: 'Design Services' },
    { value: 'marketing', label: 'Marketing Services' },
    { value: 'training', label: 'Training & Education' },
    { value: 'support', label: 'Support & Maintenance' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const proposal = `
**BUSINESS PROPOSAL**

**To:** ${formData.clientName || '[Client Name]'}
**Company:** ${formData.clientCompany || '[Client Company]'}
**Project:** ${formData.projectTitle || '[Project Title]'}
**Date:** ${new Date().toLocaleDateString()}
**Prepared by:** [Your Name/Company]

---

**EXECUTIVE SUMMARY**

We are pleased to present this proposal for ${formData.projectTitle || 'your project'}. Our team is excited about the opportunity to work with ${formData.clientCompany || 'your organization'} and deliver exceptional results that align with your business objectives.

**PROJECT OVERVIEW**

${formData.projectDescription || 'This project involves comprehensive services tailored to meet your specific business needs. Our approach combines industry best practices with innovative solutions to deliver measurable results.'}

**SCOPE OF WORK**

**Service Type:** ${serviceTypes.find(s => s.value === formData.serviceType)?.label || 'Professional Services'}

**Key Deliverables:**
${formData.deliverables ? 
  formData.deliverables.split('\n').map(item => `• ${item}`).join('\n') : 
  `• Comprehensive project analysis
• Custom solution development
• Implementation and deployment
• Training and documentation
• Ongoing support and maintenance`
}

**PROJECT TIMELINE**

**Estimated Duration:** ${formData.timeline || '8-12 weeks'}

**Project Phases:**
• Phase 1: Discovery & Planning (Weeks 1-2)
• Phase 2: Development & Design (Weeks 3-6)
• Phase 3: Testing & Implementation (Weeks 7-8)
• Phase 4: Launch & Support (Weeks 9-12)

**INVESTMENT & TERMS**

**Total Investment:** ${formData.budget ? `$${formData.budget}` : 'To be discussed'}

**Payment Terms:** ${formData.terms}% upfront, remaining balance in milestone payments

**What's Included:**
• All development and implementation work
• Project management and coordination
• Quality assurance and testing
• Training for your team
• 30-day post-launch support
• Documentation and handover materials

**WHY CHOOSE US**

• **Proven Track Record:** Successfully delivered 200+ projects
• **Expert Team:** Certified professionals with 10+ years experience
• **Quality Assurance:** Rigorous testing and quality control processes
• **Ongoing Support:** Dedicated support team available post-launch
• **Competitive Pricing:** Transparent pricing with no hidden costs

**NEXT STEPS**

1. Review this proposal and provide feedback
2. Schedule a meeting to discuss any questions
3. Sign the agreement to begin the project
4. Kick-off meeting and project initiation

**CONTACT INFORMATION**

[Your Name]
[Your Title]
[Your Company]
[Phone Number]
[Email Address]

---

We look forward to partnering with you on this exciting project. Please don't hesitate to reach out with any questions or to schedule a discussion about this proposal.

Thank you for considering our services.

Best regards,
[Your Name]
[Your Company]
`;

    setGeneratedProposal(proposal);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedProposal], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `proposal-${formData.clientCompany || 'client'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Proposal Generator</h2>
              <p className="text-gray-600">Create professional business proposals instantly</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Powered by AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Client Company
                </label>
                <input
                  type="text"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Acme Corporation"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={formData.projectTitle}
                onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Digital Transformation Initiative"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {serviceTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe the project scope and objectives..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Deliverables
              </label>
              <textarea
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="List key deliverables (one per line)..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Budget
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="25,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Timeline
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="8-12 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upfront %
                </label>
                <select
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="25">25%</option>
                  <option value="30">30%</option>
                  <option value="50">50%</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Proposal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Proposal</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Proposal Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Proposal</h3>
              {generatedProposal && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              )}
            </div>
            
            {generatedProposal ? (
              <div className="bg-white p-4 rounded-md border max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                  {generatedProposal}
                </pre>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-md border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No proposal generated yet</p>
                  <p className="text-sm text-gray-400">
                    Fill in the project details and click "Generate Proposal" to create your professional proposal
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

export default ProposalGenerator;