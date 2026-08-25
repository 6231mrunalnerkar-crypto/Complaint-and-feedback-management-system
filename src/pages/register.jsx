import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Redirect to student dashboard upon registration
    navigate("/student-dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" }}>
      <div className="complaint-status-card" style={{ width: "100%", maxWidth: "450px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div className="logo-box" style={{ margin: "0 auto 12px auto" }}>C</div>
          <h2>Create Account</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Register to log and track your complaints</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Student ID / Roll No</label>
            <input
              type="text"
              required
              placeholder="STU-2026-001"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="student@campus.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary-large" style={{ width: "100%", border: "none", cursor: "pointer", marginTop: "10px" }}>
            Register
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "0.9rem" }}>
          Already have an account? <Link to="/login" style={{ color: "#2563eb", fontWeight: "600" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;