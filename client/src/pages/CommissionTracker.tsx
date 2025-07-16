import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, DollarSign, Calculator, Award, Filter, Download } from 'lucide-react';
import { useDealStore } from '../store/dealStore';

const CommissionTracker = () => {
  const { deals } = useDealStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  
  // Mock sales team data
  const salesTeam = [
    { id: '1', name: 'John Smith', role: 'Senior Sales Rep', rate: 0.08, target: 50000 },
    { id: '2', name: 'Sarah Johnson', role: 'Account Executive', rate: 0.10, target: 75000 },
    { id: '3', name: 'Mike Chen', role: 'Sales Manager', rate: 0.06, target: 40000 },
    { id: '4', name: 'Emily Davis', role: 'Sales Rep', rate: 0.07, target: 35000 }
  ];

  const periods = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const generateCommissionData = () => {
    const dealValues = Object.values(deals);
    const wonDeals = dealValues.filter(deal => deal.stage === 'closed-won');
    
    return salesTeam.map(person => {
      // Simulate deals for each salesperson
      const personDeals = wonDeals.filter((_, index) => index % salesTeam.length === parseInt(person.id) - 1);
      const totalSales = personDeals.reduce((sum, deal) => sum + deal.value, 0);
      const commission = totalSales * person.rate;
      const targetProgress = (totalSales / person.target) * 100;
      
      return {
        ...person,
        totalSales,
        commission,
        targetProgress: Math.min(targetProgress, 100),
        dealCount: personDeals.length,
        avgDealSize: personDeals.length > 0 ? totalSales / personDeals.length : 0
      };
    });
  };

  const commissionData = generateCommissionData();
  const totalCommissions = commissionData.reduce((sum, person) => sum + person.commission, 0);
  const totalSales = commissionData.reduce((sum, person) => sum + person.totalSales, 0);
  const avgCommissionRate = totalSales > 0 ? (totalCommissions / totalSales) * 100 : 0;

  const handleExport = () => {
    const exportData = {
      period: selectedPeriod,
      salesperson: selectedSalesperson,
      commissionData,
      totals: {
        totalCommissions,
        totalSales,
        avgCommissionRate
      },
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commission-report-${selectedPeriod}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Commission Tracker
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Track sales commissions and performance metrics
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Filters:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedSalesperson}
                onChange={(e) => setSelectedSalesperson(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Salespeople</option>
                {salesTeam.map(person => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-green-500 text-sm font-medium">+12%</div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalCommissions.toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Total Commissions</p>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-blue-500 text-sm font-medium">+8%</div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalSales.toLocaleString()}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Total Sales</p>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div className="text-orange-500 text-sm font-medium">+3%</div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgCommissionRate.toFixed(1)}%
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Avg Commission Rate</p>
            </div>
          </div>
        </div>

        {/* Sales Team Performance */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Sales Team Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Salesperson
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Total Sales
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Commission
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Target Progress
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Deals Closed
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Avg Deal Size
                  </th>
                </tr>
              </thead>
              <tbody>
                {commissionData.map(person => (
                  <tr key={person.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {person.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {person.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">
                      ${person.totalSales.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ${person.commission.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                        ({(person.rate * 100).toFixed(1)}%)
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className="h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-300"
                            style={{ width: `${person.targetProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {person.targetProgress.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      {person.dealCount}
                    </td>
                    <td className="py-4 px-4 text-gray-900 dark:text-white">
                      ${person.avgDealSize.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Commission Distribution
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <PieChart className="w-16 h-16 text-gray-400" />
              <div className="ml-4 text-gray-500 dark:text-gray-400">
                <p className="font-medium">Commission Chart</p>
                <p className="text-sm">By salesperson</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Top Performers
            </h3>
            <div className="space-y-4">
              {commissionData
                .sort((a, b) => b.commission - a.commission)
                .slice(0, 3)
                .map((person, index) => (
                  <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {person.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {person.dealCount} deals closed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600 dark:text-green-400">
                        ${person.commission.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ${person.totalSales.toLocaleString()} sales
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionTracker;