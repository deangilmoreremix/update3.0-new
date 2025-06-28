import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: ReactNode;
}

interface DialogHeaderProps {
  children: ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog content */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className = '', children }: DialogContentProps) {
  return (
    <div className={`bg-white rounded-lg shadow-xl border p-6 ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

interface DialogCloseProps {
  onClick: () => void;
  className?: string;
}

export function DialogClose({ onClick, className = '' }: DialogCloseProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${className}`}
    >
      <X className="h-5 w-5" />
    </button>
  );
}

interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  );
}