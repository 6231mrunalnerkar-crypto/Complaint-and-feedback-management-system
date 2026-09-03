import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

import {
  getStoredComplaints,
  saveComplaint,
} from "../utils/mockData";

import {
  getStoredFeedback,
} from "../utils/feedbackData";

function StudentDashboard() {
  const navigate = useNavigate();

  /* =========================================================
     LOAD COMPLAINTS
     ========================================================= */

  const [complaints, setComplaints] = useState(() => {
    try {
      const data = getStoredComplaints();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Unable to load complaints:", error);
      return [];
    }
  });

  /* =========================================================
     LOAD FEEDBACK
     ========================================================= */
     
     const feedbacks = (() => {
      try {
        const data = getStoredFeedback();
        return Array.isArray(data) ? data : [];
      } catch (error) {console.error("Unable to load feedback:", error);
        return [];
      }
    })();

  /* =========================================================
     MODAL
     ========================================================= */

  const [showModal, setShowModal] = useState(false);

  const [newComplaint, setNewComplaint] = useState({
    title: "",
    category: "Infrastructure",
    priority: "Medium",
    description: "",
  });

  /* =========================================================
     USER
     ========================================================= */

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("cfms_user");

      if (!storedUser) {
        return null;
      }

      const parsedUser = JSON.parse(storedUser);

      return parsedUser && typeof parsedUser === "object"
        ? parsedUser
        : null;
    } catch (error) {
      console.error("Unable to load user:", error);
      return null;
    }
  });

  /* =========================================================
     COMPLAINT COUNTS
     ========================================================= */

  const pendingCount = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() === "pending"
  ).length;

  const progressCount = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() ===
      "in progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() ===
      "resolved"
  ).length;

  /* =========================================================
     SORT COMPLAINTS
     ========================================================= */

  const sortedComplaints = useMemo(() => {
    return [...complaints].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      return dateB - dateA;
    });
  }, [complaints]);

  /* =========================================================
     SORT FEEDBACK
     ========================================================= */

  const sortedFeedbacks = useMemo(() => {
    return [...feedbacks].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      return dateB - dateA;
    });
  }, [feedbacks]);

  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleComplaintChange = (event) => {
    const { name, value } = event.target;

    setNewComplaint((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     SUBMIT COMPLAINT
     ========================================================= */

  const handleSubmitComplaint = (event) => {
    event.preventDefault();

    const cleanTitle = newComplaint.title.trim();
    const cleanDescription = newComplaint.description.trim();

    if (!cleanTitle) {
      alert("Please enter a complaint title.");
      return;
    }

    if (!cleanDescription) {
      alert("Please enter a complaint description.");
      return;
    }

    const complaintId = `CMP-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const createdComplaint = {
      id: complaintId,

      title: cleanTitle,

      /*
        Keep subject as well so the complaint works
        consistently with the rest of the CFMS project.
      */
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

      setNewComplaint({
        title: "",
        category: "Infrastructure",
        priority: "Medium",
        description: "",
      });

      setShowModal(false);

      alert(
        `Complaint submitted successfully.\nReference ID: ${complaintId}`
      );
    } catch (error) {
      console.error("Unable to save complaint:", error);
      alert("Unable to submit complaint. Please try again.");
    }
  };

  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("cfms_user");
    navigate("/login");
  };

  /* =========================================================
     TITLE HELPER
     ========================================================= */

  const getComplaintTitle = (complaint) => {
    return (
      complaint.title ||
      complaint.subject ||
      "Untitled Complaint"
    );
  };

  /* =========================================================
     STATUS CLASS
     ========================================================= */

  const getStatusClass = (status) => {
    const cleanStatus = String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `status-${cleanStatus}`;
  };

  /* =========================================================
     PRIORITY CLASS
     ========================================================= */

  const getPriorityClass = (priority) => {
    const cleanPriority = String(priority || "")
      .toLowerCase()
      .replace(/\s+/g, "-");

    return `priority-${cleanPriority}`;
  };

  /* =========================================================
     FORMAT DATE
     ========================================================= */

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

  /* =========================================================
     DISPLAY NAME
     ========================================================= */

  const displayName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    "Student";

  return (
    <>
      {/* =====================================================
          GLOBAL NAVBAR
          ===================================================== */}

      <Navbar />

      {/* =====================================================
          DASHBOARD
          ===================================================== */}

      <div className="dashboard-layout">

        {/* ===================================================
            SIDEBAR
            =================================================== */}

        <aside className="sidebar">

          <div className="sidebar-brand">

            <div className="logo-box">
              C
            </div>

            <span>
              CampusVoice
            </span>

          </div>

          <nav className="sidebar-menu">

            <a
              href="#overview"
              className="active"
            >
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

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </nav>

        </aside>

        {/* ===================================================
            MAIN CONTENT
            =================================================== */}

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

              <h1>
                Student Dashboard
              </h1>

              <p>
                Welcome back, {displayName}. Track your
                complaints, feedback, and campus concerns.
              </p>

            </div>

            <button
              type="button"
              className="btn-primary-large"
              onClick={() => setShowModal(true)}
            >
              + Submit New Complaint
            </button>

          </header>

          {/* =================================================
              STATISTICS
              ================================================= */}

          <div className="dashboard-stats">

            <div className="stat-card">

              <h3>
                Total Complaints
              </h3>

              <p>
                {complaints.length}
              </p>

              <small>
                All submitted complaints
              </small>

            </div>

            <div className="stat-card">

              <h3>
                Pending
              </h3>

              <p>
                {pendingCount}
              </p>

              <small>
                Awaiting review
              </small>

            </div>

            <div className="stat-card">

              <h3>
                In Progress
              </h3>

              <p>
                {progressCount}
              </p>

              <small>
                Currently being handled
              </small>

            </div>

            <div className="stat-card">

              <h3>
                Resolved
              </h3>

              <p>
                {resolvedCount}
              </p>

              <small>
                Successfully resolved
              </small>

            </div>

          </div>

          {/* =================================================
              MY COMPLAINTS
              ================================================= */}

          <section
            className="dashboard-section"
            id="my-complaints"
          >

            <div className="section-heading-row">

              <div>
                <span className="section-eyebrow">
                  COMPLAINT MANAGEMENT
                </span>

                <h2>
                  My Complaints
                </h2>

                <p>
                  View and track the complaints you have
                  submitted.
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

                <h3>
                  No complaints yet
                </h3>

                <p>
                  You have not submitted any complaints.
                </p>

                <button
                  type="button"
                  className="empty-state-btn"
                  onClick={() => setShowModal(true)}
                >
                  Submit Your First Complaint
                </button>

              </div>

            ) : (

              <div className="table-container">

                <table className="custom-table">

                  <thead>
                    <tr>
                      <th>
                        Complaint ID
                      </th>

                      <th>
                        Complaint
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Priority
                      </th>

                      <th>
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {sortedComplaints.map((complaint) => (

                      <tr key={complaint.id}>

                        <td>
                          <strong>
                            {complaint.id}
                          </strong>
                        </td>

                        <td>
                          <div className="complaint-title-cell">

                            <span>
                              {getComplaintTitle(complaint)}
                            </span>

                            {complaint.description && (
                              <small>
                                {complaint.description.length > 65
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
                            {complaint.category || "Other"}
                          </span>
                        </td>

                        <td>
                          {formatDate(complaint.date)}
                        </td>

                        <td>
                          <span
                            className={`badge ${getPriorityClass(
                              complaint.priority
                            )}`}
                          >
                            {complaint.priority || "Medium"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status || "Pending"}
                          </span>
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

          {/* =================================================
              MY FEEDBACKS
              ================================================= */}

          <section
            className="dashboard-section"
            id="my-feedbacks"
          >

            <div className="section-heading-row">

              <div>
                <span className="section-eyebrow">
                  FEEDBACK MANAGEMENT
                </span>

                <h2>
                  My Feedbacks
                </h2>

                <p>
                  Review the feedback you have submitted
                  through CampusVoice.
                </p>
              </div>

              <Link
                to="/feedback"
                className="section-link"
              >
                Give Feedback
              </Link>

            </div>

            {sortedFeedbacks.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No feedback submitted
                </h3>

                <p>
                  Your submitted feedback will appear here.
                </p>

                <Link
                  to="/feedback"
                  className="empty-state-btn"
                >
                  Submit Feedback
                </Link>

              </div>

            ) : (

              <div className="feedback-list">

                {sortedFeedbacks.map((feedback) => (

                  <article
                    className="feedback-card"
                    key={feedback.id}
                  >

                    <div className="feedback-card-header">

                      <div>

                        <span className="feedback-complaint-id">
                          {feedback.complaintId || "Complaint"}
                        </span>

                        <h3>
                          {feedback.category || "General"}
                        </h3>

                      </div>

                      <span className="anonymous-badge">
                        Anonymous
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
                      {feedback.comment || "No comment provided."}
                    </p>

                    <div className="feedback-card-footer">

                      <span>
                        Submitted on{" "}
                        {formatDate(feedback.date)}
                      </span>

                      <span>
                        {feedback.id || "Feedback"}
                      </span>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

          {/* =================================================
              PROFILE PREVIEW
              ================================================= */}

          <section
            className="profile-preview-section"
          >

            <div className="profile-preview-content">

              <span className="section-eyebrow">
                STUDENT ACCOUNT
              </span>

              <h2>
                Your Profile
              </h2>

              <p>
                View the personal, contact, student, and
                account information submitted during registration.
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
              MANAGE CAMPUS CONCERNS
              ================================================= */}

          <section
            className="manage-section"
          >

            <div className="manage-content">

              <span className="section-eyebrow">
                CAMPUSVOICE SERVICES
              </span>

              <h2>
                Manage Your Campus Concerns
              </h2>

              <p>
                Submit complaints, track existing issues,
                and share anonymous feedback through
                CampusVoice.
              </p>

            </div>

            <div className="manage-actions">

              <button
                type="button"
                className="manage-action primary"
                onClick={() => setShowModal(true)}
              >
                Submit Complaint
              </button>

              <Link
                to="/track-complaint"
                className="manage-action"
              >
                Track Complaint
              </Link>

              <Link
                to="/feedback"
                className="manage-action"
              >
                Anonymous Feedback
              </Link>

            </div>

          </section>

          {/* =================================================
              FOOTER
              ================================================= */}

          <footer className="dashboard-footer">

            <div className="dashboard-footer-top">

              <div className="dashboard-footer-brand">

                <div className="dashboard-footer-logo">
                  C
                </div>

                <div>
                  <strong>
                    CampusVoice
                  </strong>

                  <span>
                    Complaint & Feedback Management System
                  </span>
                </div>

              </div>

              <div className="dashboard-footer-links">

                <Link to="/">
                  Home
                </Link>

                <Link to="/student-dashboard">
                  Dashboard
                </Link>

                <Link to="/track-complaint">
                  Track Complaint
                </Link>

                <Link to="/feedback">
                  Feedback
                </Link>

                <Link to="/profile">
                  Profile
                </Link>

              </div>

            </div>

            <div className="dashboard-footer-bottom">

              <span>
                CampusVoice Student Portal
              </span>

              <span>
                © 2026 CampusVoice
              </span>

            </div>

          </footer>

        </main>

      </div>

      {/* =====================================================
          COMPLAINT MODAL
          ===================================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
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

            <form
              onSubmit={handleSubmitComplaint}
            >

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
                    <option value="Infrastructure">
                      Infrastructure
                    </option>

                    <option value="Academic">
                      Academic
                    </option>

                    <option value="Hostel">
                      Hostel
                    </option>

                    <option value="Canteen">
                      Canteen
                    </option>

                    <option value="Transport">
                      Transport
                    </option>

                    <option value="Administration">
                      Administration
                    </option>

                    <option value="Other">
                      Other
                    </option>
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

    </>
  );
}

export default StudentDashboard;