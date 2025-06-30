import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Search, Check, Filter } from 'lucide-react';
import { ComposioTool, composioToolsData, toolCategories, getToolsByCategory, getPopularTools, searchTools } from '../data/composioToolsData';

interface ComposioToolSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onToolsSelected: (tools: ComposioTool[]) => void;
  preselectedTools?: string[];
  goalCategory?: string;
}

export function ComposioToolSelector({ 
  isOpen, 
  onClose, 
  onToolsSelected, 
  preselectedTools = [],
  goalCategory 
}: ComposioToolSelectorProps) {
  const [selectedTools, setSelectedTools] = useState<ComposioTool[]>(() => {
    return composioToolsData.filter(tool => preselectedTools.includes(tool.id));
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);

  const getFilteredTools = () => {
    let tools = composioToolsData;

    // Apply search filter
    if (searchQuery) {
      tools = searchTools(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }

    // Apply popularity filter
    if (showOnlyPopular) {
      tools = tools.filter(tool => tool.isPopular);
    }

    return tools;
  };

  const toggleTool = (tool: ComposioTool) => {
    setSelectedTools(prev => {
      const isSelected = prev.some(t => t.id === tool.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tool.id);
      } else {
        return [...prev, tool];
      }
    });
  };

  const handleConfirm = () => {
    onToolsSelected(selectedTools);
    onClose();
  };

  const suggestedTools = goalCategory ? 
    getToolsByCategory(goalCategory === 'Sales' ? 'CRM' : goalCategory) : 
    getPopularTools().slice(0, 6);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            Select Composio Tools
          </DialogTitle>
          <p className="text-gray-600">
            Choose from 250+ business tools to power your automation goal
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 h-full">
          {/* Search and Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tools by name or capability..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="All">All Categories</option>
              {toolCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Button
              variant={showOnlyPopular ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyPopular(!showOnlyPopular)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Popular
            </Button>
          </div>

          {/* Selected Tools Summary */}
          {selectedTools.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900">
                  Selected Tools ({selectedTools.length})
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedTools([])}
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTools.map(tool => (
                  <Badge key={tool.id} variant="default" className="bg-blue-100 text-blue-800">
                    {tool.icon} {tool.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Tools */}
          {!searchQuery && selectedCategory === 'All' && (
            <div className="mb-4">
              <h3 className="font-medium mb-3 text-gray-700">
                {goalCategory ? `Recommended for ${goalCategory}` : 'Popular Tools'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {suggestedTools.map(tool => {
                  const isSelected = selectedTools.some(t => t.id === tool.id);
                  return (
                    <Button
                      key={tool.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTool(tool)}
                      className="justify-start h-auto p-2"
                    >
                      <span className="mr-2">{tool.icon}</span>
                      <span className="truncate">{tool.name}</span>
                      {isSelected && <Check className="w-4 h-4 ml-auto" />}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Tools Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-3">
              {getFilteredTools().map(tool => {
                const isSelected = selectedTools.some(t => t.id === tool.id);
                return (
                  <Card 
                    key={tool.id} 
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => toggleTool(tool)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className="text-lg">{tool.icon}</span>
                          {tool.name}
                          {tool.isPopular && (
                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                          )}
                        </CardTitle>
                        {isSelected && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {tool.capabilities.slice(0, 3).map(capability => (
                          <Badge key={capability} variant="outline" className="text-xs">
                            {capability.replace('_', ' ')}
                          </Badge>
                        ))}
                        {tool.capabilities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tool.capabilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {getFilteredTools().length} tools available
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={selectedTools.length === 0}
              >
                Use Selected Tools ({selectedTools.length})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}