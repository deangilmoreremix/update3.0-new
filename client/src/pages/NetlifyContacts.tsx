import React from 'react';

const NetlifyContacts: React.FC = () => {
  return (
    <div className="w-full h-full min-h-screen">
      <iframe
        src="https://taupe-sprinkles-83c9ee.netlify.app"
        className="w-full h-full min-h-screen border-0"
        title="Contacts Page"
        allow="fullscreen"
        style={{ minHeight: 'calc(100vh - 96px)' }}
      />
    </div>
  );
};

export default NetlifyContacts;