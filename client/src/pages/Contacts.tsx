import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Contact } from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Brain, 
  Download, 
  Upload, 
  FileInput,
  X,
  ArrowUp,
  ArrowDown,
  CheckCheck,
  Zap
} from 'lucide-react';
import { useOpenAI } from '../services/openaiService';
import { useForm } from 'react-hook-form';
import Avatar from 'react-avatar';
import { CSVLink } from 'react-csv';
import { useDropzone } from 'react-dropzone';
import { read, utils } from 'xlsx';
import Fuse from 'fuse.js';
import Select from 'react-select';
import AIEnhancedContactCard from '../components/contacts/AIEnhancedContactCard';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  PaginationState
} from '@tanstack/react-table';
import { useContactStore } from '../store/contactStore';
import ContactImport from '../components/contacts/ContactImport';
import ContactExport from '../components/contacts/ContactExport';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AvatarFallback } from '@/components/ui/avatar';
import { GlassCard, ModernButton, AvatarWithStatus, StatusIndicator, FloatingActionButton } from '@/components/modern-ui';
import { 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Star,
  MoreVertical,
  Users,
  TrendingUp
} from 'lucide-react';

const Contacts: React.FC = () => {
  // Use the contact store
  const { 
    contacts: storeContacts, 
    isLoading: storeIsLoading,
    error: storeError,
    fetchContacts, 
    createContact,
    updateContact,
    deleteContact,
    selectContact,
    importContacts
  } = useContactStore();

  const navigate = useNavigate();

  // Local state for UI
  const [contacts, setContacts] = useState<Contact[]>([]);
  const openai = useOpenAI();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importedData, setImportedData] = useState<any[]>([]);
  const [importValidation, setImportValidation] = useState<{error?: string, success?: string}>({});
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Extract unique industries for filtering
  const industries = useMemo(() => 
    [...new Set(contacts.map(contact => contact.industry))].filter(Boolean) as string[],
    [contacts]
  );

  const statuses = ['lead', 'prospect', 'customer', 'churned'];

  // Filters state
  const [activeFilters, setActiveFilters] = useState<{
    status: string | null,
    industry: string | null,
    score: [number, number] | null
  }>({
    status: null,
    industry: null,
    score: null
  });

  // Load contacts from store on component mount
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Update local contacts from store
  useEffect(() => {
    if (Object.keys(storeContacts).length > 0) {
      setContacts(Object.values(storeContacts));
    }
  }, [storeContacts]);

  // Set up fuzzy search with fuse.js
  const fuse = useMemo(() => 
    new Fuse(contacts, {
      keys: ['name', 'email', 'company', 'phone'],
      threshold: 0.3
    }),
  [contacts]);

  // Filter contacts based on search and active filters
  const filteredContacts = useMemo(() => {
    let result = contacts;

    // Apply search filter
    if (searchTerm) {
      result = fuse.search(searchTerm).map(res => res.item);
    }

    // Apply status filter
    if (activeFilters.status) {
      result = result.filter(contact => contact.status === activeFilters.status);
    }

    // Apply industry filter
    if (activeFilters.industry) {
      result = result.filter(contact => contact.industry === activeFilters.industry);
    }

    // Apply score filter
    if (activeFilters.score) {
      const [min, max] = activeFilters.score;
      result = result.filter(contact => 
        (contact.score || 0) >= min && (contact.score || 0) <= max
      );
    }

    return result;
  }, [contacts, searchTerm, activeFilters, fuse]);

  const toggleContactSelection = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(contact => contact.id));
    }
  };

  const statusColors = {
    lead: 'bg-yellow-100 text-yellow-800',
    prospect: 'bg-purple-100 text-purple-800',
    customer: 'bg-green-100 text-green-800',
    churned: 'bg-red-100 text-red-800'
  };

  // Import contacts feature
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            if (!data) {
              setImportValidation({ error: 'Failed to read file' });
              return;
            }

            const workbook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet);

            // Validate data has required fields
            if (jsonData.length === 0) {
              setImportValidation({ error: 'No data found in file' });
              return;
            }

            // Check for required fields
            const requiredFields = ['name', 'email'];
            const firstRow = jsonData[0] as any;
            const missingFields = requiredFields.filter(field => 
              !Object.keys(firstRow).some(key => 
                key.toLowerCase() === field.toLowerCase()
              )
            );

            if (missingFields.length > 0) {
              setImportValidation({ 
                error: `Missing required fields: ${missingFields.join(', ')}` 
              });
              return;
            }

            setImportedData(jsonData);
            setImportValidation({ 
              success: `Found ${jsonData.length} contacts ready to import` 
            });
          } catch (error) {
            setImportValidation({ error: 'Failed to parse file' });
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  });

  const handleImportContacts = () => {
    if (importedData.length === 0) {
      return;
    }

    // Convert imported data to Contact format
    const newContacts: Partial<Contact>[] = importedData.map((row: any) => {
      // Map the imported data to our Contact type
      return {
        name: row.name || row.Name || '',
        email: row.email || row.Email || '',
        phone: row.phone || row.Phone || '',
        company: row.company || row.Company || '',
        position: row.position || row.Position || row.Title || '',
        status: (row.status || row.Status || 'lead').toLowerCase(),
        industry: row.industry || row.Industry || '',
        location: row.location || row.Location || '',
        notes: row.notes || row.Notes || '',
      };
    });

    // Import to Supabase through store
    importContacts(newContacts)
      .then(() => {
        setImportValidation({ success: `Successfully imported ${newContacts.length} contacts` });

        // Reset import state
        setTimeout(() => {
          setImportedData([]);
          setShowImportModal(false);
          setImportValidation({});
        }, 1500);
      })
      .catch(error => {
        setImportValidation({ error: 'Failed to import contacts: ' + error.message });
      });
  };

  // Submit form for creating a new contact
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Contact>();

  const onSubmit = (data: any) => {
    // Add new contact through Supabase
    createContact({
      ...data,
      status: data.status || 'lead',
      score: data.score || 50
    })
      .then(() => {
        reset();
        setShowAddContactModal(false);
      })
      .catch(error => {
        console.error('Failed to create contact:', error);
      });
  };

  // Handle AI analysis of all contacts
  const handleAnalyzeAllContacts = async () => {
    setIsAnalyzing(true);

    try {
      // In a real app, we would process all leads in batches
      // For demo purposes, just wait a moment and update scores
      await new Promise(r => setTimeout(r, 1500));

      const updatedContacts = contacts.map(contact => {
        // Simple mock logic to simulate AI scoring
        const randomAdjustment = Math.floor(Math.random() * 10) - 5;
        const newScore = Math.max(0, Math.min(100, (contact.score || 50) + randomAdjustment));

        // Update contact in supabase
        updateContact(contact.id, { ...contact, score: newScore });

        return {
          ...contact,
          score: newScore
        };
      });

      setContacts(updatedContacts);
    } catch (err) {
      console.error("Error analyzing contacts:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Table setup using @tanstack/react-table
  const columnHelper = createColumnHelper<Contact>();

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => (
        <Link to={`/contacts/${info.row.original.id}`} className="flex items-center">
          <Avatar 
            name={info.getValue()} 
            size="40" 
            round 
            className="mr-3" 
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.email}</div>
          </div>
        </Link>
      )
    }),
    columnHelper.accessor('company', {
      header: 'Company',
      cell: (info) => (
        <div>
          <div className="text-sm text-gray-900">{info.getValue() || 'N/A'}</div>
          <div className="text-sm text-gray-500">{info.row.original.position || ''}</div>
        </div>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          statusColors[info.getValue() as keyof typeof statusColors]
        }`}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      )
    }),
    columnHelper.accessor('score', {
      header: 'AI Score',
      cell: (info) => (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div 
              className={`h-2.5 rounded-full ${
                info.getValue() && info.getValue() >= 80 ? 'bg-green-500' : 
                info.getValue() && info.getValue() >= 60 ? 'bg-blue-500' : 
                info.getValue() && info.getValue() >= 40 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`} 
              style={{ width: `${info.getValue() || 0}%` }}
            />
          </div>
          <span className="text-sm text-gray-500">
            {info.getValue()}/100
          </span>
        </div>
      )
    }),
    columnHelper.accessor('lastContact', {
      header: 'Last Contact',
      cell: (info) => (
        <span className="text-sm text-gray-500">
          {info.getValue()?.toLocaleDateString() || 'N/A'}
        </span>
      )
    }),
    columnHelper.accessor('industry', {
      header: 'Industry',
      cell: (info) => (
        <span className="text-sm text-gray-500">
          {info.getValue() || 'N/A'}
        </span>
      )
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: (info) => (
        <div className="flex justify-end">
          <button className="text-gray-400 hover:text-gray-500 mr-2">
            <Link to={`/contacts/${info.getValue()}`}>
              <MoreHorizontal size={18} />
            </Link>
          </button>
        </div>
      )
    })
  ], []);

  const table = useReactTable({
    columns,
    data: filteredContacts,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Set up export data for CSV
  const exportData = useMemo(() => 
    contacts.map(contact => ({
      Name: contact.name,
      Email: contact.email,
      Phone: contact.phone,
      Company: contact.company,
      Position: contact.position,
      Status: contact.status,
      Score: contact.score,
      LastContact: contact.lastContact ? contact.lastContact.toLocaleDateString() : '',
      Industry: contact.industry,
      Location: contact.location,
      Notes: contact.notes
    })),
  [contacts]);

  const csvHeaders = [
    { label: "Name", key: "Name" },
    { label: "Email", key: "Email" },
    { label: "Phone", key: "Phone" },
    { label: "Company", key: "Company" },
    { label: "Position", key: "Position" },
    { label: "Status", key: "Status" },
    { label: "Score", key: "Score" },
    { label: "Last Contact", key: "LastContact" },
    { label: "Industry", key: "Industry" },
    { label: "Location", key: "Location" },
    { label: "Notes", key: "Notes" }
  ];

  // Handle bulk AI analysis for selected contacts
  const handleAnalyzeSelectedContacts = async () => {
    if (selectedContacts.length === 0) return;

    setIsAnalyzing(true);

    try {
      // Simple mock logic to simulate AI scoring
      const updatedContacts = contacts.map(contact => {
        if (selectedContacts.includes(contact.id)) {
          const randomAdjustment = Math.floor(Math.random() * 10) - 5;
          const newScore = Math.max(0, Math.min(100, (contact.score || 50) + randomAdjustment));

          // Update contact in store
          updateContact(contact.id, { score: newScore });

          return {
            ...contact,
            score: newScore
          };
        }
        return contact;
      });

      setContacts(updatedContacts);

      // Clear selected contacts after bulk operation
      setSelectedContacts([]);
      setShowBulkActions(false);
    } catch (err) {
      console.error("Error analyzing selected contacts:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Watch for selections to show/hide bulk actions
  useEffect(() => {
    if (selectedContacts.length > 0) {
      setShowBulkActions(true);
    } else {
      setShowBulkActions(false);
    }
  }, [selectedContacts]);

  // Calculate values needed for pagination
  const currentPage = pagination.pageIndex + 1;
  const itemsPerPage = pagination.pageSize;
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const handleImport = () => {
    setShowImportModal(true);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleAddContact = () => {
    setShowAddContactModal(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Contacts</h1>
            <p className="text-dark-text-secondary text-lg">Manage your customer relationships</p>
          </div>
          <div className="flex gap-3">
            <ModernButton 
              onClick={handleImport}
              variant="outline"
              icon={<Upload className="h-4 w-4" />}
            >
              Import
            </ModernButton>
            <ModernButton 
              onClick={handleExport}
              variant="outline"
              icon={<Download className="h-4 w-4" />}
            >
              Export
            </ModernButton>
            <ModernButton 
              onClick={handleAddContact}
              variant="primary"
              icon={<Plus className="h-4 w-4" />}
            >
              Add Contact
            </ModernButton>
          </div>
        </div>

        {/* Search and Filter */}
        <GlassCard className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-dark-surface/50 border-dark-border text-white placeholder-dark-text-muted backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2">
              <ModernButton 
                variant="glass" 
                size="sm"
                icon={<Filter className="h-4 w-4" />}
              >
                Filter
              </ModernButton>
            </div>
          </div>
        </GlassCard>

        {/* Contacts Grid */}
        <div className="dashboard-grid">
          {filteredContacts.map((contact) => {
            return (
              <GlassCard key={contact.id} className="p-6 hover:bg-white/15 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <AvatarWithStatus
                      fallback={`${contact.name}`}
                      status={Math.random() > 0.5 ? 'online' : 'away'}
                      size="lg"
                      showStatus={true}
                    />
                    <div>
                      <h3 className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-dark-text-secondary text-sm">{contact.position}</p>
                    </div>
                  </div>
                  <ModernButton 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </ModernButton>
                </div>

                <div>
                  <p className="text-dark-text-secondary text-sm mb-2">
                    <Mail className="mr-2 inline-block h-4 w-4 align-middle" />
                    {contact.email}
                  </p>
                  <p className="text-dark-text-secondary text-sm mb-2">
                    <Phone className="mr-2 inline-block h-4 w-4 align-middle" />
                    {contact.phone}
                  </p>
                  <p className="text-dark-text-secondary text-sm mb-2">
                    <Building className="mr-2 inline-block h-4 w-4 align-middle" />
                    {contact.company}
                  </p>
                  <p className="text-dark-text-secondary text-sm">
                    <MapPin className="mr-2 inline-block h-4 w-4 align-middle" />
                    {contact.location}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<Plus className="h-6 w-6" />}
        onClick={handleAddContact}
        tooltip="Add New Contact"
        position="bottom-right"
      />
    </div>
  );
};

export default Contacts;