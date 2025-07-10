import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Bot, Zap, Clock, CheckSquare, Play, Settings, Plus, AlertCircle } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  lastRun?: string;
  runsCount: number;
  createdAt: string;
}

export const TaskAutomation: React.FC = () => {
  const { isDark } = useTheme();
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-assign high priority tasks',
      trigger: 'Task priority is set to High',
      action: 'Assign to team lead and send notification',
      isActive: true,
      lastRun: '2024-01-08T10:30:00Z',
      runsCount: 25,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Overdue task reminders',
      trigger: 'Task is overdue by 1 day',
      action: 'Send reminder email to assignee and manager',
      isActive: true,
      lastRun: '2024-01-08T09:15:00Z',
      runsCount: 12,
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: '3',
      name: 'Auto-complete recurring tasks',
      trigger: 'Recurring task is completed',
      action: 'Create next instance and update due date',
      isActive: false,
      lastRun: '2024-01-07T14:20:00Z',
      runsCount: 8,
      createdAt: '2024-01-03T00:00:00Z'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    trigger: '',
    action: ''
  });

  const handleToggleRule = (id: string) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const handleCreateRule = () => {
    if (newRule.name.trim() && newRule.trigger.trim() && newRule.action.trim()) {
      const rule: AutomationRule = {
        id: Date.now().toString(),
        name: newRule.name,
        trigger: newRule.trigger,
        action: newRule.action,
        isActive: true,
        runsCount: 0,
        createdAt: new Date().toISOString()
      };
      setAutomationRules([...automationRules, rule]);
      setNewRule({ name: '', trigger: '', action: '' });
      setShowCreateForm(false);
    }
  };

  const handleRunRule = (id: string) => {
    setAutomationRules(rules =>
      rules.map(rule =>
        rule.id === id
          ? { ...rule, lastRun: new Date().toISOString(), runsCount: rule.runsCount + 1 }
          : rule
      )
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Task Automation
              </h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                Automate repetitive tasks and streamline your workflow
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg"
            >
              <Plus size={16} />
              <span>New Rule</span>
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Active Rules</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {automationRules.filter(r => r.isActive).length}
                </p>
              </div>
              <Bot className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Executions</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {automationRules.reduce((sum, rule) => sum + rule.runsCount, 0)}
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Time Saved</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round(automationRules.reduce((sum, rule) => sum + rule.runsCount, 0) * 2.5)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  98%
                </p>
              </div>
              <CheckSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Create Rule Form */}
        {showCreateForm && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Create Automation Rule
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Rule Name
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Enter rule name..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Trigger Condition
                </label>
                <input
                  type="text"
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({...newRule, trigger: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="When should this rule trigger?"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Action to Take
                </label>
                <input
                  type="text"
                  value={newRule.action}
                  onChange={(e) => setNewRule({...newRule, action: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="What action should be taken?"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className={`px-4 py-2 border ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRule}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
              >
                Create Rule
              </button>
            </div>
          </div>
        )}

        {/* Automation Rules */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Automation Rules
          </h3>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {rule.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRunRule(rule.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Run now"
                    >
                      <Play size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`p-2 ${rule.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} rounded-lg transition-colors`}
                      title={rule.isActive ? 'Disable' : 'Enable'}
                    >
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Trigger:</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                      <AlertCircle size={14} className="mr-2 text-yellow-500" />
                      {rule.trigger}
                    </p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Action:</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                      <Zap size={14} className="mr-2 text-purple-500" />
                      {rule.action}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Runs: {rule.runsCount}
                    </span>
                    {rule.lastRun && (
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last run: {new Date(rule.lastRun).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Created: {new Date(rule.createdAt).toLocaleDateString()}
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

export default TaskAutomation;