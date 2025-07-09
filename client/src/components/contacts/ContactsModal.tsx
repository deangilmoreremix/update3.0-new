import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const contacts = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@techcorp.com',
      company: 'TechCorp Inc.',
      phone: '+1-555-0123',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@startupxyz.com',
      company: 'StartupXYZ',
      phone: '+1-555-0124',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike@datatech.com',
      company: 'DataTech Solutions',
      phone: '+1-555-0125',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
    },
    {
      id: 4,
      name: 'Lisa Chen',
      email: 'lisa@cloudfirst.com',
      company: 'CloudFirst Corp',
      phone: '+1-555-0126',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa'
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contacts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{contact.company}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {contact.phone}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};