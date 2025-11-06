import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Helper function to get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  // Check both import.meta.env (Vite) and process.env (Node.js environments)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  // Fallback for other environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID')
};

// Validate Firebase configuration (only in browser to avoid SSR issues)
if (isBrowser) {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration:', missingFields);
    console.error('Current config:', {
      ...firebaseConfig,
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.slice(0, 8)}...` : 'missing'
    });
    
    // In development, throw error. In production, just log warning
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Missing Firebase environment variables: ${missingFields.join(', ')}`);
    } else {
      console.warn(`Missing Firebase environment variables: ${missingFields.join(', ')}`);
    }
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Get the site ID from environment variable (unique for each website)
export const SITE_ID = getEnvVar('VITE_SITE_ID', 'default');

// Export config for debugging
export const debugConfig = {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasAppId: !!firebaseConfig.appId,
  siteId: SITE_ID
};
