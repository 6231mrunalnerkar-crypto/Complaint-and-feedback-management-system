import { useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import api from "../services/api";

import { getStoredCategories } from "../utils/categoryData";

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialId = searchParams.get("id") || "";

  // =====================================================
  // CATEGORIES
  // =====================================================

  const [categories] = useState(() => {
    try {
      const storedCategories = getStoredCategories();

      return storedCategories.length > 0
        ? storedCategories
        : ["Other"];
    } catch (error) {
      console.error(
        "Unable to load categories:",
        error
      );

      return ["Other"];
    }
  });

  // =====================================================
  // FORM STATE
  // =====================================================

  const [complaintId, setComplaintId] =
    useState(initialId);

  const [rating, setRating] =
    useState(5);

  const [category, setCategory] =
    useState(() => {
      try {
        const storedCategories =
          getStoredCategories();

        return storedCategories[0] || "Other";
      } catch (error) {
        return "Other";
      }
    });

  const [comment, setComment] =
    useState("");

  // =====================================================
  // VERIFICATION STATE
  // =====================================================

  const [verificationMessage, setVerificationMessage] =
    useState("");

  const [verificationType, setVerificationType] =
    useState("");

  const [isVerified, setIsVerified] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  // =====================================================
  // VERIFY COMPLAINT
  // =====================================================

  const handleVerifyComplaint = async () => {
    const cleanId = complaintId.trim();

    if (!cleanId) {
      setIsVerified(false);
      setVerificationType("error");

      setVerificationMessage(
        "Please enter your Complaint Reference ID."
      );

      return;
    }

    try {
      setVerifying(true);
      setIsVerified(false);
      setVerificationType("");
      setVerificationMessage("");

      console.log(
        "Verifying complaint:",
        cleanId
      );

      const response = await api.get(
        `/feedback/verify/${encodeURIComponent(
          cleanId
        )}`
      );

      console.log(
        "Verification response:",
        response
      );

      // IMPORTANT:
      // api.js already returns the parsed JSON.
      // Therefore response.data is the backend data object.
      const data = response?.data;

      // =================================================
      // INVALID RESPONSE
      // =================================================

      if (!data) {
        setVerificationType("error");

        setVerificationMessage(
          "Unable to verify complaint."
        );

        return;
      }

      // =================================================
      // COMPLAINT NOT FOUND
      // =================================================

      if (!data.complaint) {
        setIsVerified(false);
        setVerificationType("error");

        setVerificationMessage(
          "Complaint not found. Please check your Reference ID."
        );

        return;
      }

      // =================================================
      // ALREADY SUBMITTED
      // =================================================

      if (data.alreadySubmitted) {
        setIsVerified(false);
        setVerificationType("warning");

        setVerificationMessage(
          "Feedback has already been submitted for this complaint."
        );

        return;
      }

      // =================================================
      // NOT ELIGIBLE
      // =================================================

      if (!data.eligible) {
        setIsVerified(false);
        setVerificationType("warning");

        setVerificationMessage(
          `Complaint found, but its current status is "${data.complaint.status}". Feedback is available only after the complaint is resolved.`
        );

        return;
      }

      // =================================================
      // VERIFIED SUCCESSFULLY
      // =================================================

      setIsVerified(true);

      setVerificationType("success");

      setVerificationMessage(
        "Complaint verified. You can now submit feedback."
      );

    } catch (error) {
      console.error(
        "Unable to verify complaint:",
        error
      );

      setIsVerified(false);

      setVerificationType("error");

      setVerificationMessage(
        error.message ||
          "Unable to verify complaint."
      );
    } finally {
      setVerifying(false);
    }
  };

  // =====================================================
  // SUBMIT FEEDBACK
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanComplaintId =
      complaintId.trim().toUpperCase();

    // =================================================
    // CHECK COMPLAINT ID
    // =================================================

    if (!cleanComplaintId) {
      toast.error(
        "Please enter your Complaint Reference ID."
      );

      return;
    }

    // =================================================
    // CHECK VERIFICATION
    // =================================================

    if (!isVerified) {
      toast.error(
        "Please verify your Complaint Reference ID first."
      );

      return;
    }

    // =================================================
    // CHECK COMMENT
    // =================================================

    if (!comment.trim()) {
      toast.error(
        "Please enter your feedback comments."
      );

      return;
    }

    try {
      setSubmitting(true);

      // =================================================
      // SEND FEEDBACK TO BACKEND
      // =================================================

      const response = await api.post(
        "/feedback",
        {
          complaintReferenceId:
            cleanComplaintId,

          rating: Number(rating),

          category:
            String(category).trim() ||
            "General",

          comment:
            comment.trim(),

          anonymous: true,
        }
      );

      console.log(
        "Feedback submission response:",
        response
      );

      // =================================================
      // SUCCESS
      // =================================================

      toast.success(
        "Your anonymous feedback has been submitted successfully."
      );

      navigate(
        `/track-complaint?id=${cleanComplaintId}`
      );

    } catch (error) {
      console.error(
        "Unable to submit anonymous feedback:",
        error
      );

      toast.error(
        error.message ||
          "Unable to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // COMPLAINT ID CHANGE
  // =====================================================

  const handleComplaintIdChange = (event) => {
    setComplaintId(event.target.value);

    setIsVerified(false);

    setVerificationMessage("");

    setVerificationType("");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="feedback-page">

        <div className="feedback-card">

          {/* =================================================
              ANONYMOUS NOTICE
          ================================================= */}

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

          {/* =================================================
              HEADER
          ================================================= */}

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

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="feedback-form"
          >

            {/* =================================================
                COMPLAINT ID
            ================================================= */}

            <div className="form-group">

              <label htmlFor="complaintId">
                Complaint Reference ID*
              </label>

              <div className="verify-row">

                <input
                  id="complaintId"
                  type="text"
                  placeholder="Example: CMP-2026-MUIB2KXS278"
                  value={complaintId}
                  onChange={
                    handleComplaintIdChange
                  }
                  disabled={
                    verifying ||
                    submitting
                  }
                />

                <button
                  type="button"
                  onClick={
                    handleVerifyComplaint
                  }
                  className="verify-btn"
                  disabled={
                    verifying ||
                    submitting
                  }
                >
                  {verifying
                    ? "Verifying..."
                    : "Verify"}
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

            {/* =================================================
                RATING
            ================================================= */}

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
                      disabled={submitting}
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

            {/* =================================================
                CATEGORY
            ================================================= */}

            <div className="form-group">

              <label htmlFor="feedbackCategory">
                Category
              </label>

              <select
                id="feedbackCategory"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                disabled={submitting}
              >

                {categories.map(
                  (categoryName) => (
                    <option
                      key={categoryName}
                      value={categoryName}
                    >
                      {categoryName}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =================================================
                COMMENTS
            ================================================= */}

            <div className="form-group">

              <label htmlFor="feedbackComment">
                Comments*
              </label>

              <textarea
                id="feedbackComment"
                rows="6"
                placeholder="Describe your resolution experience..."
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
                disabled={submitting}
              />

            </div>

            {/* =================================================
                ANONYMOUS MESSAGE
            ================================================= */}

            <div className="feedback-note">

              <strong>
                Anonymous submission
              </strong>

              <span>
                This feedback is submitted without
                displaying your personal information.
              </span>

            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={
                !isVerified ||
                submitting
              }
              className={
                isVerified &&
                !submitting
                  ? "submit-feedback-btn"
                  : "submit-feedback-btn disabled"
              }
            >
              {submitting
                ? "Submitting..."
                : "Submit Anonymous Feedback"}
            </button>

          </form>

          {/* =================================================
              BACK HOME
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="back-home-btn"
            disabled={submitting}
          >
            Back to Home
          </button>

        </div>

      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

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

        .verify-btn:hover:not(:disabled) {
          background: #7dd3fc;
        }

        .verify-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .rating-btn:hover:not(:disabled) {
          border-color: #10b981;
        }

        .rating-btn.active {
          background:
            rgba(16, 185, 129, 0.15);
          color: #34d399;
          border-color: #10b981;
        }

        .rating-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .submit-feedback-btn:hover:not(:disabled) {
          background: #34d399;
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

        .back-home-btn:hover:not(:disabled) {
          color: #ffffff;
          border-color: #10b981;
        }

        .back-home-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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