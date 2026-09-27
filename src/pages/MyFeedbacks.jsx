import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import api from "../services/api";

const MyFeedbacks = () => {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD MY FEEDBACKS FROM BACKEND
  // =====================================================

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/feedback/my");

      console.log("MY FEEDBACK RESPONSE:", response);

      const feedbackList =
        response?.data?.feedbacks || [];

      setFeedbacks(feedbackList);
    } catch (err) {
      console.error(
        "Unable to load feedbacks:",
        err
      );

      setError(
        err.message ||
          "Unable to load your feedbacks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();

    window.addEventListener(
      "cfms-feedback-updated",
      loadFeedbacks
    );

    return () => {
      window.removeEventListener(
        "cfms-feedback-updated",
        loadFeedbacks
      );
    };
  }, []);

  // =====================================================
  // RATING
  // =====================================================

  const renderStars = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= value
                ? "star active"
                : "star"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // AVERAGE RATING
  // =====================================================

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce(
            (sum, feedback) =>
              sum + Number(feedback.rating || 0),
            0
          ) / feedbacks.length
        ).toFixed(1)
      : "—";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="my-feedbacks-page">
        <div className="feedbacks-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="feedbacks-header">
            <div>
              <span className="page-eyebrow">
                STUDENT PORTAL
              </span>

              <h1>
                My Feedbacks
              </h1>

              <p>
                View the feedback you have
                submitted for your resolved
                complaints.
              </p>
            </div>

            <button
              type="button"
              className="dashboard-btn"
              onClick={() =>
                navigate("/student-dashboard")
              }
            >
              ← Dashboard
            </button>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="feedback-state">
              <div className="loading-icon">
                ⟳
              </div>

              <h3>
                Loading your feedbacks...
              </h3>

              <p>
                Please wait while we fetch
                your feedback history.
              </p>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="feedback-error">
              <div className="error-icon">
                !
              </div>

              <strong>
                Unable to load feedbacks
              </strong>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={loadFeedbacks}
              >
                Try Again
              </button>
            </div>
          )}

          {/* =================================================
              SUMMARY
          ================================================= */}

          {!loading &&
            !error &&
            feedbacks.length > 0 && (
              <div className="feedback-summary">

                <div className="summary-box">
                  <span>
                    Total Feedbacks
                  </span>

                  <strong>
                    {feedbacks.length}
                  </strong>
                </div>

                <div className="summary-box">
                  <span>
                    Average Rating
                  </span>

                  <strong>
                    {averageRating}
                    <small> / 5</small>
                  </strong>
                </div>

              </div>
            )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            feedbacks.length === 0 && (
              <div className="empty-feedbacks">

                <div className="empty-icon">
                  💬
                </div>

                <h2>
                  No feedback submitted yet
                </h2>

                <p>
                  Once you submit feedback
                  for a resolved complaint,
                  it will appear here.
                </p>

                <button
                  type="button"
                  className="dashboard-btn"
                  onClick={() =>
                    navigate(
                      "/student-dashboard"
                    )
                  }
                >
                  Back to Dashboard
                </button>

              </div>
            )}

          {/* =================================================
              FEEDBACK LIST
          ================================================= */}

          {!loading &&
            !error &&
            feedbacks.length > 0 && (
              <div className="feedback-list">

                {feedbacks.map((feedback) => (

                  <article
                    className="feedback-card"
                    key={feedback._id}
                  >

                    {/* TOP */}

                    <div className="feedback-card-top">

                      <div>
                        <span className="complaint-label">
                          COMPLAINT
                        </span>

                        <h2>
                          {feedback.complaintReferenceId ||
                            feedback.complaint?.referenceId ||
                            "Complaint"}
                        </h2>
                      </div>

                      <span className="anonymous-badge">
                        {feedback.anonymous
                          ? "Anonymous"
                          : "Student"}
                      </span>

                    </div>

                    {/* META */}

                    <div className="feedback-meta">

                      <div className="meta-item">
                        <span>
                          Rating
                        </span>

                        {renderStars(
                          feedback.rating
                        )}

                        <strong>
                          {feedback.rating}/5
                        </strong>
                      </div>

                      <div className="meta-item">
                        <span>
                          Category
                        </span>

                        <strong>
                          {feedback.category ||
                            "General"}
                        </strong>
                      </div>

                      <div className="meta-item">
                        <span>
                          Submitted
                        </span>

                        <strong>
                          {formatDate(
                            feedback.createdAt
                          )}
                        </strong>
                      </div>

                    </div>

                    {/* COMMENT */}

                    <div className="feedback-content">

                      <span className="content-label">
                        YOUR FEEDBACK
                      </span>

                      <p>
                        {feedback.comment ||
                          "No comment provided."}
                      </p>

                    </div>

                    {/* FOOTER */}

                    <div className="feedback-footer">

                      <span>
                        Feedback ID:{" "}
                        {feedback.referenceId ||
                          feedback._id}
                      </span>

                      <span className="anonymous-note">
                        {feedback.anonymous
                          ? "✓ Anonymous submission"
                          : "✓ Submitted as student"}
                      </span>

                    </div>

                  </article>

                ))}

              </div>
            )}

        </div>
      </div>

      <Footer />

      <style>{`

        .my-feedbacks-page {
          min-height: calc(100vh - 64px);
          background: #030712;
          color: #ffffff;
          padding: 42px 20px 60px;
          box-sizing: border-box;
        }

        .feedbacks-container {
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feedbacks-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
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

        .feedbacks-header h1 {
          margin: 0;
          font-size: 32px;
        }

        .feedbacks-header p {
          margin: 9px 0 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
        }

        .dashboard-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 11px 16px;
          border-radius: 9px;
          background: #0b1620;
          color: #dbeafe;
          border: 1px solid #263b47;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          white-space: nowrap;
        }

        .dashboard-btn:hover {
          color: #34d399;
          border-color: #10b981;
        }

        .feedback-summary {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 24px;
        }

        .summary-box {
          padding: 20px;
          background: #0b1620;
          border: 1px solid #1f3440;
          border-radius: 14px;
        }

        .summary-box span {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 7px;
        }

        .summary-box strong {
          font-size: 26px;
        }

        .summary-box small {
          color: #94a3b8;
          font-size: 13px;
        }

        .feedback-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feedback-card {
          background: #0b1620;
          border: 1px solid #1f3440;
          border-radius: 14px;
          padding: 22px;
        }

        .feedback-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid #1f3440;
        }

        .complaint-label {
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .feedback-card h2 {
          margin: 7px 0 0;
          font-size: 17px;
        }

        .anonymous-badge {
          padding: 6px 11px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .feedback-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          padding: 18px 0;
          border-bottom: 1px solid #1f3440;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .meta-item > span {
          color: #64748b;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .meta-item strong {
          color: #e2e8f0;
          font-size: 13px;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #334155;
          font-size: 17px;
        }

        .star.active {
          color: #fbbf24;
        }

        .feedback-content {
          padding: 20px 0;
        }

        .content-label {
          display: block;
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
          margin-bottom: 8px;
        }

        .feedback-content p {
          margin: 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.7;
        }

        .feedback-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding-top: 15px;
          border-top: 1px solid #1f3440;
          color: #64748b;
          font-size: 11px;
        }

        .anonymous-note {
          color: #34d399;
          font-weight: 600;
        }

        .feedback-state {
          text-align: center;
          padding: 70px 25px;
          background: #0b1620;
          border: 1px solid #1f3440;
          border-radius: 14px;
        }

        .feedback-state h3 {
          margin: 10px 0 8px;
        }

        .feedback-state p {
          margin: 0;
          color: #94a3b8;
          line-height: 1.6;
        }

        .loading-icon {
          font-size: 32px;
          color: #34d399;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .empty-feedbacks {
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

        .empty-feedbacks h2 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .empty-feedbacks p {
          max-width: 500px;
          margin: 0 auto 22px;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .feedback-error {
          padding: 25px;
          background: rgba(248, 113, 113, 0.06);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 14px;
          color: #f87171;
        }

        .feedback-error strong {
          display: block;
          font-size: 16px;
        }

        .feedback-error p {
          color: #94a3b8;
          margin: 8px 0 0;
        }

        .feedback-error button {
          margin-top: 16px;
          padding: 10px 16px;
          background: #10b981;
          color: #022c22;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .error-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          margin-bottom: 10px;
          border-radius: 50%;
          background: rgba(248, 113, 113, 0.12);
          color: #f87171;
          font-weight: 800;
        }

        @media (max-width: 650px) {

          .feedbacks-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .feedback-summary {
            grid-template-columns: 1fr;
          }

          .feedback-meta {
            grid-template-columns: 1fr;
          }

          .feedback-card-top {
            flex-direction: column;
          }

          .feedback-footer {
            flex-direction: column;
            align-items: flex-start;
          }

        }

      `}</style>
    </>
  );
};

export default MyFeedbacks;