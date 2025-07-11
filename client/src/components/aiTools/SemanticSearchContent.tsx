import React, { useState } from 'react';
import { edgeFunctionService } from '../../services/edgeFunctionService';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import AIToolContent from '../shared/AIToolContent';
import StructuredAIResult from '../shared/StructuredAIResult';
import { Search, Database, RefreshCw } from 'lucide-react';

const SemanticSearchContent: React.FC = () => {
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<string>('');
  const [searchType, setSearchType] = useState<'all' | 'contacts' | 'deals'>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create context from deals and contacts
      const context = {
        deals: deals.map(deal => ({
          title: deal.title,
          amount: deal.amount,
          stage: deal.stage,
          contactId: deal.contactId,
          description: deal.description || ''
        })),
        contacts: contacts.map(contact => ({
          name: contact.name,
          email: contact.email,
          company: contact.company,
          status: contact.status,
          interestLevel: contact.interestLevel
        }))
      };
      
      // Use smart search API
      const response = await edgeFunctionService.callAIFunction('/api/ai/smart-search', {
        query: searchQuery,
        context: context,
        searchType: searchType,
        filters: { type: 'comprehensive' }
      });
      
      setSearchResults(response.result);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <Search className="text-blue-600 mt-1 mr-3 h-5 w-5" />
          <div>
            <h3 className="font-medium text-blue-800">Semantic Search</h3>
            <p className="text-sm text-blue-700 mt-1">
              Search through contacts and deals using natural language queries
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>
          <input
            type="text"
            id="searchQuery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., 'High-value Enterprise deals in negotiation stage'"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 mb-2">
            Search Type
          </label>
          <select
            id="searchType"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'all' | 'contacts' | 'deals')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Records</option>
            <option value="contacts">Contacts Only</option>
            <option value="deals">Deals Only</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin mr-2 h-4 w-4" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {searchResults && (
        <div className="space-y-4">
          <div className="flex items-center">
            <Database className="text-green-600 mr-2 h-5 w-5" />
            <h3 className="font-medium text-gray-800">Search Results</h3>
          </div>
          <StructuredAIResult content={searchResults} />
        </div>
      )}
    </div>
  );
};

export default SemanticSearchContent;