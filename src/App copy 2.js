// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeliveryForm from './components/DeliveryForm';
import DeliveryReports from './components/DeliveryReports';

function App() {
  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<DeliveryForm />} />
          <Route path="/reports" element={<DeliveryReports />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
