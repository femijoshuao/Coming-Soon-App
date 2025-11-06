import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ComingSoonPage from './components/ComingSoonPage';
import LoginPage from './components/LoginPage';
import FirebaseHealthCheck from './components/FirebaseHealthCheck';

/**
 * Main App component with routing
 * Routes:
 * / - Coming Soon page (public)
 * /login - Admin login page (accessible only via direct URL)
 * /health - Firebase health check (for debugging)
 * /* - Redirect unknown routes to home
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComingSoonPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/health" element={
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
            <FirebaseHealthCheck />
          </div>
        } />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;