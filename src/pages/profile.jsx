import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Profile.css";

function Profile() {
  const user = (() => {    try {
      const storedUser = localStorage.getItem("cfms_user");

      if (!storedUser) {
        return null;
      }

      const parsedUser = JSON.parse(storedUser);

      return parsedUser && typeof parsedUser === "object"
        ? parsedUser
        : null;
    } catch (error) {
      console.error("Unable to load profile:", error);
      return null;
    }
  });

  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem("cfms_profile_photo") || "";
  });

  const displayName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Student";

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return user?.age || "—";

    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
      return user?.age || "—";
    }

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      localStorage.setItem("cfms_profile_photo", imageData);
      setProfilePhoto(imageData);
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    localStorage.removeItem("cfms_profile_photo");
    setProfilePhoto("");
  };

  if (!user) {
    return (
      <>
        <Navbar />

        <main className="profile-page">
          <div className="profile-empty">
            <span className="profile-eyebrow">CAMPUSVOICE</span>
            <h1>Profile Not Found</h1>
            <p>
              Please log in or register an account to view your profile.
            </p>

            <div className="profile-empty-actions">
              <Link to="/login" className="profile-primary-btn">
                Go to Login
              </Link>

              <Link to="/" className="profile-secondary-btn">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="profile-container">

          {/* Back Navigation */}
          <div className="profile-back-row">
            <Link to="/student-dashboard" className="profile-back-link">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Profile Header */}
          <section className="profile-hero">
            <div className="profile-photo-section">
              <div className="profile-photo-wrapper">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="profile-photo"
                  />
                ) : (
                  <div className="profile-photo-placeholder">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="profile-photo-actions">
                <label htmlFor="profile-photo-input" className="photo-upload-btn">
                  {profilePhoto ? "Change Photo" : "Add Profile Photo"}
                </label>

                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  hidden
                />

                {profilePhoto && (
                  <button
                    type="button"
                    className="photo-remove-btn"
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="profile-hero-info">
              <span className="profile-eyebrow">
                STUDENT PROFILE
              </span>

              <h1>{displayName}</h1>

              <p>
                {user.institution || "Institution not available"}
              </p>

              <span className="profile-role-badge">
                {user.role === "student" ? "Student" : user.role || "Student"}
              </span>
            </div>
          </section>

          {/* Personal Information */}
          <section className="profile-card">
            <div className="profile-card-heading">
              <span className="profile-section-label">
                PERSONAL INFORMATION
              </span>

              <h2>Personal Details</h2>

              <p>
                Information submitted during your CampusVoice registration.
              </p>
            </div>

            <div className="profile-grid">

              <div className="profile-field">
                <span>First Name</span>
                <strong>{user.firstName || "—"}</strong>
              </div>

              <div className="profile-field">
                <span>Last Name</span>
                <strong>{user.lastName || "—"}</strong>
              </div>

              <div className="profile-field">
                <span>Full Name</span>
                <strong>{displayName}</strong>
              </div>

              <div className="profile-field">
                <span>Date of Birth</span>
                <strong>
                  {formatDate(user.dateOfBirth)}
                </strong>
              </div>

              <div className="profile-field">
                <span>Age</span>
                <strong>
                  {calculateAge(user.dateOfBirth)}
                </strong>
              </div>

              <div className="profile-field profile-field-full">
                <span>Address</span>
                <strong>{user.address || "—"}</strong>
              </div>

            </div>
          </section>

          {/* Student Information */}
          <section className="profile-card">
            <div className="profile-card-heading">
              <span className="profile-section-label">
                STUDENT INFORMATION
              </span>

              <h2>Academic Details</h2>

              <p>
                Your registered institution and student identification details.
              </p>
            </div>

            <div className="profile-grid">

              <div className="profile-field">
                <span>Institution</span>
                <strong>{user.institution || "—"}</strong>
              </div>

              <div className="profile-field">
                <span>Roll Number</span>
                <strong>{user.rollNumber || user.id || "—"}</strong>
              </div>

            </div>
          </section>

          {/* Contact Information */}
          <section className="profile-card">
            <div className="profile-card-heading">
              <span className="profile-section-label">
                CONTACT INFORMATION
              </span>

              <h2>Contact Details</h2>

              <p>
                Contact information associated with your student account.
              </p>
            </div>

            <div className="profile-grid">

              <div className="profile-field">
                <span>Email Address</span>
                <strong>{user.email || "—"}</strong>
              </div>

              <div className="profile-field">
                <span>Contact Number</span>
                <strong>{user.contact || "—"}</strong>
              </div>

            </div>
          </section>

          {/* Account Information */}
          <section className="profile-card">
            <div className="profile-card-heading">
              <span className="profile-section-label">
                ACCOUNT INFORMATION
              </span>

              <h2>Account Details</h2>

              <p>
                Basic information about your CampusVoice account.
              </p>
            </div>

            <div className="profile-grid">

              <div className="profile-field">
                <span>Account ID</span>
                <strong>{user.id || "—"}</strong>
              </div>

              <div className="profile-field">
                <span>Account Role</span>
                <strong>
                  {user.role === "student"
                    ? "Student"
                    : user.role || "Student"}
                </strong>
              </div>

              <div className="profile-field">
                <span>Identity Proof</span>

                <strong>
                  {user.identityProof?.name
                    ? `Uploaded: ${user.identityProof.name}`
                    : user.identityProof
                    ? "Uploaded"
                    : "Not available"}
                </strong>
              </div>

              <div className="profile-field">
                <span>Registration Consent</span>

                <strong className="consent-status">
                  {user.consent ? "Provided" : "Not available"}
                </strong>
              </div>

            </div>
          </section>

          {/* Profile Footer Actions */}
          <section className="profile-actions-card">
            <div>
              <span className="profile-section-label">
                CAMPUSVOICE
              </span>

              <h2>Manage Your Account</h2>

              <p>
                Continue managing your complaints and feedback from your
                student dashboard.
              </p>
            </div>

            <div className="profile-actions">
              <Link
                to="/student-dashboard"
                className="profile-primary-btn"
              >
                Student Dashboard
              </Link>

              <Link
                to="/"
                className="profile-secondary-btn"
              >
                Back to Home
              </Link>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="profile-footer">
          <div className="profile-footer-inner">
            <div className="profile-footer-brand">
              <div className="profile-footer-logo">C</div>

              <div>
                <strong>CampusVoice</strong>
                <span>
                  Complaint & Feedback Management System
                </span>
              </div>
            </div>

            <div className="profile-footer-links">
              <Link to="/">Home</Link>
              <Link to="/student-dashboard">Dashboard</Link>
              <Link to="/track-complaint">Track Complaint</Link>
              <Link to="/feedback">Feedback</Link>
              <Link to="/profile">Profile</Link>
            </div>
          </div>

          <div className="profile-footer-bottom">
            <span>CampusVoice Student Portal</span>
            <span>© 2026 CampusVoice</span>
          </div>
        </footer>
      </main>
    </>
  );
}

export default Profile;