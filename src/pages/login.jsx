import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "20px" }}>
      <div className="complaint-status-card" style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div className="logo-box" style={{ margin: "0 auto 12px auto" }}>C</div>
          <h2>Welcome Back</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Sign in to CampusVoice to manage your complaints</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Account Type</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student / User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="student@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary-large" style={{ width: "100%", border: "none", cursor: "pointer", marginTop: "10px" }}>
            Sign In as {role === "admin" ? "Admin" : "Student"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "0.9rem" }}>
          Don't have an account? <Link to="/register" style={{ color: "#2563eb", fontWeight: "600" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;