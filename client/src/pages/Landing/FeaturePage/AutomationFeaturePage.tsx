import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { CheckCheck, ChevronRight, Zap, Clock, Target, BarChart3, Mail, MessageSquare, Calendar, Settings, Users, Shield } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

const AutomationFeaturePage: React.FC = () => {
  return (
    <div className="bg-white">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative pt-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Automate Your Sales Process with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Smart Workflows</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Eliminate repetitive tasks and accelerate your sales cycle with intelligent automation. From lead scoring to follow-up sequences, let AI handle the routine work.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300">
                  Start Free Trial
                </Link>
                <HashLink to="#features" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition duration-300 flex items-center">
                  See Automation <ChevronRight size={18} className="ml-1" />
                </HashLink>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <CheckCheck size={18} className="text-green-500 mr-2" />
                No credit card required • 14-day free trial
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-2xl blur-3xl opacity-20 transform rotate-3"></div>
                <img
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Sales Automation Dashboard"
                  className="relative rounded-xl shadow-2xl border border-gray-200 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Key Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Sales Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to automate your sales process and focus on closing deals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Lead Scoring</h3>
              <p className="text-gray-600">
                Automatically score and prioritize leads based on behavior, demographics, and engagement patterns.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email Sequences</h3>
              <p className="text-gray-600">
                Create personalized email campaigns that trigger based on user actions and engagement levels.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Follow-up Automation</h3>
              <p className="text-gray-600">
                Never miss a follow-up with automated reminders and task creation based on deal stages.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-full w-min mb-4">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pipeline Management</h3>
              <p className="text-gray-600">
                Automatically move deals through your pipeline based on predefined criteria and actions.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-red-100 rounded-full w-min mb-4">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Performance Analytics</h3>
              <p className="text-gray-600">
                Track automation performance and optimize workflows with detailed analytics and insights.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-teal-100 rounded-full w-min mb-4">
                <Settings className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Workflows</h3>
              <p className="text-gray-600">
                Build custom automation workflows that match your unique sales process and business rules.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Automation Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Sales Teams Love Our Automation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save time, increase consistency, and never miss an opportunity with intelligent sales automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Save 15+ Hours/Week</h3>
              <p className="text-gray-600 text-sm">
                Eliminate manual tasks and focus on high-value activities
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">40% More Qualified Leads</h3>
              <p className="text-gray-600 text-sm">
                Smart scoring helps you focus on the best opportunities
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">85% Response Rate</h3>
              <p className="text-gray-600 text-sm">
                Personalized automation increases engagement
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-full w-min mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">30% Shorter Sales Cycle</h3>
              <p className="text-gray-600 text-sm">
                Automated follow-ups accelerate deal progression
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Automate Your Sales Process?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of sales teams using our automation platform to close more deals in less time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:shadow-lg transition duration-300">
              Start Free Trial
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white hover:text-blue-600 transition duration-300">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
      
      <LandingFooter />
    </div>
  );
};

export default AutomationFeaturePage;