import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/StaffDashboard.css";

function StaffDashboard() {
  return (
    <>
      <Navbar />

      <main className="staff-page">

        <div className="staff-container">

          <div className="staff-header">

            <span className="staff-eyebrow">
              CAMPUSVOICE
            </span>

            <h1>
              Staff Portal
            </h1>

            <p>
              Review assigned complaints and help
              resolve campus concerns.
            </p>

          </div>

          <div className="staff-grid">

            <div className="staff-card">
              <span>ASSIGNED COMPLAINTS</span>
              <strong>0</strong>
              <p>
                Complaints assigned to you.
              </p>
            </div>

            <div className="staff-card">
              <span>PENDING</span>
              <strong>0</strong>
              <p>
                Complaints awaiting action.
              </p>
            </div>

            <div className="staff-card">
              <span>RESOLVED</span>
              <strong>0</strong>
              <p>
                Complaints resolved by staff.
              </p>
            </div>

          </div>

          <div className="staff-panel">

            <h2>
              Staff Workspace
            </h2>

            <p>
              Complaint assignments and resolution
              activities will appear here.
            </p>

          </div>

          <Link
            to="/"
            className="staff-home-link"
          >
            ← Back to Home
          </Link>

        </div>

      </main>
    </>
  );
}

export default StaffDashboard;