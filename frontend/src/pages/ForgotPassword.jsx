import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reset code sent to your email!");
    navigate("/verify");
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        
        <div className="header">
          <Link to="/login" className="back-arrow">←</Link>
          <h2>Forgot Password</h2>
        </div>

        <p className="forgot-description">
          Enter your email or phone number to reset your password
        </p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <label className="forgot-label">Email id:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-input"
            placeholder="Enter your email address"
            required
          />

          <button type="submit" className="forgot-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}
