import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Dashboard.css";

import {
  getStoredComplaints,
  saveComplaint,
} from "../utils/mockData";

import {
  getStoredFeedback,
  saveFeedback,
  hasSubmittedFeedback,
} from "../utils/feedbackData";

import {
  getStoredCategories,
} from "../utils/categoryData";

function StudentDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // CATEGORIES
  // =====================================================

  const [categories, setCategories] = useState(() => {
    try {
      const data = getStoredCategories();
      return Array.isArray(data) && data.length > 0
        ? data
        : ["Other"];
    } catch (error) {
      console.error("Unable to load categories:", error);
      return ["Other"];
    }
  });

  // =====================================================
  // COMPLAINTS
  // =====================================================

  const [complaints, setComplaints] = useState(() => {
    try {
      const data = getStoredComplaints();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Unable to load complaints:", error);
      return [];
    }
  });

  // =====================================================
  // FEEDBACKS
  // =====================================================

  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const data = getStoredFeedback();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Unable to load feedback:", error);
      return [];
    }
  });

  // =====================================================
  // COMPLAINT MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);

  const [newComplaint, setNewComplaint] = useState(() => {
    const storedCategories = getStoredCategories();

    return {
      title: "",
      category: storedCategories[0] || "Other",
      priority: "Medium",
      description: "",
    };
  });

  // =====================================================
  // FEEDBACK MODAL
  // =====================================================

  const [showFeedbackModal, setShowFeedbackModal] =
    useState(false);

  const [feedbackComplaintId, setFeedbackComplaintId] =
    useState("");

  const [feedbackRating, setFeedbackRating] =
    useState(5);

  const [feedbackCategory, setFeedbackCategory] =
    useState(() => {
      const storedCategories = getStoredCategories();
      return storedCategories[0] || "Other";
    });

  const [feedbackComment, setFeedbackComment] =
    useState("");

  const [feedbackVerified, setFeedbackVerified] =
    useState(false);

  const [feedbackVerificationMessage, setFeedbackVerificationMessage] =
    useState("");

  const [feedbackVerificationType, setFeedbackVerificationType] =
    useState("");

  // =====================================================
  // USER
  // =====================================================

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("cfms_user");

      if (!storedUser) return null;

      const parsedUser = JSON.parse(storedUser);

      return parsedUser &&
        typeof parsedUser === "object"
        ? parsedUser
        : null;
    } catch (error) {
      console.error("Unable to load user:", error);
      return null;
    }
  });

  // =====================================================
  // REFRESH CATEGORIES
  // =====================================================

  const refreshCategories = () => {
    try {
      const storedCategories = getStoredCategories();

      const updatedCategories =
        storedCategories.length > 0
          ? storedCategories
          : ["Other"];

      setCategories(updatedCategories);

      setNewComplaint((previous) => ({
        ...previous,
        category: updatedCategories.includes(
          previous.category
        )
          ? previous.category
          : updatedCategories[0],
      }));

      setFeedbackCategory((previous) =>
        updatedCategories.includes(previous)
          ? previous
          : updatedCategories[0]
      );
    } catch (error) {
      console.error("Unable to refresh categories:", error);
    }
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const pendingCount = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() === "pending"
  ).length;

  const progressCount = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() === "in progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() === "resolved"
  ).length;

  // =====================================================
  // SORT COMPLAINTS
  // =====================================================

  const sortedComplaints = useMemo(() => {
    return [...complaints].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      return dateB - dateA;
    });
  }, [complaints]);

  // =====================================================
  // SORT FEEDBACKS
  // =====================================================

  const sortedFeedbacks = useMemo(() => {
    return [...feedbacks].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      return dateB - dateA;
    });
  }, [feedbacks]);

  // =====================================================
  // COMPLAINT FORM
  // =====================================================

  const handleComplaintChange = (event) => {
    const { name, value } = event.target;

    setNewComplaint((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT COMPLAINT
  // =====================================================

  const handleSubmitComplaint = (event) => {
    event.preventDefault();

    const cleanTitle = newComplaint.title.trim();
    const cleanDescription =
      newComplaint.description.trim();

    if (!cleanTitle) {
      toast.error("Please enter a complaint title.");
      return;
    }

    if (!cleanDescription) {
      toast.error(
        "Please enter a complaint description."
      );
      return;
    }

    const complaintId = `CMP-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const createdComplaint = {
      id: complaintId,
      title: cleanTitle,
      subject: cleanTitle,
      category: newComplaint.category,
      priority: newComplaint.priority,
      description: cleanDescription,
      status: "Pending",
      anonymous: false,
      submittedBy: user?.name || "Student",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      saveComplaint(createdComplaint);

      setComplaints((previous) => [
        createdComplaint,
        ...previous,
      ]);

      const currentCategories = getStoredCategories();

      setNewComplaint({
        title: "",
        category: currentCategories[0] || "Other",
        priority: "Medium",
        description: "",
      });

      setShowModal(false);

      toast.success(
        `Complaint submitted successfully. Reference ID: ${complaintId}`
      );
    } catch (error) {
      console.error(
        "Unable to save complaint:",
        error
      );

      toast.error(
        "Unable to submit complaint. Please try again."
      );
    }
  };

  // =====================================================
  // OPEN FEEDBACK MODAL
  // =====================================================

  const openFeedbackModal = () => {
    const storedCategories = getStoredCategories();

    const currentCategories =
      storedCategories.length > 0
        ? storedCategories
        : ["Other"];

    setCategories(currentCategories);

    setFeedbackComplaintId("");
    setFeedbackRating(5);
    setFeedbackCategory(currentCategories[0]);
    setFeedbackComment("");

    setFeedbackVerified(false);
    setFeedbackVerificationMessage("");
    setFeedbackVerificationType("");

    setShowFeedbackModal(true);
  };

  // =====================================================
  // OPEN COMPLAINT MODAL
  // =====================================================

  const openComplaintModal = () => {
    refreshCategories();
    setShowModal(true);
  };

  // =====================================================
  // CLOSE FEEDBACK MODAL
  // =====================================================

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);

    setFeedbackComplaintId("");
    setFeedbackRating(5);

    const storedCategories = getStoredCategories();

    setFeedbackCategory(
      storedCategories[0] || "Other"
    );

    setFeedbackComment("");

    setFeedbackVerified(false);
    setFeedbackVerificationMessage("");
    setFeedbackVerificationType("");
  };

  // =====================================================
  // VERIFY FEEDBACK COMPLAINT
  // =====================================================

  const handleVerifyFeedbackComplaint = () => {
    const cleanId =
      feedbackComplaintId.trim();

    if (!cleanId) {
      setFeedbackVerified(false);
      setFeedbackVerificationType("error");

      setFeedbackVerificationMessage(
        "Please enter your Complaint Reference ID."
      );

      return;
    }

    const found = complaints.find(
      (complaint) =>
        complaint.id &&
        complaint.id.toLowerCase() ===
          cleanId.toLowerCase()
    );

    if (!found) {
      setFeedbackVerified(false);
      setFeedbackVerificationType("error");

      setFeedbackVerificationMessage(
        "Complaint not found. Please check your Reference ID."
      );

      return;
    }

    if (
      String(found.status || "").toLowerCase() !==
      "resolved"
    ) {
      setFeedbackVerified(false);
      setFeedbackVerificationType("warning");

      setFeedbackVerificationMessage(
        `Complaint found, but its current status is "${found.status}". Feedback is available only after the complaint is resolved.`
      );

      return;
    }

    if (hasSubmittedFeedback(found.id)) {
      setFeedbackVerified(false);
      setFeedbackVerificationType("warning");

      setFeedbackVerificationMessage(
        "Feedback has already been submitted for this complaint."
      );

      return;
    }

    setFeedbackVerified(true);
    setFeedbackVerificationType("success");

    setFeedbackVerificationMessage(
      "Complaint verified. You can now submit your feedback."
    );
  };

  // =====================================================
  // FEEDBACK ID CHANGE
  // =====================================================

  const handleFeedbackComplaintIdChange = (event) => {
    setFeedbackComplaintId(event.target.value);

    setFeedbackVerified(false);
    setFeedbackVerificationMessage("");
    setFeedbackVerificationType("");
  };

  // =====================================================
  // SUBMIT STUDENT FEEDBACK
  // =====================================================

  const handleSubmitStudentFeedback = (event) => {
    event.preventDefault();

    const cleanComplaintId =
      feedbackComplaintId.trim().toUpperCase();

    const cleanComment =
      feedbackComment.trim();

    if (!cleanComplaintId) {
      toast.error(
        "Please enter your Complaint Reference ID."
      );
      return;
    }

    if (!feedbackVerified) {
      toast.error(
        "Please verify your Complaint Reference ID first."
      );
      return;
    }

    if (!cleanComment) {
      toast.error(
        "Please enter your feedback comments."
      );
      return;
    }

    const feedbackObj = {
      complaintId: cleanComplaintId,
      rating: feedbackRating,
      category: feedbackCategory,
      comment: cleanComment,

      anonymous: false,

      submittedBy:
        user?.name ||
        user?.fullName ||
        "Student",

      studentId: user?.studentId || "",
      email: user?.email || "",

      date: new Date()
        .toISOString()
        .split("T")[0],
    };

    try {
      saveFeedback(feedbackObj);

      setFeedbacks((previous) => [
        feedbackObj,
        ...previous,
      ]);

      closeFeedbackModal();

      toast.success(
        "Your feedback has been submitted successfully."
      );
    } catch (error) {
      console.error(
        "Unable to save feedback:",
        error
      );

      toast.error(
        "Unable to submit feedback. Please try again."
      );
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("cfms_user");
    localStorage.removeItem("userRole");

    navigate("/login");
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const getComplaintTitle = (complaint) => {
    return (
      complaint.title ||
      complaint.subject ||
      "Untitled Complaint"
    );
  };

  const getStatusClass = (status) => {
    const cleanStatus = String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `status-${cleanStatus}`;
  };

  const getPriorityClass = (priority) => {
    const cleanPriority = String(priority || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `priority-${cleanPriority}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const displayName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Student";

  return (
    <>
      <Navbar />

      <div className="dashboard-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="sidebar">

          <div className="sidebar-brand">
            <div className="logo-box">C</div>

            <span>CampusVoice</span>
          </div>

          <nav className="sidebar-menu">

            <a href="#overview" className="active">
              Overview
            </a>

            <a href="#my-complaints">
              My Complaints
            </a>

            <a href="#my-feedbacks">
              My Feedbacks
            </a>

            <Link to="/profile">
              Profile
            </Link>

          </nav>
        </aside>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="dashboard-content">

          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="dashboard-header"
            id="overview"
          >
            <div>

              <span className="dashboard-eyebrow">
                CAMPUSVOICE STUDENT PORTAL
              </span>

              <h1>Student Dashboard</h1>

              <p>
                Welcome back, {displayName}. Track your
                complaints, feedback, and campus concerns.
              </p>

            </div>

            <button
              type="button"
              className="btn-primary-large"
              onClick={openComplaintModal}
            >
              + Submit New Complaint
            </button>

          </header>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="dashboard-stats">

            <div className="stat-card">
              <h3>Total Complaints</h3>
              <p>{complaints.length}</p>
              <small>
                All submitted complaints
              </small>
            </div>

            <div className="stat-card">
              <h3>Pending</h3>
              <p>{pendingCount}</p>
              <small>
                Awaiting review
              </small>
            </div>

            <div className="stat-card">
              <h3>In Progress</h3>
              <p>{progressCount}</p>
              <small>
                Currently being handled
              </small>
            </div>

            <div className="stat-card">
              <h3>Resolved</h3>
              <p>{resolvedCount}</p>
              <small>
                Successfully resolved
              </small>
            </div>

          </div>

          {/* =================================================
              COMPLAINTS + FEEDBACKS
          ================================================= */}

          <div className="dashboard-split-row">

            {/* =================================================
                MY COMPLAINTS
            ================================================= */}

            <section
              className="dashboard-section split-col"
              id="my-complaints"
            >

              <div className="section-heading-row">

                <div>

                  <span className="section-eyebrow">
                    COMPLAINT MANAGEMENT
                  </span>

                  <h2>My Complaints</h2>

                  <p>
                    View and track the complaints you
                    have submitted.
                  </p>

                </div>

                <Link
                  to="/track-complaint"
                  className="section-link"
                >
                  Track Complaint
                </Link>

              </div>

              {sortedComplaints.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-state-icon">
                    C
                  </div>

                  <h3>No complaints yet</h3>

                  <p>
                    You have not submitted any complaints.
                  </p>

                  <button
                    type="button"
                    className="empty-state-btn"
                    onClick={openComplaintModal}
                  >
                    Submit Your First Complaint
                  </button>

                </div>
              ) : (

                <div className="table-container">

                  <table className="custom-table">

                    <thead>

                      <tr>
                        <th>Complaint ID</th>
                        <th>Complaint</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>

                    </thead>

                    <tbody>

                      {sortedComplaints.map(
                        (complaint) => (
                          <tr key={complaint.id}>

                            <td>
                              <strong>
                                {complaint.id}
                              </strong>
                            </td>

                            <td>

                              <div className="complaint-title-cell">

                                <span>
                                  {getComplaintTitle(
                                    complaint
                                  )}
                                </span>

                                {complaint.description && (
                                  <small>
                                    {complaint.description
                                      .length > 65
                                      ? `${complaint.description.slice(
                                          0,
                                          65
                                        )}...`
                                      : complaint.description}
                                  </small>
                                )}

                              </div>

                            </td>

                            <td>

                              <span className="category-badge">
                                {complaint.category ||
                                  "Other"}
                              </span>

                            </td>

                            <td>
                              {formatDate(
                                complaint.date
                              )}
                            </td>

                            <td>

                              <span
                                className={`badge ${getPriorityClass(
                                  complaint.priority
                                )}`}
                              >
                                {complaint.priority ||
                                  "Medium"}
                              </span>

                            </td>

                            <td>

                              <span
                                className={`badge ${getStatusClass(
                                  complaint.status
                                )}`}
                              >
                                {complaint.status ||
                                  "Pending"}
                              </span>

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>
              )}

            </section>

            {/* =================================================
                MY FEEDBACKS
            ================================================= */}

            <section
              className="dashboard-section split-col"
              id="my-feedbacks"
            >

              <div className="section-heading-row">

                <div>

                  <span className="section-eyebrow">
                    FEEDBACK MANAGEMENT
                  </span>

                  <h2>My Feedbacks</h2>

                  <p>
                    Review the feedback you have submitted
                    through CampusVoice.
                  </p>

                </div>

                <button
                  type="button"
                  className="section-link feedback-link-button"
                  onClick={openFeedbackModal}
                >
                  Give Feedback
                </button>

              </div>

              {sortedFeedbacks.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-state-icon">
                    F
                  </div>

                  <h3>No feedback submitted</h3>

                  <p>
                    Your submitted feedback will appear
                    here.
                  </p>

                  <button
                    type="button"
                    className="empty-state-btn"
                    onClick={openFeedbackModal}
                  >
                    Give Feedback
                  </button>

                </div>
              ) : (

                <div className="feedback-list">

                  {sortedFeedbacks.map(
                    (feedback, index) => (

                      <article
                        className="feedback-card"
                        key={
                          feedback.id ||
                          `${feedback.complaintId}-${feedback.date}-${index}`
                        }
                      >

                        <div className="feedback-card-header">

                          <div>

                            <span className="feedback-complaint-id">
                              {feedback.complaintId ||
                                "Feedback"}
                            </span>

                            <h3>
                              {feedback.category ||
                                "Other"}
                            </h3>

                          </div>

                          <span className="anonymous-badge">
                            Submitted
                          </span>

                        </div>

                        <div className="feedback-rating-row">

                          <span className="feedback-rating-label">
                            Rating
                          </span>

                          <strong className="feedback-rating">
                            {feedback.rating || 0}/5
                          </strong>

                        </div>

                        <p className="feedback-comment">
                          {feedback.comment ||
                            "No comment provided."}
                        </p>

                        <div className="feedback-card-footer">

                          <span>
                            Submitted on{" "}
                            {formatDate(feedback.date)}
                          </span>

                          <span>
                            {feedback.id ||
                              "Feedback"}
                          </span>

                        </div>

                      </article>

                    )
                  )}

                </div>
              )}

            </section>

          </div>

          {/* =================================================
              PROFILE PREVIEW
          ================================================= */}

          <section className="profile-preview-section">

            <div className="profile-preview-content">

              <span className="section-eyebrow">
                STUDENT ACCOUNT
              </span>

              <h2>Your Profile</h2>

              <p>
                View your CampusVoice student profile.
              </p>

            </div>

            <Link
              to="/profile"
              className="profile-preview-btn"
            >
              View My Profile
            </Link>

          </section>

          {/* =================================================
              CAMPUS SERVICES
          ================================================= */}

          <section className="manage-section">

            <div className="manage-content">

              <span className="section-eyebrow">
                CAMPUSVOICE SERVICES
              </span>

              <h2>
                Manage Your Campus Concerns
              </h2>

            </div>

            <div className="manage-actions">

              <button
                type="button"
                className="manage-action primary"
                onClick={openComplaintModal}
              >
                Submit Complaint
              </button>

              <button
                type="button"
                className="manage-action"
                onClick={openFeedbackModal}
              >
                Give Feedback
              </button>

              <Link
                to="/track-complaint"
                className="manage-action"
              >
                Track Complaint
              </Link>

            </div>

          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <Footer />

        </main>
      </div>

      {/* =====================================================
          SUBMIT COMPLAINT MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target === event.currentTarget
            ) {
              setShowModal(false);
            }

          }}
        >

          <div className="modal-body">

            <div className="modal-header">

              <div>

                <span className="modal-eyebrow">
                  CAMPUSVOICE
                </span>

                <h2>
                  Submit New Complaint
                </h2>

                <p>
                  Provide the details of the issue you
                  would like the institution to review.
                </p>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmitComplaint}>

              <div className="form-group">

                <label htmlFor="complaint-title">
                  Complaint Title
                </label>

                <input
                  id="complaint-title"
                  name="title"
                  type="text"
                  placeholder="Enter complaint title"
                  value={newComplaint.title}
                  onChange={handleComplaintChange}
                  required
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="complaint-category">
                    Category
                  </label>

                  <select
                    id="complaint-category"
                    name="category"
                    value={newComplaint.category}
                    onChange={handleComplaintChange}
                  >

                    {categories.map((categoryName) => (
                      <option
                        key={categoryName}
                        value={categoryName}
                      >
                        {categoryName}
                      </option>
                    ))}

                  </select>

                </div>

                <div className="form-group">

                  <label htmlFor="complaint-priority">
                    Priority
                  </label>

                  <select
                    id="complaint-priority"
                    name="priority"
                    value={newComplaint.priority}
                    onChange={handleComplaintChange}
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

              <div className="form-group">

                <label htmlFor="complaint-description">
                  Description
                </label>

                <textarea
                  id="complaint-description"
                  name="description"
                  rows="5"
                  placeholder="Describe the issue in detail..."
                  value={newComplaint.description}
                  onChange={handleComplaintChange}
                  required
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit Complaint
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          STUDENT FEEDBACK MODAL
      ===================================================== */}

      {showFeedbackModal && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target === event.currentTarget
            ) {
              closeFeedbackModal();
            }

          }}
        >

          <div className="modal-body feedback-modal-body">

            <div className="modal-header">

              <div>

                <span className="modal-eyebrow">
                  CAMPUSVOICE
                </span>

                <h2>
                  Submit Feedback
                </h2>

                <p>
                  Share your experience after your
                  complaint has been resolved.
                </p>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeFeedbackModal}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmitStudentFeedback}
            >

              {/* COMPLAINT ID */}

              <div className="form-group">

                <label htmlFor="student-feedback-id">
                  Complaint Reference ID
                </label>

                <div className="feedback-verify-row">

                  <input
                    id="student-feedback-id"
                    type="text"
                    placeholder="Example: CMP-1234"
                    value={feedbackComplaintId}
                    onChange={
                      handleFeedbackComplaintIdChange
                    }
                  />

                  <button
                    type="button"
                    className="verify-feedback-btn"
                    onClick={
                      handleVerifyFeedbackComplaint
                    }
                  >
                    Verify
                  </button>

                </div>

                {feedbackVerificationMessage && (

                  <div
                    className={`feedback-verification-message ${feedbackVerificationType}`}
                  >
                    {feedbackVerificationMessage}
                  </div>

                )}

              </div>

              {/* RATING */}

              <div className="form-group">

                <label>
                  Rating
                </label>

                <div className="student-rating-options">

                  {[1, 2, 3, 4, 5].map(
                    (number) => (

                      <button
                        type="button"
                        key={number}
                        className={
                          number === feedbackRating
                            ? "student-rating-btn active"
                            : "student-rating-btn"
                        }
                        onClick={() =>
                          setFeedbackRating(number)
                        }
                      >
                        {number}
                      </button>

                    )
                  )}

                </div>

                <small className="student-rating-label">
                  Selected rating:{" "}
                  {feedbackRating} out of 5
                </small>

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label htmlFor="student-feedback-category">
                  Category
                </label>

                <select
                  id="student-feedback-category"
                  value={feedbackCategory}
                  onChange={(event) =>
                    setFeedbackCategory(
                      event.target.value
                    )
                  }
                >

                  {categories.map((categoryName) => (
                    <option
                      key={categoryName}
                      value={categoryName}
                    >
                      {categoryName}
                    </option>
                  ))}

                </select>

              </div>

              {/* COMMENTS */}

              <div className="form-group">

                <label htmlFor="student-feedback-comment">
                  Comments
                </label>

                <textarea
                  id="student-feedback-comment"
                  rows="5"
                  placeholder="Describe your complaint resolution experience..."
                  value={feedbackComment}
                  onChange={(event) =>
                    setFeedbackComment(
                      event.target.value
                    )
                  }
                />

              </div>

              {/* ACCOUNT NOTICE */}

              <div className="student-feedback-note">

                <strong>
                  Student feedback
                </strong>

                <span>
                  This feedback will be submitted through
                  your CampusVoice student account.
                </span>

              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeFeedbackModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!feedbackVerified}
                  style={{
                    opacity: feedbackVerified
                      ? 1
                      : 0.5,
                    cursor: feedbackVerified
                      ? "pointer"
                      : "not-allowed",
                  }}
                >
                  Submit Feedback
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================================
          FEEDBACK MODAL STYLES
      ===================================================== */}

      <style>{`

        .feedback-link-button {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
        }

        .feedback-modal-body {
          max-width: 650px;
        }

        .feedback-verify-row {
          display: flex;
          gap: 10px;
        }

        .feedback-verify-row input {
          flex: 1;
          min-width: 0;
        }

        .verify-feedback-btn {
          padding: 11px 18px;
          border: none;
          border-radius: 8px;
          background: #10b981;
          color: #022c22;
          font-weight: 700;
          cursor: pointer;
        }

        .verify-feedback-btn:hover {
          background: #34d399;
        }

        .feedback-verification-message {
          margin-top: 7px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.5;
        }

        .feedback-verification-message.success {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
        }

        .feedback-verification-message.warning {
          background: rgba(251, 191, 36, 0.08);
          border: 1px solid rgba(251, 191, 36, 0.25);
          color: #fbbf24;
        }

        .feedback-verification-message.error {
          background: rgba(248, 113, 113, 0.08);
          border: 1px solid rgba(248, 113, 113, 0.25);
          color: #f87171;
        }

        .student-rating-options {
          display: flex;
          gap: 10px;
        }

        .student-rating-btn {
          width: 46px;
          height: 42px;

          background: #ffffff;
          color: #047857;

          border: 1px solid #10b981;
          border-radius: 8px;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        .student-rating-btn:hover {
          background: #d1fae5;
          color: #065f46;
          border-color: #059669;
          transform: translateY(-1px);
        }

        .student-rating-btn.active {
          background: #10b981;
          color: #ffffff;
          border-color: #10b981;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.22);
        }

        .student-rating-btn.active:hover {
          background: #059669;
          color: #ffffff;
        }

        .student-rating-label {
          color: #64748b;
          font-size: 12px;
        }

        .student-feedback-note {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 14px;
          margin-top: 4px;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 9px;
        }

        .student-feedback-note strong {
          color: #34d399;
          font-size: 12px;
        }

        .student-feedback-note span {
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 600px) {

          .feedback-verify-row {
            flex-direction: column;
          }

          .verify-feedback-btn {
            width: 100%;
          }

          .student-rating-options {
            flex-wrap: wrap;
          }

        }

      `}</style>
    </>
  );
}

export default StudentDashboard;