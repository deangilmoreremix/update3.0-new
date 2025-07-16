import React, { useState } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { smartAIService } from '../../services/smartAIService';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  industry?: string;
  notes?: string;
}

interface AIContactTestButtonProps {
  contact: Contact;
  onResult?: (result: unknown) => void;
}

export const AIContactTestButton: React.FC<AIContactTestButtonProps> = ({ 
  contact, 
  onResult 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      console.log('Starting AI analysis for contact:', contact.name);
      const analysis = await smartAIService.analyzeContact(contact);
      
      console.log('AI Analysis completed:', analysis);
      setResult(analysis);
      
      if (onResult) {
        onResult(analysis);
      }
      
    } catch (err: any) {
      console.error('AI Analysis failed:', err);
      setError(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isAnalyzing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Brain className="h-4 w-4" />
        )}
        <span>
          {isAnalyzing ? 'Analyzing...' : 'Test AI Analysis'}
        </span>
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">
            AI Analysis Results (Model: {result.modelUsed})
          </h4>
          <div className="space-y-2 text-sm">
            <p><strong>Score:</strong> {result.score}/100</p>
            <p><strong>Category:</strong> {result.category}</p>
            <p><strong>Confidence:</strong> {Math.round(result.confidence * 100)}%</p>
            
            {result.insights && result.insights.length > 0 && (
              <div>
                <strong>Insights:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {result.insights.map((insight: string, index: number) => (
                    <li key={index} className="text-green-700">{insight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.recommendations && result.recommendations.length > 0 && (
              <div>
                <strong>Recommendations:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-green-700">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};