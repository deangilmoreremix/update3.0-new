import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Mic, Play, FileText, Clock, Shield, Zap, CheckCheck, ChevronRight, Star, FileAudio, Search, Users, Brain, MessageSquare, Phone } from 'lucide-react';

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
                AI-Powered <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Speech Recognition</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform audio recordings and live speech into accurate, searchable text with our advanced AI transcription technology supporting 90+ languages.
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
                  src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Speech Recognition Technology"
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industry-Leading Speech Recognition</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the most accurate and fast speech-to-text conversion available for business use.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Save 10+ Hours Per Week</h3>
              <p className="text-gray-600">
                Eliminate manual transcription work and automatically convert all your audio content to searchable text.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">97%+ Accuracy Rate</h3>
              <p className="text-gray-600">
                Industry-leading accuracy with advanced AI models trained on millions of hours of speech data.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Understanding</h3>
              <p className="text-gray-600">
                Automatically identify speakers, detect languages, and format text with proper punctuation and structure.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Speech Recognition Tools Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Speech-to-Text Suite</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools for every speech recognition need, from live meetings to batch processing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Mic className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sales Call Transcriber</h3>
              <p className="text-gray-600">
                Automatically transcribe sales calls with speaker identification, sentiment analysis, and key moment highlighting for CRM integration.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Meeting Note Generator</h3>
              <p className="text-gray-600">
                Convert recorded meetings into structured notes with action items, decisions, and follow-up tasks automatically extracted.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-emerald-100 rounded-full w-min mb-4">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Voice Command CRM</h3>
              <p className="text-gray-600">
                Update contacts, create deals, and manage tasks using voice commands that integrate directly with your CRM database.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-indigo-100 rounded-full w-min mb-4">
                <FileAudio className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Voicemail Transcription</h3>
              <p className="text-gray-600">
                Automatically transcribe and categorize voicemails with urgency scoring and suggested response templates.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-rose-100 rounded-full w-min mb-4">
                <Search className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Call Analytics Engine</h3>
              <p className="text-gray-600">
                Search and analyze all transcribed calls for keywords, sentiment trends, and conversion patterns to improve sales performance.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-amber-100 rounded-full w-min mb-4">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Call Review</h3>
              <p className="text-gray-600">
                Generate coaching insights from sales call transcriptions with performance scoring and improvement recommendations.
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
                    <Mic className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold">Live Transcription Demo</h3>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">Audio Input</div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Mic className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-blue-200 rounded">
                            <div className="h-2 bg-blue-600 rounded animate-pulse w-3/4"></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">Recording...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center mx-auto">
                      Start Transcription
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">Real-Time Transcription</div>
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <span className="text-xs text-blue-600 font-medium min-w-[40px]">00:15</span>
                          <span className="text-gray-700 text-sm">"Welcome everyone to today's quarterly business review. Let's start by discussing our sales performance..."</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-xs text-green-600 font-medium min-w-[40px]">00:28</span>
                          <span className="text-gray-700 text-sm">"Thank you, John. The numbers look promising this quarter. We've exceeded our targets by 15%..."</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-xs text-purple-600 font-medium min-w-[40px]">00:42</span>
                          <span className="text-gray-700 text-sm animate-pulse">"That's excellent news. Can you break down the performance by region..."</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>Accuracy: 97.3%</span>
                          <span>3 speakers identified</span>
                          <span>Language: English (US)</span>
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
                <h3 className="text-2xl font-bold ml-3">Lightning-Fast Accuracy</h3>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Transcribe Speech with 97%+ Accuracy</h2>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Our advanced AI models deliver industry-leading accuracy with real-time processing, making it perfect for live meetings, interviews, and content creation.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-Time Processing</h4>
                    <p className="text-gray-600">Get transcriptions as you speak with minimal latency and high accuracy.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Speaker Identification</h4>
                    <p className="text-gray-600">Automatically identify and label different speakers in conversations.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Vocabulary</h4>
                    <p className="text-gray-600">Train the system on industry-specific terms and company jargon.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCheck className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Automatic Punctuation</h4>
                    <p className="text-gray-600">Intelligent punctuation and formatting for readable transcripts.</p>
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
      
      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect for Every Use Case</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From sales calls to content creation, our speech recognition technology adapts to your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full w-min mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sales & CRM</h3>
              <p className="text-gray-600">
                Automatically transcribe sales calls, capture meeting notes, and update CRM records with voice commands.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full w-min mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Content Creation</h3>
              <p className="text-gray-600">
                Transform podcasts, videos, and interviews into searchable text content for blogs and documentation.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full w-min mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Compliance & Legal</h3>
              <p className="text-gray-600">
                Create accurate transcripts for legal proceedings, compliance calls, and regulatory documentation.
              </p>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link to="/features/speech-to-text/use-cases" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition duration-300">
              Explore All Use Cases
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
              See how our speech recognition technology is transforming businesses worldwide
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
                "The accuracy is incredible! We've been using it for all our client calls and it's saved us hours of manual note-taking. The speaker identification works perfectly even with multiple participants."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <p className="text-gray-600 text-sm">Sales Director, TechFlow</p>
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
                "We process hundreds of hours of audio content weekly. This tool has revolutionized our workflow with its batch processing and multi-language support. Absolute game-changer for our team."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">Lisa Rodriguez</p>
                  <p className="text-gray-600 text-sm">Content Manager, MediaWorks</p>
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
                "The real-time transcription during our board meetings has been invaluable. Everyone can focus on the conversation knowing that every word is being captured accurately."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Customer" 
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">David Kumar</p>
                  <p className="text-gray-600 text-sm">Executive Assistant, Enterprise Corp</p>
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
            Ready to Transform Your Audio Into Action?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses using our AI-powered speech recognition to save time and improve accuracy.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition duration-300">
              Start Your Free Trial
            </Link>
            <Link to="/contact" className="px-8 py-4 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition duration-300">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default SpeechToTextFeaturePage;