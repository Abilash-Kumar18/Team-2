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
          <Link to="/signup/student" className="role-btn" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Student
          </Link>

          <Link to="/signup/organizer" className="role-btn" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Organizer
          </Link>
        </div>

      </div>
    </div>
  );
}

export default SignUpRole;