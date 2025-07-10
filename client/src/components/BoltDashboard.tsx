import React, { useEffect } from 'react';
import { useContactStore } from '../store/contactStore';
import { useDealStore } from '../store/dealStore';
import { useTaskStore } from '../store/taskStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar,
  DollarSign,
  Target,
  Award,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Plus,
  Clock,
  Activity
} from 'lucide-react';

const BoltDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { contacts, fetchContacts } = useContactStore();
  const { deals, fetchDeals } = useDealStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { appointments, fetchAppointments } = useAppointmentStore();

  useEffect(() => {
    fetchContacts();
    fetchDeals();
    fetchTasks();
    fetchAppointments();
  }, []);

  // Calculate KPI metrics
  const totalContacts = Object.keys(contacts).length;
  const activeDeals = Object.values(deals).filter(deal => deal.stage !== 'closed-won' && deal.stage !== 'closed-lost').length;
  const totalRevenue = Object.values(deals)
    .filter(deal => deal.stage === 'closed-won')
    .reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = activeDeals > 0 ? totalRevenue / activeDeals : 0;

  const kpis = [
    {
      title: 'Active Deals',
      value: activeDeals.toString(),
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Pipeline Value',
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Contacts',
      value: totalContacts.toString(),
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Avg Deal Size',
      value: `$${(avgDealSize / 1000).toFixed(1)}K`,
      change: '-3%',
      trend: 'down',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const quickActions = [
    { label: 'Add Contact', icon: Users, action: () => navigate('/contacts'), color: 'from-blue-500 to-blue-600' },
    { label: 'New Deal', icon: Target, action: () => navigate('/pipeline'), color: 'from-green-500 to-green-600' },
    { label: 'Schedule Call', icon: Phone, action: () => navigate('/phone'), color: 'from-purple-500 to-purple-600' },
    { label: 'AI Tools', icon: Brain, action: () => navigate('/ai-tools'), color: 'from-pink-500 to-pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, Sales Pro
          </h1>
          <p className="text-gray-400 mt-2">Here's your business overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              onClick={() => {
                if (kpi.title.includes('Deal')) navigate('/pipeline');
                else if (kpi.title.includes('Contact')) navigate('/contacts');
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${kpi.color} shadow-lg`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{kpi.change}</span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                  {kpi.value}
                </h3>
                <p className="text-gray-400 text-sm">{kpi.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} mb-3 mx-auto w-fit`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-sm text-gray-300 group-hover:text-white">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Deals */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Deals</h3>
              <button 
                onClick={() => navigate('/pipeline')}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {Object.values(deals).slice(0, 5).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-sm text-gray-400">{deal.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">${(deal.value / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-400">{deal.stage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Call with John Smith</p>
                  <p className="text-xs text-gray-400">Discussed product features - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Mail className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Email sent to Sarah Johnson</p>
                  <p className="text-xs text-gray-400">Follow-up on proposal - 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Calendar className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Meeting scheduled with TechCorp</p>
                  <p className="text-xs text-gray-400">Product demo - Tomorrow at 2 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <FileText className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Proposal updated for ABC Inc</p>
                  <p className="text-xs text-gray-400">Added pricing details - 6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Goals Progress */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Goals Progress</h3>
                <p className="text-sm text-gray-400">Automated workflows running</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/ai-goals')}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              Manage Goals <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Lead Qualification</span>
                <span className="text-sm font-medium text-green-400">85%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Email Campaigns</span>
                <span className="text-sm font-medium text-blue-400">62%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Deal Analysis</span>
                <span className="text-sm font-medium text-purple-400">78%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoltDashboard;