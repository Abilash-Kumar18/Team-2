import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';
import AdminCheckIn from './pages/AdminCheckIn';
import { AuthProvider } from './context/AuthContext';

// Simple placeholder Login page inside App.jsx or pages
const Login = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p>Login functionality boilerplate. Enter email and password to proceed.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/check-in" element={<AdminCheckIn />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
