import React, { useState, useRef, useEffect } from 'react';
import { Send, Bug, Code, Lightbulb, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { kimiDebugService } from '../../services/kimiDebugService';

interface DebugMessage {
  id: string;
  type: 'user' | 'kimi' | 'system';
  content: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high';
}

interface DebugSessionProps {
  initialError?: string;
  initialCode?: string;
  filePath?: string;
  onClose?: () => void;
}

export const KimiDebugInterface: React.FC<DebugSessionProps> = ({
  initialError,
  initialCode,
  filePath,
  onClose
}) => {
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkApiHealth();
    if (initialError) {
      handleInitialError();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const checkApiHealth = async () => {
    const healthy = await kimiDebugService.checkApiHealth();
    setApiHealthy(healthy);
    
    if (!healthy) {
      addMessage('system', 'Kimi AI service is not available. Please check your API configuration.', 'high');
    }
  };

  const handleInitialError = async () => {
    if (!initialError) return;
    
    addMessage('user', `Debug this error: ${initialError}${initialCode ? `\n\nCode:\n${initialCode}` : ''}`);
    
    if (apiHealthy) {
      await analyzeError(initialError, initialCode);
    }
  };

  const addMessage = (type: DebugMessage['type'], content: string, severity?: DebugMessage['severity']) => {
    const message: DebugMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      severity
    };
    
    setMessages(prev => [...prev, message]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzeError = async (error: string, code?: string) => {
    setIsLoading(true);
    setStreamingContent('');
    
    try {
      let streamingMessageAdded = false;
      
      await kimiDebugService.debugWithKimi(
        error,
        code || 'No code context provided',
        filePath,
        (chunk: string) => {
          if (!streamingMessageAdded) {
            addMessage('kimi', '');
            streamingMessageAdded = true;
          }
          setStreamingContent(prev => prev + chunk);
        }
      );
      
      // Update the last message with the complete streaming content
      if (streamingContent) {
        setMessages(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          if (lastMessage && lastMessage.type === 'kimi') {
            lastMessage.content = streamingContent;
          }
          return updated;
        });
      }
      
    } catch (error) {
      addMessage('system', `Error communicating with Kimi AI: ${error}`, 'high');
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    addMessage('user', userMessage);

    if (!apiHealthy) {
      addMessage('system', 'Kimi AI service is not available. Cannot process request.', 'high');
      return;
    }

    setIsLoading(true);
    setStreamingContent('');
    
    try {
      let streamingMessageAdded = false;
      
      await kimiDebugService.debugWithKimi(
        userMessage,
        'User query - no specific code context',
        filePath,
        (chunk: string) => {
          if (!streamingMessageAdded) {
            addMessage('kimi', '');
            streamingMessageAdded = true;
          }
          setStreamingContent(prev => prev + chunk);
        }
      );
      
      // Update the streaming message
      if (streamingContent) {
        setMessages(prev => {
          const updated = [...prev];
          const lastMessage = updated[updated.length - 1];
          if (lastMessage && lastMessage.type === 'kimi') {
            lastMessage.content = streamingContent;
          }
          return updated;
        });
      }
      
    } catch (error) {
      addMessage('system', `Error: ${error}`, 'high');
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getMessageIcon = (type: DebugMessage['type']) => {
    switch (type) {
      case 'user':
        return <Bug className="w-4 h-4 text-blue-500" />;
      case 'kimi':
        return <Lightbulb className="w-4 h-4 text-purple-500" />;
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5" />
          <h3 className="font-semibold">Kimi AI Debug Assistant</h3>
          {apiHealthy !== null && (
            <div className={`w-2 h-2 rounded-full ${apiHealthy ? 'bg-green-400' : 'bg-red-400'}`} />
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-purple-300" />
            <p className="text-lg font-medium">Kimi AI Debug Assistant</p>
            <p className="text-sm">Describe your issue or paste error messages for intelligent debugging assistance.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.type !== 'user' && (
              <div className="flex-shrink-0 mt-1">
                {getMessageIcon(message.type)}
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {message.content}
                  </pre>
                </div>
                {message.severity && getSeverityIcon(message.severity)}
              </div>
              <div className="mt-2 text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
            
            {message.type === 'user' && (
              <div className="flex-shrink-0 mt-1">
                {getMessageIcon(message.type)}
              </div>
            )}
          </div>
        ))}
        
        {/* Streaming message */}
        {isLoading && streamingContent && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <Lightbulb className="w-4 h-4 text-purple-500" />
            </div>
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {streamingContent}
                <span className="animate-pulse">|</span>
              </pre>
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && !streamingContent && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full" />
            <span className="text-sm">Kimi is analyzing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your issue, paste error messages, or ask for help..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            disabled={isLoading || !apiHealthy}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !apiHealthy}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {!apiHealthy && (
          <p className="mt-2 text-xs text-red-600">
            Kimi AI service unavailable. Check your VITE_KIMI_API_KEY configuration.
          </p>
        )}
      </form>
    </div>
  );
};
