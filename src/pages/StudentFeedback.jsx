import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import api from "../services/api";

const StudentFeedback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = JSON.parse(
    localStorage.getItem("cfms_user") || "null"
  );

  const initialId = searchParams.get("id") || "";

  const [complaintId, setComplaintId] = useState(initialId);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState("General");
  const [comment, setComment] = useState("");

  const [verificationMessage, setVerificationMessage] =
    useState("");
  const [verificationType, setVerificationType] =
    useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * If complaint ID comes from the URL, automatically
   * verify it when the page opens.
   */
  useEffect(() => {
    if (initialId.trim()) {
      verifyComplaint(initialId);
    }
  }, [initialId]);

  /*
   * VERIFY COMPLAINT USING BACKEND
   */
  const verifyComplaint = async (id = complaintId) => {
    const cleanId = String(id || "").trim();

    if (!cleanId) {
      setIsVerified(false);
      setVerificationType("error");
      setVerificationMessage(
        "Please enter your Complaint Reference ID."
      );
      return;
    }

    try {
      setIsVerifying(true);
      setIsVerified(false);
      setVerificationMessage("");
      setVerificationType("");

      const response = await api.get(
        `/feedback/verify/${encodeURIComponent(cleanId)}`
      );

      const data = response?.data?.data;

      if (!data?.complaint) {
        setIsVerified(false);
        setVerificationType("error");
        setVerificationMessage(
          "Complaint not found. Please check your Reference ID."
        );
        return;
      }

      if (data.alreadySubmitted) {
        setIsVerified(false);
        setVerificationType("warning");
        setVerificationMessage(
          "Feedback has already been submitted for this complaint."
        );
        return;
      }

      if (!data.eligible) {
        setIsVerified(false);
        setVerificationType("warning");
        setVerificationMessage(
          `Complaint found, but its current status is "${data.complaint.status}". Feedback is available only after the complaint is resolved.`
        );
        return;
      }

      setComplaintId(data.complaint.referenceId);
      setIsVerified(true);
      setVerificationType("success");
      setVerificationMessage(
        "Complaint verified. You can now submit your feedback."
      );
    } catch (error) {
      console.error("Complaint verification error:", error);

      setIsVerified(false);
      setVerificationType("error");

      setVerificationMessage(
        error?.response?.data?.message ||
          "Unable to verify complaint. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  /*
   * SUBMIT FEEDBACK TO BACKEND
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanComplaintId = complaintId.trim().toUpperCase();

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

    try {
      setIsSubmitting(true);

      const response = await api.post("/feedback", {
        complaintReferenceId: cleanComplaintId,
        rating: Number(rating),
        category,
        comment: comment.trim(),

        // Student feedback is NOT anonymous
        anonymous: false,
      });

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            "Feedback submission failed."
        );
      }

      toast.success(
        "Your feedback has been submitted successfully."
      );

      window.dispatchEvent(
        new Event("cfms-feedback-updated")
      );

      navigate(
        `/track-complaint?id=${cleanComplaintId}`
      );
    } catch (error) {
      console.error("Feedback submission error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to submit feedback."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * WHEN COMPLAINT ID CHANGES
   */
  const handleComplaintIdChange = (e) => {
    setComplaintId(e.target.value);

    setIsVerified(false);
    setVerificationMessage("");
    setVerificationType("");
  };

  return (
    <>
      <Navbar />

      <div className="student-feedback-page">
        <div className="student-feedback-card">

          {/* HEADER */}

          <div className="student-feedback-header">
            <span className="page-label">
              CAMPUS EXPERIENCE
            </span>

            <h1>
              Submit Feedback
            </h1>

            <p>
              Share your experience after your complaint
              has been resolved.
            </p>
          </div>

          {/* STUDENT INFORMATION */}

          <div className="student-info-box">
            <div className="info-label">
              SUBMITTING AS
            </div>

            <div className="student-name">
              {user?.name ||
                user?.fullName ||
                "Student"}
            </div>

            {user?.studentId && (
              <div className="student-id">
                Student ID: {user.studentId}
              </div>
            )}

            {user?.email && (
              <div className="student-email">
                {user.email}
              </div>
            )}
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="student-feedback-form"
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
                  placeholder="Example: CMP-2026-ABC123"
                  value={complaintId}
                  onChange={handleComplaintIdChange}
                />

                <button
                  type="button"
                  onClick={() => verifyComplaint()}
                  className="verify-btn"
                  disabled={isVerifying}
                >
                  {isVerifying
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
                placeholder="Describe your experience with the complaint resolution..."
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
              />

            </div>

            {/* STUDENT NOTICE */}

            <div className="feedback-note">

              <strong>
                Student feedback
              </strong>

              <span>
                This feedback is submitted through your
                CampusVoice student account.
              </span>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                !isVerified || isSubmitting
              }
              className={
                isVerified && !isSubmitting
                  ? "submit-feedback-btn"
                  : "submit-feedback-btn disabled"
              }
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Feedback"}
            </button>

          </form>

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate("/student-dashboard")
            }
            className="back-dashboard-btn"
          >
            Back to Dashboard
          </button>

        </div>
      </div>

      <style>{`

        .student-feedback-page {
          min-height: calc(100vh - 64px);
          background: #030712;
          color: #ffffff;
          padding: 45px 20px;
          box-sizing: border-box;
        }

        .student-feedback-card {
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

        .student-feedback-header {
          margin-bottom: 24px;
        }

        .page-label {
          color: #34d399;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.8px;
        }

        .student-feedback-header h1 {
          margin: 8px 0;
          font-size: 30px;
          line-height: 1.2;
        }

        .student-feedback-header p {
          margin: 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
        }

        .student-info-box {
          padding: 15px 16px;
          margin-bottom: 28px;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }

        .info-label {
          color: #34d399;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.4px;
          margin-bottom: 6px;
        }

        .student-name {
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
        }

        .student-id,
        .student-email {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 3px;
        }

        .student-feedback-form {
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
          background: #10b981;
          color: #022c22;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .verify-btn:hover:not(:disabled) {
          background: #34d399;
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
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
        }

        .verification-message.warning {
          background: rgba(251, 191, 36, 0.08);
          border: 1px solid rgba(251, 191, 36, 0.25);
          color: #fbbf24;
        }

        .verification-message.error {
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.25);
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
          background: rgba(16, 185, 129, 0.15);
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
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.2);
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

        .submit-feedback-btn:hover {
          background: #34d399;
        }

        .submit-feedback-btn.disabled {
          background: #26313d;
          color: #64748b;
          cursor: not-allowed;
        }

        .back-dashboard-btn {
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

        .back-dashboard-btn:hover {
          color: #ffffff;
          border-color: #10b981;
        }

        @media (max-width: 600px) {

          .student-feedback-page {
            padding: 25px 15px;
          }

          .student-feedback-card {
            padding: 22px;
          }

          .student-feedback-header h1 {
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

export default StudentFeedback;