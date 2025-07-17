import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Lock, Eye, EyeOff, Mail, User } from 'lucide-react';
import { useFormValidation, commonValidations } from '../../src/hooks/useFormValidation';
import { useLoading } from '../../src/contexts/LoadingContext';
import { useNotifications } from '../../src/contexts/NotificationContext';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { addNotification } = useNotifications();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues: RegisterFormData = {
    firstName: '',
    lastName: '',
    email: '',
    password: 'vr2025', // Pre-fill default password
    confirmPassword: 'vr2025',
  };

  const validationSchema = {
    firstName: commonValidations.name,
    lastName: commonValidations.name,
    email: commonValidations.email,
    password: commonValidations.password,
    confirmPassword: {
      required: true,
      custom: (value: string) => {
        if (value !== values.password) {
          return 'Passwords do not match';
        }
        return null;
      }
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid
  } = useFormValidation(initialValues, validationSchema);

  const onSubmit = async (formValues: RegisterFormData) => {
    setLoading(true, 'data');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password: formValues.password || 'vr2025' // Use default if empty
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store JWT token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Show success message
        addNotification({
          type: 'success',
          title: 'Account Created',
          message: 'Whitelabel partner account created successfully! Redirecting to dashboard...',
          duration: 3000
        });
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        addNotification({
          type: 'error',
          title: 'Registration Failed',
          message: data.error || data.message || 'Failed to create account',
          duration: 5000
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Network Error',
        message: 'Network error. Please try again.',
        duration: 5000
      });
      console.error('Registration error:', error);
    } finally {
      setLoading(false, 'data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a Partner</h1>
          <p className="text-gray-600">All new accounts get full whitelabel partner access</p>
        </div>

        {/* Whitelabel Partner Benefits Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Whitelabel Partner Benefits</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>Full Customization:</strong> Your own branding and domain</p>
                <p>• <strong>Customer Management:</strong> Manage unlimited customers</p>
                <p>• <strong>Revenue Sharing:</strong> Earn from customer subscriptions</p>
                <p>• <strong>Professional Plan:</strong> All premium features included</p>
                <p>• <strong>Default Password:</strong> Use "vr2025" (change after login)</p>
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit);
        }}>
          {/* Display form-level errors */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <ul className="text-red-600 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={values.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 ${
                    touched.firstName && errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="John"
                  required
                />
                {touched.firstName && errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={values.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 ${
                    touched.lastName && errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                  required
                />
                {touched.lastName && errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 ${
                  touched.email && errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="john@company.com"
                required
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password */}
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
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 ${
                  touched.password && errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="vr2025 (default partner password)"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Default password "vr2025" for all partners - you can change this after login
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Partner Account...
              </div>
            ) : (
              <span className="flex items-center">
                <Crown className="w-4 h-4 mr-2" />
                Create Whitelabel Partner Account
              </span>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;