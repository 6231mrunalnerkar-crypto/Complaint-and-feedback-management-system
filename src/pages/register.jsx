import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Auth.css";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    institution: "",
    dateOfBirth: "",
    age: "",
    address: "",
    rollNumber: "",
    email: "",
    contact: "",
    password: "",
    identityProof: null,
    consent: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= CALCULATE AGE =================

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : "";
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = event.target;

    setError("");

    if (name === "dateOfBirth") {
      setFormData((previous) => ({
        ...previous,
        dateOfBirth: value,
        age: calculateAge(value),
      }));

      return;
    }

    if (type === "checkbox") {
      setFormData((previous) => ({
        ...previous,
        [name]: checked,
      }));

      return;
    }

    if (type === "file") {
      setFormData((previous) => ({
        ...previous,
        [name]: files?.[0] || null,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================= REGISTER =================

  const handleRegister = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!formData.consent) {
      setError(
        "Please provide your consent before creating an account."
      );
      return;
    }

    if (!formData.identityProof) {
      setError(
        "Please upload a valid proof of identity."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ================= BACKEND REGISTRATION =================

      const response = await api.post(
        "/auth/register",
        {
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          name:
            `${formData.firstName} ${formData.lastName}`.trim(),

          institution:
            formData.institution.trim(),

          dateOfBirth:
            formData.dateOfBirth,

          age:
            formData.age,

          address:
            formData.address.trim(),

          rollNumber:
            formData.rollNumber.trim(),

          email:
            formData.email.trim(),

          contact:
            formData.contact.trim(),

          password:
            formData.password,

          identityProofName:
            formData.identityProof.name,

          identityProofSubmitted:
            Boolean(formData.identityProof),

          consent:
            formData.consent,
        }
      );

      const data = response?.data || {};

      // ================= TOKEN =================

      const token =
        data.token ||
        data.accessToken ||
        data.jwt;

      // ================= USER =================

      const user =
        data.user ||
        data.account ||
        data.profile;

      /*
        Some registration APIs may return only a
        success message and require the user to login.
        Therefore token/user are handled when available.
      */

      if (token) {
        localStorage.setItem(
          "cfms_token",
          token
        );
      }

      if (user) {
        localStorage.setItem(
          "cfms_user",
          JSON.stringify(user)
        );

        localStorage.setItem(
          "userRole",
          user.role || "student"
        );
      }

      // ================= SUCCESS =================

      alert(
        "Account created successfully. Please sign in."
      );

      navigate("/login");
    } catch (err) {
      console.error(
        "Registration failed:",
        err
      );

      setError(
        err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page register-page">
        <div className="auth-card register-card">

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
              STUDENT REGISTRATION
            </span>

            <h1>
              Create Account
            </h1>

            <p>
              Register your account to submit and track
              campus complaints and feedback.
            </p>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* ================= FORM ================= */}

          <form
            className="auth-form register-form"
            onSubmit={handleRegister}
          >

            {/* ================= PERSONAL INFORMATION ================= */}

            <div className="form-section-title">
              Personal Information
            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="firstName">
                  First Name <span>*</span>
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name <span>*</span>
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  disabled={loading}
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-group">

              <label htmlFor="institution">
                College / Institution <span>*</span>
              </label>

              <input
                id="institution"
                name="institution"
                type="text"
                required
                disabled={loading}
                placeholder="Enter your college or institution"
                value={formData.institution}
                onChange={handleChange}
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="dateOfBirth">
                  Date of Birth <span>*</span>
                </label>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  disabled={loading}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label htmlFor="age">
                  Age
                </label>

                <input
                  id="age"
                  name="age"
                  type="text"
                  readOnly
                  value={
                    formData.age
                      ? `${formData.age} years`
                      : ""
                  }
                  placeholder="Automatically calculated"
                />

              </div>

            </div>

            {/* ================= CONTACT INFORMATION ================= */}

            <div className="form-section-title">
              Contact Information
            </div>

            <div className="form-group">

              <label htmlFor="address">
                Address <span>*</span>
              </label>

              <textarea
                id="address"
                name="address"
                required
                disabled={loading}
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={handleChange}
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="rollNumber">
                  Desired Roll Number <span>*</span>
                </label>

                <input
                  id="rollNumber"
                  name="rollNumber"
                  type="text"
                  required
                  disabled={loading}
                  placeholder="e.g. STU-2026-001"
                  value={formData.rollNumber}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label htmlFor="contact">
                  Contact Number <span>*</span>
                </label>

                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  disabled={loading}
                  placeholder="10-digit mobile number"
                  value={formData.contact}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="form-group">

              <label htmlFor="registerEmail">
                Email Address <span>*</span>
              </label>

              <input
                id="registerEmail"
                name="email"
                type="email"
                required
                disabled={loading}
                placeholder="student@campus.edu"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            <div className="form-group">

              <label htmlFor="registerPassword">
                Password <span>*</span>
              </label>

              <input
                id="registerPassword"
                name="password"
                type="password"
                required
                minLength="6"
                disabled={loading}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />

              <small className="field-help">
                Password must contain at least 6 characters.
              </small>

            </div>

            {/* ================= IDENTITY VERIFICATION ================= */}

            <div className="form-section-title">
              Identity Verification
            </div>

            <div className="form-group">

              <label htmlFor="identityProof">
                Proof of Identity <span>*</span>
              </label>

              <input
                id="identityProof"
                name="identityProof"
                type="file"
                required
                disabled={loading}
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
              />

              <small className="field-help">
                Upload a valid college ID card in JPG,
                PNG, or PDF format.
              </small>

              {formData.identityProof && (
                <small className="field-help">
                  Selected:{" "}
                  {formData.identityProof.name}
                </small>
              )}

            </div>

            {/* ================= CONSENT ================= */}

            <div className="consent-box">

              <label className="consent-label">

                <input
                  type="checkbox"
                  name="consent"
                  required
                  disabled={loading}
                  checked={formData.consent}
                  onChange={handleChange}
                />

                <span>
                  I give my consent to CampusVoice to collect,
                  store, and use the information provided in this
                  registration form for account creation,
                  authentication, complaint management, and
                  communication related to the services.
                </span>

              </label>

            </div>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* ================= FOOTER ================= */}

          <div className="auth-footer">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign In
            </Link>

          </div>

        </div>
      </main>
    </>
  );
}

export default Register;