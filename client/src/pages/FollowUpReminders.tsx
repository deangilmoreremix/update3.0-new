import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, User, CheckCircle, AlertCircle, Plus, Filter, Search, Trash2 } from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import { useDealStore } from '../store/dealStore';

const FollowUpReminders = () => {
  const { contacts } = useContactStore();
  const { deals } = useDealStore();
  const [reminders, setReminders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    contactId: '',
    dealId: '',
    dueDate: '',
    priority: 'medium',
    type: 'call'
  });

  const reminderTypes = [
    { value: 'call', label: 'Phone Call', icon: '📞' },
    { value: 'email', label: 'Email', icon: '✉️' },
    { value: 'meeting', label: 'Meeting', icon: '🤝' },
    { value: 'task', label: 'Task', icon: '✅' },
    { value: 'quote', label: 'Quote Follow-up', icon: '💰' },
    { value: 'proposal', label: 'Proposal Review', icon: '📋' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    generateMockReminders();
  }, [contacts, deals]);

  const generateMockReminders = () => {
    const contactValues = Object.values(contacts);
    const dealValues = Object.values(deals);
    
    const mockReminders = [
      {
        id: '1',
        title: 'Follow up on product demo',
        description: 'Check if client needs more information about pricing',
        contactId: contactValues[0]?.id || '',
        dealId: dealValues[0]?.id || '',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        priority: 'high',
        type: 'call',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Send proposal follow-up',
        description: 'Check status of submitted proposal',
        contactId: contactValues[1]?.id || '',
        dealId: dealValues[1]?.id || '',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
        priority: 'medium',
        type: 'email',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Schedule contract review',
        description: 'Set up meeting to review contract terms',
        contactId: contactValues[2]?.id || '',
        dealId: dealValues[2]?.id || '',
        dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 days
        priority: 'medium',
        type: 'meeting',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Check on implementation progress',
        description: 'Verify client is satisfied with current progress',
        contactId: contactValues[3]?.id || '',
        dealId: dealValues[3]?.id || '',
        dueDate: new Date(Date.now() + 604800000).toISOString().split('T')[0], // 1 week
        priority: 'low',
        type: 'call',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Quote renewal reminder',
        description: 'Annual service quote needs renewal',
        contactId: contactValues[4]?.id || '',
        dealId: dealValues[4]?.id || '',
        dueDate: new Date(Date.now() + 1209600000).toISOString().split('T')[0], // 2 weeks
        priority: 'high',
        type: 'quote',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
    
    setReminders(mockReminders);
  };

  const filteredReminders = reminders.filter(reminder => {
    const matchesFilter = filter === 'all' || reminder.priority === filter || reminder.status === filter;
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addReminder = () => {
    if (newReminder.title && newReminder.dueDate) {
      const reminder = {
        ...newReminder,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: '',
        description: '',
        contactId: '',
        dealId: '',
        dueDate: '',
        priority: 'medium',
        type: 'call'
      });
      setShowNewReminder(false);
    }
  };

  const markCompleted = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, status: 'completed' } : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const getContactName = (contactId) => {
    const contact = contacts[contactId];
    return contact ? contact.name : 'Unknown Contact';
  };

  const getDealTitle = (dealId) => {
    const deal = deals[dealId];
    return deal ? deal.title : 'No Deal';
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getReminderIcon = (type) => {
    const reminderType = reminderTypes.find(rt => rt.value === type);
    return reminderType ? reminderType.icon : '📋';
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Follow-up Reminders
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Manage and track all your follow-up activities
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNewReminder(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reminder</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Reminders</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reminders.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reminders.filter(r => getDaysUntilDue(r.dueDate) <= 2).length}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Due Soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reminders.filter(r => r.status === 'completed').length}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reminders List */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Reminders ({filteredReminders.length})
          </h3>
          
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No reminders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReminders.map(reminder => {
                const daysUntilDue = getDaysUntilDue(reminder.dueDate);
                const isOverdue = daysUntilDue < 0;
                const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0;
                
                return (
                  <div
                    key={reminder.id}
                    className={`p-4 rounded-xl border-l-4 ${
                      isOverdue ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                      isDueSoon ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                      'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getReminderIcon(reminder.type)}</span>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {reminder.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reminder.priority)}`}>
                            {reminder.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {reminder.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{getContactName(reminder.contactId)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(reminder.dueDate).toLocaleDateString()}
                              {isOverdue && <span className="text-red-500 ml-1">(Overdue)</span>}
                              {isDueSoon && <span className="text-yellow-500 ml-1">(Due Soon)</span>}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {reminder.status === 'pending' && (
                          <button
                            onClick={() => markCompleted(reminder.id)}
                            className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* New Reminder Modal */}
        {showNewReminder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Reminder
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter reminder title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Enter description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={newReminder.type}
                      onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {reminderTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newReminder.priority}
                      onChange={(e) => setNewReminder({...newReminder, priority: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newReminder.dueDate}
                    onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewReminder(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addReminder}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpReminders;