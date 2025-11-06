import React, { useState, useEffect } from 'react';
import { auth, debugConfig } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Firebase Health Check Component
 * Tests Firebase connectivity and configuration
 */
const FirebaseHealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [details, setDetails] = useState<string[]>([]);

  useEffect(() => {
    const checkFirebaseHealth = async () => {
      const checks: string[] = [];
      let isHealthy = true;

      try {
        // Check 1: Configuration
        if (debugConfig.hasApiKey && debugConfig.hasAuthDomain && debugConfig.hasProjectId && debugConfig.hasAppId) {
          checks.push('✓ Firebase configuration loaded');
        } else {
          checks.push('✗ Firebase configuration incomplete');
          isHealthy = false;
        }

        // Check 2: Auth service
        if (auth) {
          checks.push('✓ Firebase Auth service initialized');
          
          // Check 3: Auth state listener
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              checks.push('✓ User authenticated');
            } else {
              checks.push('• No user authenticated (normal for public access)');
            }
          });

          // Clean up listener after a brief moment
          setTimeout(() => unsubscribe(), 1000);
        } else {
          checks.push('✗ Firebase Auth service not initialized');
          isHealthy = false;
        }

        // Check 4: Network connectivity (basic)
        try {
          const response = await fetch('https://firebase.googleapis.com/');
          if (response.status !== 404) { // 404 is expected for root endpoint
            checks.push('✓ Firebase services reachable');
          }
        } catch (networkError) {
          checks.push('✗ Network connectivity issue');
          isHealthy = false;
        }

        setDetails(checks);
        setStatus(isHealthy ? 'healthy' : 'unhealthy');
      } catch (error) {
        console.error('Health check error:', error);
        checks.push(`✗ Health check failed: ${error}`);
        setDetails(checks);
        setStatus('unhealthy');
      }
    };

    checkFirebaseHealth();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'checking': return 'text-yellow-600';
      case 'healthy': return 'text-green-600';
      case 'unhealthy': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking': return '🔄';
      case 'healthy': return '✅';
      case 'unhealthy': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>{getStatusIcon()}</span>
        Firebase Health Check
      </h3>
      
      <div className={`text-sm font-medium mb-3 ${getStatusColor()}`}>
        Status: {status.toUpperCase()}
      </div>

      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
        {details.map((detail, index) => (
          <div key={index} className="font-mono">
            {detail}
          </div>
        ))}
      </div>

      {status === 'unhealthy' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-red-700 dark:text-red-400 text-sm">
            <strong>Issues detected:</strong> Please check your Firebase configuration and environment variables.
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Add <code>?debug=true</code> to the URL for more debug information.
      </div>
    </div>
  );
};

export default FirebaseHealthCheck;