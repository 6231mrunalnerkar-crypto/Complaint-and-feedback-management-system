import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getStoredComplaints } from "../utils/mockData";

const TrackComplaint = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialId = searchParams.get("id") || "";

  const [searchId, setSearchId] = useState(initialId);
  const [complaint, setComplaint] = useState(null);
  const [searched, setSearched] = useState(false);

  const role =
    localStorage.getItem("userRole") || "guest";

  // =====================================================
  // SEARCH COMPLAINT
  // =====================================================

  const handleSearch = () => {
    const cleanId = searchId.trim();

    if (!cleanId) {
      setComplaint(null);
      setSearched(false);
      return;
    }

    const complaints = getStoredComplaints();

    const found = complaints.find(
      (item) =>
        item.id &&
        item.id.toLowerCase() ===
          cleanId.toLowerCase()
    );

    setComplaint(found || null);
    setSearched(true);
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    if (status === "Resolved") {
      return {
        background: "var(--status-success-bg)",
        color: "var(--success)",
        border: "1px solid var(--status-success-border)",
      };
    }

    if (status === "In Progress") {
      return {
        background: "var(--status-info-bg)",
        color: "var(--primary)",
        border: "1px solid var(--status-info-border)",
      };
    }

    return {
      background: "var(--status-warning-bg)",
      color: "var(--warning)",
      border: "1px solid var(--status-warning-border)",
    };
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="track-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="track-main">

        <div className="track-container">

          {/* HEADER */}

          <div className="track-header">

            <div className="track-eyebrow">
              COMPLAINT TRACKING
            </div>

            <h1>
              Track Complaint Status
            </h1>

            <p>
              Enter your Complaint Reference ID to check
              the latest status and resolution progress.
            </p>

          </div>

          {/* =================================================
              SEARCH CARD
          ================================================= */}

          <div className="track-search-card">

            <label htmlFor="complaintReference">
              Complaint Reference ID
            </label>

            <div className="track-search-row">

              <input
                id="complaintReference"
                type="text"
                placeholder="e.g. CFMS-2026-12345"
                value={searchId}
                onChange={(event) =>
                  setSearchId(event.target.value)
                }
                onKeyDown={handleKeyDown}
              />

              <button
                type="button"
                onClick={handleSearch}
                className="track-button"
              >
                Track Status
              </button>

            </div>

            <p className="track-help">
              Use the unique Reference ID provided after
              submitting your complaint.
            </p>

          </div>

          {/* =================================================
              SEARCH RESULTS
          ================================================= */}

          {searched && (
            <>
              {complaint ? (

                <div className="complaint-result-card">

                  {/* ID + STATUS */}

                  <div className="complaint-top">

                    <span className="complaint-id">
                      {complaint.id}
                    </span>

                    <span
                      className="complaint-status"
                      style={getStatusStyle(
                        complaint.status
                      )}
                    >
                      ● {complaint.status}
                    </span>

                  </div>

                  {/* SUBJECT */}

                  <h2>
                    {complaint.subject}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="complaint-description">
                    {complaint.description}
                  </p>

                  {/* DETAILS */}

                  <div className="complaint-details">

                    <div>
                      <span>
                        Category
                      </span>

                      <strong>
                        {complaint.category ||
                          "General"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Priority
                      </span>

                      <strong>
                        {complaint.priority ||
                          "Medium"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Submitted On
                      </span>

                      <strong>
                        {complaint.date ||
                          "Recent"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Submission Type
                      </span>

                      <strong className="anonymous-text">
                        {complaint.anonymous
                          ? "Anonymous"
                          : "Registered User"}
                      </strong>
                    </div>

                  </div>

                  {/* FEEDBACK */}

                  {complaint.status ===
                    "Resolved" && (

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/feedback?id=${complaint.id}`
                        )
                      }
                      className="feedback-button"
                    >
                      Submit Feedback
                    </button>

                  )}

                </div>

              ) : (

                /* =================================================
                   NOT FOUND
                ================================================= */

                <div className="not-found-card">

                  <div className="not-found-icon">
                    🔍
                  </div>

                  <h2>
                    Complaint Not Found
                  </h2>

                  <p>
                    No complaint was found with Reference
                    ID{" "}
                    <strong>
                      "{searchId}"
                    </strong>
                    .
                    <br />
                    Please check the ID and try again.
                  </p>

                </div>

              )}
            </>
          )}

          {/* =================================================
              NAVIGATION BUTTONS
          ================================================= */}

          <div className="track-navigation">

            {role === "student" && (

              <button
                type="button"
                onClick={() =>
                  navigate("/student-dashboard")
                }
                className="dashboard-button"
              >
                ← Back to Student Dashboard
              </button>

            )}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="home-button"
            >
              ← Back to Home
            </button>

          </div>

        </div>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />

      {/* =================================================
          THEME-AWARE CSS
      ================================================= */}

      <style>{`

        .track-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--background);
          color: var(--text);
          font-family: sans-serif;
          transition:
            background-color 0.25s ease,
            color 0.25s ease;
        }

        .track-main {
          flex: 1;
          padding: 40px 20px;
        }

        .track-container {
          max-width: 700px;
          margin: 0 auto;
        }

        /* ================= HEADER ================= */

        .track-header {
          margin-bottom: 28px;
        }

        .track-eyebrow {
          color: var(--primary);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .track-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--heading);
        }

        .track-header p {
          color: var(--muted);
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
        }

        /* ================= SEARCH CARD ================= */

        .track-search-card {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          transition:
            background-color 0.25s ease,
            border-color 0.25s ease;
        }

        .track-search-card label {
          display: block;
          color: var(--muted);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .track-search-row {
          display: flex;
          gap: 10px;
        }

        .track-search-row input {
          flex: 1;
          min-width: 0;
          padding: 12px 14px;
          background: var(--input-background);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition:
            background-color 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease;
        }

        .track-search-row input::placeholder {
          color: var(--placeholder);
        }

        .track-search-row input:focus {
          border-color: var(--primary);
        }

        .track-button {
          padding: 12px 20px;
          background: var(--primary);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .track-help {
          color: var(--muted);
          font-size: 12px;
          margin: 10px 0 0;
        }

        /* ================= RESULT ================= */

        .complaint-result-card {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 24px;
          border-radius: 12px;
          transition:
            background-color 0.25s ease,
            border-color 0.25s ease;
        }

        .complaint-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .complaint-id {
          color: var(--primary);
          font-weight: 700;
          font-size: 14px;
        }

        .complaint-status {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .complaint-result-card h2 {
          color: var(--heading);
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 10px;
        }

        .complaint-description {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
          margin: 0 0 20px;
        }

        /* ================= DETAILS ================= */

        .complaint-details {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;

          background: var(--surface);
          padding: 16px;
          border-radius: 8px;
          font-size: 13px;
        }

        .complaint-details div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .complaint-details span {
          color: var(--muted);
        }

        .complaint-details strong {
          color: var(--text);
          font-weight: 600;
        }

        .complaint-details .anonymous-text {
          color: var(--success);
        }

        /* ================= FEEDBACK ================= */

        .feedback-button {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          background: var(--primary);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        /* ================= NOT FOUND ================= */

        .not-found-card {
          background: var(--card);
          border: 1px solid var(--border);
          padding: 32px;
          border-radius: 12px;
          text-align: center;
        }

        .not-found-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .not-found-card h2 {
          color: var(--heading);
          font-size: 18px;
          margin: 0 0 8px;
        }

        .not-found-card p {
          color: var(--muted);
          font-size: 13px;
          margin: 0;
          line-height: 1.6;
        }

        .not-found-card strong {
          color: var(--danger);
        }

        /* ================= NAVIGATION ================= */

        .track-navigation {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .dashboard-button {
          flex: 1;
          min-width: 200px;
          padding: 12px;
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .home-button {
          flex: 1;
          min-width: 160px;
          padding: 12px;
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        /* ================= MOBILE ================= */

        @media (max-width: 600px) {

          .track-main {
            padding: 28px 15px;
          }

          .track-header h1 {
            font-size: 24px;
          }

          .track-search-row {
            flex-direction: column;
          }

          .track-button {
            width: 100%;
          }

          .complaint-details {
            grid-template-columns: 1fr;
          }

          .track-navigation {
            flex-direction: column;
          }

          .dashboard-button,
          .home-button {
            width: 100%;
            min-width: 0;
          }

        }

      `}</style>

    </div>
  );
};

export default TrackComplaint;