import React, { memo } from 'react';
import { User, Mail, Phone, Building, Tag } from 'lucide-react';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  tags?: string[];
  lastContact?: Date;
  status?: 'lead' | 'prospect' | 'customer' | 'inactive';
  avatar?: string;
}

interface ContactListItemProps {
  contact: Contact;
  isSelected?: boolean;
  onClick?: (contact: Contact) => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
}

// Memoized Contact List Item Component for Performance
const ContactListItem = memo<ContactListItemProps>(({ 
  contact, 
  isSelected = false, 
  onClick, 
  onEdit, 
  onDelete 
}) => {
  const handleClick = () => {
    onClick?.(contact);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(contact);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(contact.id);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'customer':
        return 'bg-green-100 text-green-800';
      case 'prospect':
        return 'bg-blue-100 text-blue-800';
      case 'lead':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {contact.name}
              </h3>
              {contact.status && (
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              )}
            </div>

            {contact.title && contact.company && (
              <p className="text-sm text-gray-600 truncate flex items-center mt-1">
                <Building className="w-4 h-4 mr-1" />
                {contact.title} at {contact.company}
              </p>
            )}

            <div className="mt-2 space-y-1">
              {contact.email && (
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {contact.email}
                </p>
              )}
              {contact.phone && (
                <p className="text-sm text-gray-600 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {contact.phone}
                </p>
              )}
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-2 flex items-center flex-wrap gap-1">
                <Tag className="w-3 h-3 text-gray-400" />
                {contact.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {contact.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{contact.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Last Contact */}
            {contact.lastContact && (
              <p className="text-xs text-gray-500 mt-2">
                Last contact: {new Date(contact.lastContact).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-2">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit contact"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Delete contact"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ContactListItem.displayName = 'ContactListItem';

export default ContactListItem;
