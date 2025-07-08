// Mock database for development - no actual database connection needed for dashboard demo
export const db = {
  // Mock database functions for development
  select: () => ({ from: () => ({ where: () => [] }) }),
  insert: () => ({ values: () => ({ returning: () => [] }) }),
  update: () => ({ set: () => ({ where: () => ({ returning: () => [] }) }) }),
  delete: () => ({ where: () => [] }),
};
