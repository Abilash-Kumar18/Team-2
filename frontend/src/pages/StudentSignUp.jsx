import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import "./StudentSignUp.css";

export default function StudentSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    deptYear: "",
    email: "",
    mobile: "",
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
      const { name, regNo, deptYear, email, mobile, password } = formData;
      const response = await authService.registerStudent({
        name,
        regNo,
        deptYear,
        email,
        mobileNumber: mobile,
        password,
      });

      // Store token and user data on successful registration
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      alert("Student Account Created Successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        
        <div className="header">
          <Link to="/signup" className="back-arrow">←</Link>
          <h2>Student Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}

          <label className="signup-label">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="signup-input"
            placeholder="Enter your name"
            required
            disabled={loading}
          />

          <label className="signup-label">Reg.No:</label>
          <input
            type="text"
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            className="signup-input"
            placeholder="Enter registration number"
            required
            disabled={loading}
          />

          <label className="signup-label">Dept/Year:</label>
          <input
            type="text"
            name="deptYear"
            value={formData.deptYear}
            onChange={handleChange}
            className="signup-input"
            placeholder="e.g. CSE / III Year"
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
