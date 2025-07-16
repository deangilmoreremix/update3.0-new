import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { useHelp } from '../contexts/HelpContext';

interface TourStep {
  id: string;
  target: string; // CSS selector or element ID
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    type: 'click' | 'hover' | 'input';
    text: string;
  };
  highlight?: boolean;
}

interface ContextualTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  autoStart?: boolean;
  tourId: string;
}

export const ContextualTour: React.FC<ContextualTourProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  autoStart = false,
  tourId,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentTarget, setCurrentTarget] = useState<Element | null>(null);
  const { markTourCompleted, isTourCompleted, showTours } = useHelp();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = steps[currentStepIndex];

  // Auto-advance functionality
  useEffect(() => {
    if (!isPlaying || !isOpen) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      nextStep();
    }, 5000); // 5 seconds per step

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isOpen, currentStepIndex]);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const completeTour = () => {
    if (currentTarget && currentStep?.highlight) {
      currentTarget.classList.remove('tour-highlight');
    }
    setIsPlaying(false);
    markTourCompleted(tourId);
    onComplete?.();
    onClose();
  };

  const handleClose = () => {
    if (currentTarget && currentStep?.highlight) {
      currentTarget.classList.remove('tour-highlight');
    }
    setIsPlaying(false);
    onClose();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getTooltipPosition = () => {
    if (!currentTarget) return { top: '50%', left: '50%' };

    const rect = currentTarget.getBoundingClientRect();
    const placement = currentStep?.placement || 'bottom';

    switch (placement) {
      case 'top':
        return {
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          top: rect.bottom + 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)',
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2,
          left: rect.left - 10,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2,
          left: rect.right + 10,
          transform: 'translate(0, -50%)',
        };
      default:
        return {
          top: rect.bottom + 10,
          left: rect.left + rect.width / 2,
          transform: 'translate(-50%, 0)',
        };
    }
  };

  // Find and highlight the target element
  useEffect(() => {
    if (!currentStep?.target || !isOpen) {
      setCurrentTarget(null);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const findTarget = () => {
      const element = document.querySelector(currentStep.target);
      if (element) {
        setCurrentTarget(element);
        if (currentStep.highlight) {
          element.classList.add('tour-highlight');
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(findTarget, 100);
      }
    };

    findTarget();

    return () => {
      if (currentTarget && currentStep?.highlight) {
        currentTarget.classList.remove('tour-highlight');
      }
    };
  }, [currentStep, isOpen, setCurrentTarget]);

  if (!isOpen || isTourCompleted(tourId) || !showTours) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Tooltip */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl p-4 max-w-sm border border-gray-200"
        style={getTooltipPosition()}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentStep?.title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          {currentStep?.content}
        </p>
        
        {currentStep?.action && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Action:</strong> {currentStep.action.text}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <span className="text-sm text-gray-500">
              {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContextualTour;
