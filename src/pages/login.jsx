import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loginCode: "",
    role: "student",
  });

  const [error, setError] = useState("");

  // ================= HANDLE CHANGE =================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ================= NORMAL LOGIN =================

  const handleLogin = (event) => {
    event.preventDefault();

    const email = formData.email.trim();

    // ================= STUDENT LOGIN =================

    if (formData.role === "student") {
      if (!email || !formData.password.trim()) {
        setError(
          "Please enter your email and password."
        );
        return;
      }

      const user = {
        email,
        role: "student",
      };

      localStorage.setItem(
        "cfms_user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "userRole",
        "student"
      );

      navigate("/student-dashboard");

      return;
    }

    // ================= STAFF / ADMIN LOGIN =================

    if (!email || !formData.loginCode.trim()) {
      setError(
        "Please enter your email and unique login code."
      );
      return;
    }

    const user = {
      email,
      role: formData.role,
      loginCode: formData.loginCode.trim(),
    };

    localStorage.setItem(
      "cfms_user",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "userRole",
      formData.role
    );

    // ================= ROLE NAVIGATION =================

    if (formData.role === "staff") {
      navigate("/staff-dashboard");
    }

    if (formData.role === "admin") {
      navigate("/admin-dashboard");
    }
  };

  // ================= GUEST LOGIN =================

  const handleGuestLogin = () => {
    localStorage.removeItem("cfms_user");

    localStorage.setItem(
      "userRole",
      "guest"
    );

    const guestUser = {
      role: "guest",
      anonymous: true,
    };

    localStorage.setItem(
      "cfms_user",
      JSON.stringify(guestUser)
    );

    navigate("/guest-dashboard");
  };

  // ================= ROLE =================

  const isStudent =
    formData.role === "student";

  const isStaff =
    formData.role === "staff";

  const isAdmin =
    formData.role === "admin";

  return (
    <>
      <Navbar />

      <main className="auth-page login-page">
        <div className="auth-card login-container">

          {/* ================= BACK HOME ================= */}

          <div className="auth-top-navigation">
            <Link
              to="/"
              className="auth-home-btn"
            >
              ← Home
            </Link>
          </div>

          {/* ================= HEADER ================= */}

          <div className="auth-header">

            <Link
              to="/"
              className="auth-logo"
            >
              <span>C</span>
              <strong>CampusVoice</strong>
            </Link>

            <span className="auth-eyebrow">
              CAMPUSVOICE PORTAL
            </span>

            <h1>
              {isStudent
                ? "Student Login"
                : isStaff
                ? "Staff Login"
                : "Administrator Login"}
            </h1>

            <p>
              {isStudent
                ? "Sign in to access your student portal."
                : isStaff
                ? "Authorized staff members can access the portal using their registered email and unique login code."
                : "Authorized administrators can access the management portal using their registered email and unique login code."}
            </p>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}

          <form
            className="auth-form"
            onSubmit={handleLogin}
          >

            {/* ================= ROLE ================= */}

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

            {/* ================= EMAIL ================= */}

            <div className="form-group">

              <label htmlFor="loginEmail">
                Email Address
              </label>

              <input
                id="loginEmail"
                name="email"
                type="email"
                required
                placeholder={
                  isStudent
                    ? "Enter your student email"
                    : isStaff
                    ? "Enter your staff email"
                    : "Enter your administrator email"
                }
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* =================================================
                STUDENT PASSWORD ONLY
            ================================================= */}

            {isStudent && (
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
            )}

            {/* =================================================
                STAFF / ADMIN UNIQUE CODE ONLY
            ================================================= */}

            {!isStudent && (
              <div className="form-group">

                <label htmlFor="loginCode">
                  Unique Login Code
                </label>

                <input
                  id="loginCode"
                  name="loginCode"
                  type="text"
                  required
                  placeholder={
                    isStaff
                      ? "Enter staff unique login code"
                      : "Enter administrator unique login code"
                  }
                  value={formData.loginCode}
                  onChange={handleChange}
                  autoComplete="off"
                />

                <small
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#6b7280",
                    fontSize: "11px",
                    lineHeight: "1.5",
                  }}
                >
                  {isStaff
                    ? "This code is provided only to authorized staff members."
                    : "This code is provided only to authorized administrators."}
                </small>

              </div>
            )}

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              className="auth-submit"
            >
              {isStudent
                ? "Sign In"
                : "Access Portal"}
            </button>

          </form>

          {/* =================================================
              STUDENT ONLY SECTION
          ================================================= */}

          {isStudent && (
            <>
              {/* ================= DIVIDER ================= */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  margin: "22px 0",
                  color: "#6b7280",
                  fontSize: "12px",
                }}
              >

                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "#374151",
                  }}
                />

                <span>OR</span>

                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "#374151",
                  }}
                />

              </div>

              {/* ================= GUEST ACCESS ================= */}

              <div
                style={{
                  padding: "16px",
                  background:
                    "rgba(56, 189, 248, 0.06)",
                  border:
                    "1px solid rgba(56, 189, 248, 0.2)",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              >

                <div
                  style={{
                    color: "#38bdf8",
                    fontSize: "13px",
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                >
                  🔒 Anonymous Guest Access
                </div>

                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    margin: "0 0 14px",
                  }}
                >
                  No account, name, email, password,
                  or registration is required. Submit
                  complaints and feedback anonymously.
                </p>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  style={{
                    width: "100%",
                    padding: "11px",
                    background: "transparent",
                    color: "#38bdf8",
                    border:
                      "1px solid rgba(56, 189, 248, 0.4)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Continue as Guest
                </button>

              </div>

              {/* ================= STUDENT REGISTER ================= */}

              <div className="auth-footer">

                <span>
                  Don't have an account?
                </span>

                <Link to="/register">
                  Create Account
                </Link>

              </div>
            </>
          )}

          {/* =================================================
              STAFF / ADMIN NOTICE
          ================================================= */}

          {!isStudent && (
            <div
              style={{
                marginTop: "22px",
                padding: "14px 16px",
                background:
                  "rgba(251, 191, 36, 0.06)",
                border:
                  "1px solid rgba(251, 191, 36, 0.2)",
                borderRadius: "8px",
              }}
            >

              <div
                style={{
                  color: "#fbbf24",
                  fontSize: "12px",
                  fontWeight: "700",
                  marginBottom: "5px",
                }}
              >
                🔐 AUTHORIZED ACCESS ONLY
              </div>

              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "11px",
                  lineHeight: "1.5",
                }}
              >
                {isStaff
                  ? "Staff accounts are created and managed by the campus administration."
                  : "Administrator access is restricted to authorized system administrators."}
              </div>

            </div>
          )}

        </div>
      </main>
    </>
  );
}

export default Login;