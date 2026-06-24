import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Approval Request Sent Successfully!");
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        
        <div className="header">
          <Link to="/signup" className="back-arrow">←</Link>
          <h2>Organizer Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <label className="signup-label">Organizer Name:</label>
          <input
            type="text"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            className="signup-input"
            placeholder="Enter organizer/organization name"
            required
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
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
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle-btn"
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button type="submit" className="signup-submit-btn">Request Approval</button>
        </form>
      </div>
    </div>
  );
}
