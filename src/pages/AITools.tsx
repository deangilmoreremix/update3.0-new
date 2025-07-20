import React from 'react'
import { Brain, Sparkles, MessageSquare, Zap } from 'lucide-react'

export default function AITools() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tools</h1>
        <p className="text-gray-600">Powered by artificial intelligence</p>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">27</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks Automated</p>
              <p className="text-2xl font-bold text-gray-900">143</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Conversations</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Efficiency Gain</p>
              <p className="text-2xl font-bold text-gray-900">+34%</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow p-6 border border-purple-100">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
          </div>
          <p className="text-gray-600 mb-4">AI-powered analytics and recommendations for your business.</p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Get Insights
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-100">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <p className="text-gray-600 mb-4">Chat with AI to get help with your CRM tasks and questions.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Start Chat
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow p-6 border border-green-100">
          <div className="flex items-center mb-4">
            <Zap className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Auto Actions</h3>
          </div>
          <p className="text-gray-600 mb-4">Automate repetitive tasks with AI-powered workflows.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Setup Automation
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Features</h2>
        <p className="text-gray-600 mb-4">
          This is a placeholder for the AI Tools page. In the full implementation, this would include:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Smart email composition and responses</li>
          <li>Predictive lead scoring and prioritization</li>
          <li>Automated data entry and enrichment</li>
          <li>Intelligent task suggestions and scheduling</li>
          <li>AI-powered sales forecasting</li>
          <li>Natural language query interface</li>
        </ul>
      </div>
    </div>
  )
}
