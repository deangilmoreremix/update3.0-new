import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Lightbulb, Info, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpTooltipProps {
  content: string;
  title?: string;
  type?: 'info' | 'tip' | 'feature' | 'goal';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  persistent?: boolean;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  title,
  type = 'info',
  placement = 'top',
  trigger = 'hover',
  size = 'md',
  className = '',
  children,
  showIcon = true,
  persistent = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getIcon = () => {
    switch (type) {
      case 'tip':
        return <Lightbulb size={14} className="text-yellow-500" />;
      case 'feature':
        return <Zap size={14} className="text-blue-500" />;
      case 'goal':
        return <Target size={14} className="text-green-500" />;
      default:
        return <Info size={14} className="text-blue-500" />;
    }
  };

  const getTypeColors = () => {
    switch (type) {
      case 'tip':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'feature':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'goal':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-xs text-xs p-2';
      case 'lg':
        return 'max-w-md text-sm p-4';
      default:
        return 'max-w-sm text-xs p-3';
    }
  };

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 200; // Approximate width
    const tooltipHeight = 80; // Approximate height
    
    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        y = triggerRect.top - tooltipHeight - 8;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipWidth - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    const padding = 16;
    x = Math.max(padding, Math.min(x, window.innerWidth - tooltipWidth - padding));
    y = Math.max(padding, Math.min(y, window.innerHeight - tooltipHeight - padding));

    setPosition({ x, y });
  };

  const showTooltip = () => {
    calculatePosition();
    setIsVisible(true);
  };

  const hideTooltip = () => {
    if (!persistent) {
      setIsVisible(false);
    }
  };

  const toggleTooltip = () => {
    if (isVisible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible, placement]);

  const triggerProps = trigger === 'hover' 
    ? { onMouseEnter: showTooltip, onMouseLeave: hideTooltip }
    : { onClick: toggleTooltip };

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-flex items-center cursor-help ${className}`}
        {...triggerProps}
      >
        {children || (
          showIcon && (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center"
            >
              <HelpCircle 
                size={16} 
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200" 
              />
            </motion.div>
          )
        )}
      </div>

      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop for click trigger */}
            {trigger === 'click' && (
              <div
                className="fixed inset-0 z-40"
                onClick={hideTooltip}
              />
            )}
            
            <motion.div
              ref={tooltipRef}
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                y: placement === 'top' ? 10 : placement === 'bottom' ? -10 : 0,
                x: placement === 'left' ? 10 : placement === 'right' ? -10 : 0
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0,
                x: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8,
                y: placement === 'top' ? 10 : placement === 'bottom' ? -10 : 0,
                x: placement === 'left' ? 10 : placement === 'right' ? -10 : 0
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                duration: 0.2
              }}
              className={`
                fixed z-50 rounded-lg border shadow-lg backdrop-blur-sm
                ${getTypeColors()} ${getSizeClasses()}
              `}
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
            >
              {/* Arrow */}
              <div
                className={`
                  absolute w-2 h-2 rotate-45 border
                  ${getTypeColors()}
                  ${placement === 'top' ? 'bottom-[-4px] left-1/2 transform -translate-x-1/2 border-t-0 border-l-0' : ''}
                  ${placement === 'bottom' ? 'top-[-4px] left-1/2 transform -translate-x-1/2 border-b-0 border-r-0' : ''}
                  ${placement === 'left' ? 'right-[-4px] top-1/2 transform -translate-y-1/2 border-l-0 border-b-0' : ''}
                  ${placement === 'right' ? 'left-[-4px] top-1/2 transform -translate-y-1/2 border-r-0 border-t-0' : ''}
                `}
              />

              {/* Close button for click trigger */}
              {trigger === 'click' && (
                <button
                  onClick={hideTooltip}
                  className="absolute top-1 right-1 p-1 rounded-full hover:bg-black/10 transition-colors"
                >
                  <X size={12} />
                </button>
              )}

              {/* Content */}
              <div className="flex items-start gap-2">
                {showIcon && getIcon()}
                <div className="flex-1">
                  {title && (
                    <div className="font-medium mb-1 flex items-center gap-1">
                      {title}
                    </div>
                  )}
                  <div className="leading-relaxed">
                    {content}
                  </div>
                </div>
              </div>

              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-blue-400/20"
                animate={{
                  borderColor: [
                    'rgba(59, 130, 246, 0.2)',
                    'rgba(59, 130, 246, 0.4)',
                    'rgba(59, 130, 246, 0.2)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpTooltip;