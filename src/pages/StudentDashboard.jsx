import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

import {
  useComplaints,
} from "../context/ComplaintContext";

function StudentDashboard() {
  const navigate = useNavigate();

  const {
    complaints,
    loading,
    error,
    loadComplaints,
    addComplaint,
  } = useComplaints();

  /* =========================================================
     USER
     ========================================================= */

  const [user] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem("cfms_user");

      if (!storedUser) {
        return null;
      }

      const parsedUser =
        JSON.parse(storedUser);

      return parsedUser &&
        typeof parsedUser === "object"
        ? parsedUser
        : null;
    } catch (error) {
      console.error(
        "Unable to load user:",
        error
      );

      return null;
    }
  });

  /* =========================================================
     LOAD REAL COMPLAINTS FROM BACKEND
     ========================================================= */

  useEffect(() => {
    const token =
      localStorage.getItem("cfms_token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadComplaints();
  }, [loadComplaints, navigate]);

  /* =========================================================
     MODAL
     ========================================================= */

  const [showModal, setShowModal] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [newComplaint, setNewComplaint] =
    useState({
      title: "",
      category: "Infrastructure",
      priority: "Medium",
      description: "",
    });

  /* =========================================================
     COMPLAINT COUNTS
     ========================================================= */

  const pendingCount = complaints.filter(
    (complaint) => {
      const status = String(
        complaint.status || ""
      ).toLowerCase();

      return (
        status === "submitted" ||
        status === "pending" ||
        status === "under review"
      );
    }
  ).length;

  const progressCount = complaints.filter(
    (complaint) =>
      String(
        complaint.status || ""
      ).toLowerCase() ===
      "in progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      String(
        complaint.status || ""
      ).toLowerCase() ===
      "resolved"
  ).length;

  /* =========================================================
     SORT COMPLAINTS
     ========================================================= */

  const sortedComplaints = useMemo(() => {
    return [...complaints].sort(
      (a, b) => {
        const dateA = new Date(
          a.createdAt ||
          a.date ||
          a.updatedAt ||
          0
        ).getTime();

        const dateB = new Date(
          b.createdAt ||
          b.date ||
          b.updatedAt ||
          0
        ).getTime();

        return dateB - dateA;
      }
    );
  }, [complaints]);

  /* =========================================================
     FORM CHANGE
     ========================================================= */

  const handleComplaintChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setNewComplaint(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setSubmitError("");
  };

  /* =========================================================
     SUBMIT COMPLAINT
     ========================================================= */

  const handleSubmitComplaint =
    async (event) => {
      event.preventDefault();

      if (submitting) return;

      const cleanTitle =
        newComplaint.title.trim();

      const cleanDescription =
        newComplaint.description.trim();

      if (!cleanTitle) {
        setSubmitError(
          "Please enter a complaint title."
        );
        return;
      }

      if (!cleanDescription) {
        setSubmitError(
          "Please enter a complaint description."
        );
        return;
      }

      try {
        setSubmitting(true);
        setSubmitError("");

        const createdComplaint =
          await addComplaint({
            title: cleanTitle,

            subject: cleanTitle,

            category:
              newComplaint.category,

            priority:
              newComplaint.priority,

            description:
              cleanDescription,

            isAnonymous: false,

            studentName:
              user?.name ||
              `${user?.firstName || ""} ${
                user?.lastName || ""
              }`.trim(),

            email:
              user?.email || "",

            rollNumber:
              user?.rollNumber || "",

            phone:
              user?.contact ||
              user?.phone ||
              "",
          });

        setNewComplaint({
          title: "",
          category:
            "Infrastructure",
          priority:
            "Medium",
          description: "",
        });

        setShowModal(false);

        if (
          createdComplaint?.referenceId
        ) {
          alert(
            `Complaint submitted successfully.\nReference ID: ${createdComplaint.referenceId}`
          );
        } else {
          alert(
            "Complaint submitted successfully."
          );
        }
      } catch (error) {
        console.error(
          "Unable to submit complaint:",
          error
        );

        setSubmitError(
          error.message ||
            "Unable to submit complaint. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "cfms_token"
    );

    localStorage.removeItem(
      "cfms_user"
    );

    localStorage.removeItem(
      "userRole"
    );

    navigate("/login");
  };

  /* =========================================================
     TITLE HELPER
     ========================================================= */

  const getComplaintTitle = (
    complaint
  ) => {
    return (
      complaint.title ||
      complaint.subject ||
      "Untitled Complaint"
    );
  };

  /* =========================================================
     COMPLAINT ID HELPER
     ========================================================= */

  const getComplaintId = (
    complaint
  ) => {
    return (
      complaint.referenceId ||
      complaint.id ||
      complaint._id ||
      "—"
    );
  };

  /* =========================================================
     STATUS CLASS
     ========================================================= */

  const getStatusClass = (
    status
  ) => {
    const cleanStatus =
      String(status || "")
        .toLowerCase()
        .replace(/\s+/g, "-");

    return `status-${cleanStatus}`;
  };

  /* =========================================================
     PRIORITY CLASS
     ========================================================= */

  const getPriorityClass = (
    priority
  ) => {
    const cleanPriority =
      String(priority || "")
        .toLowerCase()
        .replace(/\s+/g, "-");

    return `priority-${cleanPriority}`;
  };

  /* =========================================================
     FORMAT DATE
     ========================================================= */

  const formatDate = (
    date
  ) => {
    if (!date) return "—";

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     DISPLAY NAME
     ========================================================= */

  const displayName =
    user?.name ||
    `${user?.firstName || ""} ${
      user?.lastName || ""
    }`.trim() ||
    "Student";

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <>
      <Navbar />

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
                Welcome back,{" "}
                {displayName}. Track your
                complaints, feedback, and
                campus concerns.
              </p>

            </div>

            <button
              type="button"
              className="btn-primary-large"
              onClick={() => {
                setSubmitError("");
                setShowModal(true);
              }}
            >
              + Submit New Complaint
            </button>

          </header>

          {/* =================================================
              ERROR
              ================================================= */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* =================================================
              LOADING
              ================================================= */}

          {loading && (
            <div
              className="empty-state"
              style={{
                marginBottom: "24px",
              }}
            >
              <h3>
                Loading your complaints...
              </h3>

              <p>
                Please wait while we fetch
                your latest complaint data.
              </p>
            </div>
          )}

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
                  View and track the complaints
                  you have submitted.
                </p>

              </div>

              <Link
                to="/track-complaint"
                className="section-link"
              >
                Track Complaint
              </Link>

            </div>

            {sortedComplaints.length ===
            0 ? (

              <div className="empty-state">

                <h3>
                  No complaints yet
                </h3>

                <p>
                  You have not submitted any
                  complaints.
                </p>

                <button
                  type="button"
                  className="empty-state-btn"
                  onClick={() => {
                    setSubmitError("");
                    setShowModal(true);
                  }}
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

                    {sortedComplaints.map(
                      (complaint) => (

                        <tr
                          key={
                            complaint._id ||
                            complaint.id ||
                            complaint.referenceId
                          }
                        >

                          <td>

                            <strong>
                              {getComplaintId(
                                complaint
                              )}
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
                                  {complaint
                                    .description
                                    .length >
                                  65
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
                              complaint.createdAt ||
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
                                "Submitted"}
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
                  Review the feedback you have
                  submitted through CampusVoice.
                </p>

              </div>

              <Link
                to="/feedback"
                className="section-link"
              >
                Give Feedback
              </Link>

            </div>

            <div className="empty-state">

              <h3>
                Feedback integration
              </h3>

              <p>
                Your feedback section will
                display submitted feedback
                after the feedback API is
                connected.
              </p>

              <Link
                to="/feedback"
                className="empty-state-btn"
              >
                Submit Feedback
              </Link>

            </div>

          </section>

          {/* =================================================
              PROFILE PREVIEW
              ================================================= */}

          <section className="profile-preview-section">

            <div className="profile-preview-content">

              <span className="section-eyebrow">
                STUDENT ACCOUNT
              </span>

              <h2>
                Your Profile
              </h2>

              <p>
                View the personal, contact,
                student, and account information
                submitted during registration.
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

          <section className="manage-section">

            <div className="manage-content">

              <span className="section-eyebrow">
                CAMPUSVOICE SERVICES
              </span>

              <h2>
                Manage Your Campus Concerns
              </h2>

              <p>
                Submit complaints, track existing
                issues, and share anonymous
                feedback through CampusVoice.
              </p>

            </div>

            <div className="manage-actions">

              <button
                type="button"
                className="manage-action primary"
                onClick={() => {
                  setSubmitError("");
                  setShowModal(true);
                }}
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
                    Complaint & Feedback
                    Management System
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

            if (
              event.target ===
              event.currentTarget
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
                  Provide the details of the
                  issue you would like the
                  institution to review.
                </p>

              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {submitError && (
              <div className="form-error">
                {submitError}
              </div>
            )}

            <form
              onSubmit={
                handleSubmitComplaint
              }
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
                  value={
                    newComplaint.title
                  }
                  onChange={
                    handleComplaintChange
                  }
                  disabled={submitting}
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
                    value={
                      newComplaint.category
                    }
                    onChange={
                      handleComplaintChange
                    }
                    disabled={submitting}
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

                    <option value="Library">
                      Library
                    </option>

                    <option value="Canteen">
                      Canteen
                    </option>

                    <option value="Transportation">
                      Transportation
                    </option>

                    <option value="Technical">
                      Technical
                    </option>

                    <option value="Faculty">
                      Faculty
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
                    value={
                      newComplaint.priority
                    }
                    onChange={
                      handleComplaintChange
                    }
                    disabled={submitting}
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

                    <option value="Urgent">
                      Urgent
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
                  value={
                    newComplaint.description
                  }
                  onChange={
                    handleComplaintChange
                  }
                  disabled={submitting}
                  required
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setShowModal(false)
                  }
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Complaint"}
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