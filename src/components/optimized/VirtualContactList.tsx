import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Contact } from '../../types';

interface VirtualContactListProps {
  contacts: Contact[];
  selectedContactId?: string;
  onContactSelect?: (contact: Contact) => void;
  onContactEdit?: (contact: Contact) => void;
  onContactDelete?: (contactId: string) => void;
  height?: number;
  width?: number | string;
  itemHeight?: number;
  className?: string;
}

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    contacts: Contact[];
    selectedContactId?: string;
    onContactSelect?: (contact: Contact) => void;
    onContactEdit?: (contact: Contact) => void;
    onContactDelete?: (contactId: string) => void;
  };
}

// Memoized Virtual List Item Renderer
const VirtualListItem = memo<ListItemProps>(({ index, style, data }) => {
  const contact = data.contacts[index];
  
  if (!contact) {
    return (
      <div style={style} className="p-4">
        <div className="animate-pulse bg-gray-200 h-20 rounded"></div>
      </div>
    );
  }

  const handleClick = () => {
    data.onContactSelect?.(contact);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onContactEdit?.(contact);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onContactDelete?.(contact.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer':
        return 'bg-green-100 text-green-800';
      case 'prospect':
        return 'bg-blue-100 text-blue-800';
      case 'lead':
        return 'bg-yellow-100 text-yellow-800';
      case 'churned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isSelected = contact.id === data.selectedContactId;

  return (
    <div style={style} className="px-4 py-2">
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
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {contact.name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              </div>

              {contact.position && contact.company && (
                <p className="text-sm text-gray-600 truncate mt-1">
                  {contact.position} at {contact.company}
                </p>
              )}

              <div className="mt-2 space-y-1">
                {contact.email && (
                  <p className="text-sm text-gray-600 truncate">
                    📧 {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-sm text-gray-600 truncate">
                    📱 {contact.phone}
                  </p>
                )}
              </div>

              {contact.lastContact && (
                <p className="text-xs text-gray-500 mt-2">
                  Last contact: {new Date(contact.lastContact).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-2">
            {data.onContactEdit && (
              <button
                onClick={handleEdit}
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit contact"
              >
                ✏️
              </button>
            )}
            {data.onContactDelete && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Delete contact"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualListItem.displayName = 'VirtualListItem';

// Virtual Contact List Component with React Window
const VirtualContactList = memo<VirtualContactListProps>(({
  contacts,
  selectedContactId,
  onContactSelect,
  onContactEdit,
  onContactDelete,
  height = 600,
  width = '100%',
  itemHeight = 120,
  className = ''
}) => {
  // Memoized data for virtual list
  const listData = useMemo(() => ({
    contacts,
    selectedContactId,
    onContactSelect,
    onContactEdit,
    onContactDelete
  }), [contacts, selectedContactId, onContactSelect, onContactEdit, onContactDelete]);

  // Memoized item key getter for better performance
  const getItemKey = useCallback((index: number) => {
    return contacts[index]?.id || index;
  }, [contacts]);

  if (contacts.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-600">No contacts found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <List
        height={height}
        width={width}
        itemCount={contacts.length}
        itemSize={itemHeight}
        itemData={listData}
        itemKey={getItemKey}
        overscanCount={5} // Render 5 extra items for smooth scrolling
      >
        {VirtualListItem}
      </List>
    </div>
  );
});

VirtualContactList.displayName = 'VirtualContactList';

export default VirtualContactList;
