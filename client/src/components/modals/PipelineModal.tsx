import React from 'react';
import { X } from 'lucide-react';
import { EnhancedPipeline } from '../EnhancedPipeline';

interface PipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PipelineModal: React.FC<PipelineModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        {/* Modal Content */}
        <div className="w-full h-full overflow-y-auto">
          <EnhancedPipeline />
        </div>
      </div>
    </div>
  );
};

export default PipelineModal;