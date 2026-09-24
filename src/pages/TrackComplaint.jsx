import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import "../styles/ComplaintTracker.css";

const TrackComplaint = () => {
  const [referenceId, setReferenceId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    const id = referenceId.trim();

    if (!id) {
      setError("Please enter a complaint reference ID.");
      setComplaint(null);
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const response = await api.get(
        `/complaints/track/${encodeURIComponent(id)}`
      );

      setComplaint(response.complaint || response.data || response);
    } catch (err) {
      console.error("Track complaint error:", err);
      setError(err.message || "Complaint not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="complaint-tracker-section">
        <div className="tracker-container">

          {/* HEADER */}
          <div className="tracker-heading">
            <span>COMPLAINT MANAGEMENT</span>

            <h2>
              Track <strong>Complaint</strong>
            </h2>

            <p>
              Enter your Complaint Reference ID to check the latest status
              and resolution progress.
            </p>
          </div>

          {/* TRACKING CARD */}
          <div className="tracker-card">
            <form className="tracker-form" onSubmit={handleTrack}>

              <div className="tracker-field">
                <label htmlFor="referenceId">
                  COMPLAINT REFERENCE ID
                </label>

                <input
                  id="referenceId"
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="Example: CMP-2026-ABC123"
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Checking..." : "Track Status"}
              </button>

            </form>

            <p
              style={{
                marginTop: "10px",
                color: "var(--text-secondary)",
                fontSize: "10px",
              }}
            >
              Use the unique Reference ID provided after submitting your
              complaint.
            </p>

            {/* ERROR */}
            {error && (
              <div className="tracker-error">
                {error}
              </div>
            )}

            {/* RESULT */}
            {complaint && (
              <div className="tracker-result">

                <div className="tracker-result-title">
                  <span>COMPLAINT FOUND</span>

                  <strong>
                    {complaint.referenceId || referenceId}
                  </strong>
                </div>

                <div className="tracker-details">

                  <div>
                    <span>Title</span>
                    <strong>
                      {complaint.title || "Complaint"}
                    </strong>
                  </div>

                  <div>
                    <span>Category</span>
                    <strong>
                      {complaint.category || "Other"}
                    </strong>
                  </div>

                  <div>
                    <span>Priority</span>
                    <strong>
                      {complaint.priority || "Medium"}
                    </strong>
                  </div>

                  <div>
                    <span>Submitted</span>
                    <strong>
                      {complaint.createdAt
                        ? new Date(
                            complaint.createdAt
                          ).toLocaleDateString()
                        : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong className="tracker-status">
                      {complaint.status || "Submitted"}
                    </strong>
                  </div>

                </div>

                {/* DESCRIPTION */}
                <div
                  style={{
                    paddingTop: "12px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "9px",
                    }}
                  >
                    DESCRIPTION
                  </span>

                  <p
                    style={{
                      marginTop: "6px",
                      color: "var(--text)",
                      fontSize: "11px",
                      lineHeight: "1.6",
                    }}
                  >
                    {complaint.description || "No description available."}
                  </p>
                </div>

                {/* PROGRESS */}
                <div className="tracker-progress">

                  <div className="tracker-progress-label">
                    <span>Resolution Progress</span>

                    <strong>
                      {complaint.status === "Resolved"
                        ? "100%"
                        : complaint.status === "In Progress"
                        ? "65%"
                        : "30%"}
                    </strong>
                  </div>

                  <div className="tracker-progress-bar">
                    <div
                      className={
                        complaint.status === "Resolved"
                          ? "progress-complete"
                          : complaint.status === "In Progress"
                          ? "progress-active"
                          : "progress-pending"
                      }
                    ></div>
                  </div>

                </div>

              </div>
            )}
          </div>

          {/* NAVIGATION */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "25px",
              fontSize: "12px",
            }}
          >
            <Link
              to="/student-dashboard"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              ← Back to Student Dashboard
            </Link>

            <Link
              to="/"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TrackComplaint;