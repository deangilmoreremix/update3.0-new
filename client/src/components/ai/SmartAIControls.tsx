import React, { useState, useEffect } from 'react';
import { Zap, Pause, RotateCcw, Settings, BarChart3, Users, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { useSmartAI } from '../../hooks/useSmartAI';
import { ModernButton } from '../ui/ModernButton';

interface BulkAnalysisSettings {
  batchSize: number;
  maxConcurrent: number;
  urgency: 'low' | 'medium' | 'high';
  analysisType: 'contact_scoring' | 'categorization' | 'lead_qualification';
  costLimit: number;
}

export const SmartAIControls: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const { 
    analyzing, 
    results, 
    errors, 
    bulkAnalyzeContacts, 
    clearResults,
    getPerformanceMetrics 
  } = useSmartAI();

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [settings, setSettings] = useState<BulkAnalysisSettings>({
    batchSize: 10,
    maxConcurrent: 3,
    urgency: 'medium',
    analysisType: 'contact_scoring',
    costLimit: 1.0
  });
  const [showSettings, setShowSettings] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const performanceData = await getPerformanceMetrics();
      setMetrics(performanceData);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const startBulkAnalysis = async () => {
    if (contacts.length === 0) return;

    setIsRunning(true);
    setProgress(0);

    try {
      const contactsData = contacts.map(contact => ({
        contactId: contact.id,
        contact
      }));

      const request = {
        contacts: contactsData,
        analysisType: settings.analysisType,
        urgency: settings.urgency,
        costLimit: settings.costLimit
      };

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      await bulkAnalyzeContacts(request);
      
      clearInterval(progressInterval);
      setProgress(100);
      setIsRunning(false);
      
      // Reload metrics after analysis
      await loadMetrics();
    } catch (error) {
      console.error('Bulk analysis failed:', error);
      setIsRunning(false);
      setProgress(0);
    }
  };

  const pauseAnalysis = () => {
    setIsPaused(!isPaused);
  };

  const resetAnalysis = () => {
    setIsRunning(false);
    setIsPaused(false);
    setProgress(0);
    clearResults();
  };

  const getProcessedCount = () => {
    return Object.keys(results).length;
  };

  const getErrorCount = () => {
    return Object.keys(errors).length;
  };

  const getSuccessRate = () => {
    const total = getProcessedCount() + getErrorCount();
    return total > 0 ? (getProcessedCount() / total) * 100 : 0;
  };

  return (
    <div className={`
      p-6 rounded-lg border backdrop-blur-sm
      ${isDark 
        ? 'bg-gray-900/50 border-gray-700' 
        : 'bg-white/50 border-gray-200'
      }
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`
            p-2 rounded-lg
            ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}
          `}>
            <Zap className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Smart AI Controls
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Bulk AI analysis with intelligent optimization
            </p>
          </div>
        </div>
        
        <ModernButton
          variant="ghost"
          size="sm"
          icon={Settings}
          onClick={() => setShowSettings(!showSettings)}
          className="shrink-0"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Users className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Contacts</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {contacts.length}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Processed</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getProcessedCount()}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Errors</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getErrorCount()}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Target className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</span>
          </div>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getSuccessRate().toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {(isRunning || progress > 0) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Analysis Progress
            </span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-3 mb-6">
        <ModernButton
          variant="primary"
          icon={isRunning ? Pause : Play}
          onClick={isRunning ? pauseAnalysis : startBulkAnalysis}
          disabled={contacts.length === 0 || analyzing}
          loading={analyzing}
        >
          {isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Start Analysis'}
        </ModernButton>

        <ModernButton
          variant="outline"
          icon={RotateCcw}
          onClick={resetAnalysis}
          disabled={!isRunning && progress === 0}
        >
          Reset
        </ModernButton>

        <ModernButton
          variant="ghost"
          icon={BarChart3}
          onClick={loadMetrics}
        >
          Refresh Stats
        </ModernButton>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`
          p-4 rounded-lg border mb-6
          ${isDark 
            ? 'bg-gray-800/50 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <h4 className={`text-md font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Analysis Settings
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Analysis Type
              </label>
              <select
                value={settings.analysisType}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  analysisType: e.target.value as any 
                }))}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="contact_scoring">Contact Scoring</option>
                <option value="categorization">Categorization</option>
                <option value="lead_qualification">Lead Qualification</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Urgency
              </label>
              <select
                value={settings.urgency}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  urgency: e.target.value as any 
                }))}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Batch Size
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.batchSize}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  batchSize: parseInt(e.target.value) || 10 
                }))}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Cost Limit ($)
              </label>
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={settings.costLimit}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  costLimit: parseFloat(e.target.value) || 1.0 
                }))}
                className={`
                  w-full px-3 py-2 rounded-lg border
                  ${isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              />
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {metrics && (
        <div className={`
          p-4 rounded-lg border
          ${isDark 
            ? 'bg-gray-800/50 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <h4 className={`text-md font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Performance Overview
          </h4>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Tasks</span>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {metrics.totalTasks}
              </p>
            </div>
            <div>
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</span>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {metrics.overallSuccessRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Response</span>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {metrics.avgResponseTime.toFixed(1)}s
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};