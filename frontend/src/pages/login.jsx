import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

import { useNavigate } from 'react-router-dom';
export default function Login() {
const navigate = useNavigate(); // Navigation handle panna variable

  // Sign in click panna run aaga intha function-ah eludhunga
  const handleSignIn = (e) => {
    e.preventDefault(); 
    alert("Sign In Successfully! Opening Dashboard..."); // Click aagudhannu check panna alert
    navigate('/'); // Unga dashboard route path-ku kootitupogum
  };
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          {role === "Student" ? "Login" : role === "Faculty" ? "Faculty Sign In" : "Organizer Login"}
        </h1>

        {/* Role Toggles */}
        <div className="role-toggle-container">
          {["Student", "Faculty", "Organizer"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              className={`role-toggle-btn ${role === item ? "active" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="login-form">
          <label className="login-label">
            {role === "Student" ? "Email" : "Email id:"}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            placeholder={role === "Student" ? "Enter email" : "Enter email id"}
            required
          />

          <label className="login-label">
            {role === "Student" ? "Password" : "Password:"}
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="forgot-password-container">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-submit-btn">Sign In</button>
        </form>

        {/* Social Buttons with Accurate SVGs */}
        <div className="social-buttons-container">
          {/* Google Button */}
          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95a11.95 11.95 0 0 0 3.63-8.64z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.5 1.18-3.98 1.18-3.07 0-5.67-2.08-6.6-4.88H1.31v3.18A12 12 0 0 0 12 24z"/>
              <path fill="#FBBC05" d="M5.4 14.31A7.16 7.16 0 0 1 5 12c0-.8.14-1.57.4-2.31V6.51H1.31A11.99 11.99 0 0 0 0 12c0 2.22.6 4.3 1.66 6.1l3.74-2.89z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.31 6.51l4.09 3.19c.93-2.8 3.53-4.95 6.6-4.95z"/>
            </svg>
            Sign In With Google
          </button>

          {/* Apple Button */}
          <button className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
            </svg>
            Sign In With Apple
          </button>
        </div>

        {role !== "Faculty" && (
          <p className="signup-redirect-text">
            If you don't have account
            <Link to="/signup" className="signup-redirect-link">Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
}