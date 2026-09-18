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

import { getStoredCategories } from "../utils/categoryData";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("cfms_user")) || null
      );
    } catch {
      return null;
    }
  });

  const [complaints, setComplaints] = useState(() =>
    getStoredComplaints()
  );

  const [feedbacks, setFeedbacks] = useState(() =>
    getStoredFeedback()
  );

  const [categories] = useState(() =>
    getStoredCategories()
  );

  const [showComplaintModal, setShowComplaintModal] =
    useState(false);

  const [showFeedbackModal, setShowFeedbackModal] =
    useState(false);

  const [newComplaint, setNewComplaint] = useState({
    title: "",
    category: "Infrastructure",
    priority: "Medium",
    description: "",
  });

  const [feedbackComplaintId, setFeedbackComplaintId] =
    useState("");

  const [feedbackRating, setFeedbackRating] = useState(0);

  const [feedbackCategory, setFeedbackCategory] =
    useState("General");

  const [feedbackComment, setFeedbackComment] =
    useState("");

  /* =========================================
     STUDENT INFORMATION
  ========================================= */

  const displayName =
    user?.name ||
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.fullName ||
    "Student";

  const studentInitial =
    displayName.charAt(0).toUpperCase();

  /* =========================================
     CATEGORIES
  ========================================= */

  const availableCategories =
    categories?.length > 0
      ? categories
      : [
          "Infrastructure",
          "Library",
          "Canteen",
          "Academic",
          "Appliances",
          "Ragging-related",
          "Molestation-related",
          "Campus Crime",
          "Faculty Complaints",
        ];

  /* =========================================
     STUDENT COMPLAINTS
  ========================================= */

  const studentComplaints = useMemo(() => {
    const studentName =
      user?.name ||
      user?.fullName ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    return complaints
      .filter((complaint) => {
        if (complaint.anonymous) return false;

        return (
          complaint.submittedBy === studentName ||
          complaint.studentId === user?.studentId ||
          complaint.email === user?.email
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.date || a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.date || b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      });
  }, [complaints, user]);

  /* =========================================
     STUDENT FEEDBACKS
  ========================================= */

  const studentFeedbacks = useMemo(() => {
    const studentName =
      user?.name ||
      user?.fullName ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

    return feedbacks
      .filter((feedback) => {
        if (feedback.anonymous) return false;

        return (
          feedback.submittedBy === studentName ||
          feedback.studentId === user?.studentId ||
          feedback.email === user?.email
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.date || a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.date || b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      });
  }, [feedbacks, user]);

  /* =========================================
     COMPLAINT STATISTICS
  ========================================= */

  const totalComplaints =
    studentComplaints.length;

  const pendingComplaints =
    studentComplaints.filter(
      (complaint) =>
        complaint.status === "Pending"
    ).length;

  const inProgressComplaints =
    studentComplaints.filter(
      (complaint) =>
        complaint.status === "In Progress" ||
        complaint.status === "In-Progress"
    ).length;

  const resolvedComplaints =
    studentComplaints.filter(
      (complaint) =>
        complaint.status === "Resolved" ||
        complaint.status === "Completed"
    ).length;

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    localStorage.removeItem("cfms_user");

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  /* =========================================
     COMPLAINT FORM
  ========================================= */

  const handleComplaintChange = (event) => {
    const { name, value } = event.target;

    setNewComplaint((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleComplaintSubmit = (event) => {
    event.preventDefault();

    if (
      !newComplaint.title.trim() ||
      !newComplaint.description.trim()
    ) {
      toast.error(
        "Please enter complaint title and description."
      );

      return;
    }

    const complaintId = `CMP-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const studentName =
      user?.name ||
      user?.fullName ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      "Student";

    const complaint = {
      id: complaintId,

      title: newComplaint.title.trim(),

      subject: newComplaint.title.trim(),

      category: newComplaint.category,

      priority: newComplaint.priority,

      description:
        newComplaint.description.trim(),

      status: "Pending",

      anonymous: false,

      submittedBy: studentName,

      studentId: user?.studentId || "",

      email: user?.email || "",

      date: new Date()
        .toISOString()
        .split("T")[0],

      createdAt: new Date().toISOString(),
    };

    saveComplaint(complaint);

    setComplaints(getStoredComplaints());

    setNewComplaint({
      title: "",
      category: "Infrastructure",
      priority: "Medium",
      description: "",
    });

    setShowComplaintModal(false);

    toast.success(
      `Complaint submitted successfully. ID: ${complaintId}`
    );
  };

  /* =========================================
     FEEDBACK MODAL
  ========================================= */

  const openFeedbackModal = () => {
    if (!studentComplaints.length) {
      toast.error(
        "You need to submit a complaint first."
      );

      return;
    }

    const resolvedComplaint =
      studentComplaints.find(
        (complaint) =>
          (complaint.status === "Resolved" ||
            complaint.status === "Completed") &&
          !hasSubmittedFeedback(
            complaint.id
          )
      );

    if (!resolvedComplaint) {
      toast.error(
        "Feedback can only be submitted for a resolved complaint."
      );

      return;
    }

    setFeedbackComplaintId(
      resolvedComplaint.id
    );

    setFeedbackCategory(
      resolvedComplaint.category ||
        "General"
    );

    setFeedbackRating(0);

    setFeedbackComment("");

    setShowFeedbackModal(true);
  };

  /* =========================================
     FEEDBACK SUBMIT
  ========================================= */

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();

    if (!feedbackComplaintId) {
      toast.error(
        "Please select a complaint."
      );

      return;
    }

    const complaint =
      studentComplaints.find(
        (item) =>
          item.id === feedbackComplaintId
      );

    if (!complaint) {
      toast.error(
        "Complaint not found."
      );

      return;
    }

    if (
      complaint.status !== "Resolved" &&
      complaint.status !== "Completed"
    ) {
      toast.error(
        "Feedback can only be submitted after the complaint is resolved."
      );

      return;
    }

    if (
      hasSubmittedFeedback(
        feedbackComplaintId
      )
    ) {
      toast.error(
        "Feedback has already been submitted for this complaint."
      );

      return;
    }

    if (!feedbackComment.trim()) {
      toast.error(
        "Please enter your feedback."
      );

      return;
    }

    if (!feedbackRating) {
      toast.error(
        "Please select a rating."
      );

      return;
    }

    const studentName =
      user?.name ||
      user?.fullName ||
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      "Student";

    const feedback = {
      id: `FDB-${Math.floor(
        1000 + Math.random() * 9000
      )}`,

      complaintId:
        feedbackComplaintId,

      category: feedbackCategory,

      rating: feedbackRating,

      comment:
        feedbackComment.trim(),

      anonymous: false,

      submittedBy: studentName,

      studentId:
        user?.studentId || "",

      email:
        user?.email || "",

      date: new Date()
        .toISOString()
        .split("T")[0],

      createdAt:
        new Date().toISOString(),
    };

    saveFeedback(feedback);

    setFeedbacks(
      getStoredFeedback()
    );

    setShowFeedbackModal(false);

    setFeedbackComplaintId("");

    setFeedbackRating(0);

    setFeedbackCategory(
      "General"
    );

    setFeedbackComment("");

    toast.success(
      "Feedback submitted successfully."
    );
  };

  /* =========================================
     STATUS STYLE
  ========================================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
      case "Completed":
        return "status-badge resolved";

      case "In Progress":
      case "In-Progress":
        return "status-badge progress";

      case "Pending":
      default:
        return "status-badge pending";
    }
  };

  /* =========================================
     PRIORITY STYLE
  ========================================= */

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "priority-badge high";

      case "Low":
        return "priority-badge low";

      case "Medium":
      default:
        return "priority-badge medium";
    }
  };

  return (
    <>
      <Navbar />

      <div className="student-dashboard-shell">

        {/* =========================================
            LEFT INDEX
        ========================================= */}

        <aside className="sidebar">

          <div className="sidebar-top">

            <div className="sidebar-brand">

              <div className="sidebar-brand-mark">
                C
              </div>

              <strong>
                CampusVoice
              </strong>

              <span>
                Student Portal
              </span>

            </div>


            <div className="sidebar-status">

              <span className="sidebar-status-dot"></span>

              <div>
                <strong>
                  Student Status
                </strong>

                <span>
                  Active
                </span>
              </div>

            </div>


            {/* =========================================
                FIXED ROUTING
            ========================================= */}

            <nav className="sidebar-menu">

              <Link
                to="/student-dashboard"
                className="sidebar-menu-item active"
              >
                Dashboard
              </Link>

              <Link
                to="/my-complaints"
                className="sidebar-menu-item"
              >
                My Complaints
              </Link>

              <Link
                to="/my-feedbacks"
                className="sidebar-menu-item"
              >
                My Feedbacks
              </Link>

              <Link
                to="/profile"
                className="sidebar-menu-item"
              >
                Profile
              </Link>

            </nav>

          </div>


          <div className="sidebar-bottom">

            <div className="sidebar-help">

              <strong>
                Need Help?
              </strong>

              Contact the administration for
              assistance with your complaints.

            </div>


            <button
              type="button"
              className="sidebar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </aside>


        {/* =========================================
            RIGHT SIDE
        ========================================= */}

        <div className="dashboard-main-area">

          <main className="dashboard-content">

            {/* =========================================
                HEADER
            ========================================= */}

            <section className="dashboard-header">

              <div>

                <span className="section-eyebrow">
                  STUDENT DASHBOARD
                </span>

                <h1>
                  Welcome, {displayName}
                </h1>

                <p>
                  Manage your complaints, feedback
                  and student account from one place.
                </p>

              </div>


              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setShowComplaintModal(true)
                }
              >
                Lodge Complaint
              </button>

            </section>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <section className="dashboard-stats">

              <div className="stat-card">

                <div className="stat-card-top">

                  <span className="stat-label">
                    Total Complaints
                  </span>

                </div>

                <strong className="stat-value">
                  {totalComplaints}
                </strong>

                <span className="stat-description">
                  Complaints submitted by you
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-card-top">

                  <span className="stat-label">
                    Pending
                  </span>

                </div>

                <strong className="stat-value">
                  {pendingComplaints}
                </strong>

                <span className="stat-description">
                  Awaiting action
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-card-top">

                  <span className="stat-label">
                    In Progress
                  </span>

                </div>

                <strong className="stat-value">
                  {inProgressComplaints}
                </strong>

                <span className="stat-description">
                  Currently being handled
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-card-top">

                  <span className="stat-label">
                    Resolved
                  </span>

                </div>

                <strong className="stat-value">
                  {resolvedComplaints}
                </strong>

                <span className="stat-description">
                  Successfully resolved
                </span>

              </div>

            </section>


            {/* =========================================
                STUDENT STATUS
            ========================================= */}

            <section className="student-status-card">

              <div className="student-status-main">

                <div className="student-avatar">
                  {studentInitial}
                </div>

                <div>

                  <span className="section-eyebrow">
                    STUDENT STATUS
                  </span>

                  <h2>
                    {displayName}
                  </h2>

                  <p>
                    Active student account on CampusVoice.
                  </p>

                </div>

              </div>


              <span className="student-online-status">
                Active
              </span>

            </section>


            {/* =========================================
                MY COMPLAINTS
            ========================================= */}

            <section className="dashboard-section">

              <div className="section-heading">

                <div>

                  <span className="section-eyebrow">
                    COMPLAINT MANAGEMENT
                  </span>

                  <h2>
                    My Complaints
                  </h2>

                  <p>
                    View and track the complaints
                    submitted from your student account.
                  </p>

                </div>


                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowComplaintModal(true)
                  }
                >
                  New Complaint
                </button>

              </div>


              {studentComplaints.length === 0 ? (

                <div className="empty-state">

                  <h3>
                    No complaints yet
                  </h3>

                  <p>
                    You have not submitted any complaints.
                  </p>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      setShowComplaintModal(true)
                    }
                  >
                    Lodge Your First Complaint
                  </button>

                </div>

              ) : (

                <div className="table-wrapper">

                  <table className="complaints-table">

                    <thead>

                      <tr>

                        <th>
                          ID
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

                        <th>
                          Action
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {studentComplaints.map(
                        (complaint) => (

                          <tr
                            key={complaint.id}
                          >

                            <td>

                              <strong className="complaint-id">
                                {complaint.id}
                              </strong>

                            </td>


                            <td>

                              <div className="complaint-title-cell">

                                <strong>
                                  {complaint.title ||
                                    complaint.subject ||
                                    "Untitled Complaint"}
                                </strong>

                                {complaint.description && (
                                  <span>
                                    {complaint.description.length >
                                    70
                                      ? `${complaint.description.slice(
                                          0,
                                          70
                                        )}...`
                                      : complaint.description}
                                  </span>
                                )}

                              </div>

                            </td>


                            <td>
                              {complaint.category ||
                                "General"}
                            </td>


                            <td>
                              {complaint.date ||
                                "—"}
                            </td>


                            <td>

                              <span
                                className={getPriorityClass(
                                  complaint.priority
                                )}
                              >
                                {complaint.priority ||
                                  "Medium"}
                              </span>

                            </td>


                            <td>

                              <span
                                className={getStatusClass(
                                  complaint.status
                                )}
                              >
                                {complaint.status ||
                                  "Pending"}
                              </span>

                            </td>


                            <td>

                              <Link
                                to={`/track-complaint?id=${complaint.id}`}
                                className="track-link"
                              >
                                Track
                              </Link>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>


            {/* =========================================
                MY FEEDBACKS
            ========================================= */}

            <section className="dashboard-section">

              <div className="section-heading">

                <div>

                  <span className="section-eyebrow">
                    FEEDBACK
                  </span>

                  <h2>
                    My Feedbacks
                  </h2>

                  <p>
                    Review feedback submitted for your
                    resolved complaints.
                  </p>

                </div>


                <button
                  type="button"
                  className="secondary-button"
                  onClick={openFeedbackModal}
                >
                  Give Feedback
                </button>

              </div>


              {studentFeedbacks.length === 0 ? (

                <div className="empty-state">

                  <h3>
                    No feedback submitted
                  </h3>

                  <p>
                    Feedback becomes available after
                    a complaint is resolved.
                  </p>

                </div>

              ) : (

                <div className="feedback-grid">

                  {studentFeedbacks.map(
                    (feedback, index) => (

                      <div
                        className="feedback-card"
                        key={
                          feedback.id ||
                          `${feedback.complaintId}-${index}`
                        }
                      >

                        <div className="feedback-card-header">

                          <div>

                            <span className="feedback-complaint-id">
                              {feedback.complaintId}
                            </span>

                            <h3>
                              {feedback.category ||
                                "General"}
                            </h3>

                          </div>


                          <span className="feedback-rating">
                            {feedback.rating}/5
                          </span>

                        </div>


                        <p className="feedback-comment">
                          {feedback.comment ||
                            "No comment provided."}
                        </p>


                        <div className="feedback-card-footer">

                          <span>
                            {feedback.date ||
                              "—"}
                          </span>

                          <span>
                            Anonymous:{" "}
                            {feedback.anonymous
                              ? "Yes"
                              : "No"}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* =========================================
                PROFILE PREVIEW
            ========================================= */}

            <section className="dashboard-section">

              <div className="section-heading">

                <div>

                  <span className="section-eyebrow">
                    ACCOUNT
                  </span>

                  <h2>
                    Profile Preview
                  </h2>

                  <p>
                    Information associated with your
                    CampusVoice student account.
                  </p>

                </div>

              </div>


              <div className="profile-preview">

                <div className="profile-preview-avatar">
                  {studentInitial}
                </div>


                <div className="profile-preview-details">

                  <div>

                    <span>
                      Full Name
                    </span>

                    <strong>
                      {displayName}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Student ID
                    </span>

                    <strong>
                      {user?.studentId ||
                        "Not available"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Email
                    </span>

                    <strong>
                      {user?.email ||
                        "Not available"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Role
                    </span>

                    <strong>
                      Student
                    </strong>

                  </div>

                </div>

              </div>

            </section>


            {/* =========================================
                QUICK ACTIONS
            ========================================= */}

            <section className="dashboard-section">

              <div className="section-heading">

                <div>

                  <span className="section-eyebrow">
                    QUICK ACCESS
                  </span>

                  <h2>
                    Quick Actions
                  </h2>

                </div>

              </div>


              <div className="quick-actions">

                <button
                  type="button"
                  className="quick-action-card"
                  onClick={() =>
                    setShowComplaintModal(true)
                  }
                >

                  <strong>
                    Lodge Complaint
                  </strong>

                  <span>
                    Submit a new complaint
                  </span>

                </button>


                <Link
                  to="/track-complaint"
                  className="quick-action-card"
                >

                  <strong>
                    Track Complaint
                  </strong>

                  <span>
                    Check complaint status
                  </span>

                </Link>


                <button
                  type="button"
                  className="quick-action-card"
                  onClick={openFeedbackModal}
                >

                  <strong>
                    Give Feedback
                  </strong>

                  <span>
                    Share your experience
                  </span>

                </button>


                <Link
                  to="/"
                  className="quick-action-card"
                >

                  <strong>
                    CampusVoice Home
                  </strong>

                  <span>
                    Return to homepage
                  </span>

                </Link>

              </div>

            </section>

          </main>


          {/* FOOTER */}

          <div className="dashboard-footer-wrapper">
            <Footer />
          </div>

        </div>

      </div>


      {/* =========================================
          COMPLAINT MODAL
      ========================================= */}

      {showComplaintModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowComplaintModal(false)
          }
        >

          <div
            className="dashboard-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="section-eyebrow">
                  NEW SUBMISSION
                </span>

                <h2>
                  Lodge Complaint
                </h2>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowComplaintModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="dashboard-form"
              onSubmit={handleComplaintSubmit}
            >

              <div className="form-group">

                <label htmlFor="title">
                  Complaint Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={newComplaint.title}
                  onChange={handleComplaintChange}
                  placeholder="Enter complaint title"
                />

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="category">
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={newComplaint.category}
                    onChange={handleComplaintChange}
                  >

                    {availableCategories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}

                  </select>

                </div>


                <div className="form-group">

                  <label htmlFor="priority">
                    Priority
                  </label>

                  <select
                    id="priority"
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

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  value={newComplaint.description}
                  onChange={handleComplaintChange}
                  placeholder="Describe your complaint in detail..."
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowComplaintModal(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-button"
                >
                  Submit Complaint
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =========================================
          FEEDBACK MODAL
      ========================================= */}

      {showFeedbackModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowFeedbackModal(false)
          }
        >

          <div
            className="dashboard-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="section-eyebrow">
                  FEEDBACK
                </span>

                <h2>
                  Give Feedback
                </h2>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowFeedbackModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="dashboard-form"
              onSubmit={handleFeedbackSubmit}
            >

              <div className="form-group">

                <label htmlFor="feedbackComplaint">
                  Resolved Complaint
                </label>

                <select
                  id="feedbackComplaint"
                  value={feedbackComplaintId}
                  onChange={(event) =>
                    setFeedbackComplaintId(
                      event.target.value
                    )
                  }
                >

                  {studentComplaints
                    .filter(
                      (complaint) =>
                        (
                          complaint.status ===
                            "Resolved" ||
                          complaint.status ===
                            "Completed"
                        ) &&
                        !hasSubmittedFeedback(
                          complaint.id
                        )
                    )
                    .map((complaint) => (

                      <option
                        key={complaint.id}
                        value={complaint.id}
                      >
                        {complaint.id} -{" "}
                        {complaint.title ||
                          complaint.subject ||
                          "Complaint"}
                      </option>

                    ))}

                </select>

              </div>


              <div className="form-group">

                <label htmlFor="feedbackCategory">
                  Category
                </label>

                <select
                  id="feedbackCategory"
                  value={feedbackCategory}
                  onChange={(event) =>
                    setFeedbackCategory(
                      event.target.value
                    )
                  }
                >

                  <option value="General">
                    General
                  </option>

                  {availableCategories.map(
                    (category) => (

                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-group">

                <label>
                  Rating
                </label>

                <div className="rating-selector">

                  {[1, 2, 3, 4, 5].map(
                    (rating) => (

                      <button
                        type="button"
                        key={rating}
                        className={
                          feedbackRating === rating
                            ? "rating-button selected"
                            : "rating-button"
                        }
                        onClick={() =>
                          setFeedbackRating(
                            rating
                          )
                        }
                      >
                        {rating}
                      </button>

                    )
                  )}

                </div>

              </div>


              <div className="form-group">

                <label htmlFor="feedbackComment">
                  Feedback
                </label>

                <textarea
                  id="feedbackComment"
                  rows="6"
                  value={feedbackComment}
                  onChange={(event) =>
                    setFeedbackComment(
                      event.target.value
                    )
                  }
                  placeholder="Share your experience..."
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowFeedbackModal(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-button"
                >
                  Submit Feedback
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  );
};

export default StudentDashboard;