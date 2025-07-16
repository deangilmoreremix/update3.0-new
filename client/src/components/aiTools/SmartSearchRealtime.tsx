import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactStore } from '../../store/contactStore';
import { useDealStore } from '../../store/dealStore';
import { Search, DollarSign } from 'lucide-react';

const SmartSearchRealtime: React.FC = () => {
  const { isDark } = useTheme();
  const { contacts } = useContactStore();
  const { deals } = useDealStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      performSearch(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    const results: unknown[] = [];

    // Search contacts
    Object.values(contacts).forEach(contact => {
      if (
        contact.name.toLowerCase().includes(lowercaseQuery) ||
        contact.email.toLowerCase().includes(lowercaseQuery) ||
        contact.company?.toLowerCase().includes(lowercaseQuery) ||
        contact.title?.toLowerCase().includes(lowercaseQuery)
      ) {
        results.push({
          type: 'contact',
          id: contact.id,
          title: contact.name,
          subtitle: `${contact.title || 'Contact'} at ${contact.company || 'Unknown Company'}`,
          email: contact.email,
          icon: User,
          relevance: calculateRelevance(contact.name, lowercaseQuery)
        });
      }
    });

    // Search deals
    Object.values(deals).forEach(deal => {
      if (
        deal.title.toLowerCase().includes(lowercaseQuery) ||
        deal.company.toLowerCase().includes(lowercaseQuery) ||
        deal.stage.toLowerCase().includes(lowercaseQuery)
      ) {
        results.push({
          type: 'deal',
          id: deal.id,
          title: deal.title,
          subtitle: `${deal.company} • $${deal.value.toLocaleString()}`,
          stage: deal.stage,
          value: deal.value,
          icon: Building,
          relevance: calculateRelevance(deal.title, lowercaseQuery)
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    setSearchResults(results.slice(0, 6)); // Limit to 6 results
  };

  const calculateRelevance = (text: string, query: string): number => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    if (textLower === queryLower) return 100;
    if (textLower.startsWith(queryLower)) return 80;
    if (textLower.includes(queryLower)) return 60;
    
    // Fuzzy matching for partial matches
    const score = 0;;
    const queryWords = queryLower.split(' ');
    queryWords.forEach(word => {
      if (textLower.includes(word)) score += 20;
    });
    
    return score;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'deal':
        return isDark ? 'text-green-400' : 'text-green-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium';
    switch (type) {
      case 'contact':
        return `${baseClasses} ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`;
      case 'deal':
        return `${baseClasses} ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`;
      default:
        return `${baseClasses} ${isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'}`;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <input
          type="text"
          placeholder="Search contacts, deals, companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`
            w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-colors
            ${isDark 
              ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            }
            focus:outline-none focus:ring-1 focus:ring-blue-500
          `}
        />
        
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </span>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Smart AI matching
            </span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map((result, index) => {
              const Icon = result.icon;
              return (
                <div
                  key={`${result.type}-${result.id}-${index}`}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02]
                    ${isDark 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Icon className={`w-4 h-4 ${getTypeColor(result.type)} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                          {result.title}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                          {result.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className={getTypeBadge(result.type)}>
                        {result.type}
                      </div>
                      {result.relevance > 80 && (
                        <div className={`px-1 py-0.5 rounded text-xs ${
                          isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          ⭐
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {result.type === 'deal' && (
                    <div className="mt-2 flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>${result.value.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`px-1 py-0.5 rounded ${
                          isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {result.stage.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="text-center py-8">
          <Search className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No results found for "{searchQuery}"
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
            Try searching for contacts, deals, or companies
          </p>
        </div>
      )}

      {/* Search Tips */}
      {!searchQuery && (
        <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            Smart Search Tips:
          </p>
          <ul className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} space-y-1`}>
            <li>• Search by name, company, or email</li>
            <li>• Use partial matches for fuzzy search</li>
            <li>• Results are ranked by AI relevance</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SmartSearchRealtime;