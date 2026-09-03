import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Auth.css";

function Register() {
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

  const navigate = useNavigate();

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : "";
  };

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

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
        [name]: files[0] || null,
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!formData.consent) {
      alert("Please provide your consent before creating an account.");
      return;
    }

    /*
      Store the complete student profile information.

      The actual identity-proof file is NOT stored in localStorage.
      Only its filename is retained so the profile can indicate
      that a document was submitted.
    */
    const studentUser = {
      role: "student",

      id: formData.rollNumber,

      firstName: formData.firstName,
      lastName: formData.lastName,

      name: `${formData.firstName} ${formData.lastName}`.trim(),

      institution: formData.institution,

      dateOfBirth: formData.dateOfBirth,
      age: formData.age,

      address: formData.address,

      rollNumber: formData.rollNumber,

      email: formData.email,

      contact: formData.contact,

      identityProofName: formData.identityProof
        ? formData.identityProof.name
        : "",

      identityProofSubmitted: Boolean(formData.identityProof),

      accountStatus: "Active",

      registeredOn: new Date().toISOString().split("T")[0],
    };

    localStorage.setItem(
      "cfms_user",
      JSON.stringify(studentUser)
    );

    /*
      Profile photo is deliberately NOT created here.
      It will be managed separately from the Profile page.
    */

    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <main className="auth-page register-page">
        <div className="auth-card register-card">

          <div className="auth-top-navigation">
            <Link to="/" className="auth-home-btn">
              ← Home
            </Link>
          </div>

          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span>C</span>
              <strong>CampusVoice</strong>
            </Link>

            <span className="auth-eyebrow">
              STUDENT REGISTRATION
            </span>

            <h1>Create Account</h1>

            <p>
              Register your account to submit and track
              campus complaints and feedback.
            </p>
          </div>

          <form
            className="auth-form register-form"
            onSubmit={handleRegister}
          >

            {/* PERSONAL INFORMATION */}

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
                  value={
                    formData.age
                      ? `${formData.age} years`
                      : ""
                  }
                  placeholder="Automatically calculated"
                  readOnly
                />
              </div>

            </div>

            {/* CONTACT INFORMATION */}

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />

              <small className="field-help">
                Password must contain at least 6 characters.
              </small>
            </div>

            {/* IDENTITY VERIFICATION */}

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
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleChange}
              />

              <small className="field-help">
                Upload a valid college ID card in JPG, PNG, or PDF format.
              </small>
            </div>

            {/* CONSENT */}

            <div className="consent-box">
              <label className="consent-label">

                <input
                  type="checkbox"
                  name="consent"
                  required
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
          </div>

        </div>
      </main>
    </>
  );
}

export default Register;