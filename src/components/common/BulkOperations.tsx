import React, { useState, useCallback, useMemo, FC } from 'react';
import { CheckSquare, Square, MoreHorizontal, Trash2, Edit3, Mail, Tag, Users, Archive, Download, AlertTriangle, Loader2, Move, UserPlus } from 'lucide-react';

export const BulkOperations: FC<BulkOperationsProps> = ({
  items,
  selectedItems,
  onSelectionChange,
  onItemsUpdate,
  customActions = [],
  type
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkEditFields, setBulkEditFields] = useState<Record<string, any>>({});
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  // Mock team members for assignment
  const teamMembers = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com' },
    { id: '2', name: 'Mike Chen', email: 'mike@example.com' },
    { id: '3', name: 'Lisa Wong', email: 'lisa@example.com' },
    { id: '4', name: 'David Smith', email: 'david@example.com' }
  ];

  // Get selected items data
  const selectedItemsData = useMemo(() => {
    return items.filter(item => selectedItems.includes(item.id));
  }, [items, selectedItems]);

  // Check if all items are selected
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < items.length;

  // Default bulk actions based on type
  const defaultActions: BulkAction[] = useMemo(() => {
    const actions: BulkAction[] = [
      {
        id: 'edit',
        label: 'Bulk Edit',
        icon: <Edit3 className="w-4 h-4" />,
        action: async () => {
          setShowBulkEditModal(true);
        }
      },
      {
        id: 'assign',
        label: 'Assign To',
        icon: <UserPlus className="w-4 h-4" />,
        action: async () => {
          setShowAssignModal(true);
        }
      },
      {
        id: 'tag',
        label: 'Add Tags',
        icon: <Tag className="w-4 h-4" />,
        action: async (items) => {
          // Mock tag addition

        }
      },
      {
        id: 'export',
        label: 'Export',
        icon: <Download className="w-4 h-4" />,
        action: async (items) => {
          const csv = generateCSV(items);
          downloadCSV(csv, `${type}_export.csv`);
        }
      }
    ];

    if (type === 'deals') {
      actions.push(
        {
          id: 'move-stage',
          label: 'Move Stage',
          icon: <Move className="w-4 h-4" />,
          action: async (items) => {
            // Mock stage movement

          }
        },
        {
          id: 'update-value',
          label: 'Update Value',
          icon: <Edit3 className="w-4 h-4" />,
          action: async (items) => {
            // Mock value update

          }
        }
      );
    }

    if (type === 'contacts') {
      actions.push(
        {
          id: 'send-email',
          label: 'Send Email',
          icon: <Mail className="w-4 h-4" />,
          action: async (items) => {
            // Mock email sending

          }
        },
        {
          id: 'add-to-list',
          label: 'Add to List',
          icon: <Users className="w-4 h-4" />,
          action: async (items) => {
            // Mock list addition

          }
        }
      );
    }

    // Common destructive actions
    actions.push(
      {
        id: 'archive',
        label: 'Archive',
        icon: <Archive className="w-4 h-4" />,
        action: async (items) => {
          // Mock archiving

          if (onItemsUpdate) {
            const updatedItems = items.map(item => ({
              ...item,
              data: { ...item.data, archived: true }
            }));
            onItemsUpdate(updatedItems);
          }
        },
        requiresConfirmation: true,
        confirmationMessage: `Are you sure you want to archive ${selectedItems.length} item(s)?`,
        color: 'warning' as const
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: <Trash2 className="w-4 h-4" />,
        action: async (items) => {
          // Mock deletion

          if (onItemsUpdate) {
            onItemsUpdate([]);
          }
          onSelectionChange([]);
        },
        requiresConfirmation: true,
        confirmationMessage: `Are you sure you want to permanently delete ${selectedItems.length} item(s)? This action cannot be undone.`,
        color: 'danger' as const
      }
    );

    return actions;
  }, [type, selectedItems.length, onItemsUpdate, onSelectionChange]);

  // All available actions
  const allActions = [...defaultActions, ...customActions];

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  }, [isAllSelected, items, onSelectionChange]);

  // Handle individual selection
  const handleSelectItem = useCallback((itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    } else {
      onSelectionChange([...selectedItems, itemId]);
    }
  }, [selectedItems, onSelectionChange]);

  // Execute bulk action
  const executeBulkAction = async (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setPendingAction(action);
      setShowConfirmation(true);
      return;
    }

    await performAction(action);
  };

  // Perform the actual action
  const performAction = async (action: BulkAction) => {
    setIsLoading(true);
    setCurrentAction(action.id);

    try {
      await action.action(selectedItemsData);
      // Clear selection after successful action
      if (!['edit', 'assign'].includes(action.id)) {
        onSelectionChange([]);
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
      setCurrentAction(null);
      setShowConfirmation(false);
      setPendingAction(null);
    }
  };

  // Generate CSV for export
  const generateCSV = (items: BulkOperationItem[]) => {
    if (items.length === 0) return '';

    const headers = Object.keys(items[0].data);
    const csvContent = [
      headers.join(','),
      ...items.map(item => 
        headers.map(header => 
          JSON.stringify(item.data[header] || '')
        ).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  // Download CSV file
  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle bulk edit
  const handleBulkEdit = async () => {
    setIsLoading(true);
    try {
      // Mock bulk edit

      if (onItemsUpdate) {
        const updatedItems = selectedItemsData.map(item => ({
          ...item,
          data: { ...item.data, ...bulkEditFields }
        }));
        onItemsUpdate(updatedItems);
      }

      setShowBulkEditModal(false);
      setBulkEditFields({});
      onSelectionChange([]);
    } catch (error) {
      console.error('Bulk edit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle assignment
  const handleAssignment = async () => {
    setIsLoading(true);
    try {
      // Mock assignment

      if (onItemsUpdate) {
        const updatedItems = selectedItemsData.map(item => ({
          ...item,
          data: { ...item.data, assignedTo: selectedAssignee }
        }));
        onItemsUpdate(updatedItems);
      }

      setShowAssignModal(false);
      setSelectedAssignee('');
      onSelectionChange([]);
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get action button style
  const getActionButtonStyle = (action: BulkAction) => {
    const baseStyle = "flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors";

    switch (action.color) {
      case 'danger':
        return `${baseStyle} text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20`;
      case 'warning':
        return `${baseStyle} text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20`;
      case 'success':
        return `${baseStyle} text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20`;
      default:
        return `${baseStyle} text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700`;
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Select All Checkbox */}
            <button
              onClick={handleSelectAll}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
            >
              {isAllSelected ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : isPartiallySelected ? (
                <div className="w-5 h-5 bg-blue-600 rounded border-2 border-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm" />
                </div>
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Actions */}
            {allActions.slice(0, 4).map(action => (
              <button
                key={action.id}
                onClick={() => executeBulkAction(action)}
                disabled={isLoading || (action.disabled && action.disabled(selectedItemsData))}
                className={getActionButtonStyle(action)}
              >
                {isLoading && currentAction === action.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  action.icon
                )}
                <span>{action.label}</span>
              </button>
            ))}

            {/* More Actions Menu */}
            {allActions.length > 4 && (
              <div className="relative">
                <button className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {/* Dropdown menu would go here */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Item List with Selection */}
      <div className="space-y-2">
        {items.map(item => (
          <div
            key={item.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
              selectedItems.includes(item.id)
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleSelectItem(item.id)}
          >
            <div className="mr-3">
              {selectedItems.includes(item.id) ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              {/* Render item content based on type */}
              {type === 'deals' && (
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.data.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${item.data.value?.toLocaleString()} • {item.data.stage}
                  </div>
                </div>
              )}

              {type === 'contacts' && (
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.data.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.data.email} • {item.data.status}
                  </div>
                </div>
              )}

              {type === 'companies' && (
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {item.data.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.data.industry} • {item.data.size} employees
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Action
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {pendingAction.confirmationMessage}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => performAction(pendingAction)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  pendingAction.color === 'danger' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Edit Modal */}
      {showBulkEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Bulk Edit {selectedItems.length} Item{selectedItems.length !== 1 ? 's' : ''}
            </h3>

            <div className="space-y-4 mb-6">
              {/* Common fields based on type */}
              {type === 'deals' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stage
                    </label>
                    <select
                      value={bulkEditFields.stage || ''}
                      onChange={(e) => setBulkEditFields({...bulkEditFields, stage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Don't change</option>
                      <option value="discovery">Discovery</option>
                      <option value="qualification">Qualification</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed-won">Closed Won</option>
                      <option value="closed-lost">Closed Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={bulkEditFields.priority || ''}
                      onChange={(e) => setBulkEditFields({...bulkEditFields, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Don't change</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </>
              )}

              {type === 'contacts' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={bulkEditFields.status || ''}
                      onChange={(e) => setBulkEditFields({...bulkEditFields, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Don't change</option>
                      <option value="lead">Lead</option>
                      <option value="prospect">Prospect</option>
                      <option value="customer">Customer</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Source
                    </label>
                    <input
                      type="text"
                      value={bulkEditFields.source || ''}
                      onChange={(e) => setBulkEditFields({...bulkEditFields, source: e.target.value})}
                      placeholder="Don't change"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Common fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={bulkEditFields.tags || ''}
                  onChange={(e) => setBulkEditFields({...bulkEditFields, tags: e.target.value})}
                  placeholder="Add tags..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowBulkEditModal(false);
                  setBulkEditFields({});
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkEdit}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Apply Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Assign {selectedItems.length} Item{selectedItems.length !== 1 ? 's' : ''}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign to team member
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select team member</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedAssignee('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignment}
                disabled={isLoading || !selectedAssignee}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Assign'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
