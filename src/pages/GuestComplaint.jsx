import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { saveComplaint } from "../utils/mockData";
import "../styles/Auth.css";

const GuestComplaint = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "Library",
    subject: "",
    description: "",
    priority: "Medium",
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const categories = [
    "Library",
    "Hostel",
    "Canteen",
    "Academic",
    "Infrastructure",
    "Transport",
    "Administration",
    "Other",
  ];

  const priorities = ["Low", "Medium", "High", "Urgent"];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setFormData((previous) => ({
      ...previous,
      file,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.subject.trim() || !formData.description.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      const generatedId = `CFMS-2026-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

      const newEntry = {
        id: generatedId,
        category: formData.category,
        subject: formData.subject.trim(),
        title: formData.subject.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
        attachmentName: formData.file
          ? formData.file.name
          : null,
      };

      /*
       * Save through existing utility
       */
      saveComplaint(newEntry);

      /*
       * Also keep Admin Dashboard data synchronized.
       */
      const existingComplaints = JSON.parse(
        localStorage.getItem("cfms_complaints") || "[]"
      );

      localStorage.setItem(
        "cfms_complaints",
        JSON.stringify([
          newEntry,
          ...existingComplaints,
        ])
      );

      setLoading(false);
      setSubmittedData(newEntry);
    }, 700);
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <div className="auth-card guest-card">

          {!submittedData ? (
            <>
              {/* Header */}
              <div className="auth-header">

                <span className="auth-eyebrow">
                  CAMPUSVOICE
                </span>

                <h1>
                  Lodge a Complaint
                </h1>

                <p>
                  Register your concern and allow the
                  campus administration to review and
                  resolve it.
                </p>

              </div>

              {/* Error */}
              {error && (
                <div className="form-error">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >

                {/* Category + Priority */}
                <div className="form-row">

                  <div className="form-group">
                    <label htmlFor="category">
                      Category
                      <span className="required">*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>


                  <div className="form-group">
                    <label htmlFor="priority">
                      Priority
                      <span className="required">*</span>
                    </label>

                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      required
                    >
                      {priorities.map((priority) => (
                        <option
                          key={priority}
                          value={priority}
                        >
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>


                {/* Subject */}
                <div className="form-group">

                  <label htmlFor="subject">
                    Subject / Title
                    <span className="required">*</span>
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Briefly describe your issue"
                    value={formData.subject}
                    onChange={handleChange}
                  />

                </div>


                {/* Description */}
                <div className="form-group">

                  <label htmlFor="description">
                    Detailed Description
                    <span className="required">*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    maxLength="500"
                    required
                    placeholder="Provide details about your concern..."
                    value={formData.description}
                    onChange={handleChange}
                  />

                  <small className="character-count">
                    {formData.description.length}/500
                  </small>

                </div>


                {/* Attachment */}
                <div className="form-group">

                  <label htmlFor="file">
                    Attachment
                    <span className="optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={handleFileChange}
                  />

                  {formData.file && (
                    <small className="file-name">
                      Selected: {formData.file.name}
                    </small>
                  )}

                </div>


                {/* Submit */}
                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Submitting Complaint..."
                    : "Submit Complaint"}
                </button>

              </form>

              {/* Back */}
              <div className="auth-footer">

                <button
                  type="button"
                  className="back-button"
                  onClick={() => navigate("/")}
                >
                  ← Back to Home
                </button>

              </div>
            </>
          ) : (

            /* SUCCESS */
            <div className="guest-success">

              <span className="auth-eyebrow">
                SUBMISSION SUCCESSFUL
              </span>

              <h1>
                Complaint Submitted
              </h1>

              <p>
                Your complaint has been successfully
                registered with CampusVoice.
              </p>

              <div className="tracking-id">

                <span>
                  REFERENCE ID
                </span>

                <strong>
                  {submittedData.id}
                </strong>

              </div>

              <p className="tracking-message">
                Keep this reference ID to track the
                progress of your complaint.
              </p>

              <div className="success-actions">

                <button
                  type="button"
                  className="auth-submit"
                  onClick={() =>
                    navigate(
                      `/track-complaint?id=${submittedData.id}`
                    )
                  }
                >
                  Track Complaint
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setSubmittedData(null);
                    setFormData({
                      category: "Library",
                      subject: "",
                      description: "",
                      priority: "Medium",
                      file: null,
                    });
                  }}
                >
                  Lodge Another Complaint
                </button>

              </div>

            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default GuestComplaint;