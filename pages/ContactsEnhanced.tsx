import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Phone, Mail, MessageSquare, User, Building, MapPin, Calendar, Star, MoreVertical, Edit, Download } from 'lucide-react';

// Mock data
const mockContacts = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    position: 'CTO',
    location: 'San Francisco, CA',
    lastContact: '2 days ago',
    status: 'hot',
    deals: 2,
    totalValue: 45000,
    tags: ['Enterprise', 'Tech'],
    avatar: null
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@startupco.io',
    phone: '+1 (555) 234-5678',
    company: 'StartupCo',
    position: 'CEO',
    location: 'Austin, TX',
    lastContact: '1 day ago',
    status: 'warm',
    deals: 1,
    totalValue: 15000,
    tags: ['Startup', 'SaaS'],
    avatar: null
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@bigcorp.com',
    phone: '+1 (555) 345-6789',
    company: 'BigCorp',
    position: 'VP Sales',
    location: 'New York, NY',
    lastContact: 'Today',
    status: 'hot',
    deals: 3,
    totalValue: 125000,
    tags: ['Enterprise', 'Fortune 500'],
    avatar: null
  },
  {
    id: '4',
    name: 'Lisa Brown',
    email: 'lisa.brown@retailco.com',
    phone: '+1 (555) 456-7890',
    company: 'RetailCo',
    position: 'COO',
    location: 'Chicago, IL',
    lastContact: '3 hours ago',
    status: 'warm',
    deals: 1,
    totalValue: 35000,
    tags: ['Retail', 'Mid-market'],
    avatar: null
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.lee@edutech.edu',
    phone: '+1 (555) 567-8901',
    company: 'EduTech Solutions',
    position: 'Director IT',
    location: 'Boston, MA',
    lastContact: '1 week ago',
    status: 'cold',
    deals: 1,
    totalValue: 12000,
    tags: ['Education', 'Non-profit'],
    avatar: null
  }
];

const ContactsEnhanced: React.FC = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ContactCard = ({ contact }: { contact: any }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
         onClick={() => setSelectedContact(contact.id)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.position}</p>
            <p className="text-sm text-gray-500">{contact.company}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>{contact.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4" />
          <span>{contact.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>{contact.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Last contact: {contact.lastContact}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="font-medium text-gray-900">{contact.deals} deals</span>
          <span className="text-gray-500"> • </span>
          <span className="font-medium text-green-600">${contact.totalValue.toLocaleString()}</span>
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Phone className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600">
            <Mail className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-purple-600">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {contact.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const ContactListItem = ({ contact }: { contact: any }) => (
    <div className="bg-white border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer"
         onClick={() => setSelectedContact(contact.id)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.position} at {contact.company}</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <div className="text-sm text-gray-600">{contact.email}</div>
          <div className="text-sm text-gray-600">{contact.phone}</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
            {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
          </span>
          <div className="text-sm text-gray-600">{contact.deals} deals</div>
          <div className="text-sm font-medium text-green-600">${contact.totalValue.toLocaleString()}</div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Phone className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600">
            <Mail className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const totalContacts = contacts.length;
  const totalValue = contacts.reduce((sum, contact) => sum + contact.totalValue, 0);
  const avgValue = totalValue / totalContacts;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600 mt-1">Manage your customer relationships and connections</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-blue-600">{totalContacts}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Value</p>
                <p className="text-2xl font-bold text-purple-600">${Math.round(avgValue).toLocaleString()}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">{contacts.filter(c => c.status === 'hot').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className="space-y-1 w-4 h-4">
                  <div className="w-4 h-0.5 bg-current rounded-sm"></div>
                  <div className="w-4 h-0.5 bg-current rounded-sm"></div>
                  <div className="w-4 h-0.5 bg-current rounded-sm"></div>
                  <div className="w-4 h-0.5 bg-current rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10"></div>
                  <div className="font-medium text-gray-900">Name</div>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                  <div className="font-medium text-gray-900 w-48">Email</div>
                  <div className="font-medium text-gray-900 w-32">Phone</div>
                  <div className="font-medium text-gray-900 w-20">Status</div>
                  <div className="font-medium text-gray-900 w-16">Deals</div>
                  <div className="font-medium text-gray-900 w-24">Value</div>
                </div>
                <div className="w-24"></div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <ContactListItem key={contact.id} contact={contact} />
              ))}
            </div>
          </div>
        )}

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {(() => {
                  const contact = contacts.find(c => c.id === selectedContact);
                  if (!contact) return null;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">{contact.name}</h2>
                            <p className="text-gray-600">{contact.position}</p>
                            <p className="text-gray-500">{contact.company}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedContact(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="text-gray-900">{contact.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <p className="text-gray-900">{contact.phone}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <p className="text-gray-900">{contact.location}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Deals</label>
                            <p className="text-gray-900">{contact.deals} active deals</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Total Value</label>
                            <p className="text-2xl font-bold text-green-600">${contact.totalValue.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {contact.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Phone className="h-4 w-4" />
                          <span>Call</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                          <MessageSquare className="h-4 w-4" />
                          <span>Message</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsEnhanced;
