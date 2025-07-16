import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Brain, Sparkles, ArrowRight } from 'lucide-react';

interface SignInFormData {
  email: string;
  password: string;
}

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectMessage = searchParams.get('message');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Store user data and JWT token
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        
        // Redirect based on user role
        if (data.user.role === 'super_admin' || data.user.isAdmin) {
          navigate('/super-admin-dashboard');
        } else {
          const returnTo = searchParams.get('returnTo') || '/dashboard';
          navigate(returnTo);
        }
      } else {
        // Handle both message and error fields
        setError(data.message || data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = false; // For consistency with dashboard theme

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header with Dashboard Style */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mr-3 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Smart
                </span>
                <span className="text-gray-900">CRM</span>
              </h1>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Access your AI-powered business intelligence dashboard
          </p>
        </div>

        {/* Redirect Message */}
        {redirectMessage && (
          <div className="bg-amber-50/80 backdrop-blur-xl border border-amber-200/50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-amber-800">{redirectMessage}</p>
          </div>
        )}

        {/* Main Sign In Card with Dashboard Glassmorphism */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl p-8">
          {/* Demo Access Section */}
          <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Demo Access</h3>
                <p className="text-sm text-gray-600">Try the platform instantly</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Super Admin Access</p>
                    <p className="text-xs text-gray-600">admin@company.com • password123</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ email: 'admin@company.com', password: 'password123' })}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                  >
                    Use
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SSO Section */}
          <div className="mb-6">
            <a
              href="/api/login"
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg"
            >
              <Shield className="w-5 h-5 mr-2" />
              Continue with Replit SSO
            </a>
            <p className="text-xs text-gray-500 text-center mt-2">
              Supports Google, GitHub, Apple, X, and more
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <ArrowRight className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Create account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-white/50 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-sm font-medium text-gray-900">Enterprise Security</p>
          </div>
          <p className="text-xs text-gray-600">
            Your data is protected with bank-level encryption and security protocols
          </p>
        </div>
      </div>
    </div>
  );
};