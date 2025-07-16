import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Zap, Clock, Target, Mail, MessageSquare, Calendar, CheckCheck, ChevronRight, Star, Play, Brain, Workflow, Filter, TrendingUp } from 'lucide-react';

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
                Sales Automation that <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Actually Works</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Eliminate repetitive tasks and accelerate your sales cycle with intelligent automation. From lead scoring to follow-up sequences, let AI handle the routine work.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300">
                  Start Free Trial
                </Link>
                <HashLink to="#automation-tools" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition duration-300 flex items-center">
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
      
      {/* Key Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Supercharge Your Sales with Smart Automation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our automation tools eliminate manual work, increase consistency, and help you focus on closing deals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Save 15+ Hours Per Week</h3>
              <p className="text-gray-600">
                Automate repetitive tasks like lead qualification, follow-ups, and data entry to focus on high-value activities.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">40% More Qualified Leads</h3>
              <p className="text-gray-600">
                Smart scoring and automated nurturing helps you identify and prioritize the best opportunities automatically.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">30% Shorter Sales Cycle</h3>
              <p className="text-gray-600">
                Automated follow-ups and intelligent workflow triggers accelerate deal progression and reduce time to close.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Automation Tools Section */}
      <section id="automation-tools" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Sales Automation Suite</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional automation tools for every part of your sales process, from lead capture to deal closure.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Lead Scorer</h3>
              <p className="text-gray-600">
                Automatically analyze and score incoming leads using 50+ data points including website behavior, email engagement, and demographic fit.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Email Sequence Builder</h3>
              <p className="text-gray-600">
                Create smart email drip campaigns that adapt based on recipient behavior with personalized content and optimal send timing.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Task Scheduler</h3>
              <p className="text-gray-600">
                Automatically create and schedule follow-up tasks based on deal stages, customer actions, and optimal timing algorithms.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-full w-min mb-4">
                <Workflow className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pipeline Automator</h3>
              <p className="text-gray-600">
                Automatically advance deals through pipeline stages based on custom triggers, actions, and AI-driven progression rules.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-red-100 rounded-full w-min mb-4">
                <Target className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Opportunity Detector</h3>
              <p className="text-gray-600">
                Monitor customer behavior and automatically flag upsell opportunities, renewal risks, and expansion possibilities.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-teal-100 rounded-full w-min mb-4">
                <MessageSquare className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Response Automator</h3>
              <p className="text-gray-600">
                Automatically respond to common inquiries with personalized messages while routing complex questions to appropriate team members.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold">Lead Scoring Automation</h3>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">Incoming Lead Data</div>
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-700 text-sm border border-gray-200">
                      <div className="space-y-2">
                        <div><strong>Name:</strong> Sarah Johnson</div>
                        <div><strong>Company:</strong> TechStart Inc.</div>
                        <div><strong>Title:</strong> VP of Sales</div>
                        <div><strong>Email:</strong> s.johnson@techstart.com</div>
                        <div><strong>Industry:</strong> SaaS</div>
                        <div><strong>Company Size:</strong> 50-200 employees</div>
                        <div><strong>Website Visits:</strong> 5 in last 7 days</div>
                        <div><strong>Content Downloads:</strong> 2 whitepapers</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center mx-auto">
                      <Zap className="w-4 h-4 mr-2" />
                      Calculate Score
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">AI Lead Score Results</div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">Lead Score: 87/100</h4>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">HOT LEAD</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Company fit score:</span>
                          <span className="font-medium text-green-600">92/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Engagement score:</span>
                          <span className="font-medium text-blue-600">85/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Intent score:</span>
                          <span className="font-medium text-purple-600">84/100</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <h5 className="font-medium text-sm mb-2">Recommended Actions:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Schedule demo call within 24 hours</li>
                          <li>• Send personalized SaaS case study</li>
                          <li>• Assign to senior sales rep</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold ml-3">Intelligent Lead Scoring</h3>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Focus on Your Best Opportunities</h2>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Our AI analyzes dozens of data points to automatically identify your hottest leads and recommend the best next actions for each prospect.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Predictive Scoring</h4>
                    <p className="text-gray-600">AI models trained on your successful deals identify conversion patterns.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-Time Updates</h4>
                    <p className="text-gray-600">Scores update instantly as prospects engage with your content and website.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Automated Actions</h4>
                    <p className="text-gray-600">Trigger personalized follow-ups and assign leads based on scores automatically.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Criteria</h4>
                    <p className="text-gray-600">Define your ideal customer profile and scoring factors.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Link to="/register" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mr-4">
                  Try It Free
                </Link>
                <button className="flex items-center text-blue-600 font-medium">
                  <Play size={16} className="mr-2" fill="currentColor" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Automation Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Sales Teams Love Our Automation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Save time, increase consistency, and never miss an opportunity with intelligent sales automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Eliminate Manual Work</h3>
              <p className="text-gray-600">
                Automate data entry, lead routing, and follow-up scheduling so your team can focus on selling.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Filter className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Consistent Process</h3>
              <p className="text-gray-600">
                Ensure every lead gets the same high-quality experience with standardized automated workflows.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Never Miss Opportunities</h3>
              <p className="text-gray-600">
                Automated alerts and reminders ensure no lead falls through the cracks or goes uncontacted.
              </p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link to="/features/automation/benefits" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300">
              See All Benefits
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our automation platform is transforming sales teams worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex mb-4">
                {Array(5).fill(0).map((_, index) => (
                  <Star 
                    key={index}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400" 
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Our sales team is now 40% more productive since implementing the automation tools. The lead scoring is incredibly accurate, and we're closing deals faster than ever before."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Mark Wilson</p>
                  <p className="text-gray-600 text-sm">VP of Sales, GrowthCorp</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex mb-4">
                {Array(5).fill(0).map((_, index) => (
                  <Star 
                    key={index}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400" 
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "The email automation has been a game-changer. Our response rates have increased by 60%, and we never miss a follow-up anymore. It's like having a sales assistant that never sleeps."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Jennifer Lopez</p>
                  <p className="text-gray-600 text-sm">Sales Director, TechSolutions</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex mb-4">
                {Array(5).fill(0).map((_, index) => (
                  <Star 
                    key={index}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400" 
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "Setting up custom workflows was surprisingly easy, and the impact was immediate. We've reduced our sales cycle by 30% and our team is much more focused on high-value activities."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Robert Chen</p>
                  <p className="text-gray-600 text-sm">Sales Manager, InnovateLabs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Automate Your Sales Success?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of sales teams using our automation platform to close more deals in less time.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition duration-300">
              Start Your Free Trial
            </Link>
            <Link to="/contact" className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default AutomationFeaturePage;