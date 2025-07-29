import React from 'react';
import Navbar from '../Navbar';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </>
  );
};

export default AuthenticatedLayout;
