import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ChevronRight,
  Clock,
  ExternalLink,
  BarChart,
  Users,
  Briefcase,
  Eye,
  Image,
  Mic,
  Search,
  Zap
} from 'lucide-react';

import LandingHeader from './components/LandingHeader';
import LandingFooter from './components/LandingFooter';
import PricingCard from './components/PricingCard';
import FeatureCard from './components/FeatureCard';
import TestimonialCard from './components/TestimonialCard';

const LandingPage = () => {
  useEffect(() => {
    console.log("LandingPage component mounted");
  }, []);

  return (
    <div className="bg-white">
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Smart CRM That Works For You
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              AI-powered sales automation, intelligent lead management, and advanced analytics in one powerful platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                Start Free Trial
              </Link>
              <Link to="/features/ai-tools" className="px-8 py-4 bg-white text-blue-600 border border-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-300">
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Impact of Smart CRM</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Real results from businesses using our AI-powered CRM platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">32%</div>
              <div className="text-gray-700">Sales Growth</div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600 mb-2">9.5</div>
              <div className="text-gray-700">Hours Saved Weekly</div>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <BarChart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-600 mb-2">24%</div>
              <div className="text-gray-700">Lead Conversion</div>
            </div>

            <div className="text-center p-6 bg-indigo-50 rounded-lg">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-indigo-600 mb-2">5000+</div>
              <div className="text-gray-700">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All the Features You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart CRM combines powerful sales tools with advanced AI capabilities to streamline your workflow and boost your results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-blue-600" />}
              title="AI Sales Tools"
              description="Access 20+ AI tools to automate tasks, get insights, and personalize your sales approach."
              link="/features/ai-tools"
            />

            <FeatureCard
              icon={<Users className="h-8 w-8 text-indigo-600" />}
              title="Contact Management"
              description="Organize and track all your contacts, leads, and accounts in one unified database."
              link="/features/contacts"
            />

            <FeatureCard
              icon={<Briefcase className="h-8 w-8 text-violet-600" />}
              title="Deal Pipeline"
              description="Visualize and optimize your sales pipeline with drag-and-drop simplicity and AI insights."
              link="/features/pipeline"
            />

            <FeatureCard
              icon={<Brain className="h-8 w-8 text-fuchsia-600" />}
              title="AI Assistant"
              description="Work with a context-aware AI assistant that remembers conversations and takes actions for you."
              link="/features/ai-assistant"
            />

            <FeatureCard
              icon={<Eye className="h-8 w-8 text-cyan-600" />}
              title="Vision Analyzer"
              description="Extract insights from images, documents, competitor materials, and visual content."
              link="/features/vision-analyzer"
            />

            <FeatureCard
              icon={<Image className="h-8 w-8 text-emerald-600" />}
              title="Image Generator"
              description="Create professional images for presentations, proposals, and marketing materials instantly."
              link="/features/image-generator"
            />

            <FeatureCard
              icon={<Mic className="h-8 w-8 text-indigo-600" />}
              title="Voice Features"
              description="Voice profiles and audio management for your sales content."
              link="/voice-profiles"
            />

            <FeatureCard
              icon={<Search className="h-8 w-8 text-blue-600" />}
              title="Semantic Search"
              description="Find anything in your CRM with natural language queries and contextual understanding."
              link="/features/semantic-search"
            />

            <FeatureCard
              icon={<Zap className="h-8 w-8 text-yellow-600" />}
              title="Function Assistant"
              description="Let AI perform real actions in your CRM through natural conversation."
              link="/features/function-assistant"
            />
          </div>

          <div className="text-center mt-12">
            <Link to="/ai-tools" className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
              Explore AI Tools <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Smart CRM Transforms Your Sales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the real benefits our customers experience every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <PieChart className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">27% Higher Win Rate</h3>
              <p className="text-gray-600">
                AI-driven insights and personalization help you target the right prospects with the right approach, significantly increasing win rates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">35% Faster Sales Cycle</h3>
              <p className="text-gray-600">
                Automated workflows, smart follow-ups, and AI tools help you move deals through your pipeline more efficiently.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">9+ Hours Saved Weekly</h3>
              <p className="text-gray-600">
                Automation of routine tasks and AI-powered content generation save your team valuable time to focus on relationship building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Sales Teams Everywhere
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't take our word for it - see what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Smart CRM has completely transformed our sales process. The AI tools save us hours each week and provide insights we never had before."
              name="Sarah Johnson"
              position="VP of Sales"
              company="TechCorp"
              image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              stars={5}
            />

            <TestimonialCard
              quote="The AI assistant is like having an extra team member. It handles routine tasks, provides insights, and helps us close more deals."
              name="Michael Rodriguez"
              position="Sales Director"
              company="Global Solutions"
              image="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              stars={5}
            />

            <TestimonialCard
              quote="We've seen a 32% increase in our sales since implementing Smart CRM. The AI-powered features are a game-changer!"
              name="Jennifer Lee"
              position="CEO"
              company="Startup Innovations"
              image="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              stars={5}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              tier="Starter"
              price={25}
              description="Perfect for individuals and small teams"
              buttonText="Get Started"
              features={[
                "Up to 5 users",
                "Contact & deal management",
                "Basic AI tools",
                "Email integration",
                "Mobile app access",
                "5GB storage"
              ]}
            />

            <PricingCard
              tier="Professional"
              price={65}
              description="Ideal for growing teams with advanced needs"
              buttonText="Start Free Trial"
              popular={true}
              color="bg-gradient-to-r from-blue-50 to-indigo-50"
              features={[
                "Up to 25 users",
                "All Starter features",
                "Full AI toolset",
                "Custom sales pipeline",
                "Advanced analytics",
                "API access",
                "25GB storage",
                "Priority support"
              ]}
            />

            <PricingCard
              tier="Enterprise"
              price={125}
              description="For organizations requiring maximum capability"
              buttonText="Contact Sales"
              features={[
                "Unlimited users",
                "All Professional features",
                "Dedicated AI resources",
                "Custom AI model training",
                "Advanced security controls",
                "Dedicated account manager",
                "Unlimited storage",
                "24/7 premium support",
                "Custom integrations"
              ]}
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">All plans include a 14-day free trial. No credit card required.</p>
            <Link to="/pricing" className="text-blue-600 hover:text-blue-800 font-medium">
              View full pricing details
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of sales professionals already using Smart CRM to close more deals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dashboard" className="px-8 py-4 bg-white text-blue-700 font-medium rounded-lg hover:shadow-lg transition duration-300 transform hover:scale-105">
              Start Your Free Trial
            </Link>
            <Link to="/dashboard" className="px-8 py-4 bg-green-500 bg-opacity-90 hover:bg-opacity-100 text-white font-medium rounded-lg hover:shadow-lg transition duration-300 flex items-center">
              <ExternalLink size={18} className="mr-1.5" />
              Go to Dashboard
            </Link>
          </div>
          <p className="mt-4 opacity-80">No credit card required • Free for 14 days</p>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
