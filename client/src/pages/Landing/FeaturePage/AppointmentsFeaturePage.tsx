import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Calendar, Clock, Users, Zap, Video, Bell, CheckCheck, ChevronRight, Star, Play, Link2, Settings, BarChart3 } from 'lucide-react';

import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

const AppointmentsFeaturePage: React.FC = () => {
  return (
    <div className="bg-white">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative pt-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Appointment Scheduling that <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Converts Prospects</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your booking process with intelligent scheduling. Let prospects book meetings instantly while you focus on closing deals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300">
                  Start Free Trial
                </Link>
                <HashLink to="#scheduling-tools" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition duration-300 flex items-center">
                  See Features <ChevronRight size={18} className="ml-1" />
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
                  src="https://images.pexels.com/photos/6120204/pexels-photo-6120204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Appointment Scheduling Interface"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Scheduling That Actually Converts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Remove friction from your booking process and turn more prospects into booked meetings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">3x Faster Booking</h3>
              <p className="text-gray-600">
                Instant scheduling reduces friction and increases conversions from initial interest to booked meeting.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">50% Fewer No-Shows</h3>
              <p className="text-gray-600">
                Smart reminders and confirmations improve attendance rates and reduce wasted calendar time.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">25% More Meetings</h3>
              <p className="text-gray-600">
                Simplified booking process and better availability management increases overall meeting volume.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Scheduling Tools Section */}
      <section id="scheduling-tools" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Scheduling Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional appointment management tools for every scheduling need and business type.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Meeting Scheduler</h3>
              <p className="text-gray-600">
                Let prospects book meetings directly from your emails with intelligent calendar sync and automated confirmation workflows.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Availability</h3>
              <p className="text-gray-600">
                AI-powered scheduling that suggests optimal meeting times based on your productivity patterns and prospect preferences.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">No-Show Predictor</h3>
              <p className="text-gray-600">
                Analyze booking patterns to predict and prevent no-shows with targeted reminder campaigns and rescheduling suggestions.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-full w-min mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Round-Robin</h3>
              <p className="text-gray-600">
                Automatically distribute appointments across team members based on availability, expertise, and workload balancing.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-red-100 rounded-full w-min mb-4">
                <Video className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Meeting Prep Assistant</h3>
              <p className="text-gray-600">
                Automatically research attendees and prepare meeting briefs with conversation starters and relevant context from your CRM.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-teal-100 rounded-full w-min mb-4">
                <BarChart3 className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Booking Analytics</h3>
              <p className="text-gray-600">
                Track appointment trends, conversion rates, and optimize your scheduling process with detailed booking performance insights.
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
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold">Booking Interface Demo</h3>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">Available Time Slots</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors">
                        9:00 AM
                      </button>
                      <button className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors">
                        10:30 AM
                      </button>
                      <button className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors">
                        2:00 PM
                      </button>
                      <button className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors">
                        3:30 PM
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">Meeting Details</div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">Sales Discovery Call</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">30 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Format:</span>
                          <span className="font-medium">Video Call (Zoom)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Timezone:</span>
                          <span className="font-medium">EST (Auto-detected)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center mx-auto w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book 2:00 PM Slot
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">Confirmation Details</div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                      <div className="flex items-center mb-2">
                        <CheckCheck className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Meeting Confirmed!</span>
                      </div>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>📧 Calendar invite sent to your email</div>
                        <div>🔗 Zoom link: https://zoom.us/j/123456789</div>
                        <div>⏰ Reminder set for 1 hour before</div>
                        <div>📱 SMS reminder sent to +1 (555) 123-4567</div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <div className="flex justify-between text-xs">
                          <button className="text-blue-600 hover:underline">Add to Calendar</button>
                          <button className="text-gray-600 hover:underline">Reschedule</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold ml-3">Instant Booking Experience</h3>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Convert Prospects with Frictionless Scheduling</h2>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Our intelligent booking system removes all barriers between prospect interest and scheduled meetings, maximizing your conversion rates.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">One-Click Booking</h4>
                    <p className="text-gray-600">Prospects can book meetings in seconds without account creation or complex forms.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Automatic Confirmations</h4>
                    <p className="text-gray-600">Instant email confirmations with calendar invites and video links.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Reminders</h4>
                    <p className="text-gray-600">Automated email and SMS reminders reduce no-shows by 50%.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mobile Optimized</h4>
                    <p className="text-gray-600">Perfect booking experience on any device, anywhere.</p>
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
      
      {/* Integration Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with all your favorite tools and platforms for a unified workflow experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Link2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Calendar Platforms</h3>
              <p className="text-gray-600">
                Sync with Google Calendar, Outlook, Apple Calendar, and all major calendar applications automatically.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Video Conferencing</h3>
              <p className="text-gray-600">
                Automatic integration with Zoom, Google Meet, Microsoft Teams, and other video platforms.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">CRM & Sales Tools</h3>
              <p className="text-gray-600">
                Connect with Salesforce, HubSpot, Pipedrive, and other CRM systems for complete data sync.
              </p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link to="/features/appointments/integrations" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300">
              View All Integrations
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
              See how our scheduling platform is transforming appointment booking worldwide
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
                "Our booking rates increased by 200% after switching to this platform. The interface is so smooth that prospects actually want to schedule meetings with us now!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Sarah Mitchell</p>
                  <p className="text-gray-600 text-sm">Business Development, StartupFlow</p>
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
                "The no-show rate dropped dramatically with their smart reminder system. We've gone from 30% no-shows to less than 5%. It's been incredible for our team's productivity."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">James Rodriguez</p>
                  <p className="text-gray-600 text-sm">Sales Manager, TechConsult</p>
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
                "Setting up team scheduling was a game-changer. Our prospects can now book with any available team member, and our conversion rate has never been higher."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Emily Chen</p>
                  <p className="text-gray-600 text-sm">Director of Sales, GrowthMakers</p>
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
            Ready to Transform Your Scheduling?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of sales professionals using our appointment scheduling platform to book more meetings and close more deals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition duration-300">
              Start Your Free Trial
            </Link>
            <Link to="/contact" className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default AppointmentsFeaturePage;