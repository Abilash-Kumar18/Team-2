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
    if (name === "mobile" || name === "regNo") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Password constraints (advanced requirements)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).");
      return;
    }

    // 2. Passwords matching
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // 3. Name validation (alphabets only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setError("Name must contain only alphabets and spaces.");
      return;
    }

    // 4. Email validation (@gmail.com or @ksrce.ac.in)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|ksrce\.ac\.in)$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email address must end with @gmail.com or @ksrce.ac.in.");
      return;
    }

    // 5. Mobile validation (10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError("Mobile number must be exactly 10 digits.");
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
        mobileNumber: `+91${mobile}`,
        password,
      });

      // Store token and user data on successful registration
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // Auto-login: if token was returned, go straight to dashboard
      if (response.token) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
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
            pattern="[a-zA-Z\s]+"
            title="Name must contain only alphabets and spaces."
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
            pattern="\d+"
            title="Registration number must contain only numbers."
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
            pattern="^[a-zA-Z0-9._%+-]+@(gmail\.com|ksrce\.ac\.in)$"
            title="Email address must end with @gmail.com or @ksrce.ac.in"
            disabled={loading}
          />

          <label className="signup-label">Mobile Number:</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ 
              padding: "10px 14px", 
              background: "rgba(255, 255, 255, 0.05)", 
              border: "1px solid var(--border-color)", 
              borderRadius: "8px", 
              color: "var(--text-secondary)", 
              fontSize: "14px", 
              display: "flex", 
              alignItems: "center" 
            }}>
              +91
            </span>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="signup-input"
              placeholder="Enter 10-digit number"
              required
              pattern="\d{10}"
              title="Mobile number must be exactly 10 digits"
              disabled={loading}
              maxLength="10"
              style={{ flex: 1 }}
            />
          </div>

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
              minLength="8"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
              title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
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
              minLength="8"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
              title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
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
