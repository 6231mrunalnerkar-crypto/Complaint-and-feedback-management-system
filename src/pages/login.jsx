import React, { useState } from "react";
import "../styles/Auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-box">C</div>
          <h2>Welcome back</h2>
          <p>Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="student@campus.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <a href="/register">Register here</a>
          </p>
          <p>
            <a href="/">← Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;