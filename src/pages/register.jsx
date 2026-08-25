import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = (event) => {
    event.preventDefault();

    navigate("/student-dashboard");
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <Link to="/" className="auth-logo">
            <span>C</span>
            <strong>CampusVoice</strong>
          </Link>

          <h1>Create Account</h1>

          <p>
            Register to submit and track your campus concerns.
          </p>

        </div>


        <form className="auth-form" onSubmit={handleRegister}>

          <div className="form-group">

            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label htmlFor="studentId">
              Student ID / Roll No
            </label>

            <input
              id="studentId"
              name="studentId"
              type="text"
              required
              placeholder="STU-2026-001"
              value={formData.studentId}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label htmlFor="registerEmail">
              Email Address
            </label>

            <input
              id="registerEmail"
              name="email"
              type="email"
              required
              placeholder="student@campus.edu"
              value={formData.email}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label htmlFor="registerPassword">
              Password
            </label>

            <input
              id="registerPassword"
              name="password"
              type="password"
              required
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />

          </div>


          <button
            type="submit"
            className="auth-submit"
          >
            Create Account
          </button>

        </form>


        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign In
          </Link>

          <Link to="/" className="back-home">
            Back to CampusVoice
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Register;