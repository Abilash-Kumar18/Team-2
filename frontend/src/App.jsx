import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login.jsx'; 

function App() {
  return (
    <Router>
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