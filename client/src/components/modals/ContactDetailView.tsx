import React from 'react';
import { Contact } from '../../types/contact';

interface ContactDetailViewProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (contactId: string, updates: Partial<Contact>) => Promise<void>;
}

export const ContactDetailView: React.FC<ContactDetailViewProps> = ({ 
  contact, 
  isOpen, 
  onClose, 
  onUpdate 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{contact.name}</h2>
        <p className="mb-2">Email: {contact.email}</p>
        <p className="mb-2">Company: {contact.company}</p>
        <p className="mb-4">Status: {contact.status}</p>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};