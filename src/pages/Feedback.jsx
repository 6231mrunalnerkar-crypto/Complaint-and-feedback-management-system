import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  saveFeedback,
  hasSubmittedFeedback,
} from "../utils/feedbackData";

import { getStoredComplaints } from "../utils/mockData";

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

    const complaints = getStoredComplaints();

    const found = complaints.find(
      (complaint) =>
        complaint.id &&
        complaint.id.toLowerCase() ===
          cleanId.toLowerCase()
    );

    // Complaint not found
    if (!found) {
      setIsVerified(false);
      setVerificationType("error");
      setVerificationMessage(
        "Complaint not found. Please check your Reference ID."
      );
      return;
    }

    // Complaint exists but isn't resolved
    if (found.status !== "Resolved") {
      setIsVerified(false);
      setVerificationType("warning");
      setVerificationMessage(
        `Complaint found, but its current status is "${found.status}". Feedback is available only after the complaint is resolved.`
      );
      return;
    }

    // Check duplicate feedback
    if (hasSubmittedFeedback(found.id)) {
      setIsVerified(false);
      setVerificationType("warning");
      setVerificationMessage(
        "Feedback has already been submitted for this complaint."
      );
      return;
    }

    // Everything is valid
    setIsVerified(true);
    setVerificationType("success");
    setVerificationMessage(
      "✓ Complaint verified. You can now submit feedback."
    );
  };

  // =====================================================
  // SUBMIT FEEDBACK
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanComplaintId = complaintId
      .trim()
      .toUpperCase();

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

      // ============================================
      // GUEST FEEDBACK IS ALWAYS ANONYMOUS
      // ============================================

      anonymous: true,

      submittedBy: "Guest",

      date: new Date()
        .toISOString()
        .split("T")[0],
    };

    saveFeedback(feedbackObj);

    toast.success(
      "Thank you! Your anonymous feedback has been submitted."
    );

    navigate(
      `/track-complaint?id=${cleanComplaintId}`
    );
  };

  // =====================================================
  // HANDLE COMPLAINT ID CHANGE
  // =====================================================

  const handleComplaintIdChange = (e) => {
    setComplaintId(e.target.value);

    // Reset previous verification when ID changes
    setIsVerified(false);
    setVerificationMessage("");
    setVerificationType("");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#030712",
        color: "#ffffff",
        padding: "32px 20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#111827",
          border: "1px solid #1f2937",
          padding: "32px",
          borderRadius: "12px",
        }}
      >

        {/* =================================================
            ANONYMOUS INFORMATION
        ================================================= */}

        <div
          style={{
            marginBottom: "24px",
            padding: "14px 16px",
            background:
              "rgba(56, 189, 248, 0.08)",
            border:
              "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              color: "#38bdf8",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "5px",
            }}
          >
            🔒 ANONYMOUS FEEDBACK
          </div>

          <div
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            No name, email, password, or account is
            required. Your feedback will be submitted
            anonymously.
          </div>
        </div>

        {/* =================================================
            HEADER
        ================================================= */}

        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Submit Feedback
        </h1>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "14px",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          Share your experience after your complaint
          has been resolved.
        </p>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >

          {/* =================================================
              COMPLAINT REFERENCE ID
          ================================================= */}

          <div>
            <label
              htmlFor="complaintId"
              style={{
                display: "block",
                fontSize: "13px",
                color: "#9ca3af",
                marginBottom: "6px",
              }}
            >
              Complaint Reference ID*
            </label>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                id="complaintId"
                type="text"
                placeholder="e.g. CFMS-2026-12345"
                value={complaintId}
                onChange={handleComplaintIdChange}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "10px 14px",
                  background: "#090d16",
                  border:
                    "1px solid #374151",
                  color: "#ffffff",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={handleVerifyComplaint}
                style={{
                  padding: "10px 16px",
                  background: "#38bdf8",
                  color: "#030712",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Verify
              </button>
            </div>

            {/* Verification message */}

            {verificationMessage && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px 12px",
                  borderRadius: "7px",

                  background:
                    verificationType === "success"
                      ? "rgba(16, 185, 129, 0.08)"
                      : verificationType === "warning"
                      ? "rgba(251, 191, 36, 0.08)"
                      : "rgba(248, 113, 113, 0.08)",

                  border:
                    verificationType === "success"
                      ? "1px solid rgba(16, 185, 129, 0.25)"
                      : verificationType === "warning"
                      ? "1px solid rgba(251, 191, 36, 0.25)"
                      : "1px solid rgba(248, 113, 113, 0.25)",

                  color:
                    verificationType === "success"
                      ? "#10b981"
                      : verificationType === "warning"
                      ? "#fbbf24"
                      : "#f87171",

                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                {verificationMessage}
              </div>
            )}
          </div>

          {/* =================================================
              RATING
          ================================================= */}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                color: "#9ca3af",
                marginBottom: "8px",
              }}
            >
              Rating*
            </label>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() =>
                      setRating(star)
                    }
                    style={{
                      background:
                        star <= rating
                          ? "rgba(16, 185, 129, 0.2)"
                          : "#090d16",

                      border:
                        star <= rating
                          ? "1px solid #10b981"
                          : "1px solid #374151",

                      color:
                        star <= rating
                          ? "#10b981"
                          : "#6b7280",

                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ★ {star}
                  </button>
                )
              )}
            </div>
          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div>
            <label
              htmlFor="feedbackCategory"
              style={{
                display: "block",
                fontSize: "13px",
                color: "#9ca3af",
                marginBottom: "6px",
              }}
            >
              Category
            </label>

            <select
              id="feedbackCategory"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#090d16",
                border:
                  "1px solid #374151",
                color: "#ffffff",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
              }}
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

          {/* =================================================
              COMMENTS
          ================================================= */}

          <div>
            <label
              htmlFor="feedbackComment"
              style={{
                display: "block",
                fontSize: "13px",
                color: "#9ca3af",
                marginBottom: "6px",
              }}
            >
              Comments*
            </label>

            <textarea
              id="feedbackComment"
              rows="5"
              placeholder="Describe your resolution experience..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 14px",
                background: "#090d16",
                border:
                  "1px solid #374151",
                color: "#ffffff",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          {/* =================================================
              ANONYMOUS NOTICE
          ================================================= */}

          <div
            style={{
              padding: "12px 14px",
              background:
                "rgba(16, 185, 129, 0.06)",
              border:
                "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "8px",
              color: "#9ca3af",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            🔒 This feedback is automatically
            anonymous. No personal information is
            collected.
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            disabled={!isVerified}
            style={{
              padding: "12px",

              background: isVerified
                ? "#10b981"
                : "#374151",

              color: "#ffffff",

              border: "none",

              borderRadius: "8px",

              fontWeight: "bold",

              cursor: isVerified
                ? "pointer"
                : "not-allowed",

              marginTop: "8px",
            }}
          >
            Submit Anonymous Feedback
          </button>

        </form>

        {/* =================================================
            BACK HOME
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "11px",
            background: "transparent",
            color: "#9ca3af",
            border:
              "1px solid #374151",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>

      </div>
    </div>
  );
};

export default Feedback;