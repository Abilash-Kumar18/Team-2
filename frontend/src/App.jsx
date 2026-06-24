import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import SignUpRole from './pages/SignUpRole';
import StudentSignUp from './pages/StudentSignUp';
import OrganizerSignUp from './pages/OrganizerSignUp';
import ForgotPassword from './pages/ForgotPassword';
import Verification from './pages/Verification';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/login.jsx'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpRole />} />
        <Route path="/signup/student" element={<StudentSignUp />} />
        <Route path="/signup/organizer" element={<OrganizerSignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            {/* Matra missing files lam temporary-ah thookiyachu, so error varathu */}
            <Route path="/" element={<Login />} /> 
            <Route path="/login" element={<Login />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;