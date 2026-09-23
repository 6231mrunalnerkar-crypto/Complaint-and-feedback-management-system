import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import "../styles/TrackComplaint.css";

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
    <div className="track-page">
      <Navbar />

      <main className="track-container">
        <section className="track-header">
          <span className="track-label">COMPLAINT MANAGEMENT</span>
          <h1>Track Complaint</h1>
          <p>
            Enter your Complaint Reference ID to check the latest status and
            resolution progress.
          </p>
        </section>

        <section className="track-card">
          <form onSubmit={handleTrack}>
            <label htmlFor="referenceId">Complaint Reference ID</label>

            <div className="track-input-row">
              <input
                id="referenceId"
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="Example: CMP-2026-ABC123"
              />

              <button type="submit" disabled={loading}>
                {loading ? "Checking..." : "Track Status"}
              </button>
            </div>

            <p className="track-help">
              Use the unique Reference ID provided after submitting your
              complaint.
            </p>
          </form>
        </section>

        {error && (
          <section className="track-result error-result">
            <div className="result-icon">🔍</div>
            <h2>Complaint Not Found</h2>
            <p>{error}</p>
            <p>
              Please check the Reference ID and try again.
            </p>
          </section>
        )}

        {complaint && (
          <section className="track-result success-result">
            <div className="result-top">
              <div>
                <span className="result-label">COMPLAINT FOUND</span>
                <h2>{complaint.title}</h2>
              </div>

              <span className={`status-badge status-${String(
                complaint.status || "Submitted"
              )
                .toLowerCase()
                .replace(/\s+/g, "-")}`}>
                {complaint.status || "Submitted"}
              </span>
            </div>

            <div className="complaint-details">
              <div>
                <span>Reference ID</span>
                <strong>{complaint.referenceId}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{complaint.category || "Other"}</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>{complaint.priority || "Medium"}</strong>
              </div>

              <div>
                <span>Submitted</span>
                <strong>
                  {complaint.createdAt
                    ? new Date(complaint.createdAt).toLocaleDateString()
                    : "—"}
                </strong>
              </div>
            </div>

            <div className="description-box">
              <span>Description</span>
              <p>{complaint.description}</p>
            </div>
          </section>
        )}

        <div className="track-navigation">
          <Link to="/student-dashboard">
            ← Back to Student Dashboard
          </Link>

          <Link to="/">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TrackComplaint;