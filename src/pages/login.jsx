import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <Link to="/" className="auth-logo">
            <span>C</span>
            <strong>CampusVoice</strong>
          </Link>

          <h1>Welcome Back</h1>

          <p>
            Sign in to manage your complaints and feedback.
          </p>

        </div>


        <form className="auth-form" onSubmit={handleLogin}>

          <div className="form-group">

            <label htmlFor="role">
              Account Type
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="student">
                Student / User
              </option>

              <option value="admin">
                Administrator
              </option>
            </select>

          </div>


          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              required
              placeholder="student@campus.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

          </div>


          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

          </div>


          <button
            type="submit"
            className="auth-submit"
          >
            Sign In as {role === "admin" ? "Admin" : "Student"}
          </button>

        </form>


        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create an account
          </Link>

          <Link to="/" className="back-home">
            Back to CampusVoice
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Login;