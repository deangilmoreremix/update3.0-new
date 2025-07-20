import React from 'react'
import { DollarSign, Users, Target, Percent } from 'lucide-react'
import MetricCard from '../components/MetricCard'

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Smart CRM Dashboard</h1>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Total Revenue" 
          value="$48,394" 
          change="+12%" 
          icon={<DollarSign />}
        />
        <MetricCard 
          title="Active Deals" 
          value="23" 
          change="+3%" 
          icon={<Target />}
        />
        <MetricCard 
          title="New Contacts" 
          value="127" 
          change="+8%" 
          icon={<Users />}
        />
        <MetricCard 
          title="Conversion Rate" 
          value="3.2%" 
          change="+0.5%" 
          icon={<Percent />}
        />
      </div>

      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Smart CRM!</h2>
        <p className="text-gray-600">
          This is your modern dashboard with beautiful metrics cards. Landing pages approach - building systematically.
        </p>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-medium">✅ Status: Landing Page + Basic Pages Complete</p>
          <p className="text-green-600 text-sm">Navigation working, all pages load successfully</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
