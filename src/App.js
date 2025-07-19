import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DeliveryForm from './components/DeliveryForm';
import DeliveryReports from './components/DeliveryReports';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('authenticated');
    const loginTime = localStorage.getItem('loginTime');

    if (auth === 'true' && loginTime) {
      const currentTime = Date.now();
      const timeElapsed = currentTime - parseInt(loginTime, 10);

      if (timeElapsed < 30 * 1000) {
        setIsAuthenticated(true); // session still valid within 30 seconds
      } else {
        // session expired
        localStorage.removeItem('authenticated');
        localStorage.removeItem('loginTime');
      }
    }

    setLoading(false); // done checking
  }, []);

  const handleLogin = () => {
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('loginTime', Date.now().toString());
    setIsAuthenticated(true);
  };

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<ProtectedRoute element={<DeliveryForm />} />} />
          <Route path="/reports" element={<ProtectedRoute element={<DeliveryReports />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
