import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Verification.css";

export default function Verification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input if a number is typed
    if (value !== "" && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input if backspace is pressed on empty input
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      alert("Please enter the complete 4-digit verification code.");
      return;
    }
    alert("OTP Verified Successfully!");
    navigate("/reset-password");
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        
        <div className="header">
          <Link to="/forgot-password" className="back-arrow">←</Link>
          <h2>Verification</h2>
        </div>

        <p className="verify-description">
          We've sent the code to your phone
        </p>

        <form onSubmit={handleSubmit} className="verify-form">
          <div className="otp-inputs-container">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={inputRefs[index]}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-input-field"
                required
              />
            ))}
          </div>

          <div className="resend-container">
            <span className="resend-text">Didn't receive the code? </span>
            <a href="#" className="resend-link" onClick={(e) => { e.preventDefault(); alert("OTP Resent!"); }}>Resend OTP</a>
          </div>

          <button type="submit" className="verify-submit-btn">Verify</button>
        </form>
      </div>
    </div>
  );
}
