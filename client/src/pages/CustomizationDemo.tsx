import React, { useState } from 'react';
import CustomizeButtonsModal from '../components/ai/CustomizeButtonsModal';

const CustomizationDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          AI Goals Customization Demo
        </h1>
        <p className="text-gray-600 mb-6">
          Click the button below to see the customization modal interface
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Open Customization Modal
        </button>
      </div>

      <CustomizeButtonsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialLocation="contactCards"
        entityType="contact"
      />
    </div>
  );
};

export default CustomizationDemo;