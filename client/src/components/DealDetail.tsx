import React from 'react';
import { X, Calendar, DollarSign, TrendingUp, User } from 'lucide-react';

interface DealDetailProps {
  dealId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DealDetail: React.FC<DealDetailProps> = ({ dealId, isOpen, onClose }) => {
  // Mock deal data - in a real app, this would come from a store or API
  const deal = {
    id: dealId,
    title: 'Enterprise CRM Integration',
    company: 'TechCorp Inc.',
    contact: 'John Smith',
    value: 75000,
    stage: 'qualification',
    probability: 75,
    priority: 'high',
    expectedCloseDate: '2024-02-15',
    companyAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp&backgroundColor=3b82f6&textColor=ffffff',
    contactAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    description: 'A comprehensive CRM integration project for TechCorp Inc. to streamline their sales process and improve customer relationship management.',
    notes: 'Customer is very interested in AI features. Follow up on demo feedback.',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Deal Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Deal Header */}
          <div className="flex items-start space-x-4 mb-6">
            <img
              src={deal.companyAvatar}
              alt={deal.company}
              className="w-16 h-16 rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{deal.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{deal.company}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  deal.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : deal.priority === 'medium' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {deal.priority} priority
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {deal.stage}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Value</span>
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                ${deal.value.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Probability</span>
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {deal.probability}%
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Close Date</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {deal.expectedCloseDate}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <User className="w-5 h-5 text-orange-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Contact</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {deal.contact}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
            <p className="text-gray-600 dark:text-gray-300">{deal.description}</p>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-600 dark:text-gray-300">{deal.notes}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h4>
            <div className="flex items-center space-x-4">
              <img
                src={deal.contactAvatar}
                alt={deal.contact}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">{deal.contact}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">{deal.company}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Timeline</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Created:</span>
                <span className="text-gray-900 dark:text-white">{deal.createdAt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Last Updated:</span>
                <span className="text-gray-900 dark:text-white">{deal.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;