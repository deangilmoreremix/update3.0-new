import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTaskStore } from '../store/taskStore';
import { AlertTriangle, Calendar, Clock, CheckCircle, Plus, Filter, TrendingUp } from 'lucide-react';

interface DeadlineItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'due-today' | 'overdue' | 'completed';
  category: 'task' | 'project' | 'meeting' | 'deadline';
  assignee: string;
  progress: number;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
}

export const DeadlineManager: React.FC = () => {
  const { isDark } = useTheme();
  const { tasks } = useTaskStore();
  const [deadlineItems, setDeadlineItems] = useState<DeadlineItem[]>([
    {
      id: '1',
      title: 'Complete CRM System Testing',
      description: 'Finish all user acceptance testing for the new CRM system',
      dueDate: '2024-01-10',
      priority: 'high',
      status: 'upcoming',
      category: 'task',
      assignee: 'John Doe',
      progress: 75,
      estimatedHours: 16,
      actualHours: 12,
      tags: ['testing', 'crm', 'urgent']
    },
    {
      id: '2',
      title: 'Client Presentation',
      description: 'Present quarterly results to key stakeholders',
      dueDate: '2024-01-09',
      priority: 'high',
      status: 'due-today',
      category: 'meeting',
      assignee: 'Jane Smith',
      progress: 90,
      estimatedHours: 4,
      actualHours: 3,
      tags: ['presentation', 'quarterly', 'stakeholders']
    },
    {
      id: '3',
      title: 'Database Migration',
      description: 'Migrate legacy database to new system',
      dueDate: '2024-01-08',
      priority: 'medium',
      status: 'overdue',
      category: 'project',
      assignee: 'Mike Johnson',
      progress: 60,
      estimatedHours: 24,
      actualHours: 18,
      tags: ['database', 'migration', 'backend']
    },
    {
      id: '4',
      title: 'Security Audit Report',
      description: 'Complete security audit and submit report',
      dueDate: '2024-01-07',
      priority: 'high',
      status: 'completed',
      category: 'deadline',
      assignee: 'Sarah Wilson',
      progress: 100,
      estimatedHours: 8,
      actualHours: 9,
      tags: ['security', 'audit', 'report']
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeadline, setNewDeadline] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as DeadlineItem['priority'],
    category: 'task' as DeadlineItem['category'],
    assignee: '',
    estimatedHours: 0
  });

  const filteredItems = deadlineItems.filter(item => {
    const statusMatch = selectedStatus === 'all' || item.status === selectedStatus;
    const priorityMatch = selectedPriority === 'all' || item.priority === selectedPriority;
    return statusMatch && priorityMatch;
  });

  const handleCreateDeadline = () => {
    if (newDeadline.title && newDeadline.dueDate) {
      const today = new Date();
      const dueDate = new Date(newDeadline.dueDate);
      let status: DeadlineItem['status'] = 'upcoming';
      
      if (dueDate.toDateString() === today.toDateString()) {
        status = 'due-today';
      } else if (dueDate < today) {
        status = 'overdue';
      }

      const deadline: DeadlineItem = {
        id: Date.now().toString(),
        ...newDeadline,
        status,
        progress: 0,
        actualHours: 0,
        tags: []
      };

      setDeadlineItems([...deadlineItems, deadline]);
      setNewDeadline({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: 'task',
        assignee: '',
        estimatedHours: 0
      });
      setShowCreateForm(false);
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setDeadlineItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, progress, status: progress === 100 ? 'completed' : item.status }
          : item
      )
    );
  };

  const markAsCompleted = (id: string) => {
    setDeadlineItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, status: 'completed', progress: 100 }
          : item
      )
    );
  };

  const getStatusColor = (status: DeadlineItem['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'due-today': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: DeadlineItem['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getCategoryIcon = (category: DeadlineItem['category']) => {
    switch (category) {
      case 'task': return CheckCircle;
      case 'project': return TrendingUp;
      case 'meeting': return Calendar;
      case 'deadline': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getUrgencyScore = (item: DeadlineItem) => {
    const today = new Date();
    const dueDate = new Date(item.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const urgencyScore = 0;;
    if (daysUntilDue < 0) urgencyScore += 100; // Overdue
    else if (daysUntilDue === 0) urgencyScore += 80; // Due today
    else if (daysUntilDue <= 3) urgencyScore += 60; // Due within 3 days
    else if (daysUntilDue <= 7) urgencyScore += 40; // Due within a week
    
    if (item.priority === 'high') urgencyScore += 30;
    else if (item.priority === 'medium') urgencyScore += 20;
    else urgencyScore += 10;
    
    return urgencyScore;
  };

  const calculateStats = () => {
    const total = deadlineItems.length;
    const completed = deadlineItems.filter(item => item.status === 'completed').length;
    const overdue = deadlineItems.filter(item => item.status === 'overdue').length;
    const dueToday = deadlineItems.filter(item => item.status === 'due-today').length;
    const onTime = deadlineItems.filter(item => 
      item.status === 'completed' && new Date(item.dueDate) >= new Date()
    ).length;
    const onTimeRate = total > 0 ? Math.round((onTime / total) * 100) : 0;

    return { total, completed, overdue, dueToday, onTimeRate };
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = calculateStats();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Deadline Manager
              </h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                Track and manage all your deadlines in one place
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg"
            >
              <Plus size={16} />
              <span>New Deadline</span>
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Items</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.total}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Completed</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Due Today</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.dueToday}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Overdue</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.overdue}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>On-Time Rate</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.onTimeRate}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-4 mb-6`}>
          <div className="flex items-center space-x-4">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="due-today">Due Today</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className={`px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Create Deadline Form */}
        {showCreateForm && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Create New Deadline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Title
                </label>
                <input
                  type="text"
                  value={newDeadline.title}
                  onChange={(e) => setNewDeadline({...newDeadline, title: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                  placeholder="Enter deadline title..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDeadline.dueDate}
                  onChange={(e) => setNewDeadline({...newDeadline, dueDate: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Priority
                </label>
                <select
                  value={newDeadline.priority}
                  onChange={(e) => setNewDeadline({...newDeadline, priority: e.target.value as DeadlineItem['priority']})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Category
                </label>
                <select
                  value={newDeadline.category}
                  onChange={(e) => setNewDeadline({...newDeadline, category: e.target.value as DeadlineItem['category']})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                >
                  <option value="task">Task</option>
                  <option value="project">Project</option>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Assignee
                </label>
                <input
                  type="text"
                  value={newDeadline.assignee}
                  onChange={(e) => setNewDeadline({...newDeadline, assignee: e.target.value})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                  placeholder="Assign to..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Estimated Hours
                </label>
                <input
                  type="number"
                  value={newDeadline.estimatedHours}
                  onChange={(e) => setNewDeadline({...newDeadline, estimatedHours: Number(e.target.value)})}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Description
                </label>
                <textarea
                  value={newDeadline.description}
                  onChange={(e) => setNewDeadline({...newDeadline, description: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                  placeholder="Describe the deadline..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className={`px-4 py-2 border ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-lg transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeadline}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200"
              >
                Create Deadline
              </button>
            </div>
          </div>
        )}

        {/* Deadline Items */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Deadlines ({filteredItems.length})
          </h3>
          <div className="space-y-4">
            {filteredItems
              .sort((a, b) => getUrgencyScore(b) - getUrgencyScore(a))
              .map((item) => {
                const CategoryIcon = getCategoryIcon(item.category);
                const daysUntilDue = getDaysUntilDue(item.dueDate);
                
                return (
                  <div
                    key={item.id}
                    className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <CategoryIcon size={20} className="text-gray-400 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {item.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                              {item.status.replace('-', ' ')}
                            </span>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                            {item.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <AlertTriangle size={12} className={getPriorityColor(item.priority)} />
                              <span className={getPriorityColor(item.priority)}>
                                {item.priority} priority
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar size={12} className="text-gray-400" />
                              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(item.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={12} className="text-gray-400" />
                              <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {daysUntilDue === 0 ? 'Due today' : 
                                 daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                                 `${daysUntilDue} days left`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.progress}%
                        </div>
                        <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              item.progress >= 80 ? 'bg-green-500' : 
                              item.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Assignee: {item.assignee}
                        </span>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Est: {item.estimatedHours}h
                        </span>
                        {item.actualHours && (
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Actual: {item.actualHours}h
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.progress}
                          onChange={(e) => updateProgress(item.id, Number(e.target.value))}
                          className="w-20"
                        />
                        {item.status !== 'completed' && (
                          <button
                            onClick={() => markAsCompleted(item.id)}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          
          {filteredItems.length === 0 && (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No deadlines found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlineManager;