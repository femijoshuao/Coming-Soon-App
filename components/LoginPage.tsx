import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase-config';
import AdminLogin from './AdminLogin';
import Icon from './Icon';

/**
 * Dedicated login page accessible only via direct URL (/login)
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Access the admin panel to manage your coming soon page
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Icon name="chevron-left" className="w-4 h-4" />
            Back to Homepage
          </button>
        </div>

        {/* Login Component */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
          <AdminLogin onClose={() => navigate('/')} />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          This page is only accessible to authorized administrators
        </div>
      </div>
    </div>
  );
};

export default LoginPage;