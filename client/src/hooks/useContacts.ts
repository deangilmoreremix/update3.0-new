import { useContactStore } from '../store/contactStore';
import { useMemo } from 'react';

export const useContacts = () => {
  const { contacts: contactsMap, isLoading, error, fetchContacts, createContact, updateContact, deleteContact } = useContactStore();

  // Convert contacts map to array
  const contacts = useMemo(() => {
    return Object.values(contactsMap);
  }, [contactsMap]);

  return {
    contacts,
    isLoading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact
  };
};