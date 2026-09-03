
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import {
  getStoredComplaints,
  updateComplaintStatus,
} from "../utils/mockData";

import { getStoredFeedback } from "../utils/feedbackData";

import "../styles/AdminDashboard.css";

const COMPLAINT_CATEGORIES = [
  "All",
  "Infrastructure",
  "Library",
  "Canteen",
  "Academic",
  "Appliances",
  "Hostel",
  "Faculty / Staff",
  "Ragging / Bullying",
  "Harassment / Misconduct",
  "Campus Safety / Crime",
  "IT / Computer",
  "Transport",
  "Cleanliness / Sanitation",
  "Administration / Fees",
  "Other",
];

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "In Progress",
  "Resolved",
];

const PRIORITY_OPTIONS = [
  "All",
  "Low",
  "Medium",
  "High",
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // INITIAL DATA
  // ---------------------------------------------------------

  const [complaints, setComplaints] = useState(() =>
    getStoredComplaints()
  );

  const [feedbackList, setFeedbackList] = useState(() =>
    getStoredFeedback()
  );

  const [activeSection, setActiveSection] = useState("overview");

  // ---------------------------------------------------------
  // COMPLAINT FILTERS
  // ---------------------------------------------------------

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // ---------------------------------------------------------
  // FEEDBACK FILTERS
  // ---------------------------------------------------------

  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] =
    useState("All");
  const [feedbackRatingFilter, setFeedbackRatingFilter] =
    useState("All");

  // ---------------------------------------------------------
  // MODALS
  // ---------------------------------------------------------

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // =========================================================
  // REFRESH DATA
  // =========================================================

  const refreshData = () => {
    setComplaints(getStoredComplaints());
    setFeedbackList(getStoredFeedback());
  };

  // =========================================================
  // STATUS UPDATE
  // =========================================================

  const handleStatusChange = (id, newStatus) => {
    updateComplaintStatus(id, newStatus);

    setComplaints((currentComplaints) =>
      currentComplaints.map((complaint) =>
        complaint.id === id
          ? {
              ...complaint,
              status: newStatus,
            }
          : complaint
      )
    );

    setSelectedComplaint((currentComplaint) => {
      if (!currentComplaint || currentComplaint.id !== id) {
        return currentComplaint;
      }

      return {
        ...currentComplaint,
        status: newStatus,
      };
    });

    toast.success(
      `Complaint ${id} updated to ${newStatus}.`
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("cfms_user");

    toast.success("Logged out successfully");

    navigate("/");
  };

  // =========================================================
  // COMPLAINT FILTERING
  // =========================================================

  const filteredComplaints = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const complaintId = String(complaint.id || "").toLowerCase();
      const subject = String(
        complaint.subject || ""
      ).toLowerCase();
      const title = String(
        complaint.title || ""
      ).toLowerCase();
      const description = String(
        complaint.description || ""
      ).toLowerCase();
      const category = String(
        complaint.category || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        complaintId.includes(searchValue) ||
        subject.includes(searchValue) ||
        title.includes(searchValue) ||
        description.includes(searchValue) ||
        category.includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        complaint.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        complaint.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    complaints,
    search,
    categoryFilter,
    statusFilter,
    priorityFilter,
  ]);

  // =========================================================
  // FEEDBACK CATEGORIES
  // =========================================================

  const feedbackCategories = useMemo(() => {
    const categories = feedbackList
      .map((feedback) => feedback.category)
      .filter(Boolean);

    return ["All", ...new Set(categories)];
  }, [feedbackList]);

  // =========================================================
  // FEEDBACK FILTERING
  // =========================================================

  const filteredFeedback = useMemo(() => {
    const searchValue = feedbackSearch
      .trim()
      .toLowerCase();

    return feedbackList.filter((feedback) => {
      const feedbackId = String(
        feedback.id || ""
      ).toLowerCase();

      const complaintId = String(
        feedback.complaintId || ""
      ).toLowerCase();

      const comment = String(
        feedback.comment || ""
      ).toLowerCase();

      const category = String(
        feedback.category || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        feedbackId.includes(searchValue) ||
        complaintId.includes(searchValue) ||
        comment.includes(searchValue) ||
        category.includes(searchValue);

      const matchesCategory =
        feedbackCategoryFilter === "All" ||
        feedback.category === feedbackCategoryFilter;

      const matchesRating =
        feedbackRatingFilter === "All" ||
        String(feedback.rating) === feedbackRatingFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRating
      );
    });
  }, [
    feedbackList,
    feedbackSearch,
    feedbackCategoryFilter,
    feedbackRatingFilter,
  ]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const anonymousComplaints = complaints.filter(
    (complaint) => complaint.anonymous === true
  ).length;

  const totalFeedback = feedbackList.length;

  const anonymousFeedback = feedbackList.filter(
    (feedback) => feedback.anonymous === true
  ).length;

  const averageRating =
    totalFeedback > 0
      ? (
          feedbackList.reduce(
            (total, feedback) =>
              total + Number(feedback.rating || 0),
            0
          ) / totalFeedback
        ).toFixed(1)
      : "0.0";

  // =========================================================
  // RECENT DATA
  // =========================================================

  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) =>
        String(b.date || "").localeCompare(
          String(a.date || "")
        )
      )
      .slice(0, 5);
  }, [complaints]);

  const latestFeedback = useMemo(() => {
    return [...feedbackList]
      .sort((a, b) =>
        String(b.date || "").localeCompare(
          String(a.date || "")
        )
      )
      .slice(0, 1);
  }, [feedbackList]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearComplaintFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  const clearFeedbackFilters = () => {
    setFeedbackSearch("");
    setFeedbackCategoryFilter("All");
    setFeedbackRatingFilter("All");
  };

  // =========================================================
  // SECTION NAVIGATION
  // =========================================================

  const showSection = (section) => {
    setActiveSection(section);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const getComplaintTitle = (complaint) => {
    return (
      complaint?.subject ||
      complaint?.title ||
      "Untitled Complaint"
    );
  };

  const getPriorityClass = (priority) => {
    const value = String(priority || "Medium").toLowerCase();

    if (
      value === "low" ||
      value === "medium" ||
      value === "high"
    ) {
      return value;
    }

    return "medium";
  };

  const getStatusClass = (status) => {
    if (status === "In Progress") {
      return "progress";
    }

    if (status === "Resolved") {
      return "resolved";
    }

    return "pending";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <Navbar />

      <div className="admin-page">

        {/* ===================================================
            SIDEBAR
        ==================================================== */}

        <aside className="admin-sidebar">

          <div className="admin-sidebar-header">
            <div className="admin-sidebar-title">
              ADMIN PANEL
            </div>

            <div className="admin-sidebar-subtitle">
              CampusVoice Management
            </div>
          </div>

          <div className="admin-sidebar-section">

            <div className="admin-sidebar-label">
              Dashboard
            </div>

            <button
              type="button"
              className={
                activeSection === "overview"
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
              onClick={() => showSection("overview")}
            >
              <span>Overview</span>
            </button>

          </div>

          <div className="admin-sidebar-section">

            <div className="admin-sidebar-label">
              Complaint Management
            </div>

            <button
              type="button"
              className={
                activeSection === "complaints"
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
              onClick={() => showSection("complaints")}
            >
              <span>View Complaints</span>
              <span className="sidebar-count">
                {totalComplaints}
              </span>
            </button>

            <button
              type="button"
              className={
                activeSection === "anonymous-complaints"
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
              onClick={() =>
                showSection("anonymous-complaints")
              }
            >
              <span>Anonymous Complaints</span>
              <span className="sidebar-count">
                {anonymousComplaints}
              </span>
            </button>

            <button
              type="button"
              className={
                activeSection === "categories"
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
              onClick={() => showSection("categories")}
            >
              <span>Complaint Categories</span>
            </button>

          </div>

          <div className="admin-sidebar-section">

            <div className="admin-sidebar-label">
              Feedback Management
            </div>

            <button
              type="button"
              className={
                activeSection === "feedback"
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
              onClick={() => showSection("feedback")}
            >
              <span>View Feedbacks</span>
              <span className="sidebar-count">
                {totalFeedback}
              </span>
            </button>

            <button
              type="button"
              className={
                activeSection === "anonymous-feedback"
                  ? "admin-sidebar-link active"
                  : "admin-sidebar-link"
              }
              onClick={() =>
                showSection("anonymous-feedback")
              }
            >
              <span>Anonymous Feedbacks</span>
              <span className="sidebar-count">
                {anonymousFeedback}
              </span>
            </button>

          </div>

          <div className="admin-sidebar-section">

            <div className="admin-sidebar-label">
              System
            </div>

            <button
              type="button"
              className="admin-sidebar-link"
              onClick={() => {
                refreshData();
                toast.success(
                  "Dashboard data refreshed"
                );
              }}
            >
              <span>Refresh Data</span>
            </button>

            <button
              type="button"
              className="admin-sidebar-link"
              onClick={() =>
                navigate("/admin/feedback")
              }
            >
              <span>Analytics</span>
            </button>

          </div>

          <div className="admin-sidebar-bottom">

            <button
              type="button"
              className="admin-sidebar-home"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>

            <button
              type="button"
              className="admin-sidebar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </aside>

        {/* ===================================================
            MAIN
        ==================================================== */}

        <main className="admin-main">

          <div className="admin-container">

            {/* =================================================
                OVERVIEW
            ================================================= */}

            {activeSection === "overview" && (
              <section>

                <div className="admin-header">

                  <div>
                    <span className="admin-eyebrow">
                      ADMINISTRATOR
                    </span>

                    <h1>
                      Admin Dashboard
                    </h1>

                    <p>
                      Monitor complaints, feedback and
                      campus service activity.
                    </p>
                  </div>

                  <div className="system-status">
                    <span className="status-dot"></span>
                    System Active
                  </div>

                </div>

                {/* STATS */}

                <div className="admin-stats">

                  <div className="admin-stat-card">
                    <span>Total Complaints</span>
                    <strong>
                      {totalComplaints}
                    </strong>
                    <small>
                      All submitted complaints
                    </small>
                  </div>

                  <div className="admin-stat-card pending-card">
                    <span>Pending</span>
                    <strong>
                      {pendingComplaints}
                    </strong>
                    <small>
                      Awaiting action
                    </small>
                  </div>

                  <div className="admin-stat-card progress-card">
                    <span>In Progress</span>
                    <strong>
                      {inProgressComplaints}
                    </strong>
                    <small>
                      Currently being handled
                    </small>
                  </div>

                  <div className="admin-stat-card resolved-card">
                    <span>Resolved</span>
                    <strong>
                      {resolvedComplaints}
                    </strong>
                    <small>
                      Successfully resolved
                    </small>
                  </div>

                  <div className="admin-stat-card anonymous-card">
                    <span>Anonymous Complaints</span>
                    <strong>
                      {anonymousComplaints}
                    </strong>
                    <small>
                      Anonymous submissions
                    </small>
                  </div>

                  <div className="admin-stat-card feedback-card-stat">
                    <span>Total Feedback</span>
                    <strong>
                      {totalFeedback}
                    </strong>
                    <small>
                      Average rating: {averageRating}/5
                    </small>
                  </div>

                </div>

                {/* OVERVIEW PANELS */}

                <div className="admin-overview-grid">

                  {/* FEEDBACK */}

                  <div className="admin-overview-panel">

                    <div className="overview-panel-header">

                      <div>
                        <span className="panel-eyebrow">
                          FEEDBACK OVERVIEW
                        </span>

                        <h2>
                          Latest Feedback
                        </h2>
                      </div>

                      <button
                        type="button"
                        className="view-all-button"
                        onClick={() =>
                          showSection("feedback")
                        }
                      >
                        View All
                      </button>

                    </div>

                    {latestFeedback.length === 0 ? (
                      <div className="overview-empty">
                        No feedback submitted yet.
                      </div>
                    ) : (
                      <div className="latest-feedback-list">

                        {latestFeedback.map((feedback) => (
                          <button
                            type="button"
                            key={feedback.id}
                            className="latest-feedback-item"
                            onClick={() =>
                              setSelectedFeedback(feedback)
                            }
                          >

                            <div className="latest-feedback-top">

                              <span className="feedback-reference">
                                {feedback.id}
                              </span>

                              <span className="feedback-rating">
                                {Number(
                                  feedback.rating || 0
                                )}
                                /5
                              </span>

                            </div>

                            <div className="latest-feedback-comment">
                              {feedback.comment ||
                                "No comment provided."}
                            </div>

                            <div className="latest-feedback-meta">

                              <span>
                                {feedback.category ||
                                  "General"}
                              </span>

                              <span className="meta-separator">
                                •
                              </span>

                              <span>
                                {feedback.date ||
                                  "No date"}
                              </span>

                            </div>

                          </button>
                        ))}

                      </div>
                    )}

                  </div>

                  {/* RECENT COMPLAINTS */}

                  <div className="admin-overview-panel">

                    <div className="overview-panel-header">

                      <div>
                        <span className="panel-eyebrow">
                          RECENT ACTIVITY
                        </span>

                        <h2>
                          Recent Complaints
                        </h2>
                      </div>

                      <button
                        type="button"
                        className="view-all-button"
                        onClick={() =>
                          showSection("complaints")
                        }
                      >
                        View All
                      </button>

                    </div>

                    {recentComplaints.length === 0 ? (
                      <div className="overview-empty">
                        No complaints submitted yet.
                      </div>
                    ) : (
                      <div className="recent-complaints-list">

                        {recentComplaints.map((complaint) => (
                          <button
                            type="button"
                            key={complaint.id}
                            className="recent-complaint-item"
                            onClick={() =>
                              setSelectedComplaint(
                                complaint
                              )
                            }
                          >

                            <div className="recent-complaint-main">

                              <div className="recent-complaint-id">
                                {complaint.id}
                              </div>

                              <div className="recent-complaint-title">
                                {getComplaintTitle(
                                  complaint
                                )}
                              </div>

                              <div className="recent-complaint-meta">

                                <span>
                                  {complaint.category ||
                                    "Other"}
                                </span>

                                <span className="meta-separator">
                                  •
                                </span>

                                <span>
                                  {complaint.date ||
                                    "No date"}
                                </span>

                              </div>

                            </div>

                            <span
                              className={`admin-status ${getStatusClass(
                                complaint.status
                              )}`}
                            >
                              {complaint.status ||
                                "Pending"}
                            </span>

                          </button>
                        ))}

                      </div>
                    )}

                  </div>

                </div>

              </section>
            )}

            {/* =================================================
                ALL COMPLAINTS
            ================================================= */}

            {activeSection === "complaints" && (
              <section>

                <div className="admin-header">
                  <div>
                    <span className="admin-eyebrow">
                      COMPLAINT MANAGEMENT
                    </span>

                    <h1>
                      View Complaints
                    </h1>

                    <p>
                      Search, filter and manage all
                      complaints submitted through CampusVoice.
                    </p>
                  </div>
                </div>

                <div className="admin-filter-panel">

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by ID, subject, category or description..."
                    className="admin-search"
                  />

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value)
                    }
                    className="admin-filter-select"
                  >
                    {COMPLAINT_CATEGORIES.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category === "All"
                            ? "All Categories"
                            : category}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="admin-filter-select"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status === "All"
                          ? "All Statuses"
                          : status}
                      </option>
                    ))}
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) =>
                      setPriorityFilter(e.target.value)
                    }
                    className="admin-filter-select"
                  >
                    {PRIORITY_OPTIONS.map(
                      (priority) => (
                        <option
                          key={priority}
                          value={priority}
                        >
                          {priority === "All"
                            ? "All Priorities"
                            : priority}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="button"
                    onClick={clearComplaintFilters}
                    className="clear-filter-button"
                  >
                    Clear
                  </button>

                </div>

                <div className="results-summary">
                  Showing{" "}
                  <strong>
                    {filteredComplaints.length}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {complaints.length}
                  </strong>{" "}
                  complaints
                </div>

                <div className="admin-complaints-list">

                  {filteredComplaints.length === 0 ? (
                    <div className="admin-empty-state">
                      <h3>
                        No complaints found
                      </h3>

                      <p>
                        Try changing your filters or
                        search term.
                      </p>
                    </div>
                  ) : (
                    filteredComplaints.map(
                      (complaint) => (
                        <article
                          key={complaint.id}
                          className="admin-complaint-card"
                        >

                          <div className="complaint-information">

                            <div className="complaint-meta">

                              <span className="complaint-id">
                                {complaint.id}
                              </span>

                              <span className="complaint-category">
                                {complaint.category ||
                                  "Other"}
                              </span>

                              {complaint.anonymous && (
                                <span className="anonymous-badge">
                                  Anonymous
                                </span>
                              )}

                            </div>

                            <h3>
                              {getComplaintTitle(
                                complaint
                              )}
                            </h3>

                            <p>
                              {complaint.description ||
                                "No description provided."}
                            </p>

                            <div className="complaint-footer-info">

                              <span>
                                Date:{" "}
                                {complaint.date ||
                                  "N/A"}
                              </span>

                              <span
                                className={`admin-priority ${getPriorityClass(
                                  complaint.priority
                                )}`}
                              >
                                {complaint.priority ||
                                  "Medium"}{" "}
                                Priority
                              </span>

                            </div>

                          </div>

                          <div className="complaint-status-area">

                            <span
                              className={`admin-status ${getStatusClass(
                                complaint.status
                              )}`}
                            >
                              {complaint.status ||
                                "Pending"}
                            </span>

                            <select
                              value={
                                complaint.status ||
                                "Pending"
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  complaint.id,
                                  e.target.value
                                )
                              }
                              className="status-select"
                            >
                              <option value="Pending">
                                Pending
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Resolved">
                                Resolved
                              </option>
                            </select>

                            <button
                              type="button"
                              className="details-button"
                              onClick={() =>
                                setSelectedComplaint(
                                  complaint
                                )
                              }
                            >
                              View Details
                            </button>

                          </div>

                        </article>
                      )
                    )
                  )}

                </div>

              </section>
            )}

            {/* =================================================
                ANONYMOUS COMPLAINTS
            ================================================= */}

            {activeSection === "anonymous-complaints" && (
              <section>

                <div className="admin-header">
                  <div>
                    <span className="admin-eyebrow">
                      COMPLAINT MANAGEMENT
                    </span>

                    <h1>
                      Anonymous Complaints
                    </h1>

                    <p>
                      Review complaints submitted without
                      identifying information.
                    </p>
                  </div>
                </div>

                <div className="results-summary">
                  Showing{" "}
                  <strong>
                    {anonymousComplaints}
                  </strong>{" "}
                  anonymous complaints
                </div>

                <div className="admin-complaints-list">

                  {complaints.filter(
                    (complaint) =>
                      complaint.anonymous === true
                  ).length === 0 ? (
                    <div className="admin-empty-state">
                      <h3>
                        No anonymous complaints
                      </h3>

                      <p>
                        Anonymous complaints will appear
                        here when submitted.
                      </p>
                    </div>
                  ) : (
                    complaints
                      .filter(
                        (complaint) =>
                          complaint.anonymous === true
                      )
                      .map((complaint) => (
                        <article
                          key={complaint.id}
                          className="admin-complaint-card anonymous-complaint-card"
                        >

                          <div className="complaint-information">

                            <div className="complaint-meta">

                              <span className="complaint-id">
                                {complaint.id}
                              </span>

                              <span className="complaint-category">
                                {complaint.category ||
                                  "Other"}
                              </span>

                              <span className="anonymous-badge">
                                Anonymous
                              </span>

                            </div>

                            <h3>
                              {getComplaintTitle(
                                complaint
                              )}
                            </h3>

                            <p>
                              {complaint.description ||
                                "No description provided."}
                            </p>

                            <div className="complaint-footer-info">
                              Submitted:{" "}
                              {complaint.date || "N/A"}
                            </div>

                          </div>

                          <div className="complaint-status-area">

                            <span
                              className={`admin-status ${getStatusClass(
                                complaint.status
                              )}`}
                            >
                              {complaint.status ||
                                "Pending"}
                            </span>

                            <button
                              type="button"
                              className="details-button"
                              onClick={() =>
                                setSelectedComplaint(
                                  complaint
                                )
                              }
                            >
                              View Details
                            </button>

                          </div>

                        </article>
                      ))
                  )}

                </div>

              </section>
            )}

            {/* =================================================
                CATEGORIES
            ================================================= */}

            {activeSection === "categories" && (
              <section>

                <div className="admin-header">
                  <div>
                    <span className="admin-eyebrow">
                      COMPLAINT MANAGEMENT
                    </span>

                    <h1>
                      Complaint Categories
                    </h1>

                    <p>
                      Overview of complaints across
                      different campus service categories.
                    </p>
                  </div>
                </div>

                <div className="category-admin-grid">

                  {COMPLAINT_CATEGORIES
                    .filter(
                      (category) => category !== "All"
                    )
                    .map((category) => {
                      const count =
                        complaints.filter(
                          (complaint) =>
                            complaint.category ===
                            category
                        ).length;

                      return (
                        <div
                          key={category}
                          className="category-admin-card"
                        >
                          <div>
                            <span>
                              {category}
                            </span>

                            <small>
                              Complaints
                            </small>
                          </div>

                          <strong>
                            {count}
                          </strong>
                        </div>
                      );
                    })}

                </div>

              </section>
            )}

            {/* =================================================
                FEEDBACK
            ================================================= */}

            {activeSection === "feedback" && (
              <section>

                <div className="admin-header">
                  <div>
                    <span className="admin-eyebrow">
                      FEEDBACK MANAGEMENT
                    </span>

                    <h1>
                      View Feedbacks
                    </h1>

                    <p>
                      Review feedback submitted after
                      complaint resolution.
                    </p>
                  </div>
                </div>

                <div className="feedback-admin-stats">

                  <div>
                    <span>Total Feedback</span>
                    <strong>
                      {totalFeedback}
                    </strong>
                  </div>

                  <div>
                    <span>Average Rating</span>
                    <strong>
                      {averageRating}/5
                    </strong>
                  </div>

                  <div>
                    <span>Anonymous</span>
                    <strong>
                      {anonymousFeedback}
                    </strong>
                  </div>

                </div>

                <div className="admin-filter-panel">

                  <input
                    type="text"
                    value={feedbackSearch}
                    onChange={(e) =>
                      setFeedbackSearch(e.target.value)
                    }
                    placeholder="Search feedback, complaint ID or comment..."
                    className="admin-search"
                  />

                  <select
                    value={feedbackCategoryFilter}
                    onChange={(e) =>
                      setFeedbackCategoryFilter(
                        e.target.value
                      )
                    }
                    className="admin-filter-select"
                  >
                    {feedbackCategories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category === "All"
                            ? "All Categories"
                            : category}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={feedbackRatingFilter}
                    onChange={(e) =>
                      setFeedbackRatingFilter(
                        e.target.value
                      )
                    }
                    className="admin-filter-select"
                  >
                    <option value="All">
                      All Ratings
                    </option>

                    <option value="5">
                      5 / 5
                    </option>

                    <option value="4">
                      4 / 5
                    </option>

                    <option value="3">
                      3 / 5
                    </option>

                    <option value="2">
                      2 / 5
                    </option>

                    <option value="1">
                      1 / 5
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={clearFeedbackFilters}
                    className="clear-filter-button"
                  >
                    Clear
                  </button>

                </div>

                <div className="feedback-admin-list">

                  {filteredFeedback.length === 0 ? (
                    <div className="admin-empty-state">
                      <h3>
                        No feedback found
                      </h3>

                      <p>
                        Try clearing the filters or
                        check back after feedback is
                        submitted.
                      </p>
                    </div>
                  ) : (
                    filteredFeedback.map((feedback) => (
                      <article
                        key={feedback.id}
                        className="feedback-admin-card"
                      >

                        <div className="feedback-admin-top">

                          <div>
                            <span className="feedback-reference">
                              {feedback.id}
                            </span>

                            <h3>
                              {feedback.comment ||
                                "No comment provided."}
                            </h3>
                          </div>

                          <div className="feedback-large-rating">
                            {Number(
                              feedback.rating || 0
                            )}
                            /5
                          </div>

                        </div>

                        <div className="feedback-admin-meta">

                          <span>
                            Complaint:{" "}
                            <strong>
                              {feedback.complaintId ||
                                "N/A"}
                            </strong>
                          </span>

                          <span>
                            Category:{" "}
                            <strong>
                              {feedback.category ||
                                "General"}
                            </strong>
                          </span>

                          <span>
                            Date:{" "}
                            <strong>
                              {feedback.date ||
                                "N/A"}
                            </strong>
                          </span>

                          {feedback.anonymous && (
                            <span className="anonymous-badge">
                              Anonymous
                            </span>
                          )}

                        </div>

                        <button
                          type="button"
                          className="details-button"
                          onClick={() =>
                            setSelectedFeedback(
                              feedback
                            )
                          }
                        >
                          View Feedback
                        </button>

                      </article>
                    ))
                  )}

                </div>

              </section>
            )}

            {/* =================================================
                ANONYMOUS FEEDBACK
            ================================================= */}

            {activeSection === "anonymous-feedback" && (
              <section>

                <div className="admin-header">
                  <div>
                    <span className="admin-eyebrow">
                      FEEDBACK MANAGEMENT
                    </span>

                    <h1>
                      Anonymous Feedbacks
                    </h1>

                    <p>
                      Review feedback submitted anonymously
                      by users.
                    </p>
                  </div>
                </div>

                <div className="results-summary">
                  Showing{" "}
                  <strong>
                    {anonymousFeedback}
                  </strong>{" "}
                  anonymous feedback submissions
                </div>

                <div className="feedback-admin-list">

                  {feedbackList.filter(
                    (feedback) =>
                      feedback.anonymous === true
                  ).length === 0 ? (
                    <div className="admin-empty-state">
                      <h3>
                        No anonymous feedback
                      </h3>

                      <p>
                        Anonymous feedback submissions
                        will appear here.
                      </p>
                    </div>
                  ) : (
                    feedbackList
                      .filter(
                        (feedback) =>
                          feedback.anonymous === true
                      )
                      .map((feedback) => (
                        <article
                          key={feedback.id}
                          className="feedback-admin-card"
                        >

                          <div className="feedback-admin-top">

                            <div>
                              <span className="feedback-reference">
                                {feedback.id}
                              </span>

                              <h3>
                                {feedback.comment ||
                                  "No comment provided."}
                              </h3>
                            </div>

                            <div className="feedback-large-rating">
                              {Number(
                                feedback.rating || 0
                              )}
                              /5
                            </div>

                          </div>

                          <div className="feedback-admin-meta">

                            <span>
                              Complaint:{" "}
                              <strong>
                                {feedback.complaintId ||
                                  "N/A"}
                              </strong>
                            </span>

                            <span>
                              Category:{" "}
                              <strong>
                                {feedback.category ||
                                  "General"}
                              </strong>
                            </span>

                            <span>
                              Date:{" "}
                              <strong>
                                {feedback.date ||
                                  "N/A"}
                              </strong>
                            </span>

                            <span className="anonymous-badge">
                              Anonymous
                            </span>

                          </div>

                          <button
                            type="button"
                            className="details-button"
                            onClick={() =>
                              setSelectedFeedback(
                                feedback
                              )
                            }
                          >
                            View Feedback
                          </button>

                        </article>
                      ))
                  )}

                </div>

              </section>
            )}

          </div>

        </main>

      </div>

      {/* =====================================================
          COMPLAINT DETAILS MODAL
      ====================================================== */}

      {selectedComplaint && (
        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedComplaint(null)
          }
        >
          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>
                <span className="admin-eyebrow">
                  COMPLAINT DETAILS
                </span>

                <h2>
                  {selectedComplaint.id}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setSelectedComplaint(null)
                }
              >
                Close
              </button>

            </div>

            <div className="modal-detail-grid">

              <div>
                <span>Subject</span>
                <strong>
                  {getComplaintTitle(
                    selectedComplaint
                  )}
                </strong>
              </div>

              <div>
                <span>Category</span>
                <strong>
                  {selectedComplaint.category ||
                    "Other"}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedComplaint.status ||
                    "Pending"}
                </strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>
                  {selectedComplaint.priority ||
                    "Medium"}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {selectedComplaint.date ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Submission Mode</span>
                <strong>
                  {selectedComplaint.anonymous
                    ? "Anonymous"
                    : "Identified"}
                </strong>
              </div>

            </div>

            <div className="modal-description">

              <span>Description</span>

              <p>
                {selectedComplaint.description ||
                  "No description provided."}
              </p>

            </div>

            <div className="modal-actions">

              <select
                value={
                  selectedComplaint.status ||
                  "Pending"
                }
                onChange={(e) =>
                  handleStatusChange(
                    selectedComplaint.id,
                    e.target.value
                  )
                }
                className="status-select"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>

              <button
                type="button"
                className="modal-secondary-button"
                onClick={() =>
                  setSelectedComplaint(null)
                }
              >
                Done
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          FEEDBACK DETAILS MODAL
      ====================================================== */}

      {selectedFeedback && (
        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedFeedback(null)
          }
        >
          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>
                <span className="admin-eyebrow">
                  FEEDBACK DETAILS
                </span>

                <h2>
                  {selectedFeedback.id}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setSelectedFeedback(null)
                }
              >
                Close
              </button>

            </div>

            <div className="modal-detail-grid">

              <div>
                <span>Complaint ID</span>
                <strong>
                  {selectedFeedback.complaintId ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Category</span>
                <strong>
                  {selectedFeedback.category ||
                    "General"}
                </strong>
              </div>

              <div>
                <span>Rating</span>
                <strong>
                  {Number(
                    selectedFeedback.rating || 0
                  )}
                  /5
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {selectedFeedback.date ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Submission Mode</span>
                <strong>
                  {selectedFeedback.anonymous
                    ? "Anonymous"
                    : "Identified"}
                </strong>
              </div>

            </div>

            <div className="modal-description">

              <span>Feedback</span>

              <p>
                {selectedFeedback.comment ||
                  "No comment provided."}
              </p>

            </div>

            <div className="modal-actions">

              <button
                type="button"
                className="modal-secondary-button"
                onClick={() =>
                  setSelectedFeedback(null)
                }
              >
                Done
              </button>

            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default AdminDashboard;

