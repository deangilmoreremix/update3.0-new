import React, { useState } from 'react';
import { Globe, Users, MapPin, TrendingUp, DollarSign, Target, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import { useDealStore } from '../store/dealStore';

const TerritoryManagement = () => {
  const { contacts } = useContactStore();
  const { deals } = useDealStore();
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [showNewTerritory, setShowNewTerritory] = useState(false);
  const [newTerritory, setNewTerritory] = useState({
    name: '',
    region: '',
    assignedTo: '',
    description: '',
    zipCodes: '',
    cities: ''
  });

  // Mock territories data
  const territories = [
    {
      id: '1',
      name: 'Northeast Region',
      region: 'North',
      assignedTo: 'John Smith',
      description: 'Covers New York, New Jersey, Connecticut',
      zipCodes: '10001-10999, 07001-07999, 06001-06999',
      cities: 'New York, Newark, Hartford',
      contacts: 45,
      deals: 12,
      revenue: 245000,
      target: 300000,
      performance: 81.7,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Southeast Region',
      region: 'South',
      assignedTo: 'Sarah Johnson',
      description: 'Covers Florida, Georgia, North Carolina',
      zipCodes: '30001-30999, 32001-32999, 27001-27999',
      cities: 'Atlanta, Miami, Charlotte',
      contacts: 38,
      deals: 15,
      revenue: 320000,
      target: 350000,
      performance: 91.4,
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'West Coast Region',
      region: 'West',
      assignedTo: 'Mike Chen',
      description: 'Covers California, Oregon, Washington',
      zipCodes: '90001-90999, 97001-97999, 98001-98999',
      cities: 'Los Angeles, Portland, Seattle',
      contacts: 62,
      deals: 18,
      revenue: 425000,
      target: 400000,
      performance: 106.3,
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: 'Midwest Region',
      region: 'Central',
      assignedTo: 'Emily Davis',
      description: 'Covers Illinois, Ohio, Michigan',
      zipCodes: '60001-60999, 43001-43999, 48001-48999',
      cities: 'Chicago, Columbus, Detroit',
      contacts: 29,
      deals: 8,
      revenue: 180000,
      target: 250000,
      performance: 72.0,
      color: 'bg-orange-500'
    }
  ];

  const salesReps = [
    'John Smith',
    'Sarah Johnson',
    'Mike Chen',
    'Emily Davis',
    'David Wilson',
    'Lisa Brown'
  ];

  const addTerritory = () => {
    if (newTerritory.name && newTerritory.assignedTo) {
      // In real implementation, this would add to territories
      console.log('Adding territory:', newTerritory);
      setNewTerritory({
        name: '',
        region: '',
        assignedTo: '',
        description: '',
        zipCodes: '',
        cities: ''
      });
      setShowNewTerritory(false);
    }
  };

  const getTotalMetrics = () => {
    return territories.reduce((totals, territory) => ({
      contacts: totals.contacts + territory.contacts,
      deals: totals.deals + territory.deals,
      revenue: totals.revenue + territory.revenue,
      target: totals.target + territory.target
    }), { contacts: 0, deals: 0, revenue: 0, target: 0 });
  };

  const totals = getTotalMetrics();
  const overallPerformance = ((totals.revenue / totals.target) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Territory Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage sales territories and regional performance
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewTerritory(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Territory</span>
            </button>
          </div>
        </div>

        {/* Overall Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totals.revenue.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {overallPerformance}%
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Target Achievement</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totals.contacts}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Total Contacts</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totals.deals}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Active Deals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Territory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {territories.map(territory => (
            <div
              key={territory.id}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedTerritory(territory)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${territory.color}`} />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {territory.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-green-500 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Assigned to: {territory.assignedTo}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {territory.cities}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {territory.description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {territory.contacts}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Contacts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {territory.deals}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Deals</div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Target Progress
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {territory.performance}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        territory.performance >= 100 ? 'bg-green-500' :
                        territory.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(territory.performance, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>${territory.revenue.toLocaleString()}</span>
                    <span>${territory.target.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Territory Performance Chart */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Territory Performance Comparison
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <TrendingUp className="w-16 h-16 text-gray-400" />
            <div className="ml-4 text-gray-500 dark:text-gray-400">
              <p className="font-medium">Performance Chart</p>
              <p className="text-sm">Territory comparison by revenue and targets</p>
            </div>
          </div>
        </div>

        {/* New Territory Modal */}
        {showNewTerritory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Territory
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Territory Name
                  </label>
                  <input
                    type="text"
                    value={newTerritory.name}
                    onChange={(e) => setNewTerritory({...newTerritory, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter territory name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={newTerritory.region}
                    onChange={(e) => setNewTerritory({...newTerritory, region: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select region</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assigned To
                  </label>
                  <select
                    value={newTerritory.assignedTo}
                    onChange={(e) => setNewTerritory({...newTerritory, assignedTo: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select sales rep</option>
                    {salesReps.map(rep => (
                      <option key={rep} value={rep}>{rep}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cities
                  </label>
                  <input
                    type="text"
                    value={newTerritory.cities}
                    onChange={(e) => setNewTerritory({...newTerritory, cities: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g., New York, Boston, Philadelphia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTerritory.description}
                    onChange={(e) => setNewTerritory({...newTerritory, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Territory description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewTerritory(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addTerritory}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Add Territory
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerritoryManagement;