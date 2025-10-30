import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ComingSoonPage from './components/ComingSoonPage';
import LoginPage from './components/LoginPage';

/**
 * Main App component with routing
 * Routes:
 * / - Coming Soon page (public)
 * /login - Admin login page (accessible only via direct URL)
 * /* - Redirect unknown routes to home
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComingSoonPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;