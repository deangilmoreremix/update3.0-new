import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Repeat, Plus, ArrowRight, Settings, Play, Pause, Trash2 } from 'lucide-react';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  name: string;
  description: string;
  config: unknown;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  runCount: number;
  lastRun?: string;
  createdAt: string;
}

export const WorkflowBuilder: React.FC = () => {
  const { isDark } = useTheme();
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'New Lead Processing',
      description: 'Automatically process new leads from contact forms',
      steps: [
        {
          id: '1',
          type: 'trigger',
          name: 'New Contact Form Submission',
          description: 'Triggered when a new contact form is submitted',
          config: { source: 'contact_form' }
        },
        {
          id: '2',
          type: 'action',
          name: 'Create Lead Record',
          description: 'Create a new lead record in the CRM',
          config: { priority: 'medium' }
        },
        {
          id: '3',
          type: 'action',
          name: 'Send Welcome Email',
          description: 'Send automated welcome email to new lead',
          config: { template: 'welcome_template' }
        },
        {
          id: '4',
          type: 'action',
          name: 'Assign to Sales Rep',
          description: 'Assign lead to available sales representative',
          config: { assignment: 'round_robin' }
        }
      ],
      isActive: true,
      runCount: 45,
      lastRun: '2024-01-08T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Task Reminder System',
      description: 'Send reminders for overdue tasks',
      steps: [
        {
          id: '1',
          type: 'trigger',
          name: 'Daily Schedule',
          description: 'Runs every day at 9:00 AM',
          config: { schedule: '0 9 * * *' }
        },
        {
          id: '2',
          type: 'condition',
          name: 'Check Overdue Tasks',
          description: 'Find tasks that are overdue',
          config: { condition: 'due_date < today' }
        },
        {
          id: '3',
          type: 'action',
          name: 'Send Reminder Email',
          description: 'Send reminder email to task assignee',
          config: { template: 'task_reminder' }
        }
      ],
      isActive: true,
      runCount: 12,
      lastRun: '2024-01-08T09:00:00Z',
      createdAt: '2024-01-02T00:00:00Z'
    }
  ]);

  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    steps: [] as WorkflowStep[]
  });

  const stepTypes = [
    { type: 'trigger', icon: '⚡', color: 'bg-blue-100 text-blue-800' },
    { type: 'action', icon: '🔧', color: 'bg-green-100 text-green-800' },
    { type: 'condition', icon: '❓', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const availableSteps = {
    trigger: [
      { name: 'New Contact Form', description: 'When a new contact form is submitted' },
      { name: 'Task Created', description: 'When a new task is created' },
      { name: 'Deal Stage Changed', description: 'When a deal moves to a different stage' },
      { name: 'Schedule', description: 'Run on a specific schedule' }
    ],
    action: [
      { name: 'Send Email', description: 'Send an email notification' },
      { name: 'Create Task', description: 'Create a new task' },
      { name: 'Update Record', description: 'Update an existing record' },
      { name: 'Assign User', description: 'Assign to a user or team' }
    ],
    condition: [
      { name: 'Check Value', description: 'Check if a field meets criteria' },
      { name: 'Compare Dates', description: 'Compare dates or times' },
      { name: 'User Role', description: 'Check user role or permissions' }
    ]
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, isActive: !w.isActive } : w
    ));
  };

  const handleRunWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { 
        ...w, 
        runCount: w.runCount + 1, 
        lastRun: new Date().toISOString() 
      } : w
    ));
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const handleCreateWorkflow = () => {
    if (newWorkflow.name && newWorkflow.steps.length > 0) {
      const workflow: Workflow = {
        id: Date.now().toString(),
        ...newWorkflow,
        isActive: true,
        runCount: 0,
        createdAt: new Date().toISOString()
      };
      setWorkflows([...workflows, workflow]);
      setNewWorkflow({ name: '', description: '', steps: [] });
      setShowBuilder(false);
    }
  };

  const addStep = (type: 'trigger' | 'action' | 'condition', stepData: any) => {
    const step: WorkflowStep = {
      id: Date.now().toString(),
      type,
      name: stepData.name,
      description: stepData.description,
      config: {}
    };
    setNewWorkflow({
      ...newWorkflow,
      steps: [...newWorkflow.steps, step]
    });
  };

  const removeStep = (stepId: string) => {
    setNewWorkflow({
      ...newWorkflow,
      steps: newWorkflow.steps.filter(s => s.id !== stepId)
    });
  };

  const getStepTypeConfig = (type: string) => {
    return stepTypes.find(s => s.type === type) || stepTypes[0];
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Workflow Builder
              </h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                Create and manage automated workflows for your business processes
              </p>
            </div>
            <button
              onClick={() => setShowBuilder(!showBuilder)}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <Plus size={16} />
              <span>New Workflow</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Workflows</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {workflows.length}
                </p>
              </div>
              <Repeat className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Active</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {workflows.filter(w => w.isActive).length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Runs</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {workflows.reduce((sum, w) => sum + w.runCount, 0)}
                </p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  96%
                </p>
              </div>
              <Settings className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Workflow Builder */}
        {showBuilder && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Create New Workflow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Enter workflow name..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Description
                </label>
                <input
                  type="text"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="Describe what this workflow does..."
                />
              </div>
            </div>

            {/* Step Builder */}
            <div className="mb-6">
              <h4 className={`text-md font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Workflow Steps
              </h4>
              <div className="flex items-center space-x-4 mb-4">
                {stepTypes.map((stepType) => (
                  <div key={stepType.type} className="relative">
                    <select
                      onChange={(e) => {
                        const stepData = availableSteps[stepType.type as keyof typeof availableSteps].find(s => s.name === e.target.value);
                        if (stepData) {
                          addStep(stepType.type as unknown, stepData);
                        }
                      }}
                      className={`px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    >
                      <option value="">Add {stepType.type}</option>
                      {availableSteps[stepType.type as keyof typeof availableSteps].map((step) => (
                        <option key={step.name} value={step.name}>
                          {step.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Current Steps */}
              <div className="space-y-4">
                {newWorkflow.steps.map((step, index) => {
                  const stepConfig = getStepTypeConfig(step.type);
                  return (
                    <div key={step.id} className="flex items-center space-x-4">
                      <div className={`px-3 py-2 rounded-lg ${stepConfig.color} text-sm font-medium`}>
                        {stepConfig.icon} {step.type}
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {step.name}
                        </h5>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                      </div>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      {index < newWorkflow.steps.length - 1 && (
                        <ArrowRight size={16} className="text-gray-400" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBuilder(false)}
                className={`px-4 py-2 border ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkflow}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                Create Workflow
              </button>
            </div>
          </div>
        )}

        {/* Workflow List */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Workflows
          </h3>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${workflow.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {workflow.name}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {workflow.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRunWorkflow(workflow.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Run workflow"
                    >
                      <Play size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleWorkflow(workflow.id)}
                      className={`p-2 ${workflow.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} rounded-lg transition-colors`}
                      title={workflow.isActive ? 'Disable' : 'Enable'}
                    >
                      {workflow.isActive ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete workflow"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div className="flex items-center space-x-2 mb-4">
                  {workflow.steps.map((step, index) => {
                    const stepConfig = getStepTypeConfig(step.type);
                    return (
                      <div key={step.id} className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded text-xs ${stepConfig.color}`}>
                          {stepConfig.icon} {step.name}
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <ArrowRight size={12} className="text-gray-400" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Workflow Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Runs: {workflow.runCount}
                    </span>
                    {workflow.lastRun && (
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last run: {new Date(workflow.lastRun).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Created: {new Date(workflow.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;