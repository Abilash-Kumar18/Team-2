import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import "./OrganizerSignUp.css";

export default function OrganizerSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizerName: "",
    regNo: "",
    email: "",
    mobile: "",
    clubName: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { organizerName, regNo, email, mobile, clubName, password } = formData;
      await authService.registerOrganizer({
        name: organizerName,
        regNo,
        email,
        mobileNumber: mobile,
        clubName,
        password,
      });

      alert("Approval Request Sent Successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        
        <div className="header">
          <Link to="/signup" className="back-arrow">←</Link>
          <h2>Organizer Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}

          <label className="signup-label">Organizer Name:</label>
          <input
            type="text"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            className="signup-input"
            placeholder="Enter organizer/organization name"
            required
            disabled={loading}
          />

          <label className="signup-label">Reg.no:</label>
          <input
            type="text"
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            className="signup-input"
            placeholder="Enter registration/license number"
            required
            disabled={loading}
          />

          <label className="signup-label">Email id:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
            placeholder="Enter email address"
            required
            disabled={loading}
          />

          <label className="signup-label">Mobile Number:</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="signup-input"
            placeholder="Enter mobile number"
            required
            disabled={loading}
          />

          <label className="signup-label">Club Name:</label>
          <input
            type="text"
            name="clubName"
            value={formData.clubName}
            onChange={handleChange}
            className="signup-input"
            placeholder="Enter club name"
            required
            disabled={loading}
          />

          <label className="signup-label">Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="signup-input"
              placeholder="Enter password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
              disabled={loading}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <label className="signup-label">Confirm Password:</label>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="signup-input"
              placeholder="Confirm password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle-btn"
              disabled={loading}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button type="submit" className="signup-submit-btn" disabled={loading}>
            {loading ? "Requesting Approval..." : "Request Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}
