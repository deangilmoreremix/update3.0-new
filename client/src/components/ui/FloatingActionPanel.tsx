import React, { useState } from 'react';
import { Plus, Phone, Mail, Calendar, MessageCircle, Zap } from 'lucide-react';

export const FloatingActionPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Phone,
      label: 'Make Call',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Make call')
    },
    {
      icon: Mail,
      label: 'Send Email',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => console.log('Send email')
    },
    {
      icon: Calendar,
      label: 'Schedule Meeting',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => console.log('Schedule meeting')
    },
    {
      icon: MessageCircle,
      label: 'Send Message',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => console.log('Send message')
    },
    {
      icon: Zap,
      label: 'AI Assistant',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      onClick: () => console.log('AI assistant')
    }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="relative">
        {/* Action buttons */}
        {isOpen && (
          <div className="absolute bottom-16 left-0 space-y-3">
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-white shadow-lg transition-all duration-200 hover:scale-105 ${action.color}`}
                  style={{
                    transform: `translateY(-${index * 4}px)`,
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};