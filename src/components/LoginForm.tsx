import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types/auth';

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password || !credentials.role) {
      return;
    }
    
    try {
      await login(credentials);
    } catch (err) {
      // Error is handled by the auth hook
    }
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const demoAccounts = [
    { email: 'admin@university.edu', role: 'admin', label: 'Admin', password: 'demo123' },
    { email: 'coordinator@university.edu', role: 'coordinator', label: 'Coordinator', password: 'demo123' },
    { email: 'guide@university.edu', role: 'guide', label: 'Guide', password: 'demo123' },
    { email: 'student@university.edu', role: 'student', label: 'Student', password: 'demo123' },
    { email: 'ethics@university.edu', role: 'ethics_committee', label: 'Ethics Committee', password: 'demo123' },
    { email: 'examiner@university.edu', role: 'examiner', label: 'Examiner', password: 'demo123' },
  ];

  const fillDemoCredentials = (account: typeof demoAccounts[0]) => {
    setCredentials({
      email: account.email,
      password: account.password,
      role: account.role,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-900">PG Dissertation</h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Secure Access Portal
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Role-based authentication with encrypted credentials and session management.
          </p>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4">Demo Accounts</h3>
            <div className="space-y-2 text-sm">
              {demoAccounts.map((account, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                  onClick={() => fillDemoCredentials(account)}
                >
                  <span className="font-medium text-blue-600">{account.label}</span>
                  <span className="text-gray-500">{account.email}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Click any account to auto-fill credentials</p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Login</h2>
            <p className="text-gray-600">Enter your credentials and select your role</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Role *
              </label>
              <select
                id="role"
                value={credentials.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              >
                <option value="student">Student</option>
                <option value="guide">Guide</option>
                <option value="coordinator">Coordinator</option>
                <option value="admin">Administrator</option>
                <option value="ethics_committee">Ethics Committee</option>
                <option value="examiner">Examiner</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Security Features:</strong> Password encryption, role validation, session tokens, and anti-spoofing protection.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !credentials.email || !credentials.password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Secure Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact{' '}
              <a href="mailto:support@university.edu" className="text-blue-600 hover:text-blue-700 font-medium">
                IT Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};