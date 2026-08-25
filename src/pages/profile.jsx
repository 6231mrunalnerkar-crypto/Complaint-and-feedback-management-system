import { Link } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  return (
    <main className="profile-page">

      <div className="profile-container">

        <div className="profile-header">
          <Link to="/student-dashboard" className="profile-back">
            Back to Dashboard
          </Link>

          <h1>My Profile</h1>

          <p>
            Manage your CampusVoice account information.
          </p>
        </div>


        <div className="profile-card">

          <div className="profile-avatar">
            C
          </div>

          <div className="profile-details">

            <div className="profile-field">
              <span>Full Name</span>
              <strong>Student User</strong>
            </div>

            <div className="profile-field">
              <span>Student ID</span>
              <strong>STU-2026-001</strong>
            </div>

            <div className="profile-field">
              <span>Email Address</span>
              <strong>student@campus.edu</strong>
            </div>

            <div className="profile-field">
              <span>Account Type</span>
              <strong>Student</strong>
            </div>

          </div>

          <div className="profile-actions">
            <Link to="/student-dashboard" className="profile-primary">
              Back to Dashboard
            </Link>

            <Link to="/" className="profile-secondary">
              Home
            </Link>
          </div>

        </div>

      </div>

    </main>
  );
}

export default Profile;