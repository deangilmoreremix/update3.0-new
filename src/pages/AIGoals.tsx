import React from 'react';
import { Target, TrendingUp, BarChart3, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AIGoals: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Goals</h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Smart goal tracking and AI-powered insights
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Goals</p>
                <p className="text-2xl font-bold">58</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                <p className="text-2xl font-bold">142</p>
              </div>
              <Star className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>AI Insights</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals List */}
          <div className="lg:col-span-2">
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <h2 className="text-xl font-semibold mb-6">Active AI Goals</h2>

              <div className="space-y-4">
                {[
                  { title: 'Increase Sales Pipeline by 25%', progress: 68, priority: 'high' },
                  { title: 'Improve Lead Response Time', progress: 85, priority: 'medium' },
                  { title: 'Optimize Email Campaign CTR', progress: 42, priority: 'high' },
                  { title: 'Enhance Customer Retention', progress: 73, priority: 'low' },
                ].map((goal, index) => (
                  <div key={index} className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{goal.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {goal.priority}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {goal.progress}% complete
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
              <h2 className="text-xl font-semibold mb-6">AI Insights</h2>

              <div className="space-y-4">
                <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-4`}>
                  <h3 className="font-medium text-blue-600 mb-2">Recommendation</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Focus on email campaigns between 10-11 AM for 23% better response rates.
                  </p>
                </div>

                <div className={`${isDark ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-4`}>
                  <h3 className="font-medium text-green-600 mb-2">Success Pattern</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Your highest converting leads come from LinkedIn outreach on Tuesdays.
                  </p>
                </div>

                <div className={`${isDark ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg p-4`}>
                  <h3 className="font-medium text-purple-600 mb-2">Opportunity</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    30% more deals close when follow-up includes personalized video.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGoals;
