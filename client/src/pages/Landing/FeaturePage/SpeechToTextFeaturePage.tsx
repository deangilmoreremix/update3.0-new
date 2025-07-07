import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { CheckCheck, ChevronRight, Mic, FileText, Clock, Zap, Globe, Shield, Users, BarChart3, HeadphonesIcon, MessageSquare } from 'lucide-react';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';

const SpeechToTextFeaturePage: React.FC = () => {
  return (
    <div className="bg-white">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="relative pt-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Convert Speech to Text with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI Precision</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your voice recordings, calls, and meetings into accurate text instantly. Our AI-powered speech recognition supports multiple languages and accents.
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
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Speech to Text Interface"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Speech Recognition Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to convert audio to text with professional accuracy and speed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Transcription</h3>
              <p className="text-gray-600">
                Convert speech to text instantly during live calls, meetings, or recordings with 99%+ accuracy.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Language Support</h3>
              <p className="text-gray-600">
                Supports 100+ languages and dialects with automatic language detection and accent recognition.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Formatting</h3>
              <p className="text-gray-600">
                Automatically formats text with proper punctuation, capitalization, and paragraph breaks.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-full w-min mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Timestamp Sync</h3>
              <p className="text-gray-600">
                Get precise timestamps for every word, making it easy to navigate and reference specific moments.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-red-100 rounded-full w-min mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Speaker Identification</h3>
              <p className="text-gray-600">
                Automatically identifies different speakers in conversations and labels them accordingly.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-teal-100 rounded-full w-min mb-4">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-600">
                Bank-level encryption and GDPR compliance ensure your audio data remains private and secure.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect for Every Use Case</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From business meetings to content creation, our speech-to-text solution adapts to your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Meeting Notes</h3>
              <p className="text-gray-600 text-sm">
                Automatically transcribe meetings and generate action items
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mx-auto mb-4">
                <HeadphonesIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Customer Support</h3>
              <p className="text-gray-600 text-sm">
                Convert support calls to text for analysis and training
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Content Creation</h3>
              <p className="text-gray-600 text-sm">
                Transform podcasts and videos into blog posts and articles
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-full w-min mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Sales Analysis</h3>
              <p className="text-gray-600 text-sm">
                Analyze sales calls to improve conversion rates
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Audio?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using our AI-powered speech-to-text solution to boost productivity.
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

export default SpeechToTextFeaturePage;