import React, { useEffect } from 'react';
import { Brain } from 'lucide-react';
import ParticleBackground from '../../components/Landing/ParticleBackground';
import { useClerk } from '@clerk/clerk-react';

const Login: React.FC = () => {
  const { redirectToSignIn } = useClerk();
  
  useEffect(() => {
    // Redirect to Clerk hosted sign-in
    redirectToSignIn({
      redirectUrl: '/dashboard'
    });
  }, [redirectToSignIn]);
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Loading screen while redirecting to Clerk */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Smart CRM</h1>
          <p className="text-gray-300 text-lg mb-8">Redirecting to secure sign-in...</p>
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Login;