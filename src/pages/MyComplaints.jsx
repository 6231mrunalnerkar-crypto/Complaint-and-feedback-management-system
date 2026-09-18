import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { getStoredComplaints } from "../utils/mockData";
import { hasSubmittedFeedback } from "../utils/feedbackData";

const MyComplaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);

  const [user] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("cfms_user") || "null"
      );
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const loadComplaints = () => {
      setComplaints(getStoredComplaints());
    };

    loadComplaints();

    window.addEventListener(
      "cfms-complaints-updated",
      loadComplaints
    );

    return () => {
      window.removeEventListener(
        "cfms-complaints-updated",
        loadComplaints
      );
    };
  }, []);

  /* =========================================
     STUDENT COMPLAINTS ONLY
  ========================================= */

  const studentComplaints = useMemo(() => {
    const studentName =
      user?.name ||
      user?.fullName ||
      `${user?.firstName || ""} ${
        user?.lastName || ""
      }`.trim();

    return complaints
      .filter((complaint) => {
        // Never show anonymous complaints
        // in student's personal complaint list.
        if (complaint.anonymous) {
          return false;
        }

        return (
          complaint.submittedBy === studentName ||
          complaint.studentId === user?.studentId ||
          complaint.email === user?.email
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt || a.date || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || b.date || 0
        ).getTime();

        return dateB - dateA;
      });
  }, [complaints, user]);

  /* =========================================
     STATUS
  ========================================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
      case "Resolved":
        return "status completed";

      case "In Progress":
      case "In-Progress":
        return "status progress";

      case "Pending":
      default:
        return "status pending";
    }
  };

  /* =========================================
     PRIORITY
  ========================================= */

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "priority high";

      case "Low":
        return "priority low";

      case "Medium":
      default:
        return "priority medium";
    }
  };

  return (
    <>
      <Navbar />

      <div className="my-complaints-page">

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="page-container">

          <div className="page-header">

            <div>

              <span className="page-eyebrow">
                STUDENT PORTAL
              </span>

              <h1>
                My Complaints
              </h1>

              <p>
                View and track all complaints submitted
                through your student account.
              </p>

            </div>

            <button
              type="button"
              className="new-complaint-btn"
              onClick={() =>
                navigate("/student-dashboard")
              }
            >
              ← Dashboard
            </button>

          </div>


          {/* =========================================
              SUMMARY
          ========================================= */}

          <div className="summary-card">

            <div className="summary-item">

              <span>
                Total
              </span>

              <strong>
                {studentComplaints.length}
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Pending
              </span>

              <strong>
                {
                  studentComplaints.filter(
                    (complaint) =>
                      complaint.status ===
                      "Pending"
                  ).length
                }
              </strong>

            </div>


            <div className="summary-item">

              <span>
                In Progress
              </span>

              <strong>
                {
                  studentComplaints.filter(
                    (complaint) =>
                      complaint.status ===
                        "In Progress" ||
                      complaint.status ===
                        "In-Progress"
                  ).length
                }
              </strong>

            </div>


            <div className="summary-item">

              <span>
                Completed
              </span>

              <strong>
                {
                  studentComplaints.filter(
                    (complaint) =>
                      complaint.status ===
                        "Completed" ||
                      complaint.status ===
                        "Resolved"
                  ).length
                }
              </strong>

            </div>

          </div>


          {/* =========================================
              COMPLAINT LIST
          ========================================= */}

          {studentComplaints.length === 0 ? (

            <div className="empty-card">

              <div className="empty-icon">
                📋
              </div>

              <h2>
                No complaints found
              </h2>

              <p>
                You have not submitted any complaints
                from this student account yet.
              </p>

              <button
                type="button"
                className="new-complaint-btn"
                onClick={() =>
                  navigate("/student-dashboard")
                }
              >
                Go to Dashboard
              </button>

            </div>

          ) : (

            <div className="complaints-list">

              {studentComplaints.map(
                (complaint) => {

                  const isCompleted =
                    complaint.status ===
                      "Completed" ||
                    complaint.status ===
                      "Resolved";

                  const feedbackDone =
                    hasSubmittedFeedback(
                      complaint.id
                    );

                  return (

                    <div
                      className="complaint-card"
                      key={complaint.id}
                    >

                      {/* LEFT */}

                      <div className="complaint-main">

                        <div className="complaint-top">

                          <span className="complaint-id">
                            {complaint.id}
                          </span>

                          <span
                            className={getPriorityClass(
                              complaint.priority
                            )}
                          >
                            {complaint.priority ||
                              "Medium"}
                          </span>

                        </div>


                        <h2>
                          {complaint.title ||
                            complaint.subject ||
                            "Untitled Complaint"}
                        </h2>


                        <p>
                          {complaint.description ||
                            "No description provided."}
                        </p>


                        <div className="complaint-meta">

                          <span>
                            Category:{" "}
                            <strong>
                              {complaint.category ||
                                "General"}
                            </strong>
                          </span>

                          <span>
                            Date:{" "}
                            <strong>
                              {complaint.date ||
                                "—"}
                            </strong>
                          </span>

                        </div>

                      </div>


                      {/* RIGHT */}

                      <div className="complaint-actions">

                        <span
                          className={getStatusClass(
                            complaint.status
                          )}
                        >
                          {complaint.status ||
                            "Pending"}
                        </span>


                        <Link
                          to={`/track-complaint?id=${complaint.id}`}
                          className="track-btn"
                        >
                          Track Complaint
                        </Link>


                        {isCompleted &&
                          !feedbackDone && (

                            <Link
                              to={`/student-feedback?id=${complaint.id}`}
                              className="feedback-btn"
                            >
                              Give Feedback
                            </Link>

                          )}


                        {isCompleted &&
                          feedbackDone && (

                            <span className="feedback-submitted">
                              ✓ Feedback Submitted
                            </span>

                          )}


                        {!isCompleted && (

                          <span className="feedback-unavailable">
                            Feedback after resolution
                          </span>

                        )}

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </div>

      </div>


      {/* =========================================
          PAGE STYLES
      ========================================= */}

      <style>{`

        .my-complaints-page {
          min-height: calc(100vh - 64px);
          background: #030712;
          color: #ffffff;
          padding: 42px 20px 60px;
          box-sizing: border-box;
        }

        .page-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .page-eyebrow {
          display: inline-block;
          color: #34d399;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.8px;
          margin-bottom: 8px;
        }

        .page-header h1 {
          margin: 0;
          font-size: 32px;
          line-height: 1.2;
        }

        .page-header p {
          margin: 9px 0 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
        }

        .new-complaint-btn {
          border: 1px solid #263b47;
          background: #0b1620;
          color: #dbeafe;
          border-radius: 9px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .new-complaint-btn:hover {
          border-color: #10b981;
          color: #34d399;
        }

        .summary-card {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #0b1620;
          border: 1px solid #1f3440;
          border-radius: 14px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .summary-item {
          padding: 20px;
          border-right: 1px solid #1f3440;
        }

        .summary-item:last-child {
          border-right: none;
        }

        .summary-item span {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 6px;
        }

        .summary-item strong {
          font-size: 25px;
          color: #ffffff;
        }

        .complaints-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .complaint-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          padding: 21px;
          background: #0b1620;
          border: 1px solid #1f3440;
          border-radius: 14px;
        }

        .complaint-main {
          flex: 1;
          min-width: 0;
        }

        .complaint-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 7px;
        }

        .complaint-id {
          color: #38bdf8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .5px;
        }

        .priority {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
        }

        .priority.high {
          color: #fca5a5;
          background: rgba(239, 68, 68, .12);
        }

        .priority.medium {
          color: #fcd34d;
          background: rgba(245, 158, 11, .12);
        }

        .priority.low {
          color: #86efac;
          background: rgba(34, 197, 94, .12);
        }

        .complaint-card h2 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 17px;
        }

        .complaint-card p {
          margin: 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .complaint-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 13px;
          color: #64748b;
          font-size: 11px;
        }

        .complaint-meta strong {
          color: #cbd5e1;
        }

        .complaint-actions {
          min-width: 190px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }

        .status {
          display: inline-flex;
          justify-content: center;
          padding: 7px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          border: 1px solid transparent;
        }

        .status.pending {
          color: #fbbf24;
          background: rgba(251, 191, 36, .08);
          border-color: rgba(251, 191, 36, .18);
        }

        .status.progress {
          color: #38bdf8;
          background: rgba(56, 189, 248, .08);
          border-color: rgba(56, 189, 248, .18);
        }

        .status.completed {
          color: #34d399;
          background: rgba(16, 185, 129, .08);
          border-color: rgba(16, 185, 129, .18);
        }

        .track-btn,
        .feedback-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 9px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
        }

        .track-btn {
          color: #38bdf8;
          background: #111827;
          border: 1px solid #263b47;
        }

        .track-btn:hover {
          border-color: #38bdf8;
        }

        .feedback-btn {
          color: #022c22;
          background: #10b981;
        }

        .feedback-btn:hover {
          background: #34d399;
        }

        .feedback-submitted,
        .feedback-unavailable {
          text-align: center;
          padding: 9px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
        }

        .feedback-submitted {
          color: #34d399;
          background: rgba(16, 185, 129, .08);
          border: 1px solid rgba(16, 185, 129, .2);
        }

        .feedback-unavailable {
          color: #64748b;
          background: #070d14;
          border: 1px solid #1f2937;
        }

        .empty-card {
          text-align: center;
          padding: 70px 25px;
          background: #0b1620;
          border: 1px solid #1f3440;
          border-radius: 14px;
        }

        .empty-icon {
          font-size: 34px;
          margin-bottom: 12px;
        }

        .empty-card h2 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .empty-card p {
          margin: 0 auto 20px;
          max-width: 500px;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 750px) {

          .page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .summary-card {
            grid-template-columns: repeat(2, 1fr);
          }

          .summary-item:nth-child(2) {
            border-right: none;
          }

          .summary-item:nth-child(1),
          .summary-item:nth-child(2) {
            border-bottom: 1px solid #1f3440;
          }

          .complaint-card {
            flex-direction: column;
            align-items: stretch;
          }

          .complaint-actions {
            width: 100%;
          }

        }

        @media (max-width: 480px) {

          .my-complaints-page {
            padding: 28px 14px 45px;
          }

          .page-header h1 {
            font-size: 27px;
          }

          .summary-item {
            padding: 16px;
          }

          .summary-item strong {
            font-size: 22px;
          }

          .complaint-card {
            padding: 17px;
          }

        }

      `}</style>

      <Footer />
    </>
  );
};

export default MyComplaints;