import { Link } from "react-router-dom";
import "./SignUpRole.css";

function SignUpRole() {
  return (
    <div className="signup-container">
      <div className="signup-card">

        <div className="header">
          <Link to="/login" className="back-arrow" style={{ textDecoration: "none", color: "inherit" }}>←</Link>
          <h2>Sign Up</h2>
        </div>

        <div className="role-buttons">
          <button className="role-btn">
            Student
          </button>

          <button className="role-btn">
            Organizer
          </button>
        </div>

      </div>
    </div>
  );
}

export default SignUpRole;