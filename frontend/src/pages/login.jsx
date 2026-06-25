import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import "./login.css";
export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const roleMap = {
        Student: "student",
        Faculty: "faculty",
        Organizer: "organizer",
      };

      const response = await authService.login({
        email,
        password,
        role: roleMap[role],
      });

      // Store token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          {error && (
            <div className="error-message" style={{ color: "red", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>
              {error}
            </div>
          )}
          
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
            disabled={loading}
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

          <div className="forgot-password-container">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>



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