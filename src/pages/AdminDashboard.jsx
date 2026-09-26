import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  getStoredComplaints,
  updateComplaintStatus,
  deleteComplaint,
} from "../utils/mockData";

import {
  getStoredFeedback,
  deleteFeedback,
} from "../utils/feedbackData";

import {
  getStoredCategories,
  saveCategory,
} from "../utils/categoryData";

import "../styles/AdminDashboard.css";

const STATUS_OPTIONS = [
  "Pending",
  "In Progress",
  "Resolved",
];

const PRIORITY_OPTIONS = [
  "Low",
  "Medium",
  "High",
];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getComplaintTitle = (complaint) =>
  complaint?.title ||
  complaint?.subject ||
  "Untitled Complaint";

const getComplaintId = (complaint) =>
  complaint?.referenceId ||
  complaint?.id ||
  complaint?.complaintId ||
  "—";

const getComplaintDate = (complaint) =>
  complaint?.date ||
  complaint?.createdAt ||
  complaint?.submittedAt;

const getFeedbackComment = (feedback) =>
  feedback?.comment ||
  feedback?.feedback ||
  feedback?.message ||
  feedback?.text ||
  "No feedback comment";

const getFeedbackId = (feedback) =>
  feedback?.id ||
  feedback?.feedbackId ||
  "—";

const getFeedbackDate = (feedback) =>
  feedback?.date ||
  feedback?.createdAt ||
  feedback?.submittedAt;

const getSubmissionMode = (item) =>
  item?.anonymous ? "Anonymous" : "Registered User";

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const getStatusClass = (status) => {
  const value = String(status || "").toLowerCase().trim();

  if (value === "in progress" || value === "in-progress") {
    return "progress";
  }

  if (value === "resolved" || value === "completed") {
    return "resolved";
  }

  return "pending";
};

const getPriorityClass = (priority) => {
  const value = String(priority || "").toLowerCase().trim();

  if (value === "high") return "high";
  if (value === "low") return "low";

  return "medium";
};

/* =========================================================
   SIDEBAR
========================================================= */

