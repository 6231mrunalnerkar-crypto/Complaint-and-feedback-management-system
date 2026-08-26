import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Feedback from './pages/Feedback';
import AdminDashboard from './pages/AdminDashboard';
import GuestComplaint from './pages/GuestComplaint';
import TrackComplaint from './pages/TrackComplaint';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirect to Home */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Complaint & Feedback Routes */}
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/submit-complaint" element={<GuestComplaint />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />
        
        {/* Fallback for invalid URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;