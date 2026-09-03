import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import { saveComplaint } from "../utils/mockData";

const GuestComplaint = () => {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const [formData, setFormData] = useState({
    category: "Library",
    priority: "Medium",
    subject: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.subject.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newId = `CFMS-2026-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    const complaintObj = {
      id: newId,
      category: formData.category,
      priority: formData.priority,
      subject: formData.subject.trim(),
      description: formData.description.trim(),

      anonymous: true,
      submittedBy: "Guest",

      status: "Pending",

      date: new Date()
        .toISOString()
        .split("T")[0],
    };

    saveComplaint(complaintObj);

    setReferenceId(newId);
    setSubmitted(true);

    toast.success(
      "Anonymous complaint submitted successfully."
    );
  };

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (submitted) {
    return (
      <>
        <Navbar />

        <div className="guest-page">

          <div className="guest-card success-card">

            <span className="page-label">
              ANONYMOUS SUBMISSION SUCCESSFUL
            </span>

            <h2>Complaint Submitted</h2>

            <p>
              Your complaint has been submitted anonymously.
              No personal information was required.
            </p>

            <div className="reference-box">

              <span>REFERENCE ID</span>

              <strong>{referenceId}</strong>

            </div>

            <p className="reference-note">
              Save this Reference ID to track your complaint
              later.
            </p>

            <div className="guest-actions">

              <button
                onClick={() =>
                  navigate(
                    `/track-complaint?id=${referenceId}`
                  )
                }
                className="primary-action"
              >
                Track Complaint
              </button>

              <button
                onClick={() => {
                  setSubmitted(false);

                  setFormData({
                    category: "Library",
                    priority: "Medium",
                    subject: "",
                    description: "",
                  });
                }}
                className="secondary-action"
              >
                Submit Another Complaint
              </button>

              <button
                onClick={() => navigate("/")}
                className="home-action"
              >
                Back to Home
              </button>

            </div>

          </div>

        </div>
      </>
    );
  }

  // =====================================================
  // FORM
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="guest-page">

        <div className="guest-card">

          <div className="anonymous-notice">

            <div className="notice-title">
              ANONYMOUS REPORTING
            </div>

            <div className="notice-text">
              No name, email, password, student ID, or account
              is required. Your complaint will be submitted
              anonymously.
            </div>

          </div>

          <div className="page-header">

            <span className="page-label">
              CAMPUS CONCERN
            </span>

            <h1>Anonymous Complaint</h1>

            <p>
              Report a campus concern directly to the
              appropriate administration team.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="complaint-form"
          >

            {/* CATEGORY + PRIORITY */}

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Category*
                </label>

                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                >
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

              <div className="form-group">

                <label>
                  Priority*
                </label>

                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>
                </select>

              </div>

            </div>

            {/* SUBJECT */}

            <div className="form-group">

              <label>
                Subject / Title*
              </label>

              <input
                type="text"
                placeholder="Briefly describe your issue"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject: e.target.value,
                  })
                }
              />

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Detailed Description*
              </label>

              <textarea
                rows="6"
                placeholder="Provide details about your concern..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />

            </div>

            <button
              type="submit"
              className="submit-complaint-btn"
            >
              Submit Anonymous Complaint
            </button>

          </form>

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

        .guest-page {
          min-height: calc(100vh - 64px);
          background: #030712;
          color: #ffffff;
          padding: 45px 20px;
          box-sizing: border-box;
        }

        .guest-card {
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

          background: rgba(56, 189, 248, 0.07);

          border: 1px solid rgba(56, 189, 248, 0.22);

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

        .page-header {
          margin-bottom: 28px;
        }

        .page-label {
          color: #34d399;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.8px;
        }

        .page-header h1 {
          margin: 8px 0;
          font-size: 30px;
          line-height: 1.2;
        }

        .page-header p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        .complaint-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
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

          outline: none;

          font-family: inherit;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #10b981;

          box-shadow:
            0 0 0 3px rgba(16, 185, 129, 0.08);
        }

        .form-group textarea {
          resize: vertical;
        }

        .submit-complaint-btn {
          border: none;

          padding: 13px 18px;

          background: #10b981;

          color: #022c22;

          border-radius: 9px;

          font-size: 14px;

          font-weight: 700;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .submit-complaint-btn:hover {
          background: #34d399;
          transform: translateY(-1px);
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

        /* SUCCESS */

        .success-card {
          max-width: 550px;
          text-align: center;
        }

        .success-card h2 {
          margin: 10px 0;

          font-size: 28px;
        }

        .success-card > p {
          color: #94a3b8;
          line-height: 1.6;
          font-size: 14px;
        }

        .reference-box {
          margin: 25px 0 14px;

          padding: 18px;

          border: 1px dashed #10b981;

          background: rgba(16, 185, 129, 0.05);

          border-radius: 10px;
        }

        .reference-box span {
          display: block;

          color: #94a3b8;

          font-size: 11px;

          letter-spacing: 1px;

          margin-bottom: 7px;
        }

        .reference-box strong {
          color: #38bdf8;

          font-size: 21px;

          letter-spacing: 1px;
        }

        .reference-note {
          color: #fbbf24 !important;
          font-size: 12px !important;
        }

        .guest-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 24px;
        }

        .guest-actions button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .primary-action {
          background: #10b981;
          color: #ffffff;
          border: none;
        }

        .secondary-action {
          background: #172331;
          color: #ffffff;
          border: 1px solid #334155;
        }

        .home-action {
          background: transparent;
          color: #94a3b8;
          border: 1px solid #334155;
        }

        @media (max-width: 600px) {

          .guest-page {
            padding: 25px 15px;
          }

          .guest-card {
            padding: 22px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .page-header h1 {
            font-size: 25px;
          }

        }

      `}</style>
    </>
  );
};

export default GuestComplaint;