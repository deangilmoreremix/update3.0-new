import React from 'react';
import { SignUp, useUser } from '@clerk/clerk-react';
import { Navigate, Link } from 'react-router-dom';
import { Brain, Shield } from 'lucide-react';
import ParticleBackground from '../../components/Landing/ParticleBackground';

const RegisterClerkSimple: React.FC = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Particle background */}
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
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              sign in to existing account
            </Link>
          </p>
        </div>

        {/* Clerk's default SignUp component with custom styling */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100 transform transition-all duration-300 hover:shadow-2xl w-full">
          <SignUp
            path="/register"
            routing="path"
            signInUrl="/login"
            redirectUrl="/dashboard"
            appearance={{
              variables: {
                fontFamily: 'inherit',
                colorPrimary: '#4f46e5',
                colorBackground: 'white',
                borderRadius: '0.375rem'
              },
              elements: {
                formButtonPrimary: 'group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]',
                formFieldInput: 'appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors',
                formFieldLabel: 'block text-sm font-medium text-gray-700 mb-1',
                card: 'shadow-none border-none p-0',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors',
                dividerLine: 'bg-gray-300',
                dividerText: 'text-gray-500 text-sm',
                footerActionLink: 'text-indigo-600 hover:text-indigo-500 transition-colors'
              }
            }}
          />
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

export default RegisterClerkSimple;