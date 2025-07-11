import React, { useState } from 'react';
import { useDealStore } from '../store/dealStore';
import { useGemini } from '../services/geminiService';
import { 
  X, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  User, 
  Building, 
  Tag, 
  Clock, 
  Zap, 
  Brain,
  MessageSquare,
  Mail,
  Phone,
  RefreshCw,
  Save
} from 'lucide-react';
import DealAgentButtons from './deals/DealAgentButtons';

interface DealDetailProps {
  dealId: string;
  onClose: () => void;
}

const DealDetail: React.FC<DealDetailProps> = ({ dealId, onClose }) => {
  const { deals, updateDeal, deleteDeal } = useDealStore();
  const gemini = useGemini();
  const deal = deals[dealId];
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dealAnalysis, setDealAnalysis] = useState<string | null>(null);
  
  const [editForm, setEditForm] = useState({
    title: deal.title,
    value: deal.value,
    company: deal.company,
    contact: deal.contact,
    dueDate: deal.dueDate ? deal.dueDate.toISOString().split('T')[0] : '',
    probability: deal.probability || 0,
    priority: deal.priority || 'medium',
    notes: deal.notes || '',
    nextSteps: deal.nextSteps?.join('\n') || ''
  });
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedDeal = {
        ...deal,
        title: editForm.title,
        value: editForm.value,
        company: editForm.company,
        contact: editForm.contact,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate) : null,
        probability: editForm.probability,
        priority: editForm.priority as 'low' | 'medium' | 'high',
        notes: editForm.notes,
        nextSteps: editForm.nextSteps.split('\n').filter(step => step.trim())
      };
      
      updateDeal(dealId, updatedDeal);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: deal.title,
      value: deal.value,
      company: deal.company,
      contact: deal.contact,
      dueDate: deal.dueDate ? deal.dueDate.toISOString().split('T')[0] : '',
      probability: deal.probability || 0,
      priority: deal.priority || 'medium',
      notes: deal.notes || '',
      nextSteps: deal.nextSteps?.join('\n') || ''
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    
    setIsDeleting(true);
    try {
      deleteDeal(dealId);
      onClose();
    } catch (error) {
      console.error('Error deleting deal:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const analysisPrompt = `Analyze this sales deal and provide insights:
        
        Deal: ${deal.title}
        Company: ${deal.company}
        Value: $${deal.value.toLocaleString()}
        Probability: ${deal.probability}%
        Priority: ${deal.priority}
        Due Date: ${deal.dueDate?.toLocaleDateString()}
        Notes: ${deal.notes}
        Next Steps: ${deal.nextSteps?.join(', ')}
        
        Please provide:
        1. Risk assessment
        2. Recommendations to increase close probability
        3. Potential roadblocks
        4. Suggested next actions`;

      const analysis = await gemini.generateText(analysisPrompt);
      setDealAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing deal:', error);
      setDealAnalysis('Error generating analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!deal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Deal not found</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Deal' : 'Deal Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isEditing ? (
            /* Edit Form */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={editForm.contact}
                    onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value ($)
                  </label>
                  <input
                    type="number"
                    value={editForm.value}
                    onChange={(e) => setEditForm({ ...editForm, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.probability}
                    onChange={(e) => setEditForm({ ...editForm, probability: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Steps (one per line)
                </label>
                <textarea
                  value={editForm.nextSteps}
                  onChange={(e) => setEditForm({ ...editForm, nextSteps: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              {/* Deal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Building className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Company</p>
                    <p className="text-lg font-semibold">{deal.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contact</p>
                    <p className="text-lg font-semibold">{deal.contact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Value</p>
                    <p className="text-lg font-semibold text-green-600">
                      ${deal.value.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Date</p>
                    <p className="text-lg font-semibold">
                      {deal.dueDate ? deal.dueDate.toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Probability</p>
                    <p className="text-lg font-semibold">{deal.probability || 0}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Priority</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      deal.priority === 'high' ? 'bg-red-100 text-red-800' :
                      deal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {deal.priority || 'medium'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {deal.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Notes
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{deal.notes}</p>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              {deal.nextSteps && deal.nextSteps.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Next Steps
                  </h3>
                  <div className="space-y-2">
                    {deal.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Analysis
                  </h3>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm"
                  >
                    {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                    {isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}
                  </button>
                </div>
                
                {dealAnalysis && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="whitespace-pre-wrap text-gray-700">{dealAnalysis}</div>
                  </div>
                )}
              </div>

              {/* AI Agent Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  AI Actions
                </h3>
                <DealAgentButtons dealId={dealId} />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isEditing && (
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealDetail;