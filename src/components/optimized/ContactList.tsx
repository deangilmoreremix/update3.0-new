import React, { memo, useMemo, useCallback, useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Plus } from 'lucide-react';
import ContactListItem, { Contact } from './ContactListItem';

interface ContactListProps {
  contacts: Contact[];
  selectedContactId?: string;
  onContactSelect?: (contact: Contact) => void;
  onContactEdit?: (contact: Contact) => void;
  onContactDelete?: (contactId: string) => void;
  onContactAdd?: () => void;
  isLoading?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

type SortField = 'name' | 'company' | 'lastContact' | 'status';
type SortDirection = 'asc' | 'desc';

// Memoized Contact List Container with Optimized Filtering and Sorting
const ContactList = memo<ContactListProps>(({
  contacts,
  selectedContactId,
  onContactSelect,
  onContactEdit,
  onContactDelete,
  onContactAdd,
  isLoading = false,
  searchTerm = '',
  onSearchChange
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Memoized search and filter logic
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts;

    // Apply search filter
    const searchQuery = (onSearchChange ? searchTerm : localSearchTerm).toLowerCase();
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery) ||
        contact.email.toLowerCase().includes(searchQuery) ||
        contact.company?.toLowerCase().includes(searchQuery) ||
        contact.title?.toLowerCase().includes(searchQuery) ||
        contact.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company?.toLowerCase() || '';
          bValue = b.company?.toLowerCase() || '';
          break;
        case 'lastContact':
          aValue = a.lastContact ? new Date(a.lastContact).getTime() : 0;
          bValue = b.lastContact ? new Date(b.lastContact).getTime() : 0;
          break;
        case 'status':
          aValue = a.status || 'z';
          bValue = b.status || 'z';
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [contacts, searchTerm, localSearchTerm, statusFilter, sortField, sortDirection, onSearchChange]);

  // Memoized handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearchTerm(value);
    }
  }, [onSearchChange]);

  const handleSortChange = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  }, []);

  // Memoized contact select handler
  const handleContactSelect = useCallback((contact: Contact) => {
    onContactSelect?.(contact);
  }, [onContactSelect]);

  // Memoized contact edit handler
  const handleContactEdit = useCallback((contact: Contact) => {
    onContactEdit?.(contact);
  }, [onContactEdit]);

  // Memoized contact delete handler
  const handleContactDelete = useCallback((contactId: string) => {
    onContactDelete?.(contactId);
  }, [onContactDelete]);

  // Memoized status options
  const statusOptions = useMemo(() => [
    { value: 'all', label: 'All Statuses' },
    { value: 'lead', label: 'Leads' },
    { value: 'prospect', label: 'Prospects' },
    { value: 'customer', label: 'Customers' },
    { value: 'inactive', label: 'Inactive' }
  ], []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Contacts ({filteredAndSortedContacts.length})
          </h2>
          {onContactAdd && (
            <button
              onClick={onContactAdd}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={onSearchChange ? searchTerm : localSearchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm text-gray-600">Sort by:</span>
          {(['name', 'company', 'lastContact', 'status'] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => handleSortChange(field)}
              className={`
                flex items-center px-3 py-1 rounded-md text-sm transition-colors
                ${sortField === field 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {sortField === field && (
                sortDirection === 'asc' 
                  ? <SortAsc className="w-3 h-3 ml-1" />
                  : <SortDesc className="w-3 h-3 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List */}
      <div className="p-4">
        {filteredAndSortedContacts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-600">No contacts found</p>
            {(searchTerm || localSearchTerm) && (
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedContacts.map((contact) => (
              <ContactListItem
                key={contact.id}
                contact={contact}
                isSelected={contact.id === selectedContactId}
                onClick={handleContactSelect}
                onEdit={onContactEdit ? handleContactEdit : undefined}
                onDelete={onContactDelete ? handleContactDelete : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

ContactList.displayName = 'ContactList';

export default ContactList;