const AdminSidebar = ({
  activeSection,
  setActiveSection,
  complaintCount,
  feedbackCount,
  anonymousComplaintCount,
  anonymousFeedbackCount,
  categoryCount,
  onRefresh,
  onAnalytics,
  onLogout,
}) => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-brand-mark">C</div>

        <div>
          <div className="admin-brand-name">CampusVoice</div>
          <div className="admin-brand-role">Administration</div>
        </div>
      </div>

      <div className="admin-sidebar-nav">
        <div className="admin-nav-group">
          <div className="admin-nav-title">Dashboard</div>

          <button
            className={`admin-nav-item ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveSection("overview")}
          >
            <span>Overview</span>
          </button>
        </div>

        <div className="admin-nav-group">
          <div className="admin-nav-title">
            Complaint Management
          </div>

          <button
            className={`admin-nav-item ${
              activeSection === "complaints" ? "active" : ""
            }`}
            onClick={() => setActiveSection("complaints")}
          >
            <span>View Complaints</span>
            <span className="admin-nav-count">{complaintCount}</span>
          </button>

          <button
            className={`admin-nav-item ${
              activeSection === "anonymous-complaints"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("anonymous-complaints")
            }
          >
            <span>Anonymous Complaints</span>
            <span className="admin-nav-count">
              {anonymousComplaintCount}
            </span>
          </button>

          <button
            className={`admin-nav-item ${
              activeSection === "categories" ? "active" : ""
            }`}
            onClick={() => setActiveSection("categories")}
          >
            <span>Complaint Categories</span>
            <span className="admin-nav-count">
              {categoryCount}
            </span>
          </button>
        </div>

        <div className="admin-nav-group">
          <div className="admin-nav-title">
            Feedback Management
          </div>

          <button
            className={`admin-nav-item ${
              activeSection === "feedback" ? "active" : ""
            }`}
            onClick={() => setActiveSection("feedback")}
          >
            <span>View Feedbacks</span>
            <span className="admin-nav-count">
              {feedbackCount}
            </span>
          </button>

          <button
            className={`admin-nav-item ${
              activeSection === "anonymous-feedback"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("anonymous-feedback")
            }
          >
            <span>Anonymous Feedbacks</span>
            <span className="admin-nav-count">
              {anonymousFeedbackCount}
            </span>
          </button>
        </div>

        <div className="admin-nav-group">
          <div className="admin-nav-title">System</div>

          <button
            className="admin-nav-item"
            onClick={onRefresh}
          >
            <span>Refresh Data</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={onAnalytics}
          >
            <span>Analytics</span>
          </button>
        </div>
      </div>

      <div className="admin-sidebar-bottom">
        <button
          className="admin-nav-item"
          onClick={() => setActiveSection("overview")}
        >
          <span>Back to Home</span>
        </button>

        <button
          className="admin-nav-item admin-logout-button"
          onClick={onLogout}
        >
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

/* =========================================================
   OVERVIEW
========================================================= */

const OverviewSection = ({
  complaints,
  feedbackList,
  categories,
  setActiveSection,
  setSelectedComplaint,
  setSelectedFeedback,
}) => {
  const totalComplaints = complaints.length;

  const pending = complaints.filter(
  (item) => {
    const status = String(item?.status || "").toLowerCase();
    return status === "pending" || status === "submitted";
  }
).length;
  const inProgress = complaints.filter(
    (item) =>
      String(item?.status || "").toLowerCase() ===
      "in progress"
  ).length;

  const resolved = complaints.filter((item) => {
    const status = String(item?.status || "").toLowerCase();

    return status === "resolved" || status === "completed";
  }).length;

  const anonymousComplaints = complaints.filter(
    (item) => item?.anonymous === true
  ).length;

  const anonymousFeedback = feedbackList.filter(
    (item) => item?.anonymous === true
  ).length;

  const averageRating =
    feedbackList.length > 0
      ? (
          feedbackList.reduce(
            (sum, item) => sum + toNumber(item?.rating),
            0
          ) / feedbackList.length
        ).toFixed(1)
      : "0.0";

  const recentComplaints = [...complaints]
    .sort(
      (a, b) =>
        new Date(getComplaintDate(b) || 0) -
        new Date(getComplaintDate(a) || 0)
    )
    .slice(0, 5);

  const recentFeedback = [...feedbackList]
    .sort(
      (a, b) =>
        new Date(getFeedbackDate(b) || 0) -
        new Date(getFeedbackDate(a) || 0)
    )
    .slice(0, 5);

  const categoryData = categories
    .map((category) => ({
      name: category,
      count: complaints.filter(
        (complaint) =>
          String(complaint?.category || "").toLowerCase() ===
          String(category).toLowerCase()
      ).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const highestCategoryCount =
    categoryData.length > 0
      ? Math.max(...categoryData.map((item) => item.count))
      : 1;

  const totalForPercentage = totalComplaints || 1;

  return (
    <>
      <div className="admin-header">
        <div>
          <div className="admin-eyebrow">ADMINISTRATOR</div>

          <h1>Admin Dashboard</h1>

          <p>
            Monitor complaints, feedback and campus service
            activity from one central workspace.
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          <span>System Active</span>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-label">
            Total Complaints
          </div>

          <div className="admin-stat-value">
            {totalComplaints}
          </div>

          <div className="admin-stat-description">
            All submitted complaints
          </div>
        </div>

        <div className="admin-stat-card pending-card">
          <div className="admin-stat-label">Pending</div>

          <div className="admin-stat-value">{pending}</div>

          <div className="admin-stat-description">
            Awaiting action
          </div>
        </div>

        <div className="admin-stat-card progress-card">
          <div className="admin-stat-label">In Progress</div>

          <div className="admin-stat-value">
            {inProgress}
          </div>

          <div className="admin-stat-description">
            Currently being resolved
          </div>
        </div>

        <div className="admin-stat-card resolved-card">
          <div className="admin-stat-label">Resolved</div>

          <div className="admin-stat-value">{resolved}</div>

          <div className="admin-stat-description">
            Completed complaints
          </div>
        </div>

        <div className="admin-stat-card anonymous-card">
          <div className="admin-stat-label">
            Anonymous Complaints
          </div>

          <div className="admin-stat-value">
            {anonymousComplaints}
          </div>

          <div className="admin-stat-description">
            Submitted anonymously
          </div>
        </div>

        <div className="admin-stat-card feedback-card-stat">
          <div className="admin-stat-label">Total Feedback</div>

          <div className="admin-stat-value">
            {feedbackList.length}
          </div>

          <div className="admin-stat-description">
            Avg. rating {averageRating} / 5
          </div>
        </div>
      </div>

      <div className="dashboard-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-card-header">
            <div>
              <span>ACTIVITY</span>
              <h2>Complaint Status Overview</h2>
            </div>

            <button
              onClick={() => setActiveSection("complaints")}
            >
              View Complaints
            </button>
          </div>

          <div className="status-overview">
            <div>
              <div className="status-overview-top">
                <span>Pending</span>
                <strong>{pending}</strong>
              </div>

              <div className="status-bar">
                <div
                  className="status-bar-fill pending-fill"
                  style={{
                    width: `${
                      (pending / totalForPercentage) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="status-overview-top">
                <span>In Progress</span>
                <strong>{inProgress}</strong>
              </div>

              <div className="status-bar">
                <div
                  className="status-bar-fill progress-fill"
                  style={{
                    width: `${
                      (inProgress / totalForPercentage) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="status-overview-top">
                <span>Resolved</span>
                <strong>{resolved}</strong>
              </div>

              <div className="status-bar">
                <div
                  className="status-bar-fill resolved-fill"
                  style={{
                    width: `${
                      (resolved / totalForPercentage) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-card-header">
            <div>
              <span>ACTIONS</span>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="quick-actions">
            <button
              className="quick-action"
              onClick={() => setActiveSection("complaints")}
            >
              <span>Review Complaints</span>
              <span>→</span>
            </button>

            <button
              className="quick-action"
              onClick={() => setActiveSection("anonymous-complaints")}
            >
              <span>Anonymous Complaints</span>
              <span>→</span>
            </button>

            <button
              className="quick-action"
              onClick={() => setActiveSection("feedback")}
            >
              <span>Review Feedback</span>
              <span>→</span>
            </button>

            <button
              className="quick-action"
              onClick={() => setActiveSection("categories")}
            >
              <span>Manage Categories</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-lower-grid">
        <div className="snapshot-card">
          <div className="snapshot-card-header">
            <div>
              <span>CATEGORIES</span>
              <h2>Complaint Categories</h2>
            </div>

            <button
              onClick={() => setActiveSection("categories")}
            >
              Manage
            </button>
          </div>

          {categoryData.length === 0 ? (
            <div className="overview-empty">
              No complaint category activity available yet.
            </div>
          ) : (
            <div className="category-overview-list">
              {categoryData.map((item) => (
                <div
                  className="category-overview-row"
                  key={item.name}
                >
                  <span className="category-overview-name">
                    {item.name}
                  </span>

                  <div className="category-overview-track">
                    <div
                      className="category-overview-fill"
                      style={{
                        width: `${
                          (item.count /
                            highestCategoryCount) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <span className="category-overview-count">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="snapshot-card">
          <div className="snapshot-card-header">
            <div>
              <span>FEEDBACK</span>
              <h2>Feedback Snapshot</h2>
            </div>

            <button
              onClick={() => setActiveSection("feedback")}
            >
              View All
            </button>
          </div>

          <div className="feedback-snapshot">
            <div className="feedback-mini-stat">
              <div className="feedback-mini-stat-label">
                Total Feedback
              </div>

              <div className="feedback-mini-stat-value">
                {feedbackList.length}
              </div>

              <div className="feedback-mini-stat-description">
                All submitted responses
              </div>
            </div>

            <div className="feedback-mini-stat">
              <div className="feedback-mini-stat-label">
                Average Rating
              </div>

              <div className="feedback-mini-stat-value">
                {averageRating}
              </div>

              <div className="feedback-mini-stat-description">
                Out of 5
              </div>
            </div>

            <div className="feedback-mini-stat">
              <div className="feedback-mini-stat-label">
                Anonymous
              </div>

              <div className="feedback-mini-stat-value">
                {anonymousFeedback}
              </div>

              <div className="feedback-mini-stat-description">
                Anonymous responses
              </div>
            </div>

            <div className="feedback-mini-stat">
              <div className="feedback-mini-stat-label">
                Resolved Complaints
              </div>

              <div className="feedback-mini-stat-value">
                {resolved}
              </div>

              <div className="feedback-mini-stat-description">
                Eligible for feedback
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-lower-grid">
        <div className="admin-overview-panel">
          <div className="overview-panel-header">
            <div>
              <div className="panel-eyebrow">COMPLAINTS</div>
              <h2>Recent Complaints</h2>
            </div>

            <button
              className="view-all-button"
              onClick={() => setActiveSection("complaints")}
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
                  className="recent-complaint-item"
                  key={getComplaintId(complaint)}
                  onClick={() =>
                    setSelectedComplaint(complaint)
                  }
                >
                  <div className="recent-complaint-main">
                    <div className="recent-complaint-id">
                      {getComplaintId(complaint)}
                    </div>

                    <div className="recent-complaint-title">
                      {getComplaintTitle(complaint)}
                    </div>

                    <div className="recent-complaint-meta">
                      <span>
                        {complaint?.category || "Uncategorized"}
                      </span>

                      <span className="meta-separator">
                        •
                      </span>

                      <span>
                        {formatDate(
                          getComplaintDate(complaint)
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`admin-status ${getStatusClass(
                      complaint?.status
                    )}`}
                  >
                    {complaint?.status || "Pending"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="admin-overview-panel">
          <div className="overview-panel-header">
            <div>
              <div className="panel-eyebrow">FEEDBACK</div>
              <h2>Latest Feedback</h2>
            </div>

            <button
              className="view-all-button"
              onClick={() => setActiveSection("feedback")}
            >
              View All
            </button>
          </div>

          {recentFeedback.length === 0 ? (
            <div className="overview-empty">
              No feedback submitted yet.
            </div>
          ) : (
            <div className="latest-feedback-list">
              {recentFeedback.map((feedback) => (
                <button
                  className="latest-feedback-item"
                  key={getFeedbackId(feedback)}
                  onClick={() =>
                    setSelectedFeedback(feedback)
                  }
                >
                  <div className="latest-feedback-top">
                    <span className="feedback-reference">
                      {feedback?.complaintId ||
                        "Complaint Feedback"}
                    </span>

                    <span className="feedback-rating">
                      {toNumber(feedback?.rating)}/5
                    </span>
                  </div>

                  <div className="latest-feedback-comment">
                    {getFeedbackComment(feedback)}
                  </div>

                  <div className="latest-feedback-meta">
                    <span>
                      {feedback?.category ||
                        "General Feedback"}
                    </span>

                    <span className="meta-separator">•</span>

                    <span>
                      {getSubmissionMode(feedback)}
                    </span>

                    <span className="meta-separator">•</span>

                    <span>
                      {formatDate(
                        getFeedbackDate(feedback)
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-system-card">
        <div className="snapshot-card-header">
          <div>
            <span>SYSTEM</span>
            <h2>CampusVoice Administration</h2>
          </div>
        </div>

        <div className="system-info-list">
          <div className="system-info-row">
            <span className="system-info-label">
              Complaint Records
            </span>

            <span className="system-info-value">
              {totalComplaints}
            </span>
          </div>

          <div className="system-info-row">
            <span className="system-info-label">
              Feedback Records
            </span>

            <span className="system-info-value">
              {feedbackList.length}
            </span>
          </div>

          <div className="system-info-row">
            <span className="system-info-label">
              Active Categories
            </span>

            <span className="system-info-value">
              {categories.length}
            </span>
          </div>

          <div className="system-info-row">
            <span className="system-info-label">
              Resolution Rate
            </span>

            <span className="system-info-value">
              {totalComplaints > 0
                ? `${Math.round(
                    (resolved / totalComplaints) * 100
                  )}%`
                : "0%"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

/* =========================================================
   COMPLAINTS
========================================================= */

const ComplaintsSection = ({
  complaints,
  categories,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onClearFilters,
  setSelectedComplaint,
  onDeleteComplaint,
}) => {
  const filteredComplaints = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !searchValue ||
        [
          complaint?.id,
          complaint?.complaintId,
          complaint?.title,
          complaint?.subject,
          complaint?.description,
          complaint?.category,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchValue)
          );

      const matchesCategory =
        categoryFilter === "All" ||
        complaint?.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        complaint?.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        complaint?.priority === priorityFilter;

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

  return (
    <>
      <div className="admin-header">
        <div>
          <div className="admin-eyebrow">
            COMPLAINT MANAGEMENT
          </div>

          <h1>All Complaints</h1>

          <p>
            Review, monitor and update complaints submitted
            through CampusVoice.
          </p>
        </div>
      </div>

      <div className="admin-filter-panel">
        <input
          type="text"
          className="admin-search"
          placeholder="Search complaints..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          className="admin-filter-select"
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="All">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All Status</option>

          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="admin-filter-select"
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value)
          }
        >
          <option value="All">All Priority</option>

          {PRIORITY_OPTIONS.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        <button
          className="clear-filter-button"
          onClick={onClearFilters}
        >
          Clear
        </button>
      </div>

      <div className="results-summary">
        Showing {filteredComplaints.length} of{" "}
        {complaints.length} complaints
      </div>

      {filteredComplaints.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No complaints found</h3>

          <p>
            There are no complaints matching the current
            filters.
          </p>
        </div>
      ) : (
        <div className="admin-complaints-list">
          {filteredComplaints.map((complaint) => (
            <div
              className="admin-complaint-card"
              key={getComplaintId(complaint)}
            >
              <div className="complaint-information">
                <div className="complaint-meta">
                  <span className="complaint-id">
                    {getComplaintId(complaint)}
                  </span>

                  <span className="complaint-category">
                    {complaint?.category ||
                      "Uncategorized"}
                  </span>

                  {complaint?.anonymous && (
                    <span className="anonymous-badge">
                      Anonymous
                    </span>
                  )}
                </div>

                <h3>{getComplaintTitle(complaint)}</h3>

                <p>
                  {complaint?.description ||
                    "No description provided."}
                </p>

                <div className="complaint-footer-info">
                  <span>
                    Date:{" "}
                    {formatDate(
                      getComplaintDate(complaint)
                    )}
                  </span>

                  <span>
                   Submitted by:{" "}
{complaint?.anonymous
  ? "Anonymous User"
  : typeof complaint?.submittedBy === "object"
    ? complaint?.submittedBy?.name ||
      complaint?.submittedBy?.email ||
      "Registered User"
    : complaint?.submittedBy || "Registered User"}
                  </span>
                </div>
              </div>

              <div className="complaint-status-area">
                <span
                  className={`admin-priority ${getPriorityClass(
                    complaint?.priority
                  )}`}
                >
                  {complaint?.priority || "Medium"}
                </span>

                <select
                  className={`status-select ${getStatusClass(
                    complaint?.status
                  )}`}
                  value={complaint?.status || "Pending"}
                  onChange={(event) => {
                    updateComplaintStatus(
                      getComplaintId(complaint),
                      event.target.value
                    );

                    window.dispatchEvent(
                      new Event("cfms-data-updated")
                    );

                    toast.success(
                      "Complaint status updated"
                    );
                  }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  className="details-button"
                  onClick={() =>
                    setSelectedComplaint(complaint)
                  }
                >
                  View Details
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    onDeleteComplaint(complaint)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* =========================================================
   ANONYMOUS COMPLAINTS
========================================================= */

const AnonymousComplaintsSection = ({
  complaints,
  setSelectedComplaint,
  onDeleteComplaint,
}) => {
  const anonymousComplaints = complaints.filter(
    (complaint) => complaint?.anonymous === true
  );

  return (
    <>
      <div className="admin-header">
        <div>
          <div className="admin-eyebrow">
            COMPLAINT MANAGEMENT
          </div>

          <h1>Anonymous Complaints</h1>

          <p>
            Review complaints submitted without revealing
            the submitter's identity.
          </p>
        </div>
      </div>

      <div className="results-summary">
        {anonymousComplaints.length} anonymous complaint
        {anonymousComplaints.length === 1 ? "" : "s"}
      </div>

      {anonymousComplaints.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No anonymous complaints</h3>

          <p>
            Anonymous complaints submitted by users will
            appear here.
          </p>
        </div>
      ) : (
        <div className="admin-complaints-list">
          {anonymousComplaints.map((complaint) => (
            <div
              className="admin-complaint-card"
              key={getComplaintId(complaint)}
            >
              <div className="complaint-information">
                <div className="complaint-meta">
                  <span className="complaint-id">
                    {getComplaintId(complaint)}
                  </span>

                  <span className="complaint-category">
                    {complaint?.category ||
                      "Uncategorized"}
                  </span>

                  <span className="anonymous-badge">
                    Anonymous
                  </span>
                </div>

                <h3>{getComplaintTitle(complaint)}</h3>

                <p>
                  {complaint?.description ||
                    "No description provided."}
                </p>

                <div className="complaint-footer-info">
                  <span>
                    Date:{" "}
                    {formatDate(
                      getComplaintDate(complaint)
                    )}
                  </span>

                  <span>Submitter identity hidden</span>
                </div>
              </div>

              <div className="complaint-status-area">
                <span
                  className={`admin-priority ${getPriorityClass(
                    complaint?.priority
                  )}`}
                >
                  {complaint?.priority || "Medium"}
                </span>

                <span
                  className={`admin-status ${getStatusClass(
                    complaint?.status
                  )}`}
                >
                  {complaint?.status || "Pending"}
                </span>

                <button
                  className="details-button"
                  onClick={() =>
                    setSelectedComplaint(complaint)
                  }
                >
                  View Details
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    onDeleteComplaint(complaint)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* =========================================================
   FEEDBACK
========================================================= */

const FeedbackSection = ({
  feedbackList,
  feedbackSearch,
  setFeedbackSearch,
  feedbackCategoryFilter,
  setFeedbackCategoryFilter,
  feedbackRatingFilter,
  setFeedbackRatingFilter,
  feedbackCategories,
  setSelectedFeedback,
  onDeleteFeedback,
  anonymousOnly = false,
}) => {
  const filteredFeedback = useMemo(() => {
    const searchValue = feedbackSearch
      .toLowerCase()
      .trim();

    return feedbackList.filter((feedback) => {
      if (anonymousOnly && feedback?.anonymous !== true) {
        return false;
      }

      const matchesSearch =
        !searchValue ||
        [
          getFeedbackId(feedback),
          feedback?.complaintId,
          feedback?.category,
          getFeedbackComment(feedback),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(searchValue)
          );

      const matchesCategory =
        feedbackCategoryFilter === "All" ||
        feedback?.category === feedbackCategoryFilter;

      const rating = toNumber(feedback?.rating);

      const matchesRating =
        feedbackRatingFilter === "All" ||
        String(rating) === feedbackRatingFilter;

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
    anonymousOnly,
  ]);

  const averageRating =
    feedbackList.length > 0
      ? (
          feedbackList.reduce(
            (sum, feedback) =>
              sum + toNumber(feedback?.rating),
            0
          ) / feedbackList.length
        ).toFixed(1)
      : "0.0";

  return (
    <>
      <div className="admin-header">
        <div>
          <div className="admin-eyebrow">
            FEEDBACK MANAGEMENT
          </div>

          <h1>
            {anonymousOnly
              ? "Anonymous Feedbacks"
              : "All Feedbacks"}
          </h1>

          <p>
            {anonymousOnly
              ? "Review feedback submitted anonymously by users."
              : "Review user feedback and service ratings across CampusVoice."}
          </p>
        </div>
      </div>

      <div className="feedback-admin-stats">
        <div className="feedback-admin-stat">
          <span>Total Feedback</span>
          <strong>{feedbackList.length}</strong>
        </div>

        <div className="feedback-admin-stat">
          <span>Average Rating</span>
          <strong>{averageRating}/5</strong>
        </div>

        <div className="feedback-admin-stat">
          <span>Anonymous</span>
          <strong>
            {
              feedbackList.filter(
                (item) => item?.anonymous === true
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="admin-filter-panel">
        <input
          type="text"
          className="admin-search"
          placeholder="Search feedback..."
          value={feedbackSearch}
          onChange={(event) =>
            setFeedbackSearch(event.target.value)
          }
        />

        <select
          className="admin-filter-select"
          value={feedbackCategoryFilter}
          onChange={(event) =>
            setFeedbackCategoryFilter(event.target.value)
          }
        >
          <option value="All">All Categories</option>

          {feedbackCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="admin-filter-select"
          value={feedbackRatingFilter}
          onChange={(event) =>
            setFeedbackRatingFilter(event.target.value)
          }
        >
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="results-summary">
        Showing {filteredFeedback.length} of{" "}
        {feedbackList.length} feedback entries
      </div>

      {filteredFeedback.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No feedback found</h3>

          <p>
            Feedback matching the current filters will
            appear here.
          </p>
        </div>
      ) : (
        <div className="feedback-admin-list">
          {filteredFeedback.map((feedback) => (
            <div
              className="feedback-admin-card"
              key={getFeedbackId(feedback)}
            >
              <div className="feedback-admin-top">
                <div>
                  <span className="feedback-reference">
                    {feedback?.complaintId ||
                      "General Feedback"}
                  </span>

                  <h3>
                    {feedback?.category ||
                      "General Feedback"}
                  </h3>
                </div>

                <div className="feedback-large-rating">
                  {toNumber(feedback?.rating)}/5
                </div>
              </div>

              <p className="latest-feedback-comment">
                {getFeedbackComment(feedback)}
              </p>

              <div className="feedback-admin-meta">
                <span>
                  {getSubmissionMode(feedback)}
                </span>

                <span className="meta-separator">•</span>

                <span>
                  {formatDate(
                    getFeedbackDate(feedback)
                  )}
                </span>

                <span className="meta-separator">•</span>

                <span>{getFeedbackId(feedback)}</span>
              </div>

              <div className="feedback-admin-actions">
                <button
                  className="details-button"
                  onClick={() =>
                    setSelectedFeedback(feedback)
                  }
                >
                  View Details
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    onDeleteFeedback(feedback)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* =========================================================
   CATEGORIES
========================================================= */

const CategoriesSection = ({
  categories,
  complaints,
  onAddCategory,
}) => {
  return (
    <>
      <div className="category-page-header">
        <div>
          <div className="admin-eyebrow">
            COMPLAINT MANAGEMENT
          </div>

          <h1>Complaint Categories</h1>

          <p>
            Manage the categories available for complaint
            classification.
          </p>
        </div>

        <button
          className="add-category-button"
          onClick={onAddCategory}
        >
          Add Category
        </button>
      </div>

      <div className="category-admin-grid">
        {categories.map((category) => {
          const count = complaints.filter(
            (complaint) =>
              String(complaint?.category || "").toLowerCase() ===
              String(category).toLowerCase()
          ).length;

          return (
            <div
              className="category-admin-card"
              key={category}
            >
              <div className="category-card-title">
                {category}
              </div>

              <div className="category-card-count">
                {count}
              </div>

              <div className="category-card-label">
                Complaint{count === 1 ? "" : "s"}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* =========================================================
   COMPLAINT MODAL
========================================================= */

const ComplaintModal = ({
  complaint,
  onClose,
  onStatusChange,
  onDelete,
}) => {
  if (!complaint) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <div className="admin-eyebrow">
              COMPLAINT DETAILS
            </div>

            <h2>{getComplaintTitle(complaint)}</h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal-detail-grid">
          <div>
            <span>ID</span>
            <strong>{getComplaintId(complaint)}</strong>
          </div>

          <div>
            <span>Category</span>
            <strong>
              {complaint?.category || "Uncategorized"}
            </strong>
          </div>

          <div>
            <span>Priority</span>
            <strong>
              {complaint?.priority || "Medium"}
            </strong>
          </div>

          <div>
            <span>Date</span>
            <strong>
              {formatDate(getComplaintDate(complaint))}
            </strong>
          </div>

          <div>
            <span>Submitted By</span>
           <strong>
  {complaint?.anonymous
    ? "Anonymous User"
    : typeof complaint?.submittedBy === "object"
      ? complaint?.submittedBy?.name ||
        complaint?.submittedBy?.email ||
        "Registered User"
      : complaint?.submittedBy || "Registered User"}
</strong>
          </div>

          <div>
            <span>Submission Type</span>
            <strong>
              {getSubmissionMode(complaint)}
            </strong>
          </div>
        </div>

        <div className="modal-description">
          <span>Description</span>

          <p>
            {complaint?.description ||
              "No description provided."}
          </p>
        </div>

        <div className="modal-actions">
          <select
            className={`status-select ${getStatusClass(
              complaint?.status
            )}`}
            value={complaint?.status || "Pending"}
            onChange={(event) =>
              onStatusChange(
                complaint,
                event.target.value
              )
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            className="modal-secondary-button"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="delete-button"
            onClick={() => onDelete(complaint)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   FEEDBACK MODAL
========================================================= */

const FeedbackModal = ({ feedback, onClose, onDelete }) => {
  if (!feedback) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <div className="admin-eyebrow">
              FEEDBACK DETAILS
            </div>

            <h2>Feedback Details</h2>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="modal-detail-grid">
          <div>
            <span>Feedback ID</span>
            <strong>{getFeedbackId(feedback)}</strong>
          </div>

          <div>
            <span>Complaint ID</span>
            <strong>
              {feedback?.complaintId || "—"}
            </strong>
          </div>

          <div>
            <span>Category</span>
            <strong>
              {feedback?.category || "General Feedback"}
            </strong>
          </div>

          <div>
            <span>Rating</span>
            <strong>
              {toNumber(feedback?.rating)}/5
            </strong>
          </div>

          <div>
            <span>Submitted By</span>
            <strong>
              {feedback?.anonymous
                ? "Anonymous User"
                : feedback?.submittedBy ||
                  "Registered User"}
            </strong>
          </div>

          <div>
            <span>Date</span>
            <strong>
              {formatDate(getFeedbackDate(feedback))}
            </strong>
          </div>
        </div>

        <div className="modal-description">
          <span>Feedback</span>

          <p>{getFeedbackComment(feedback)}</p>
        </div>

        <div className="modal-actions">
          <button
            className="modal-secondary-button"
            onClick={onClose}
          >
            Close
          </button>

          <button
            className="delete-button"
            onClick={() => onDelete(feedback)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ANALYTICS MODAL
========================================================= */

const AnalyticsModal = ({
  complaints,
  feedbackList,
  onClose,
}) => {
  const totalComplaints = complaints.length;

  const pending = complaints.filter(
    (item) =>
      String(item?.status || "").toLowerCase() === "pending"
  ).length;

  const inProgress = complaints.filter(
    (item) =>
      String(item?.status || "").toLowerCase() ===
      "in progress"
  ).length;

  const resolved = complaints.filter((item) => {
    const status = String(item?.status || "").toLowerCase();

    return status === "resolved" || status === "completed";
  }).length;

  const resolutionRate =
    totalComplaints > 0
      ? Math.round((resolved / totalComplaints) * 100)
      : 0;

  const feedbackAverage =
    feedbackList.length > 0
      ? (
          feedbackList.reduce(
            (sum, item) => sum + toNumber(item?.rating),
            0
          ) / feedbackList.length
        ).toFixed(1)
      : "0.0";

  const goodFeedback = feedbackList.filter(
    (item) => toNumber(item?.rating) >= 4
  ).length;

  const improvementFeedback = feedbackList.filter(
    (item) => toNumber(item?.rating) <= 3
  ).length;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal analytics-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <div className="admin-eyebrow">
              SYSTEM REPORT
            </div>

            <h2>CampusVoice Analytics</h2>

            <p className="analytics-subtitle">
              Current complaint and feedback activity.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="analytics-summary-grid">
          <div className="analytics-summary-card">
            <span>Total Complaints</span>
            <strong>{totalComplaints}</strong>
          </div>

          <div className="analytics-summary-card">
            <span>Resolution Rate</span>
            <strong>{resolutionRate}%</strong>
          </div>

          <div className="analytics-summary-card">
            <span>Total Feedback</span>
            <strong>{feedbackList.length}</strong>
          </div>

          <div className="analytics-summary-card">
            <span>Average Rating</span>
            <strong>{feedbackAverage}/5</strong>
          </div>
        </div>

        <div className="analytics-section">
          <div className="analytics-section-header">
            <h3>Complaint Distribution</h3>
          </div>

          <div className="analytics-progress-list">
            <div className="analytics-progress-row">
              <div className="analytics-progress-label">
                <span>Pending</span>
                <strong>{pending}</strong>
              </div>

              <div className="analytics-progress-track">
                <div
                  className="analytics-progress pending-fill"
                  style={{
                    width: `${
                      totalComplaints
                        ? (pending / totalComplaints) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="analytics-progress-row">
              <div className="analytics-progress-label">
                <span>In Progress</span>
                <strong>{inProgress}</strong>
              </div>

              <div className="analytics-progress-track">
                <div
                  className="analytics-progress progress-fill"
                  style={{
                    width: `${
                      totalComplaints
                        ? (inProgress / totalComplaints) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="analytics-progress-row">
              <div className="analytics-progress-label">
                <span>Resolved</span>
                <strong>{resolved}</strong>
              </div>

              <div className="analytics-progress-track">
                <div
                  className="analytics-progress resolved-fill"
                  style={{
                    width: `${
                      totalComplaints
                        ? (resolved / totalComplaints) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-section">
          <div className="analytics-section-header">
            <h3>Feedback Quality</h3>
          </div>

          <div className="feedback-analysis-grid">
            <div className="feedback-quality-card">
              <span>Good Feedback</span>

              <strong>{goodFeedback}</strong>

              <div className="feedback-quality-bar">
                <div
                  style={{
                    width: `${
                      feedbackList.length
                        ? (goodFeedback /
                            feedbackList.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <small>Ratings 4–5</small>
            </div>

            <div className="feedback-quality-card">
              <span>Needs Improvement</span>

              <strong>{improvementFeedback}</strong>

              <div className="feedback-quality-bar">
                <div
                  style={{
                    width: `${
                      feedbackList.length
                        ? (improvementFeedback /
                            feedbackList.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <small>Ratings 1–3</small>
            </div>
          </div>
        </div>

        <div className="analytics-resolution-card">
          <div className="analytics-circle-value">
            {resolutionRate}%
          </div>

          <div>
            <strong>Complaint Resolution Rate</strong>

            <p>
              Percentage of submitted complaints currently
              marked as resolved.
            </p>
          </div>
        </div>

        <div className="analytics-modal-footer">
          <button
            className="modal-secondary-button"
            onClick={onClose}
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ADD CATEGORY MODAL
========================================================= */

const AddCategoryModal = ({
  categoryName,
  setCategoryName,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal category-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <div className="admin-eyebrow">
              CATEGORY MANAGEMENT
            </div>

            <h2>Add Complaint Category</h2>

            <p className="category-modal-subtitle">
              Create a new category for complaint
              classification.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="category-form">
          <label htmlFor="categoryName">
            Category Name
          </label>

          <input
            id="categoryName"
            type="text"
            value={categoryName}
            placeholder="Enter category name"
            onChange={(event) =>
              setCategoryName(event.target.value)
            }
            autoFocus
          />

          <div className="category-form-actions">
            <button
              className="category-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="add-category-submit"
              onClick={onSubmit}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN ADMIN DASHBOARD
========================================================= */

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [feedbackList, setFeedbackList] = useState(() =>
    getStoredFeedback()
  );

  const [categories, setCategories] = useState(() =>
  getStoredCategories()
);

const loadComplaints = async () => {
  try {
    const response = await api.get("/complaints");

    setComplaints(response.complaints || []);
  } catch (error) {
    console.error("Failed to load complaints:", error);
    toast.error(error.message || "Failed to load complaints");
  }
};

useEffect(() => {
  loadComplaints();
}, []);

const [activeSection, setActiveSection] =
  useState("overview");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [feedbackSearch, setFeedbackSearch] =
    useState("");

  const [feedbackCategoryFilter, setFeedbackCategoryFilter] =
    useState("All");

  const [feedbackRatingFilter, setFeedbackRatingFilter] =
    useState("All");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [selectedFeedback, setSelectedFeedback] =
    useState(null);

  const [showAnalytics, setShowAnalytics] =
    useState(false);

  const [showAddCategory, setShowAddCategory] =
    useState(false);

  const [newCategoryName, setNewCategoryName] =
    useState("");

 const refreshData = async () => {
  await loadComplaints();

  setFeedbackList(getStoredFeedback());
  setCategories(getStoredCategories());

  toast.success("Dashboard data refreshed");
};
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("cfms_user");

    toast.success("Logged out successfully");

    navigate("/");
  };

 const handleStatusChange = async (
  complaint,
  newStatus
) => {
  try {
    const response = await api.patch(
      `/complaints/${complaint._id}/status`,
      {
        status: newStatus,
      }
    );

    if (!response.success) {
      throw new Error(
        response.message || "Failed to update complaint status"
      );
    }

    const id = getComplaintId(complaint);

    const updatedComplaints = complaints.map((item) =>
      getComplaintId(item) === id
        ? {
            ...item,
            status: newStatus,
          }
        : item
    );

    setComplaints(updatedComplaints);

    setSelectedComplaint((current) =>
      current &&
      getComplaintId(current) === id
        ? {
            ...current,
            status: newStatus,
          }
        : current
    );

    window.dispatchEvent(
      new Event("cfms-data-updated")
    );

    toast.success("Complaint status updated");
  } catch (error) {
    console.error(
      "Complaint status update error:",
      error
    );

    toast.error(
      error.message || "Failed to update complaint status"
    );
  }
};
  const handleDeleteComplaint = (complaint) => {
    const id = getComplaintId(complaint);

    const confirmed = window.confirm(
      `Delete complaint ${id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    deleteComplaint(id);

    setComplaints((current) =>
      current.filter(
        (item) => getComplaintId(item) !== id
      )
    );

    setSelectedComplaint(null);

    window.dispatchEvent(
      new Event("cfms-data-updated")
    );

    toast.success("Complaint deleted");
  };

  const handleDeleteFeedback = (feedback) => {
    const id = getFeedbackId(feedback);

    const confirmed = window.confirm(
      `Delete feedback ${id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    deleteFeedback(id);

    setFeedbackList((current) =>
      current.filter(
        (item) => getFeedbackId(item) !== id
      )
    );

    setSelectedFeedback(null);

    window.dispatchEvent(
      new Event("cfms-data-updated")
    );

    toast.success("Feedback deleted");
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      toast.error("Please enter a category name");
      return;
    }

    const exists = categories.some(
      (category) =>
        String(category).toLowerCase() ===
        trimmedName.toLowerCase()
    );

    if (exists) {
      toast.error("This category already exists");
      return;
    }

    saveCategory(trimmedName);

    setCategories(getStoredCategories());

    setNewCategoryName("");
    setShowAddCategory(false);

    toast.success("Category added successfully");
  };

  const clearComplaintFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  const anonymousComplaintCount = complaints.filter(
    (complaint) => complaint?.anonymous === true
  ).length;

  const anonymousFeedbackCount = feedbackList.filter(
    (feedback) => feedback?.anonymous === true
  ).length;

  const feedbackCategories = useMemo(() => {
    const values = [
      ...categories,
      ...feedbackList
        .map((feedback) => feedback?.category)
        .filter(Boolean),
    ];

    return [...new Set(values)];
  }, [categories, feedbackList]);

  return (
    <>
      <Navbar />

      <div className="admin-page">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          complaintCount={complaints.length}
          feedbackCount={feedbackList.length}
          anonymousComplaintCount={
            anonymousComplaintCount
          }
          anonymousFeedbackCount={
            anonymousFeedbackCount
          }
          categoryCount={categories.length}
          onRefresh={refreshData}
          onAnalytics={() => setShowAnalytics(true)}
          onLogout={handleLogout}
        />

        <main className="admin-main">
          <div className="admin-container">
            {activeSection === "overview" && (
              <OverviewSection
                complaints={complaints}
                feedbackList={feedbackList}
                categories={categories}
                setActiveSection={setActiveSection}
                setSelectedComplaint={
                  setSelectedComplaint
                }
                setSelectedFeedback={setSelectedFeedback}
              />
            )}

            {activeSection === "complaints" && (
              <ComplaintsSection
                complaints={complaints}
                categories={categories}
                search={search}
                setSearch={setSearch}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                onClearFilters={clearComplaintFilters}
                setSelectedComplaint={
                  setSelectedComplaint
                }
                onDeleteComplaint={
                  handleDeleteComplaint
                }
              />
            )}

            {activeSection === "anonymous-complaints" && (
              <AnonymousComplaintsSection
                complaints={complaints}
                setSelectedComplaint={
                  setSelectedComplaint
                }
                onDeleteComplaint={
                  handleDeleteComplaint
                }
              />
            )}

            {activeSection === "feedback" && (
              <FeedbackSection
                feedbackList={feedbackList}
                feedbackSearch={feedbackSearch}
                setFeedbackSearch={setFeedbackSearch}
                feedbackCategoryFilter={
                  feedbackCategoryFilter
                }
                setFeedbackCategoryFilter={
                  setFeedbackCategoryFilter
                }
                feedbackRatingFilter={
                  feedbackRatingFilter
                }
                setFeedbackRatingFilter={
                  setFeedbackRatingFilter
                }
                feedbackCategories={
                  feedbackCategories
                }
                setSelectedFeedback={
                  setSelectedFeedback
                }
                onDeleteFeedback={handleDeleteFeedback}
              />
            )}

            {activeSection === "anonymous-feedback" && (
              <FeedbackSection
                feedbackList={feedbackList}
                feedbackSearch={feedbackSearch}
                setFeedbackSearch={setFeedbackSearch}
                feedbackCategoryFilter={
                  feedbackCategoryFilter
                }
                setFeedbackCategoryFilter={
                  setFeedbackCategoryFilter
                }
                feedbackRatingFilter={
                  feedbackRatingFilter
                }
                setFeedbackRatingFilter={
                  setFeedbackRatingFilter
                }
                feedbackCategories={
                  feedbackCategories
                }
                setSelectedFeedback={
                  setSelectedFeedback
                }
                onDeleteFeedback={handleDeleteFeedback}
                anonymousOnly
              />
            )}

            {activeSection === "categories" && (
              <CategoriesSection
                categories={categories}
                complaints={complaints}
                onAddCategory={() =>
                  setShowAddCategory(true)
                }
              />
            )}
          </div>

          <div className="admin-footer">
            <Footer />
          </div>
        </main>
      </div>

      {selectedComplaint && (
        <ComplaintModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteComplaint}
        />
      )}

      {selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onDelete={handleDeleteFeedback}
        />
      )}

      {showAnalytics && (
        <AnalyticsModal
          complaints={complaints}
          feedbackList={feedbackList}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showAddCategory && (
        <AddCategoryModal
          categoryName={newCategoryName}
          setCategoryName={setNewCategoryName}
          onClose={() => {
            setShowAddCategory(false);
            setNewCategoryName("");
          }}
          onSubmit={handleAddCategory}
        />
      )}
    </>
  );
};

export default AdminDashboard;