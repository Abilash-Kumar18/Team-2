import React, { useState } from "react";

export default function Login() {
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // inline styles for figma design
  const cardStyle = {
    backgroundColor: "#5FA0A4",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    margin: "auto"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "8px",
    marginTop: "6px",
    marginBottom: "16px",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#333"
  };

  const btnStyle = {
    width: "100%",
    padding: "14px",
    backgroundColor: "#F27474",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px"
  };

  const socialBtnStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ffffff",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f4f7f6", padding: "20px" }}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: "center", color: "#333", fontSize: "28px", marginBottom: "24px", fontWeight: "600" }}>Login</h1>

        {/* Role Toggles */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "24px" }}>
          {["Student", "Faculty", "Organizer"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRole(item)}
              style={{
                flex: 1,
                padding: "10px 5px",
                borderRadius: "6px",
                border: "1px solid white",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: role === item ? "bold" : "normal",
                backgroundColor: role === item ? "white" : "transparent",
                color: role === item ? "#333" : "white",
                transition: "all 0.2s"
              }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} style={{ textAlign: "left" }}>
          <label style={{ color: "#333", fontSize: "14px", fontWeight: "500" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="Enter email"
          />

          <label style={{ color: "#333", fontSize: "14px", fontWeight: "500" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "12px", top: "14px", border: "none", background: "none", cursor: "pointer", fontSize: "16px" }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <a href="#" style={{ color: "#333", fontSize: "12px", textDecoration: "none", fontWeight: "500" }}>Forgot Password?</a>
          </div>

          <button type="submit" style={btnStyle}>Sign In</button>
        </form>

        {/* Social Buttons with Accurate SVGs */}
        <div style={{ marginTop: "24px" }}>
          {/* Google Button */}
          <button style={socialBtnStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61a5.66 5.66 0 0 1-2.45 3.71v3.08h3.95a11.95 11.95 0 0 0 3.63-8.64z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.95-3.08c-1.1.74-2.5 1.18-3.98 1.18-3.07 0-5.67-2.08-6.6-4.88H1.31v3.18A12 12 0 0 0 12 24z"/>
              <path fill="#FBBC05" d="M5.4 14.31A7.16 7.16 0 0 1 5 12c0-.8.14-1.57.4-2.31V6.51H1.31A11.99 11.99 0 0 0 0 12c0 2.22.6 4.3 1.66 6.1l3.74-2.89z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.9 11.9 0 0 0 12 0 12 12 0 0 0 1.31 6.51l4.09 3.19c.93-2.8 3.53-4.95 6.6-4.95z"/>
            </svg>
            Sign In With Google
          </button>

          {/* Apple Button */}
          <button style={socialBtnStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
            </svg>
            Sign In With Apple
          </button>
        </div>

        <p style={{ textAlign: "center", color: "#333", fontSize: "12px", marginTop: "24px", fontWeight: "500" }}>
          If you don't have account{" "}
          <a href="#" style={{ color: "#003366", fontWeight: "bold", textDecoration: "none" }}>Sign Up</a>
        </p>
      </div>
    </div>
  );
}