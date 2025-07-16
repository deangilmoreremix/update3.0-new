import React, { useEffect, useState } from 'react';
import { runAgentWorkflow } from '../../agents/AgentOrchestrator';
import agentButtonMap from '../../agents/agentButtons';
import { X, Copy, CheckCircle, Send, Check } from 'lucide-react';

interface AgentModalProps {
  agentId: string;
  data: unknown;
  onClose: () => void;
}

const AgentModal: React.FC<AgentModalProps> = ({ agentId, data, onClose }) => {
  const [steps, setSteps] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const output = await runAgentWorkflow(agentId, data, setSteps);
        setResult(output);
      } catch (err) {
        setError('Agent failed to run');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [agentId, data]);

  const { label, icon } = agentButtonMap[agentId] || {};

  const copyToClipboard = () => {
    if (result) {
      const textToCopy = typeof result === 'string' 
        ? result 
        : JSON.stringify(result, null, 2);
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to determine if content is an email
  const isEmail = (text: string) => {
    return text.includes('Subject:') && 
           (text.includes('Hi ') || text.includes('Hello ') || text.includes('Dear ')) && 
           (text.includes('Regards,') || text.includes('Best,') || text.includes('Thanks,'));
  };

  // Render JSON output
  const renderJsonOutput = (data: unknown) => {
    // Handle email sequence output (SDR agent)
    if (data.first_email && data.follow_up && data.final_bump) {
      return (
        <div className="space-y-4 text-sm text-gray-800">
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
            <h4 className="font-bold mb-2 text-blue-800 flex items-center">
              <span className="mr-1">1️⃣</span> First-touch Email
            </h4>
            <p className="whitespace-pre-wrap">{data.first_email}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-indigo-500">
            <h4 className="font-bold mb-2 text-indigo-800 flex items-center">
              <span className="mr-1">2️⃣</span> Follow-up Email
            </h4>
            <p className="whitespace-pre-wrap">{data.follow_up}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-500">
            <h4 className="font-bold mb-2 text-purple-800 flex items-center">
              <span className="mr-1">3️⃣</span> Final Bump
            </h4>
            <p className="whitespace-pre-wrap">{data.final_bump}</p>
          </div>
        </div>
      );
    }

    // Handle lead enrichment output
    if (data.enrichedProfile && data.potentialPainPoints) {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">Enriched Profile</h4>
            <p className="text-sm whitespace-pre-wrap">{data.enrichedProfile}</p>
          </div>
          
          {data.potentialPainPoints && data.potentialPainPoints.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h4 className="font-bold text-amber-800 mb-2">Potential Pain Points</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {data.potentialPainPoints.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {data.recommendedApproach && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="font-bold text-green-800 mb-2">Recommended Approach</h4>
              <p className="text-sm">{data.recommendedApproach}</p>
            </div>
          )}
        </div>
      );
    }

    // Generic handling for other JSON outputs
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto">
        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  // Render result based on its type
  const renderResult = () => {
    if (!result) return null;

    // Handle string results
    if (typeof result === 'string') {
      // If it looks like an email, format it nicely
      if (isEmail(result)) {
        return (
          <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
            <p className="whitespace-pre-wrap text-sm">{result}</p>
          </div>
        );
      }
      
      // Otherwise show as plain text
      return <p className="whitespace-pre-wrap text-sm">{result}</p>;
    }
    
    // Handle JSON/object results
    return renderJsonOutput(result);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              {icon || null} {label || agentId}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && <p className="text-sm text-gray-600 mb-3">⏳ Executing steps...</p>}
          {error && <p className="text-sm bg-red-50 text-red-700 p-3 rounded-lg mb-3">{error}</p>}

          {/* Steps */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Execution Steps</h3>
            <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
              {steps.length === 0 && loading && (
                <p className="text-gray-500 italic">Starting agent workflow...</p>
              )}
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-gray-400 mr-2">➡️</span>
                  <span className="font-medium text-gray-700">{step.step || step.name}</span>
                  {step.result && (
                    <span className="ml-1 text-green-600 flex items-center">
                      <Check size={14} className="mr-1" />
                      {step.result}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Result */}
          {!loading && result && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700">Agent Result</h3>
                <button 
                  onClick={copyToClipboard}
                  className="text-xs flex items-center text-gray-700 hover:text-blue-700"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={14} className="mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-auto max-h-60">
                {renderResult()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between flex-wrap gap-2">
            <button 
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
              onClick={onClose}
            >
              Close
            </button>
            
            <div className="flex space-x-2">
              <button 
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
                onClick={() => alert('Task created successfully!')}
                disabled={loading || !result}
              >
                <CheckCircle size={16} className="mr-1.5" />
                Create Task
              </button>
              
              {agentId === 'ai-sdr' && (
                <button 
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center"
                  onClick={() => alert('Email sequence added to outbound campaign!')}
                  disabled={loading || !result}
                >
                  <Send size={16} className="mr-1.5" />
                  Send Sequence
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentModal;