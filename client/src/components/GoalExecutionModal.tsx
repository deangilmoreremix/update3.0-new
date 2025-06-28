import React, { useState, useEffect, useRef } from 'react';
import { Goal } from '@/types/goals';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  X,
  Play,
  Pause,
  Square,
  Bot,
  Brain,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  Settings,
  Target,
  Sparkles,
  ArrowRight,
  MessageSquare,
  BarChart3,
  Shield,
  Cpu,
  Network,
  Eye,
  Layers,
  Globe,
  Database,
  Link
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'thinking' | 'working' | 'completed' | 'error';
  currentTask: string;
  progress: number;
  thoughts: string[];
  tools: string[];
  lastUpdate: Date;
}

interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  agent: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  output?: string;
  dependencies: string[];
}

interface GoalExecutionModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  realMode?: boolean;
}

const GoalExecutionModal: React.FC<GoalExecutionModalProps> = ({
  goal,
  isOpen,
  onClose,
  realMode = false
}) => {
  const [executionState, setExecutionState] = useState<'idle' | 'running' | 'paused' | 'completed' | 'failed'>('idle');
  const [overallProgress, setOverallProgress] = useState(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(0);
  const [executionStartTime, setExecutionStartTime] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'steps' | 'logs' | 'results'>('overview');
  const [chainOfThought, setChainOfThought] = useState<string[]>([]);
  const [networkActivity, setNetworkActivity] = useState<{from: string, to: string, message: string, timestamp: Date}[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initialize agents and steps when goal changes
  useEffect(() => {
    if (goal && isOpen) {
      initializeExecution();
    }
  }, [goal, isOpen]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const initializeExecution = () => {
    if (!goal) return;

    // Initialize agents based on goal requirements
    const initialAgents: Agent[] = goal.agentsRequired.map((agentName, index) => ({
      id: `agent-${index}`,
      name: agentName,
      role: getAgentRole(agentName),
      status: 'idle',
      currentTask: 'Awaiting instructions',
      progress: 0,
      thoughts: [],
      tools: getAgentTools(agentName),
      lastUpdate: new Date()
    }));

    // Initialize execution steps
    const initialSteps: ExecutionStep[] = generateExecutionSteps(goal, initialAgents);

    setAgents(initialAgents);
    setExecutionSteps(initialSteps);
    setLogs([]);
    setOverallProgress(0);
    setExecutionState('idle');
    setEstimatedTimeRemaining(getEstimatedTime(goal.estimatedSetupTime));
    setChainOfThought([]);
    setNetworkActivity([]);
  };

  const getAgentRole = (agentName: string): string => {
    const roleMap: { [key: string]: string } = {
      'Lead Analyzer': 'Data Analysis & Scoring',
      'Data Processor': 'Data Collection & Processing',
      'CRM Integrator': 'System Integration',
      'Score Calculator': 'Mathematical Computation',
      'Content Creator': 'Content Generation',
      'Personalization Engine': 'User Personalization',
      'Timing Optimizer': 'Temporal Analysis',
      'Health Monitor': 'System Monitoring',
      'Risk Assessor': 'Risk Analysis',
      'Alert System': 'Notification Management',
      'Pipeline Analyzer': 'Process Analysis',
      'Action Recommender': 'Decision Support',
      'Document Scanner': 'Document Processing',
      'Data Extractor': 'Information Extraction',
      'Validation Engine': 'Quality Assurance'
    };
    return roleMap[agentName] || 'Specialized AI Agent';
  };

  const getAgentTools = (agentName: string): string[] => {
    const toolMap: { [key: string]: string[] } = {
      'Lead Analyzer': ['ML Models', 'Analytics API', 'Scoring Engine'],
      'Data Processor': ['ETL Pipeline', 'Database Connector', 'Data Cleaner'],
      'CRM Integrator': ['CRM API', 'Webhook Manager', 'OAuth Handler'],
      'Score Calculator': ['Math Engine', 'Statistics Library', 'Prediction Models'],
      'Content Creator': ['NLP Engine', 'Template System', 'Content API'],
      'Personalization Engine': ['User Profiler', 'Recommendation Engine', 'A/B Tester'],
      'Timing Optimizer': ['Time Series Analysis', 'Pattern Recognition', 'Scheduler'],
      'Health Monitor': ['Metrics Collector', 'Anomaly Detector', 'Dashboard API'],
      'Risk Assessor': ['Risk Models', 'Probability Calculator', 'Decision Tree'],
      'Alert System': ['Notification API', 'Channel Manager', 'Template Engine']
    };
    return toolMap[agentName] || ['General Tools', 'API Access', 'Data Processing'];
  };

  const generateExecutionSteps = (goal: Goal, agents: Agent[]): ExecutionStep[] => {
    const baseSteps = [
      {
        title: 'Environment Setup',
        description: 'Initialize required tools and connections',
        agent: agents[0]?.name || 'System',
        dependencies: []
      },
      {
        title: 'Data Collection',
        description: 'Gather necessary data and validate inputs',
        agent: agents[1]?.name || agents[0]?.name,
        dependencies: ['step-0']
      },
      {
        title: 'System Integration',
        description: 'Connect to required external systems',
        agent: agents[2]?.name || agents[0]?.name,
        dependencies: ['step-1']
      },
      {
        title: 'Core Processing',
        description: 'Execute main goal logic and algorithms',
        agent: agents[0]?.name,
        dependencies: ['step-2']
      },
      {
        title: 'Quality Validation',
        description: 'Validate results and ensure quality standards',
        agent: agents[agents.length - 1]?.name || agents[0]?.name,
        dependencies: ['step-3']
      },
      {
        title: 'Deployment & Monitoring',
        description: 'Deploy solution and set up monitoring',
        agent: 'System Orchestrator',
        dependencies: ['step-4']
      }
    ];

    return baseSteps.map((step, index) => ({
      id: `step-${index}`,
      title: step.title,
      description: step.description,
      agent: step.agent,
      status: 'pending' as const,
      dependencies: step.dependencies
    }));
  };

  const getEstimatedTime = (timeString: string): number => {
    // Parse time string like "2-3 hours" or "45 minutes"
    const match = timeString.match(/(\d+)(-(\d+))?\s*(hour|minute)/);
    if (match) {
      const min = parseInt(match[1]);
      const max = match[3] ? parseInt(match[3]) : min;
      const unit = match[4];
      const avgTime = (min + max) / 2;
      return unit === 'hour' ? avgTime * 60 : avgTime;
    }
    return 60; // Default 1 hour
  };

  const startExecution = async () => {
    if (!goal) return;

    setExecutionState('running');
    setExecutionStartTime(new Date());
    addLog('🚀 Starting goal execution...');
    addLog(`📋 Goal: ${goal.title}`);
    addLog(`👥 Deploying ${agents.length} AI agents`);

    // Start execution simulation
    simulateExecution();
  };

  const simulateExecution = async () => {
    const totalSteps = executionSteps.length;
    let completedSteps = 0;

    for (let i = 0; i < executionSteps.length; i++) {
      const step = executionSteps[i];
      
      // Update step status
      setExecutionSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'in_progress', startTime: new Date() } : s
      ));

      // Find agent for this step
      const agent = agents.find(a => a.name === step.agent);
      if (agent) {
        // Update agent status
        setAgents(prev => prev.map(a => 
          a.id === agent.id ? {
            ...a,
            status: 'working',
            currentTask: step.title,
            lastUpdate: new Date()
          } : a
        ));

        // Add agent thoughts
        const thoughts = generateAgentThoughts(step, agent);
        setAgents(prev => prev.map(a => 
          a.id === agent.id ? { ...a, thoughts: [...a.thoughts, ...thoughts] } : a
        ));

        // Add chain of thought
        addChainOfThought(`🤖 ${agent.name}: Starting ${step.title}`);
        addChainOfThought(`💭 Analyzing requirements and planning approach...`);
        
        // Simulate network activity
        addNetworkActivity('Orchestrator', agent.name, `Assigned task: ${step.title}`);
      }

      addLog(`⚡ Executing: ${step.title}`);

      // Simulate step execution time
      const stepDuration = Math.random() * 3000 + 2000; // 2-5 seconds
      
      // Update progress during step execution
      const progressInterval = setInterval(() => {
        if (agent) {
          setAgents(prev => prev.map(a => 
            a.id === agent.id ? { 
              ...a, 
              progress: Math.min(100, a.progress + Math.random() * 20),
              lastUpdate: new Date()
            } : a
          ));
        }
      }, 500);

      await new Promise(resolve => setTimeout(resolve, stepDuration));
      clearInterval(progressInterval);

      // Complete step
      setExecutionSteps(prev => prev.map(s => 
        s.id === step.id ? { 
          ...s, 
          status: 'completed', 
          endTime: new Date(),
          output: generateStepOutput(step)
        } : s
      ));

      if (agent) {
        setAgents(prev => prev.map(a => 
          a.id === agent.id ? {
            ...a,
            status: 'completed',
            progress: 100,
            currentTask: 'Task completed',
            lastUpdate: new Date()
          } : a
        ));

        addNetworkActivity(agent.name, 'Orchestrator', `Completed: ${step.title}`);
      }

      completedSteps++;
      const newProgress = (completedSteps / totalSteps) * 100;
      setOverallProgress(newProgress);

      addLog(`✅ Completed: ${step.title}`);
      addChainOfThought(`✅ ${step.title} completed successfully`);

      // Update estimated time remaining
      const elapsed = executionStartTime ? Date.now() - executionStartTime.getTime() : 0;
      const avgTimePerStep = elapsed / completedSteps;
      const remainingSteps = totalSteps - completedSteps;
      setEstimatedTimeRemaining(Math.max(0, (remainingSteps * avgTimePerStep) / 60000)); // Convert to minutes
    }

    // Execution completed
    setExecutionState('completed');
    addLog('🎉 Goal execution completed successfully!');
    addChainOfThought('🎉 All tasks completed! Goal is now active and monitoring.');
    
    // Generate final results
    setTimeout(() => {
      setActiveTab('results');
    }, 2000);
  };

  const generateAgentThoughts = (step: ExecutionStep, agent: Agent): string[] => {
    const thoughtTemplates = [
      `Analyzing ${step.description.toLowerCase()}...`,
      `Accessing required tools: ${agent.tools.join(', ')}`,
      `Validating prerequisites and dependencies`,
      `Executing core logic and algorithms`,
      `Monitoring progress and quality metrics`
    ];
    
    return thoughtTemplates.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const generateStepOutput = (step: ExecutionStep): string => {
    const outputs = [
      `Successfully configured ${step.title.toLowerCase()}`,
      `Processed 847 data points with 99.2% accuracy`,
      `Established secure connections to all required systems`,
      `Deployed algorithm with 94% confidence score`,
      `Quality validation passed with 0 errors detected`,
      `Monitoring dashboard active with real-time metrics`
    ];
    
    return outputs[Math.floor(Math.random() * outputs.length)];
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const addChainOfThought = (thought: string) => {
    setChainOfThought(prev => [...prev, thought]);
  };

  const addNetworkActivity = (from: string, to: string, message: string) => {
    setNetworkActivity(prev => [...prev, { from, to, message, timestamp: new Date() }]);
  };

  const pauseExecution = () => {
    setExecutionState('paused');
    addLog('⏸️ Execution paused by user');
  };

  const stopExecution = () => {
    setExecutionState('idle');
    addLog('⏹️ Execution stopped by user');
    setOverallProgress(0);
    
    // Reset all agents
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'idle',
      progress: 0,
      currentTask: 'Awaiting instructions',
      thoughts: []
    })));

    // Reset all steps
    setExecutionSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending',
      startTime: undefined,
      endTime: undefined,
      output: undefined
    })));
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'idle': return 'text-gray-500';
      case 'thinking': return 'text-yellow-500';
      case 'working': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'in_progress': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <Clock className="h-4 w-4" />;
      case 'thinking': return <Brain className="h-4 w-4 animate-pulse" />;
      case 'working': return <Activity className="h-4 w-4 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'in_progress': return <Activity className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!goal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {goal.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mb-4">
                {goal.description}
              </DialogDescription>
              
              {/* Execution Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {executionState === 'idle' && (
                    <button
                      onClick={startExecution}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {realMode ? 'Execute Real Goal' : 'Start Demo'}
                    </button>
                  )}
                  
                  {executionState === 'running' && (
                    <>
                      <button
                        onClick={pauseExecution}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                      >
                        <Pause className="h-4 w-4" />
                        Pause
                      </button>
                      <button
                        onClick={stopExecution}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <Square className="h-4 w-4" />
                        Stop
                      </button>
                    </>
                  )}
                  
                  {executionState === 'paused' && (
                    <button
                      onClick={() => setExecutionState('running')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Resume
                    </button>
                  )}
                </div>
                
                {/* Progress Indicator */}
                {executionState !== 'idle' && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${overallProgress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{Math.round(overallProgress)}%</span>
                    </div>
                    
                    {estimatedTimeRemaining > 0 && executionState === 'running' && (
                      <div className="text-sm text-gray-600">
                        ~{formatTime(estimatedTimeRemaining)} remaining
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 flex-shrink-0">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
              { id: 'agents', label: 'AI Agents', icon: <Bot className="h-4 w-4" /> },
              { id: 'steps', label: 'Execution Steps', icon: <Layers className="h-4 w-4" /> },
              { id: 'logs', label: 'Live Logs', icon: <MessageSquare className="h-4 w-4" /> },
              { id: 'results', label: 'Results', icon: <Target className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Goal Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Business Impact</h3>
                  </div>
                  <p className="text-gray-700">{goal.businessImpact}</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Expected ROI</h3>
                  </div>
                  <p className="text-gray-700">{goal.roi}</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Setup Time</h3>
                  </div>
                  <p className="text-gray-700">{goal.estimatedSetupTime}</p>
                </div>
              </div>

              {/* Real World Example */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Real World Example
                </h3>
                <p className="text-gray-700 leading-relaxed">{goal.realWorldExample}</p>
              </div>

              {/* Prerequisites */}
              {goal.prerequisite && goal.prerequisite.length > 0 && (
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-500" />
                    Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {goal.prerequisite.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Metrics */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Success Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goal.successMetrics.map((metric, index) => (
                    <div key={index} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-6">
              {/* Agent Network Visualization */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Network className="h-5 w-5 text-blue-500" />
                  Agent Network
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`bg-white rounded-lg p-4 border-2 transition-all duration-300 cursor-pointer ${
                        selectedAgent === agent.id
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          agent.status === 'completed' ? 'bg-green-100' :
                          agent.status === 'working' ? 'bg-blue-100' :
                          agent.status === 'thinking' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          <Bot className={`h-5 w-5 ${getStatusColor(agent.status)}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                          <p className="text-sm text-gray-600">{agent.role}</p>
                        </div>
                        <div className={`flex items-center gap-1 ${getStatusColor(agent.status)}`}>
                          {getStatusIcon(agent.status)}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-600 mb-1">Current Task</div>
                        <div className="text-sm font-medium text-gray-900">{agent.currentTask}</div>
                      </div>
                      
                      {agent.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(agent.progress)}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${agent.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.slice(0, 2).map((tool, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tool}
                          </span>
                        ))}
                        {agent.tools.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{agent.tools.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Details */}
              {selectedAgent && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  {(() => {
                    const agent = agents.find(a => a.id === selectedAgent);
                    if (!agent) return null;
                    
                    return (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5 text-purple-500" />
                          {agent.name} - Detailed View
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Agent Information</h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="text-gray-600">Role:</span> {agent.role}</div>
                              <div><span className="text-gray-600">Status:</span> 
                                <span className={`ml-1 ${getStatusColor(agent.status)}`}>
                                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                </span>
                              </div>
                              <div><span className="text-gray-600">Last Update:</span> {agent.lastUpdate.toLocaleTimeString()}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Available Tools</h4>
                            <div className="flex flex-wrap gap-2">
                              {agent.tools.map((tool, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {agent.thoughts.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-semibold text-gray-900 mb-2">Chain of Thought</h4>
                            <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                              {agent.thoughts.map((thought, index) => (
                                <div key={index} className="text-sm text-gray-700 mb-1">
                                  💭 {thought}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Network Activity */}
              {networkActivity.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Link className="h-5 w-5 text-green-500" />
                    Network Activity
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {networkActivity.slice(-10).map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">{activity.timestamp.toLocaleTimeString()}</span>
                        <span className="text-blue-600">{activity.from}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className="text-green-600">{activity.to}</span>
                        <span className="text-gray-700">{activity.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-500" />
                Execution Pipeline
              </h3>
              
              <div className="space-y-4">
                {executionSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    {/* Step Number */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step.status === 'completed' ? 'bg-green-100 text-green-700' :
                      step.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      step.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {step.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    
                    {/* Connector Line */}
                    {index < executionSteps.length - 1 && (
                      <div className={`absolute left-4 mt-8 w-0.5 h-12 ${
                        step.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                      }`} />
                    )}
                    
                    {/* Step Content */}
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${getStatusColor(step.status)}`}>
                          {getStatusIcon(step.status)}
                          {step.status.replace('_', ' ').charAt(0).toUpperCase() + step.status.replace('_', ' ').slice(1)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>👤 {step.agent}</span>
                        {step.startTime && (
                          <span>⏰ Started {step.startTime.toLocaleTimeString()}</span>
                        )}
                        {step.endTime && (
                          <span>✅ Completed {step.endTime.toLocaleTimeString()}</span>
                        )}
                      </div>
                      
                      {step.output && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-sm text-green-800">{step.output}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  Live Execution Logs
                </h3>
                <button
                  onClick={() => setLogs([])}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear Logs
                </button>
              </div>
              
              {/* Chain of Thought */}
              {chainOfThought.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Chain of Thought
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {chainOfThought.slice(-5).map((thought, index) => (
                      <div key={index} className="text-sm text-blue-800">{thought}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Execution Logs */}
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto" ref={logContainerRef}>
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No logs yet. Start execution to see live updates.
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              {executionState === 'completed' ? (
                <>
                  {/* Results Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Goal Successfully Implemented
                    </h3>
                    <p className="text-green-800 mb-4">
                      Your AI goal "{goal.title}" has been successfully deployed and is now active. The system is monitoring performance and will provide ongoing optimization.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-600">98.5%</div>
                        <div className="text-sm text-gray-600">Setup Success Rate</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-600">
                          {executionStartTime ? Math.round((Date.now() - executionStartTime.getTime()) / 60000) : 0}m
                        </div>
                        <div className="text-sm text-gray-600">Total Setup Time</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-600">{agents.length}</div>
                        <div className="text-sm text-gray-600">Agents Deployed</div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Next Steps
                    </h3>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Monitor the automated dashboard for real-time performance metrics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Review weekly optimization reports and suggested improvements
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Scale to additional use cases as business needs evolve
                      </li>
                    </ul>
                  </div>

                  {/* Expected Impact */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      Expected Business Impact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Immediate Benefits (Week 1-4)</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Automated data processing and analysis</li>
                          <li>• Reduced manual work and human error</li>
                          <li>• Real-time monitoring and alerts</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Long-term Impact (3-6 months)</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• {goal.businessImpact}</li>
                          <li>• Expected ROI: {goal.roi}</li>
                          <li>• Continuous optimization and improvement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Target className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Results Will Appear Here</h3>
                  <p className="text-gray-600">Start execution to see real-time results and performance metrics.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalExecutionModal;