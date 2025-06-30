import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Play, SkipForward } from 'lucide-react';

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

const ContextualTour: React.FC<ContextualTourProps> = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  autoStart = false,
  tourId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isStarted, setIsStarted] = useState(autoStart);

  useEffect(() => {
    if (isOpen && isStarted && steps[currentStep]) {
      const element = document.querySelector(steps[currentStep].target) as HTMLElement;
      setTargetElement(element);
      
      if (element) {
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
        
        // Add highlight class
        if (steps[currentStep].highlight) {
          element.classList.add('tour-highlight');
        }
      }
    }

    return () => {
      // Clean up highlight
      if (targetElement && steps[currentStep]?.highlight) {
        targetElement.classList.remove('tour-highlight');
      }
    };
  }, [currentStep, isOpen, isStarted, steps, targetElement]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  const startTour = () => {
    setIsStarted(true);
    setCurrentStep(0);
  };

  const completeTour = () => {
    // Store completion in localStorage
    localStorage.setItem(`tour-${tourId}-completed`, 'true');
    setIsStarted(false);
    onComplete?.();
    onClose();
  };

  const getTooltipPosition = () => {
    if (!targetElement) return { x: 0, y: 0 };

    const rect = targetElement.getBoundingClientRect();
    const placement = steps[currentStep].placement || 'bottom';
    
    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = rect.left + rect.width / 2;
        y = rect.top - 20;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2;
        y = rect.bottom + 20;
        break;
      case 'left':
        x = rect.left - 20;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right + 20;
        y = rect.top + rect.height / 2;
        break;
    }

    return { x, y };
  };

  if (!isOpen) return null;

  // Tour start screen
  if (!isStarted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <Play size={32} className="text-blue-600" />
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-2">Welcome to Smart CRM!</h3>
          <p className="text-gray-600 mb-6">
            Let's take a quick tour to get you familiar with the key features. 
            This will only take a few minutes.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={skipTour}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip Tour
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startTour}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Start Tour
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const position = getTooltipPosition();
  const step = steps[currentStep];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
      
      {/* Spotlight effect */}
      {targetElement && step.highlight && (
        <div 
          className="fixed pointer-events-none z-45"
          style={{
            left: targetElement.getBoundingClientRect().left - 8,
            top: targetElement.getBoundingClientRect().top - 8,
            width: targetElement.getBoundingClientRect().width + 16,
            height: targetElement.getBoundingClientRect().height + 16,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px'
          }}
        />
      )}

      {/* Tour tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            x: step.placement === 'left' ? 20 : step.placement === 'right' ? -20 : 0,
            y: step.placement === 'top' ? 20 : step.placement === 'bottom' ? -20 : 0
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25
          }}
          className="fixed z-50 bg-white rounded-lg shadow-xl border max-w-sm p-6"
          style={{
            left: `${position.x - 150}px`,
            top: `${position.y}px`,
            transform: step.placement === 'left' ? 'translateX(-100%)' : 
                      step.placement === 'right' ? 'translateX(0)' :
                      step.placement === 'top' ? 'translateY(-100%)' : 'translateY(0)'
          }}
        >
          {/* Arrow */}
          <div
            className={`
              absolute w-3 h-3 bg-white border rotate-45
              ${step.placement === 'top' ? 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-0 border-l-0' : ''}
              ${step.placement === 'bottom' ? 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-0 border-r-0' : ''}
              ${step.placement === 'left' ? 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-0 border-b-0' : ''}
              ${step.placement === 'right' ? 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-0 border-t-0' : ''}
            `}
          />

          {/* Close button */}
          <button
            onClick={skipTour}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>

          {/* Content */}
          <div className="pr-6">
            <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
            <p className="text-gray-600 mb-4 leading-relaxed">{step.content}</p>
            
            {step.action && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Try it:</strong> {step.action.text}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>
              
              {/* Progress dots */}
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-blue-600' : 
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevStep}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Back
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStep === steps.length - 1 ? (
                  <SkipForward size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-blue-400/30 pointer-events-none"
            animate={{
              borderColor: [
                'rgba(59, 130, 246, 0.3)',
                'rgba(59, 130, 246, 0.6)',
                'rgba(59, 130, 246, 0.3)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ContextualTour;