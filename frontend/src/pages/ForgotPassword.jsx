import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      localStorage.setItem("resetEmail", email);
      alert("Reset code sent to your email!");
      navigate("/verify");
    } catch (err) {
      setError(err.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}

          <label className="forgot-label">Email id:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-input"
            placeholder="Enter your email address"
            required
            pattern="^[a-zA-Z0-9._%+-]+@(gmail\.com|ksrce\.ac\.in)$"
            title="Email address must end with @gmail.com or @ksrce.ac.in"
            disabled={loading}
          />

          <button type="submit" className="forgot-submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
