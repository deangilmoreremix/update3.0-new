export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  industry?: string;
  status: 'lead' | 'prospect' | 'customer' | 'churned';
  interestLevel: 'hot' | 'medium' | 'low' | 'cold';
  aiScore?: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}