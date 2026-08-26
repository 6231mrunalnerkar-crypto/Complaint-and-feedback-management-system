import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    /*
     * Save logged-in user information
     */
    const user = {
      email: formData.email,
      role: formData.role,
    };

    localStorage.setItem("cfms_user", JSON.stringify(user));

    /*
     * Navigate according to selected role
     */
    if (formData.role === "admin") {
      navigate("/admin-dashboard");
    } else if (formData.role === "staff") {
      navigate("/staff-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page login-page">

        <div className="auth-card login-container">

          {/* Back to Home */}
          <div className="auth-top-navigation">
            <Link to="/" className="auth-home-btn">
              ← Home
            </Link>
          </div>

          {/* Header */}
          <div className="auth-header">

            <Link to="/" className="auth-logo">
              <span>C</span>
              <strong>CampusVoice</strong>
            </Link>

            <span className="auth-eyebrow">
              CAMPUSVOICE PORTAL
            </span>

            <h1>
              Welcome Back
            </h1>

            <p>
              Sign in to access your CampusVoice portal.
            </p>

          </div>

          {/* Error */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form
            className="auth-form"
            onSubmit={handleLogin}
          >

            {/* Role */}
            <div className="form-group">

              <label htmlFor="role">
                Login As
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">
                  Student
                </option>

                <option value="staff">
                  Staff
                </option>

                <option value="admin">
                  Administrator
                </option>
              </select>

            </div>

            {/* Email */}
            <div className="form-group">

              <label htmlFor="loginEmail">
                Email Address
              </label>

              <input
                id="loginEmail"
                name="email"
                type="email"
                required
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* Password */}
            <div className="form-group">

              <label htmlFor="loginPassword">
                Password
              </label>

              <input
                id="loginPassword"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
            >
              Sign In
            </button>

          </form>

          {/* Footer */}
          <div className="auth-footer">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </main>
    </>
  );
}

export default Login;