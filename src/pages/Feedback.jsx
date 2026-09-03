import { useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import {
  saveFeedback,
  hasSubmittedFeedback,
} from "../utils/feedbackData";

import {
  getStoredComplaints,
} from "../utils/mockData";

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialId =
    searchParams.get("id") || "";

  const [complaintId, setComplaintId] =
    useState(initialId);

  const [rating, setRating] =
    useState(5);

  const [category, setCategory] =
    useState("General");

  const [comment, setComment] =
    useState("");

  const [verificationMessage, setVerificationMessage] =
    useState("");

  const [verificationType, setVerificationType] =
    useState("");

  const [isVerified, setIsVerified] =
    useState(false);

  // =====================================================
  // VERIFY COMPLAINT
  // =====================================================

  const handleVerifyComplaint = () => {
    const cleanId = complaintId.trim();

    if (!cleanId) {
      setIsVerified(false);
      setVerificationType("error");

      setVerificationMessage(
        "Please enter your Complaint Reference ID."
      );

      return;
    }

    const complaints =
      getStoredComplaints();

    const found = complaints.find(
      (complaint) =>
        complaint.id &&
        complaint.id.toLowerCase() ===
          cleanId.toLowerCase()
    );

    if (!found) {
      setIsVerified(false);
      setVerificationType("error");

      setVerificationMessage(
        "Complaint not found. Please check your Reference ID."
      );

      return;
    }

    if (found.status !== "Resolved") {
      setIsVerified(false);
      setVerificationType("warning");

      setVerificationMessage(
        `Complaint found, but its current status is "${found.status}". Feedback is available only after the complaint is resolved.`
      );

      return;
    }

    if (hasSubmittedFeedback(found.id)) {
      setIsVerified(false);
      setVerificationType("warning");

      setVerificationMessage(
        "Feedback has already been submitted for this complaint."
      );

      return;
    }

    setIsVerified(true);
    setVerificationType("success");

    setVerificationMessage(
      "Complaint verified. You can now submit feedback."
    );
  };

  // =====================================================
  // SUBMIT FEEDBACK
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanComplaintId =
      complaintId.trim().toUpperCase();

    if (!cleanComplaintId) {
      toast.error(
        "Please enter your Complaint Reference ID."
      );

      return;
    }

    if (!isVerified) {
      toast.error(
        "Please verify your Complaint Reference ID first."
      );

      return;
    }

    if (!comment.trim()) {
      toast.error(
        "Please enter your feedback comments."
      );

      return;
    }

    const feedbackObj = {
      complaintId: cleanComplaintId,

      rating,

      category,

      comment: comment.trim(),

      anonymous: true,

      submittedBy: "Guest",

      date: new Date()
        .toISOString()
        .split("T")[0],
    };

    saveFeedback(feedbackObj);

    toast.success(
      "Your anonymous feedback has been submitted."
    );

    navigate(
      `/track-complaint?id=${cleanComplaintId}`
    );
  };

  // =====================================================
  // ID CHANGE
  // =====================================================

  const handleComplaintIdChange = (e) => {
    setComplaintId(e.target.value);

    setIsVerified(false);
    setVerificationMessage("");
    setVerificationType("");
  };

  return (
    <>
      <Navbar />

      <div className="feedback-page">

        <div className="feedback-card">

          {/* ANONYMOUS NOTICE */}

          <div className="anonymous-notice">

            <div className="notice-title">
              ANONYMOUS FEEDBACK
            </div>

            <div className="notice-text">
              No name, email, password, or account is
              required. Your feedback will be submitted
              anonymously.
            </div>

          </div>

          {/* HEADER */}

          <div className="feedback-header">

            <span className="page-label">
              CAMPUS EXPERIENCE
            </span>

            <h1>
              Anonymous Feedback
            </h1>

            <p>
              Share your experience after your complaint
              has been resolved.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="feedback-form"
          >

            {/* COMPLAINT ID */}

            <div className="form-group">

              <label htmlFor="complaintId">
                Complaint Reference ID*
              </label>

              <div className="verify-row">

                <input
                  id="complaintId"
                  type="text"
                  placeholder="Example: CFMS-2026-12345"
                  value={complaintId}
                  onChange={handleComplaintIdChange}
                />

                <button
                  type="button"
                  onClick={handleVerifyComplaint}
                  className="verify-btn"
                >
                  Verify
                </button>

              </div>

              {verificationMessage && (
                <div
                  className={`verification-message ${verificationType}`}
                >
                  {verificationMessage}
                </div>
              )}

            </div>

            {/* RATING */}

            <div className="form-group">

              <label>
                Rating*
              </label>

              <div className="rating-options">

                {[1, 2, 3, 4, 5].map(
                  (number) => (
                    <button
                      type="button"
                      key={number}
                      onClick={() =>
                        setRating(number)
                      }
                      className={
                        number === rating
                          ? "rating-btn active"
                          : "rating-btn"
                      }
                    >
                      {number}
                    </button>
                  )
                )}

              </div>

              <div className="rating-label">
                Selected rating: {rating} out of 5
              </div>

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label htmlFor="feedbackCategory">
                Category
              </label>

              <select
                id="feedbackCategory"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option value="General">
                  General
                </option>

                <option value="Library">
                  Library
                </option>

                <option value="Hostel">
                  Hostel
                </option>

                <option value="Canteen">
                  Canteen
                </option>

                <option value="Academic">
                  Academic
                </option>

                <option value="Infrastructure">
                  Infrastructure
                </option>
              </select>

            </div>

            {/* COMMENTS */}

            <div className="form-group">

              <label htmlFor="feedbackComment">
                Comments*
              </label>

              <textarea
                id="feedbackComment"
                rows="6"
                placeholder="Describe your resolution experience..."
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
              />

            </div>

            {/* ANONYMOUS MESSAGE */}

            <div className="feedback-note">

              <strong>
                Anonymous submission
              </strong>

              <span>
                This feedback is submitted without
                displaying your personal information.
              </span>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={!isVerified}
              className={
                isVerified
                  ? "submit-feedback-btn"
                  : "submit-feedback-btn disabled"
              }
            >
              Submit Anonymous Feedback
            </button>

          </form>

          {/* BACK HOME */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="back-home-btn"
          >
            Back to Home
          </button>

        </div>

      </div>

      <style>{`

        .feedback-page {
          min-height: calc(100vh - 64px);

          background: #030712;

          color: #ffffff;

          padding: 45px 20px;

          box-sizing: border-box;
        }

        .feedback-card {
          width: 100%;
          max-width: 650px;

          margin: 0 auto;

          background: #0b1620;

          border: 1px solid #1f3440;

          border-radius: 16px;

          padding: 32px;

          box-sizing: border-box;

          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .anonymous-notice {
          padding: 15px 16px;

          margin-bottom: 28px;

          background:
            rgba(56, 189, 248, 0.07);

          border:
            1px solid rgba(56, 189, 248, 0.22);

          border-radius: 10px;
        }

        .notice-title {
          color: #38bdf8;

          font-size: 12px;

          font-weight: 700;

          letter-spacing: 1px;

          margin-bottom: 6px;
        }

        .notice-text {
          color: #94a3b8;

          font-size: 13px;

          line-height: 1.6;
        }

        .feedback-header {
          margin-bottom: 28px;
        }

        .page-label {
          color: #34d399;

          font-size: 11px;

          font-weight: 700;

          letter-spacing: 1.8px;
        }

        .feedback-header h1 {
          margin: 8px 0;

          font-size: 30px;

          line-height: 1.2;
        }

        .feedback-header p {
          margin: 0;

          color: #94a3b8;

          font-size: 14px;

          line-height: 1.6;
        }

        .feedback-form {
          display: flex;

          flex-direction: column;

          gap: 20px;
        }

        .form-group {
          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .form-group label {
          color: #cbd5e1;

          font-size: 13px;

          font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;

          box-sizing: border-box;

          padding: 12px 13px;

          background: #060d14;

          border: 1px solid #263b47;

          border-radius: 8px;

          color: #ffffff;

          font-size: 14px;

          font-family: inherit;

          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #10b981;

          box-shadow:
            0 0 0 3px
            rgba(16, 185, 129, 0.08);
        }

        .form-group textarea {
          resize: vertical;
        }

        .verify-row {
          display: flex;

          gap: 10px;
        }

        .verify-row input {
          flex: 1;

          min-width: 0;
        }

        .verify-btn {
          padding: 12px 18px;

          background: #38bdf8;

          color: #03131c;

          border: none;

          border-radius: 8px;

          font-weight: 700;

          cursor: pointer;
        }

        .verification-message {
          padding: 10px 12px;

          border-radius: 8px;

          font-size: 12px;

          line-height: 1.5;
        }

        .verification-message.success {
          background:
            rgba(16, 185, 129, 0.08);

          border:
            1px solid rgba(16, 185, 129, 0.25);

          color: #34d399;
        }

        .verification-message.warning {
          background:
            rgba(251, 191, 36, 0.08);

          border:
            1px solid rgba(251, 191, 36, 0.25);

          color: #fbbf24;
        }

        .verification-message.error {
          background:
            rgba(248, 113, 113, 0.08);

          border:
            1px solid rgba(248, 113, 113, 0.25);

          color: #f87171;
        }

        .rating-options {
          display: flex;

          gap: 8px;
        }

        .rating-btn {
          width: 45px;

          height: 42px;

          background: #060d14;

          color: #94a3b8;

          border: 1px solid #263b47;

          border-radius: 8px;

          font-weight: 700;

          cursor: pointer;
        }

        .rating-btn.active {
          background:
            rgba(16, 185, 129, 0.15);

          color: #34d399;

          border-color: #10b981;
        }

        .rating-label {
          color: #64748b;

          font-size: 12px;
        }

        .feedback-note {
          display: flex;

          flex-direction: column;

          gap: 4px;

          padding: 13px 14px;

          background:
            rgba(16, 185, 129, 0.06);

          border:
            1px solid rgba(16, 185, 129, 0.2);

          border-radius: 9px;
        }

        .feedback-note strong {
          color: #34d399;

          font-size: 12px;
        }

        .feedback-note span {
          color: #94a3b8;

          font-size: 12px;

          line-height: 1.5;
        }

        .submit-feedback-btn {
          padding: 13px;

          background: #10b981;

          color: #022c22;

          border: none;

          border-radius: 9px;

          font-size: 14px;

          font-weight: 700;

          cursor: pointer;
        }

        .submit-feedback-btn.disabled {
          background: #26313d;

          color: #64748b;

          cursor: not-allowed;
        }

        .back-home-btn {
          width: 100%;

          margin-top: 12px;

          padding: 12px;

          background: transparent;

          color: #94a3b8;

          border: 1px solid #263b47;

          border-radius: 9px;

          font-size: 14px;

          font-weight: 600;

          cursor: pointer;
        }

        .back-home-btn:hover {
          color: #ffffff;

          border-color: #10b981;
        }

        @media (max-width: 600px) {

          .feedback-page {
            padding: 25px 15px;
          }

          .feedback-card {
            padding: 22px;
          }

          .feedback-header h1 {
            font-size: 25px;
          }

          .verify-row {
            flex-direction: column;
          }

          .verify-btn {
            width: 100%;
          }

        }

      `}</style>
    </>
  );
};

export default Feedback;