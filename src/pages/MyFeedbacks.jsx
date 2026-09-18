import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { getStoredFeedback } from "../utils/feedbackData";

const MyFeedbacks = () => {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);

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
    const loadFeedbacks = () => {
      setFeedbacks(getStoredFeedback());
    };

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

  /* =========================================
     ONLY THIS STUDENT'S FEEDBACK
  ========================================= */

  const studentFeedbacks = useMemo(() => {
    const studentName =
      user?.name ||
      user?.fullName ||
      `${user?.firstName || ""} ${
        user?.lastName || ""
      }`.trim();

    return feedbacks
      .filter((feedback) => {
        if (feedback.anonymous) {
          return false;
        }

        return (
          feedback.submittedBy === studentName ||
          feedback.studentId === user?.studentId ||
          feedback.email === user?.email
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
  }, [feedbacks, user]);

  /* =========================================
     RATING
  ========================================= */

  const renderStars = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="stars">

        {[1, 2, 3, 4, 5].map(
          (star) => (

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

          )
        )}

      </div>
    );
  };

  return (
    <>
      <Navbar />

      <div className="my-feedbacks-page">

        <div className="feedbacks-container">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="feedbacks-header">

            <div>

              <span className="page-eyebrow">
                STUDENT PORTAL
              </span>

              <h1>
                My Feedbacks
              </h1>

              <p>
                View the feedback you have submitted
                for your resolved complaints.
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


          {/* =========================================
              SUMMARY
          ========================================= */}

          <div className="feedback-summary">

            <div className="summary-box">

              <span>
                Total Feedbacks
              </span>

              <strong>
                {studentFeedbacks.length}
              </strong>

            </div>


            <div className="summary-box">

              <span>
                Average Rating
              </span>

              <strong>

                {studentFeedbacks.length
                  ? (
                      studentFeedbacks.reduce(
                        (sum, feedback) =>
                          sum +
                          Number(
                            feedback.rating || 0
                          ),
                        0
                      ) /
                      studentFeedbacks.length
                    ).toFixed(1)
                  : "—"}

                {studentFeedbacks.length
                  ? " / 5"
                  : ""}

              </strong>

            </div>

          </div>


          {/* =========================================
              FEEDBACK LIST
          ========================================= */}

          {studentFeedbacks.length === 0 ? (

            <div className="empty-feedbacks">

              <div className="empty-icon">
                💬
              </div>

              <h2>
                No feedback submitted yet
              </h2>

              <p>
                Once you submit feedback for a
                resolved complaint, it will appear here.
              </p>

              <Link
                to="/student-dashboard"
                className="dashboard-btn"
              >
                Go to Dashboard
              </Link>

            </div>

          ) : (

            <div className="feedback-list">

              {studentFeedbacks.map(
                (feedback, index) => (

                  <div
                    className="feedback-card"
                    key={
                      feedback.id ||
                      `${feedback.complaintId}-${index}`
                    }
                  >

                    <div className="feedback-card-top">

                      <div>

                        <span className="complaint-id">
                          {feedback.complaintId ||
                            "Complaint"}
                        </span>

                        <h2>
                          {feedback.category ||
                            "General Feedback"}
                        </h2>

                      </div>


                      <div className="rating-box">

                        {renderStars(
                          feedback.rating
                        )}

                        <strong>
                          {feedback.rating || 0}/5
                        </strong>

                      </div>

                    </div>


                    <div className="feedback-content">

                      <span className="content-label">
                        YOUR FEEDBACK
                      </span>

                      <p>
                        {feedback.comment ||
                          "No comment provided."}
                      </p>

                    </div>


                    <div className="feedback-footer">

                      <span>
                        Submitted on{" "}
                        {feedback.date || "—"}
                      </span>

                      <span className="non-anonymous">
                        ✓ Submitted as student
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>


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

        .complaint-id {
          color: #38bdf8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .5px;
        }

        .feedback-card h2 {
          margin: 7px 0 0;
          font-size: 17px;
        }

        .rating-box {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }

        .rating-box strong {
          color: #cbd5e1;
          font-size: 12px;
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

        .non-anonymous {
          color: #34d399;
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

        @media (max-width: 650px) {

          .feedbacks-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .feedback-summary {
            grid-template-columns: 1fr;
          }

          .feedback-card-top {
            flex-direction: column;
          }

          .rating-box {
            align-items: flex-start;
          }

          .feedback-footer {
            flex-direction: column;
            align-items: flex-start;
          }

        }

      `}</style>

      <Footer />
    </>
  );
};

export default MyFeedbacks;