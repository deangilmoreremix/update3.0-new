import React from 'react';
import { ExternalLink, ArrowRight, Shield, Brain } from 'lucide-react';

const LandingPage: React.FC = () => {
  const openLandingPage = () => {
    window.open('https://cerulean-crepe-9470cc.netlify.app/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-3">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Smart
                </span>
                <span className="text-gray-900">CRM</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/signin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </a>
              <a
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
                SmartCRM
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience our AI-powered CRM platform with intelligent automation, 
              advanced analytics, and seamless customer relationship management.
            </p>
          </div>

          {/* Main CTA */}
          <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 mb-12 shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <ExternalLink className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                View Our Interactive Demo
              </h2>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore the full SmartCRM experience with our interactive landing page featuring 
              live demos, animations, and detailed feature showcases.
            </p>
            <button
              onClick={openLandingPage}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Open Interactive Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Opens in a new window • Full interactive experience
            </p>
          </div>

          {/* Quick Access */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href="/signin"
              className="group bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Existing User</h3>
              <p className="text-gray-600 text-sm mb-3">
                Sign in to access your CRM dashboard
              </p>
              <div className="flex items-center justify-center text-green-600 group-hover:text-green-700">
                <span className="text-sm font-medium">Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            <a
              href="/signup"
              className="group bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">New User</h3>
              <p className="text-gray-600 text-sm mb-3">
                Create your account and start your free trial
              </p>
              <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">Get Started</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
