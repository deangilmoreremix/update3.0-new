import React, { createContext, useState, useContext, FC } from 'react';

// Lazy load modal components to prevent initial load performance issues
const PipelineModal = React.lazy(() => import('./PipelineModal'));

const ModalsContext = createContext<ModalsContextType | undefined>(undefined);

export const useModals = () => {
  const context = useContext(ModalsContext);
  if (context === undefined) {
    throw new Error('useModals must be used within a ModalsProvider');
  }
  return context;
};

export const ModalsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  const openPipelineModal = () => setIsPipelineModalOpen(true);
  const closePipelineModal = () => setIsPipelineModalOpen(false);

  return (
    <ModalsContext.Provider value={{ openPipelineModal, closePipelineModal }}>
      {children}
      {/* Only render modal when it's open to prevent unnecessary DOM elements */}
      {isPipelineModalOpen && (
        <React.Suspense fallback={null}>
          <PipelineModal isOpen={isPipelineModalOpen} onClose={closePipelineModal} />
        </React.Suspense>
      )}
    </ModalsContext.Provider>
  );
};

export default ModalsProvider;