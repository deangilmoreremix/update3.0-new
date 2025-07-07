import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { CheckCheck, ChevronRight, Calendar, Clock, Users, Globe, Zap, MessageSquare, Video, Mail, Bell, Shield } from 'lucide-react';
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
                Effortless Appointment Scheduling that <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Converts Prospects</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your booking process with intelligent scheduling. Let prospects book meetings instantly while you focus on closing deals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300">
                  Start Free Trial
                </Link>
                <HashLink to="#features" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition duration-300 flex items-center">
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
      
      {/* Key Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Smart Scheduling Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage appointments efficiently and professionally.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Calendar Sync</h3>
              <p className="text-gray-600">
                Automatically sync with Google Calendar, Outlook, and other calendar platforms to prevent double bookings.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Time Slots</h3>
              <p className="text-gray-600">
                Set custom availability, buffer times, and meeting durations that work with your schedule.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Timezone Intelligence</h3>
              <p className="text-gray-600">
                Automatically detects prospect's timezone and shows available slots in their local time.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-full w-min mb-4">
                <Video className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Video Integration</h3>
              <p className="text-gray-600">
                Automatically generate Zoom, Teams, or Google Meet links for seamless virtual meetings.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-red-100 rounded-full w-min mb-4">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Reminders</h3>
              <p className="text-gray-600">
                Send automated email and SMS reminders to reduce no-shows and keep everyone prepared.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-teal-100 rounded-full w-min mb-4">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Scheduling</h3>
              <p className="text-gray-600">
                Enable round-robin booking, collective availability, and team-based appointment routing.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Sales Teams Choose Our Scheduling</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Increase booking rates and reduce administrative overhead with intelligent appointment management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">3x Faster Booking</h3>
              <p className="text-gray-600 text-sm">
                Instant scheduling reduces friction and increases conversions
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">50% Fewer No-Shows</h3>
              <p className="text-gray-600 text-sm">
                Smart reminders and confirmations improve attendance
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">90% Customer Satisfaction</h3>
              <p className="text-gray-600 text-sm">
                Seamless experience delights prospects and customers
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-full w-min mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">25% More Meetings</h3>
              <p className="text-gray-600 text-sm">
                Simplified booking process increases meeting volume
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Simplify Your Scheduling?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of sales professionals using our appointment scheduling platform to book more meetings.
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

export default AppointmentsFeaturePage;