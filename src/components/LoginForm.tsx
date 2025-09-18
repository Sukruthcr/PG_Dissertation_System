import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, GraduationCap, AlertCircle, Shield, Lock, User, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types/auth';

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    role: '',
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
    { 
      email: 'admin@university.edu', 
      role: 'admin', 
      label: 'System Administrator', 
      password: 'SecureAdmin123!',
      description: 'Full system access, user management, all modules'
    },
    { 
      email: 'coordinator@university.edu', 
      role: 'coordinator', 
      label: 'Program Coordinator', 
      password: 'CoordPass456!',
      description: 'Guide assignments, progress monitoring, approvals'
    },
    { 
      email: 'guide@university.edu', 
      role: 'guide', 
      label: 'Research Guide', 
      password: 'GuideSecure789!',
      description: 'Student mentoring, feedback, milestone approval'
    },
    { 
      email: 'student@university.edu', 
      role: 'student', 
      label: 'Graduate Student', 
      password: 'StudentPass123!',
      description: 'Topic submission, progress tracking, publications'
    },
    { 
      email: 'ethics@university.edu', 
      role: 'ethics_committee', 
      label: 'Ethics Committee', 
      password: 'EthicsSecure456!',
      description: 'Ethics review, flagged submissions approval'
    },
    { 
      email: 'examiner@university.edu', 
      role: 'examiner', 
      label: 'External Examiner', 
      password: 'ExaminerPass789!',
      description: 'Dissertation evaluation, final assessment'
    },
  ];

  const fillDemoCredentials = (account: typeof demoAccounts[0]) => {
    setCredentials({
      email: account.email,
      password: account.password,
      role: account.role,
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'coordinator': return '📋';
      case 'guide': return '🎓';
      case 'student': return '📚';
      case 'ethics_committee': return '⚖️';
      case 'examiner': return '🔍';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding & Demo Accounts */}
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
            Multi-role authentication with encrypted credentials, role validation, and session management.
          </p>

          {/* Security Features */}
          <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Security Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-green-600">
                <Lock className="h-4 w-4 mr-2" />
                SHA-256 Password Encryption
              </div>
              <div className="flex items-center text-green-600">
                <Shield className="h-4 w-4 mr-2" />
                Role-Based Access Control
              </div>
              <div className="flex items-center text-green-600">
                <User className="h-4 w-4 mr-2" />
                Anti-Spoofing Protection
              </div>
              <div className="flex items-center text-green-600">
                <Lock className="h-4 w-4 mr-2" />
                Secure Session Tokens
              </div>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-4">Demo Accounts</h3>
            <div className="space-y-3 text-sm max-h-64 overflow-y-auto">
              {demoAccounts.map((account, index) => (
                <div 
                  key={index} 
                  className="flex items-start justify-between p-3 hover:bg-gray-50 rounded cursor-pointer transition-colors border border-gray-100"
                  onClick={() => fillDemoCredentials(account)}
                >
                  <div className="flex items-start">
                    <span className="text-lg mr-3">{getRoleIcon(account.role)}</span>
                    <div>
                      <div className="font-medium text-blue-600">{account.label}</div>
                      <div className="text-gray-500 text-xs">{account.email}</div>
                      <div className="text-gray-400 text-xs mt-1">{account.description}</div>
                    </div>
                  </div>
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
            <p className="text-gray-600">Enter your credentials and select your assigned role</p>
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
                Select Your Role *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  id="role"
                  value={credentials.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Choose your assigned role</option>
                  <option value="admin">👑 System Administrator</option>
                  <option value="coordinator">📋 Program Coordinator</option>
                  <option value="guide">🎓 Research Guide</option>
                  <option value="student">📚 Graduate Student</option>
                  <option value="ethics_committee">⚖️ Ethics Committee</option>
                  <option value="examiner">🔍 External Examiner</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your university email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your secure password"
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">Enhanced Security</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Passwords are encrypted using SHA-256 with salt</li>
                    <li>• Role validation prevents unauthorized access</li>
                    <li>• Account lockout after 5 failed attempts</li>
                    <li>• Secure session tokens with 24-hour validity</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !credentials.email || !credentials.password || !credentials.role}
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