import React, { useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Navigate, Link } from 'react-router-dom';
import { Brain, ExternalLink, Shield } from 'lucide-react';
import ParticleBackground from '../../components/Landing/ParticleBackground';

const RegisterClerkHosted: React.FC = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { redirectToSignUp } = useClerk();

  useEffect(() => {
    // If Clerk is loaded and user is not signed in, redirect to hosted sign-up
    if (isLoaded && !isSignedIn) {
      redirectToSignUp({
        redirectUrl: window.location.origin + '/dashboard'
      });
    }
  }, [isLoaded, isSignedIn, redirectToSignUp]);

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <ParticleBackground color="#4f46e5" particleCount={30} speed={0.5} />
        
        <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ParticleBackground color="#4f46e5" particleCount={30} speed={0.5} />
      
      {/* Floating icons */}
      <div className="absolute top-20 right-20 opacity-10 animate-float">
        <div className="p-4 bg-white rounded-full shadow-lg">
          <Brain size={30} className="text-indigo-600" />
        </div>
      </div>
      <div className="absolute bottom-20 left-20 opacity-10 animate-float" style={{animationDelay: '1s'}}>
        <div className="p-4 bg-white rounded-full shadow-lg">
          <Shield size={30} className="text-blue-600" />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col justify-center items-center">
        <div>
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg transform transition-all duration-300 hover:scale-110">
              <Brain size={32} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You'll be redirected to complete registration
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl w-full">
          <div className="text-center">
            <div className="mb-4">
              <ExternalLink className="mx-auto h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Click below to sign up securely
            </p>
            <button
              onClick={() => redirectToSignUp({
                redirectUrl: window.location.origin + '/dashboard'
              })}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
            >
              Sign Up
            </button>
            
            <div className="mt-4">
              <Link 
                to="/login" 
                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-px bg-gray-300 w-12"></div>
            <span className="text-sm text-gray-500">Powered by AI</span>
            <div className="h-px bg-gray-300 w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterClerkHosted;