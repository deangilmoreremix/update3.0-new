import React, { useState } from 'react';
import { Video, FileText, Clock, Users, Sparkles, Copy, Check, Upload } from 'lucide-react';

interface MeetingSummarizerProps {
  onClose?: () => void;
}

const MeetingSummarizer: React.FC<MeetingSummarizerProps> = ({ onClose }) => {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'upload'>('input');

  const handleSummarize = async () => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockSummary = `
**Meeting Summary**
Date: ${new Date().toLocaleDateString()}
Duration: 45 minutes
Participants: 4 attendees

**Key Discussion Points:**
• Product roadmap for Q1 2025
• Budget allocation for new features
• Timeline for implementation
• Resource requirements and team assignments

**Decisions Made:**
• Approved $50K budget for new feature development
• Set launch date for March 15, 2025
• Assigned Sarah as project lead
• Weekly check-ins scheduled for Fridays

**Action Items:**
• John: Prepare technical specifications by Jan 15
• Sarah: Create project timeline by Jan 12
• Mike: Coordinate with design team by Jan 18
• Team: Review and approve budget proposal by Jan 10

**Next Steps:**
• Follow-up meeting scheduled for January 20
• Final review of specifications
• Begin development sprint planning

**Notes:**
The team expressed enthusiasm about the new features and confirmed commitment to the timeline. Stakeholders are aligned on priorities and resource allocation.
`;
    
    setSummary(mockSummary);
    setIsProcessing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTranscript(content);
        setActiveTab('input');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Meeting Summarizer</h2>
              <p className="text-gray-600">Transform meeting transcripts into actionable summaries</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Powered by AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('input')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'input' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="inline h-4 w-4 mr-2" />
                Paste Transcript
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'upload' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="inline h-4 w-4 mr-2" />
                Upload File
              </button>
            </div>

            {activeTab === 'input' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Transcript
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={16}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Paste your meeting transcript here...

Example:
[00:00] John: Good morning everyone, let's start today's meeting about the Q1 roadmap.
[00:05] Sarah: Thanks John. I've prepared the budget analysis for the new features.
[00:10] Mike: The design team has some concerns about the timeline..."
                />
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Transcript File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Upload a text file containing your meeting transcript
                  </p>
                  <input
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="transcript-upload"
                  />
                  <label
                    htmlFor="transcript-upload"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported formats: .txt, .doc, .docx
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">AI Summary Features:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• <Clock className="inline h-4 w-4 mr-1" /> Key discussion points</li>
                <li>• <Users className="inline h-4 w-4 mr-1" /> Decisions made</li>
                <li>• <FileText className="inline h-4 w-4 mr-1" /> Action items with owners</li>
                <li>• <Video className="inline h-4 w-4 mr-1" /> Next steps and follow-ups</li>
              </ul>
            </div>

            <button
              onClick={handleSummarize}
              disabled={isProcessing || !transcript.trim()}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Meeting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Summary</span>
                </>
              )}
            </button>
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Meeting Summary</h3>
              {summary && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
            
            {summary ? (
              <div className="bg-white p-4 rounded-md border">
                <pre className="whitespace-pre-wrap text-gray-700 text-sm">
                  {summary}
                </pre>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-md border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No summary generated yet</p>
                  <p className="text-sm text-gray-400">
                    Paste your meeting transcript and click "Generate Summary" to get started
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

export default MeetingSummarizer;