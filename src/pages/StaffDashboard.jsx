import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/StaffDashboard.css";

/* =========================================================
   API CONFIG
========================================================= */

const API_BASE_URL = "http://localhost:5000/api";

/* =========================================================
   AUTH TOKEN
========================================================= */

function getToken() {
  return (
    localStorage.getItem("cfms_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}

/* =========================================================
   API REQUEST
========================================================= */

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

/* =========================================================
   COMPLAINT CARD
========================================================= */

function ComplaintCard({
  complaint,
  onOpen,
  getStatusClass,
  getPriorityClass,
  formatDate,
}) {
  const title =
    complaint.title ||
    complaint.subject ||
    "Untitled Complaint";

  const complaintId =
    complaint.referenceId ||
    complaint.id ||
    complaint._id ||
    "CMP-0000";

  return (
    <article className="staff-complaint-card">
      <div className="staff-complaint-main">

        <div className="staff-complaint-indicator" />

        <div className="staff-complaint-info">

          <span className="staff-complaint-id">
            {complaintId}
          </span>

          <h3>{title}</h3>

          <p>
            {complaint.description
              ? complaint.description.length > 90
                ? `${complaint.description.slice(
                    0,
                    90
                  )}...`
                : complaint.description
              : "No description provided."}
          </p>

        </div>

        <span className="staff-category-badge">
          {complaint.category || "Other"}
        </span>

        <span
          className={`staff-priority-badge ${getPriorityClass(
            complaint.priority
          )}`}
        >
          {complaint.priority || "Medium"}
        </span>

        <div className="staff-assigned-date">

          <strong>
            {formatDate(
              complaint.assignedDate ||
                complaint.createdAt
            )}
          </strong>

          <span>
            Assigned by{" "}
            {complaint.assignedBy || "Admin"}
          </span>

        </div>

        <span
          className={`staff-status-badge ${getStatusClass(
            complaint.status
          )}`}
        >
          {complaint.status || "Submitted"}
        </span>

        <button
          type="button"
          className="staff-view-btn"
          onClick={() => onOpen(complaint)}
        >
          View Details →
        </button>

      </div>
    </article>
  );
}

/* =========================================================
   PRIORITY SECTION
========================================================= */

function PrioritySection({
  title,
  description,
  icon,
  items,
  priorityClass,
  onOpen,
  getStatusClass,
  getPriorityClass,
  formatDate,
}) {
  return (
    <section
      className={`priority-section ${priorityClass}`}
    >

      <div className="priority-section-header">

        <div className="priority-title-wrap">

          <span className="priority-icon">
            {icon}
          </span>

          <div>

            <h3>{title}</h3>

            <p>{description}</p>

          </div>

        </div>

        <span className="priority-count">
          {items.length}
        </span>

      </div>

      {items.length === 0 ? (

        <div className="priority-empty">
          No {title.toLowerCase()} complaints assigned.
        </div>

      ) : (

        <div className="priority-complaints">

          {items.map((complaint) => (

            <ComplaintCard
              key={
                complaint._id ||
                complaint.referenceId
              }
              complaint={complaint}
              onOpen={onOpen}
              getStatusClass={getStatusClass}
              getPriorityClass={getPriorityClass}
              formatDate={formatDate}
            />

          ))}

        </div>

      )}

    </section>
  );
}

/* =========================================================
   STAFF DASHBOARD
========================================================= */

function StaffDashboard() {

  const [complaints, setComplaints] =
    useState([]);

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [resolutionNote, setResolutionNote] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [staff] = useState(() => {

    try {

      const storedUser =
        localStorage.getItem("cfms_user");

      if (!storedUser) {
        return {
          name: "Staff Member",
          role: "Staff",
          id: "",
        };
      }

      const parsed =
        JSON.parse(storedUser);

      return {
        name:
          parsed?.name ||
          parsed?.fullName ||
          `${parsed?.firstName || ""} ${
            parsed?.lastName || ""
          }`.trim() ||
          "Staff Member",

        role:
          parsed?.role ||
          "Staff",

        id:
          parsed?._id ||
          parsed?.id ||
          parsed?.userId ||
          "",
      };

    } catch (err) {

      console.error(
        "Unable to load staff information:",
        err
      );

      return {
        name: "Staff Member",
        role: "Staff",
        id: "",
      };
    }

  });

  /* =======================================================
     LOAD COMPLAINTS FROM BACKEND
  ======================================================= */

  const loadComplaints = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await apiRequest("/complaints");

      const loadedComplaints =
        Array.isArray(data.complaints)
          ? data.complaints
          : [];

      setComplaints(
        loadedComplaints
      );

    } catch (err) {

      console.error(
        "Unable to load staff complaints:",
        err
      );

      setError(
        err.message ||
          "Unable to load complaints."
      );

    } finally {

      setLoading(false);

    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    loadComplaints();

    const handleComplaintUpdate =
      () => {
        loadComplaints();
      };

    window.addEventListener(
      "cfms-complaints-updated",
      handleComplaintUpdate
    );

    return () => {

      window.removeEventListener(
        "cfms-complaints-updated",
        handleComplaintUpdate
      );

    };

  }, []);

  /* =======================================================
     FILTER COMPLAINTS
  ======================================================= */

  const filteredComplaints =
    useMemo(() => {

      const cleanSearch =
        search
          .trim()
          .toLowerCase();

      return complaints.filter(
        (complaint) => {

          const title =
            complaint.title ||
            complaint.subject ||
            "";

          const referenceId =
            complaint.referenceId ||
            complaint.id ||
            complaint._id ||
            "";

          const category =
            complaint.category ||
            "";

          const matchesSearch =
            !cleanSearch ||
            String(referenceId)
              .toLowerCase()
              .includes(cleanSearch) ||
            String(title)
              .toLowerCase()
              .includes(cleanSearch) ||
            String(category)
              .toLowerCase()
              .includes(cleanSearch);

          const complaintStatus =
            String(
              complaint.status ||
                "Submitted"
            ).toLowerCase();

          const matchesStatus =
            statusFilter === "All" ||
            complaintStatus ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [
      complaints,
      search,
      statusFilter,
    ]);

  /* =======================================================
     PRIORITY GROUPS
  ======================================================= */

  const highPriority =
    filteredComplaints.filter(
      (complaint) =>
        String(
          complaint.priority ||
            "Medium"
        ).toLowerCase() ===
        "high"
    );

  const mediumPriority =
    filteredComplaints.filter(
      (complaint) =>
        String(
          complaint.priority ||
            "Medium"
        ).toLowerCase() ===
        "medium"
    );

  const lowPriority =
    filteredComplaints.filter(
      (complaint) =>
        String(
          complaint.priority ||
            "Medium"
        ).toLowerCase() ===
        "low"
    );

  /* =======================================================
     COUNTS
  ======================================================= */

  const pendingCount =
    complaints.filter(
      (complaint) => {

        const status =
          String(
            complaint.status ||
              "Submitted"
          ).toLowerCase();

        return (
          status === "submitted" ||
          status === "under review" ||
          status === "pending"
        );
      }
    ).length;

  const progressCount =
    complaints.filter(
      (complaint) =>
        String(
          complaint.status ||
            ""
        ).toLowerCase() ===
        "in progress"
    ).length;

  const completedCount =
    complaints.filter(
      (complaint) => {

        const status =
          String(
            complaint.status ||
              ""
          ).toLowerCase();

        return (
          status === "completed" ||
          status === "resolved" ||
          status === "closed"
        );

      }
    ).length;

  const highPriorityCount =
    complaints.filter(
      (complaint) =>
        String(
          complaint.priority ||
            ""
        ).toLowerCase() ===
        "high"
    ).length;

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

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

  const formatDateTime = (date) => {

    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =======================================================
     STATUS CLASS
  ======================================================= */

  const getStatusClass = (status) => {

    return String(
      status || "Submitted"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /* =======================================================
     PRIORITY CLASS
  ======================================================= */

  const getPriorityClass = (
    priority
  ) => {

    return String(
      priority || "Medium"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /* =======================================================
     OPEN COMPLAINT
  ======================================================= */

  const openComplaint = (
    complaint
  ) => {

    setSelectedComplaint(
      complaint
    );

    setResolutionNote(
      complaint
        ?.resolutionDetails
        ?.resolutionSummary ||
        complaint?.resolutionNote ||
        ""
    );

    setError("");
  };

  /* =======================================================
     CLOSE COMPLAINT
  ======================================================= */

  const closeComplaint = () => {

    if (actionLoading) {
      return;
    }

    setSelectedComplaint(
      null
    );

    setResolutionNote(
      ""
    );

    setError("");
  };

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  const updateStatus = async (
    newStatus
  ) => {

    if (!selectedComplaint) {
      return;
    }

    if (
      newStatus ===
      selectedComplaint.status
    ) {
      return;
    }

    try {

      setActionLoading(true);
      setError("");

      const complaintId =
        selectedComplaint._id;

      const data =
        await apiRequest(
          `/complaints/${complaintId}/status`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status: newStatus,
              notes:
                resolutionNote.trim(),
            }),
          }
        );

      const updated =
        data.complaint;

      setSelectedComplaint(
        updated
      );

      setComplaints(
        (previous) =>
          previous.map(
            (complaint) =>
              String(
                complaint._id
              ) ===
              String(
                updated._id
              )
                ? updated
                : complaint
          )
      );

      window.dispatchEvent(
        new Event(
          "cfms-complaints-updated"
        )
      );

    } catch (err) {

      console.error(
        "Unable to update status:",
        err
      );

      setError(
        err.message ||
          "Unable to update complaint status."
      );

    } finally {

      setActionLoading(false);

    }
  };

  /* =======================================================
     COMPLETE / RESOLVE COMPLAINT
  ======================================================= */

  const handleCompleteComplaint =
    async () => {

      if (!selectedComplaint) {
        return;
      }

      const cleanNote =
        resolutionNote.trim();

      if (!cleanNote) {

        setError(
          "Please add a resolution note before completing the complaint."
        );

        return;
      }

      try {

        setActionLoading(true);
        setError("");

        const complaintId =
          selectedComplaint._id;

        const data =
          await apiRequest(
            `/complaints/${complaintId}/resolve`,
            {
              method: "POST",
              body: JSON.stringify({
                resolutionSummary:
                  cleanNote,
              }),
            }
          );

        const updated =
          data.complaint;

        setSelectedComplaint(
          updated
        );

        setComplaints(
          (previous) =>
            previous.map(
              (complaint) =>
                String(
                  complaint._id
                ) ===
                String(
                  updated._id
                )
                  ? updated
                  : complaint
            )
        );

        window.dispatchEvent(
          new Event(
            "cfms-complaints-updated"
          )
        );

      } catch (err) {

        console.error(
          "Unable to resolve complaint:",
          err
        );

        setError(
          err.message ||
            "Unable to resolve complaint."
        );

      } finally {

        setActionLoading(false);

      }
    };

  /* =======================================================
     ADD UPDATE
  ======================================================= */

  const handleAddUpdate =
    async () => {

      if (!selectedComplaint) {
        return;
      }

      const cleanNote =
        resolutionNote.trim();

      if (!cleanNote) {

        setError(
          "Please enter an update message."
        );

        return;
      }

      try {

        setActionLoading(true);
        setError("");

        const complaintId =
          selectedComplaint._id;

        const data =
          await apiRequest(
            `/complaints/${complaintId}/updates`,
            {
              method: "POST",
              body: JSON.stringify({
                message:
                  cleanNote,
                isInternal: false,
              }),
            }
          );

        const updated =
          data.complaint;

        setSelectedComplaint(
          updated
        );

        setComplaints(
          (previous) =>
            previous.map(
              (complaint) =>
                String(
                  complaint._id
                ) ===
                String(
                  updated._id
                )
                  ? updated
                  : complaint
            )
        );

        alert(
          "Complaint update added successfully."
        );

      } catch (err) {

        console.error(
          "Unable to add update:",
          err
        );

        setError(
          err.message ||
            "Unable to add complaint update."
        );

      } finally {

        setActionLoading(false);

      }
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <Navbar />

      <div className="staff-layout">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="staff-sidebar">

          <div className="staff-sidebar-brand">

            <div className="staff-logo-icon">
              C
            </div>

            <div>

              <strong>
                CampusVoice
              </strong>

              <span>
                Staff Portal
              </span>

            </div>

          </div>

          <nav className="staff-sidebar-menu">

            <a
              href="#staff-overview"
              className="staff-sidebar-link active"
            >
              <span>⌂</span>
              Dashboard
            </a>

            <a
              href="#my-complaints"
              className="staff-sidebar-link"
            >
              <span>▣</span>
              My Complaints
            </a>

            <Link
              to="/profile"
              className="staff-sidebar-link"
            >
              <span>♙</span>
              Profile
            </Link>

          </nav>

          <div className="staff-sidebar-help">

            <span className="help-icon">
              ?
            </span>

            <div>

              <strong>
                Need Help?
              </strong>

              <small>
                Contact Admin Support
              </small>

            </div>

          </div>

          <div className="staff-sidebar-decoration">
            CampusVoice
          </div>

        </aside>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="staff-main">

          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="staff-dashboard-header"
            id="staff-overview"
          >

            <div>

              <span className="staff-eyebrow">
                STAFF PORTAL
              </span>

              <h1>
                Welcome back, {staff.name}!
              </h1>

              <p>
                Here’s an overview of your assigned
                complaints. Keep up the great work!
              </p>

            </div>

            <div className="staff-user-card">

              <div className="staff-avatar">

                {staff.name
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <strong>
                  {staff.name}
                </strong>

                <span>
                  {staff.role}
                </span>

                <small>
                  <i />
                  Online
                </small>

              </div>

            </div>

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

          {loading ? (

            <div className="staff-no-results">

              <div>
                ⏳
              </div>

              <h3>
                Loading complaints...
              </h3>

              <p>
                Please wait while we fetch
                your assigned complaints.
              </p>

            </div>

          ) : (

            <>

              {/* =================================================
                  STATISTICS
              ================================================= */}

              <section className="staff-stats">

                <div className="staff-stat-card">

                  <div className="stat-icon assigned">
                    ▣
                  </div>

                  <div>

                    <span>
                      Total Assigned
                    </span>

                    <strong>
                      {complaints.length}
                    </strong>

                    <small>
                      Complaints assigned to you
                    </small>

                  </div>

                </div>

                <div className="staff-stat-card">

                  <div className="stat-icon pending">
                    ◷
                  </div>

                  <div>

                    <span>
                      Pending
                    </span>

                    <strong>
                      {pendingCount}
                    </strong>

                    <small>
                      Awaiting action
                    </small>

                  </div>

                </div>

                <div className="staff-stat-card">

                  <div className="stat-icon progress">
                    ◔
                  </div>

                  <div>

                    <span>
                      In Progress
                    </span>

                    <strong>
                      {progressCount}
                    </strong>

                    <small>
                      Currently being resolved
                    </small>

                  </div>

                </div>

                <div className="staff-stat-card">

                  <div className="stat-icon completed">
                    ✓
                  </div>

                  <div>

                    <span>
                      Completed
                    </span>

                    <strong>
                      {completedCount}
                    </strong>

                    <small>
                      Resolved and updated
                    </small>

                  </div>

                </div>

                <div className="staff-stat-card">

                  <div className="stat-icon high">
                    !
                  </div>

                  <div>

                    <span>
                      High Priority
                    </span>

                    <strong>
                      {highPriorityCount}
                    </strong>

                    <small>
                      Requires attention
                    </small>

                  </div>

                </div>

              </section>

              {/* =================================================
                  CONTENT GRID
              ================================================= */}

              <div className="staff-content-grid">

                {/* =================================================
                    COMPLAINTS
                ================================================= */}

                <section
                  className="staff-complaints-panel"
                  id="my-complaints"
                >

                  <div className="staff-panel-header">

                    <div>

                      <h2>
                        My Assigned Complaints
                      </h2>

                      <p>
                        View and manage all complaints
                        assigned to you.
                      </p>

                    </div>

                    <div className="staff-filters">

                      <div className="staff-search">

                        <span>
                          ⌕
                        </span>

                        <input
                          type="text"
                          placeholder="Search by ID, title or category..."
                          value={search}
                          onChange={(event) =>
                            setSearch(
                              event.target.value
                            )
                          }
                        />

                      </div>

                      <select
                        value={statusFilter}
                        onChange={(event) =>
                          setStatusFilter(
                            event.target.value
                          )
                        }
                      >

                        <option value="All">
                          All Status
                        </option>

                        <option value="Submitted">
                          Submitted
                        </option>

                        <option value="Under Review">
                          Under Review
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>

                        <option value="Closed">
                          Closed
                        </option>

                      </select>

                    </div>

                  </div>

                  {/* HIGH */}

                  <PrioritySection
                    title="High Priority"
                    description="Requires immediate attention"
                    icon="!"
                    items={highPriority}
                    priorityClass="priority-high"
                    onOpen={openComplaint}
                    getStatusClass={
                      getStatusClass
                    }
                    getPriorityClass={
                      getPriorityClass
                    }
                    formatDate={formatDate}
                  />

                  {/* MEDIUM */}

                  <PrioritySection
                    title="Medium Priority"
                    description="Regular complaints requiring action"
                    icon="◷"
                    items={mediumPriority}
                    priorityClass="priority-medium"
                    onOpen={openComplaint}
                    getStatusClass={
                      getStatusClass
                    }
                    getPriorityClass={
                      getPriorityClass
                    }
                    formatDate={formatDate}
                  />

                  {/* LOW */}

                  <PrioritySection
                    title="Low Priority"
                    description="Can be handled after urgent issues"
                    icon="↓"
                    items={lowPriority}
                    priorityClass="priority-low"
                    onOpen={openComplaint}
                    getStatusClass={
                      getStatusClass
                    }
                    getPriorityClass={
                      getPriorityClass
                    }
                    formatDate={formatDate}
                  />

                  {filteredComplaints.length === 0 && (

                    <div className="staff-no-results">

                      <div>
                        ✓
                      </div>

                      <h3>
                        No assigned complaints
                      </h3>

                      <p>
                        Complaints assigned to you by
                        the administrator will appear here.
                      </p>

                    </div>

                  )}

                </section>

                {/* =================================================
                    RIGHT COLUMN
                ================================================= */}

                <aside className="staff-right-column">

                  {/* QUICK ACTIONS */}

                  <section className="staff-side-panel">

                    <div className="side-panel-heading">

                      <span>
                        ⚙
                      </span>

                      <h3>
                        Quick Actions
                      </h3>

                    </div>

                    <button
                      type="button"
                      className="quick-action primary"
                      onClick={() =>
                        document
                          .getElementById(
                            "my-complaints"
                          )
                          ?.scrollIntoView({
                            behavior:
                              "smooth",
                          })
                      }
                    >

                      <span>
                        ✓
                      </span>

                      <div>

                        <strong>
                          Update Complaint Status
                        </strong>

                        <small>
                          Mark as In Progress or Resolved
                        </small>

                      </div>

                    </button>

                    <button
                      type="button"
                      className="quick-action"
                      onClick={() => {

                        if (
                          selectedComplaint
                        ) {

                          document
                            .getElementById(
                              "complaint-details"
                            )
                            ?.scrollIntoView({
                              behavior:
                                "smooth",
                            });

                        } else {

                          alert(
                            "Open a complaint first."
                          );

                        }

                      }}
                    >

                      <span>
                        ▧
                      </span>

                      <div>

                        <strong>
                          Open Complaint
                        </strong>

                        <small>
                          View details and update complaint
                        </small>

                      </div>

                    </button>

                  </section>

                  {/* STATUS OVERVIEW */}

                  <section className="staff-side-panel">

                    <div className="side-panel-heading">

                      <span>
                        ◔
                      </span>

                      <h3>
                        Status Overview
                      </h3>

                    </div>

                    <div className="status-overview">

                      <div className="status-circle">

                        <strong>
                          {complaints.length}
                        </strong>

                        <span>
                          Total
                        </span>

                      </div>

                      <div className="status-legend">

                        <div>

                          <i className="dot pending-dot" />

                          <span>
                            Pending
                          </span>

                          <strong>
                            {pendingCount}
                          </strong>

                        </div>

                        <div>

                          <i className="dot progress-dot" />

                          <span>
                            In Progress
                          </span>

                          <strong>
                            {progressCount}
                          </strong>

                        </div>

                        <div>

                          <i className="dot completed-dot" />

                          <span>
                            Completed
                          </span>

                          <strong>
                            {completedCount}
                          </strong>

                        </div>

                        <div>

                          <i className="dot high-dot" />

                          <span>
                            High Priority
                          </span>

                          <strong>
                            {highPriorityCount}
                          </strong>

                        </div>

                      </div>

                    </div>

                  </section>

                  {/* RECENT ACTIVITY */}

                  <section className="staff-side-panel">

                    <div className="side-panel-heading">

                      <span>
                        ◷
                      </span>

                      <h3>
                        Recent Activity
                      </h3>

                    </div>

                    <div className="activity-list">

                      {complaints
                        .slice(0, 4)
                        .map(
                          (complaint) => {

                            const id =
                              complaint.referenceId ||
                              complaint._id;

                            const status =
                              String(
                                complaint.status ||
                                  ""
                              ).toLowerCase();

                            return (

                              <div
                                className="activity-item"
                                key={id}
                              >

                                <span className="activity-line">
                                  <i />
                                </span>

                                <div>

                                  <strong>
                                    {complaint.referenceId ||
                                      complaint._id}
                                  </strong>

                                  <p>

                                    {status ===
                                    "resolved"
                                      ? "Complaint resolved"
                                      : status ===
                                        "closed"
                                      ? "Complaint closed"
                                      : status ===
                                        "in progress"
                                      ? "Complaint is being resolved"
                                      : "Complaint assigned to you"}

                                  </p>

                                  <small>
                                    {formatDateTime(
                                      complaint.updatedAt ||
                                        complaint.createdAt
                                    )}
                                  </small>

                                </div>

                              </div>

                            );

                          }
                        )}

                      {complaints.length === 0 && (

                        <p className="no-activity">
                          No recent activity.
                        </p>

                      )}

                    </div>

                  </section>

                </aside>

              </div>

            </>

          )}

          {/* =================================================
              COMPLAINT DETAIL MODAL
          ================================================= */}

          {selectedComplaint && (

            <div
              className="staff-modal-overlay"
              onMouseDown={(event) => {

                if (
                  event.target ===
                  event.currentTarget
                ) {
                  closeComplaint();
                }

              }}
            >

              <div
                className="staff-detail-modal"
                id="complaint-details"
              >

                {/* HEADER */}

                <div className="detail-modal-header">

                  <div>

                    <span>
                      COMPLAINT DETAILS
                    </span>

                    <h2>
                      {selectedComplaint.referenceId ||
                        selectedComplaint._id}
                    </h2>

                    <h3>
                      {selectedComplaint.title ||
                        selectedComplaint.subject ||
                        "Untitled Complaint"}
                    </h3>

                  </div>

                  <button
                    type="button"
                    className="detail-close"
                    onClick={
                      closeComplaint
                    }
                    disabled={
                      actionLoading
                    }
                  >
                    ×
                  </button>

                </div>

                {/* STATUS */}

                <div className="detail-status-row">

                  <span
                    className={`staff-priority-badge ${getPriorityClass(
                      selectedComplaint.priority
                    )}`}
                  >
                    {selectedComplaint.priority ||
                      "Medium"}{" "}
                    Priority
                  </span>

                  <span
                    className={`staff-status-badge ${getStatusClass(
                      selectedComplaint.status
                    )}`}
                  >
                    {selectedComplaint.status ||
                      "Submitted"}
                  </span>

                </div>

                {/* INFORMATION */}

                <div className="complaint-detail-info">

                  <div>

                    <span>
                      Category
                    </span>

                    <strong>
                      {selectedComplaint.category ||
                        "Other"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Location
                    </span>

                    <strong>
                      {selectedComplaint.location ||
                        "Not specified"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Assigned By
                    </span>

                    <strong>
                      {selectedComplaint.assignedBy ||
                        "Admin"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Submitted On
                    </span>

                    <strong>
                      {formatDate(
                        selectedComplaint.createdAt
                      )}
                    </strong>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="detail-description">

                  <span>
                    Complaint Description
                  </span>

                  <p>
                    {selectedComplaint.description ||
                      "No description provided."}
                  </p>

                </div>

                {/* STAFF ACTION */}

                <div className="staff-action-section">

                  <h3>
                    Staff Actions
                  </h3>

                  {/* STATUS */}

                  <div className="staff-status-control">

                    <label>
                      Current Status
                    </label>

                    <select
                      value={
                        selectedComplaint.status ||
                        "Submitted"
                      }
                      onChange={(event) =>
                        updateStatus(
                          event.target.value
                        )
                      }
                      disabled={
                        actionLoading
                      }
                    >

                      <option value="Submitted">
                        Submitted
                      </option>

                      <option value="Under Review">
                        Under Review
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                      <option value="Closed">
                        Closed
                      </option>

                    </select>

                  </div>

                  {/* RESOLUTION NOTE */}

                  <div className="resolution-field">

                    <label>
                      Resolution / Update Note
                    </label>

                    <textarea
                      rows="5"
                      maxLength="500"
                      placeholder="Describe what you did or add an update..."
                      value={
                        resolutionNote
                      }
                      onChange={(event) =>
                        setResolutionNote(
                          event.target.value
                        )
                      }
                      disabled={
                        actionLoading
                      }
                    />

                    <small>
                      {resolutionNote.length}/500
                    </small>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >

                    <button
                      type="button"
                      className="complete-complaint-btn"
                      onClick={
                        handleAddUpdate
                      }
                      disabled={
                        actionLoading ||
                        !resolutionNote.trim()
                      }
                    >
                      {actionLoading
                        ? "Saving..."
                        : "Add Update"}
                    </button>

                    <button
                      type="button"
                      className="complete-complaint-btn"
                      onClick={
                        handleCompleteComplaint
                      }
                      disabled={
                        actionLoading ||
                        selectedComplaint.status ===
                          "Resolved" ||
                        selectedComplaint.status ===
                          "Closed"
                      }
                    >
                      {actionLoading
                        ? "Processing..."
                        : selectedComplaint.status ===
                          "Resolved"
                        ? "Complaint Resolved"
                        : "Mark as Resolved"}
                    </button>

                  </div>

                </div>

              </div>

            </div>

          )}

          <Footer />

        </main>

      </div>
    </>
  );
}

export default StaffDashboard;