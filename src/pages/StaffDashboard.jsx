import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/StaffDashboard.css";

import {
  getStoredComplaints,
  saveComplaint,
} from "../utils/mockData";

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

  return (
    <article className="staff-complaint-card">
      <div className="staff-complaint-main">

        <div className="staff-complaint-indicator" />

        <div className="staff-complaint-info">
          <span className="staff-complaint-id">
            {complaint.id || "CMP-0000"}
          </span>

          <h3>{title}</h3>

          <p>
            {complaint.description
              ? complaint.description.length > 90
                ? `${complaint.description.slice(0, 90)}...`
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
              complaint.assignedDate || complaint.date
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
          {complaint.status || "Pending"}
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
              key={complaint.id}
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

  const [complaints, setComplaints] = useState([]);

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [resolutionNote, setResolutionNote] =
    useState("");

  const [proofImage, setProofImage] =
    useState("");

  const [proofName, setProofName] =
    useState("");


  /* =======================================================
     STAFF INFORMATION
  ======================================================= */

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
          `${parsed?.firstName || ""} ${
            parsed?.lastName || ""
          }`.trim() ||
          "Staff Member",

        role:
          parsed?.role ||
          "Staff",

        id:
          parsed?.id ||
          parsed?.userId ||
          "",
      };

    } catch (error) {

      console.error(
        "Unable to load staff information:",
        error
      );

      return {
        name: "Staff Member",
        role: "Staff",
        id: "",
      };
    }

  });


  /* =======================================================
     LOAD COMPLAINTS
  ======================================================= */

  useEffect(() => {

    const loadData = () => {

      try {

        const data =
          getStoredComplaints();

        setComplaints(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Unable to load complaints:",
          error
        );

        setComplaints([]);

      }

    };

    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "cfms-complaints-updated",
      handleStorageChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "cfms-complaints-updated",
        handleStorageChange
      );

    };

  }, []);


  /* =======================================================
     CHECK STAFF ASSIGNMENT
  ======================================================= */

  const isAssignedToStaff = (complaint) => {

    const assignedName =
      String(
        complaint.assignedTo ||
        complaint.assignedStaff ||
        complaint.staffName ||
        ""
      )
        .trim()
        .toLowerCase();

    const assignedId =
      String(
        complaint.assignedStaffId ||
        complaint.staffId ||
        ""
      )
        .trim()
        .toLowerCase();

    const currentName =
      String(staff.name || "")
        .trim()
        .toLowerCase();

    const currentId =
      String(staff.id || "")
        .trim()
        .toLowerCase();

    return (
      (assignedName &&
        assignedName === currentName) ||
      (assignedId &&
        currentId &&
        assignedId === currentId)
    );
  };


  /* =======================================================
     ASSIGNED COMPLAINTS
  ======================================================= */

  const assignedComplaints =
    useMemo(() => {

      return complaints.filter(
        isAssignedToStaff
      );

    }, [complaints, staff]);


  /* =======================================================
     SEARCH + STATUS FILTER
  ======================================================= */

  const filteredComplaints =
    useMemo(() => {

      const cleanSearch =
        search.trim().toLowerCase();

      return assignedComplaints.filter(
        (complaint) => {

          const title =
            complaint.title ||
            complaint.subject ||
            "";

          const matchesSearch =
            !cleanSearch ||
            String(complaint.id || "")
              .toLowerCase()
              .includes(cleanSearch) ||
            String(title)
              .toLowerCase()
              .includes(cleanSearch) ||
            String(
              complaint.category || ""
            )
              .toLowerCase()
              .includes(cleanSearch);

          const complaintStatus =
            String(
              complaint.status ||
              "Pending"
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
      assignedComplaints,
      search,
      statusFilter,
    ]);


  /* =======================================================
     PRIORITY CATEGORIES
  ======================================================= */

  const highPriority =
    filteredComplaints.filter(
      (complaint) =>
        String(
          complaint.priority ||
          "Medium"
        ).toLowerCase() === "high"
    );

  const mediumPriority =
    filteredComplaints.filter(
      (complaint) =>
        String(
          complaint.priority ||
          "Medium"
        ).toLowerCase() === "medium"
    );

  const lowPriority =
    filteredComplaints.filter(
      (complaint) =>
        String(
          complaint.priority ||
          "Medium"
        ).toLowerCase() === "low"
    );


  /* =======================================================
     DASHBOARD COUNTS
  ======================================================= */

  const pendingCount =
    assignedComplaints.filter(
      (complaint) =>
        String(
          complaint.status ||
          "Pending"
        ).toLowerCase() === "pending"
    ).length;


  const progressCount =
    assignedComplaints.filter(
      (complaint) =>
        String(
          complaint.status || ""
        ).toLowerCase() ===
        "in progress"
    ).length;


  const completedCount =
    assignedComplaints.filter(
      (complaint) => {

        const status =
          String(
            complaint.status || ""
          ).toLowerCase();

        return (
          status === "completed" ||
          status === "resolved"
        );

      }
    ).length;


  const highPriorityCount =
    assignedComplaints.filter(
      (complaint) =>
        String(
          complaint.priority || ""
        ).toLowerCase() === "high"
    ).length;


  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatDate = (date) => {

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


  const formatDateTime = (date) => {

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
      status || "Pending"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");
  };


  const getPriorityClass = (priority) => {

    return String(
      priority || "Medium"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");
  };


  /* =======================================================
     OPEN COMPLAINT
  ======================================================= */

  const openComplaint = (complaint) => {

    setSelectedComplaint(
      complaint
    );

    setResolutionNote(
      complaint.resolutionNote ||
      ""
    );

    setProofImage(
      complaint.proofImage ||
      ""
    );

    setProofName(
      complaint.proofImageName ||
      ""
    );
  };


  /* =======================================================
     CLOSE COMPLAINT
  ======================================================= */

  const closeComplaint = () => {

    setSelectedComplaint(null);

    setResolutionNote("");

    setProofImage("");

    setProofName("");
  };


  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  const updateStatus = (
    newStatus
  ) => {

    if (!selectedComplaint) {
      return;
    }

    const updatedComplaint = {

      ...selectedComplaint,

      status: newStatus,

      staffStatus: newStatus,

      lastUpdatedBy:
        staff.name,

      lastUpdatedAt:
        new Date().toISOString(),

    };


    try {

      saveComplaint(
        updatedComplaint
      );

      setComplaints(
        (previous) =>
          previous.map(
            (complaint) =>
              complaint.id ===
              updatedComplaint.id
                ? updatedComplaint
                : complaint
          )
      );

      setSelectedComplaint(
        updatedComplaint
      );

      window.dispatchEvent(
        new Event(
          "cfms-complaints-updated"
        )
      );

    } catch (error) {

      console.error(
        "Unable to update complaint:",
        error
      );

      alert(
        "Unable to update complaint. Please try again."
      );
    }
  };


  /* =======================================================
     PROOF IMAGE UPLOAD
  ======================================================= */

  const handleProofUpload = (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;


    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select an image file."
      );

      return;
    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Proof image must be smaller than 5 MB."
      );

      return;
    }


    const reader =
      new FileReader();


    reader.onload = () => {

      setProofImage(
        reader.result
      );

      setProofName(
        file.name
      );

    };


    reader.readAsDataURL(file);
  };


  /* =======================================================
     COMPLETE COMPLAINT
  ======================================================= */

  const handleCompleteComplaint =
    () => {

      if (!selectedComplaint) {
        return;
      }


      const cleanNote =
        resolutionNote.trim();


      if (!cleanNote) {

        alert(
          "Please add a resolution note before completing."
        );

        return;
      }


      if (!proofImage) {

        alert(
          "Please upload a proof image before completing."
        );

        return;
      }


      const completedComplaint = {

        ...selectedComplaint,

        status: "Completed",

        staffStatus:
          "Completed",

        resolutionNote:
          cleanNote,

        proofImage:
          proofImage,

        proofImageName:
          proofName,

        completedBy:
          staff.name,

        completedById:
          staff.id || "",

        completedDate:
          new Date().toISOString(),

        lastUpdatedBy:
          staff.name,

        lastUpdatedAt:
          new Date().toISOString(),

      };


      try {

        saveComplaint(
          completedComplaint
        );


        setComplaints(
          (previous) =>
            previous.map(
              (complaint) =>
                complaint.id ===
                completedComplaint.id
                  ? completedComplaint
                  : complaint
            )
        );


        setSelectedComplaint(
          completedComplaint
        );


        window.dispatchEvent(
          new Event(
            "cfms-complaints-updated"
          )
        );


        alert(
          `Complaint ${completedComplaint.id} has been marked as completed.`
        );


      } catch (error) {

        console.error(
          "Unable to complete complaint:",
          error
        );

        alert(
          "Unable to complete complaint. Please try again."
        );
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
            LEFT SIDEBAR
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
            MAIN CONTENT
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
                  {assignedComplaints.length}
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

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                </div>

              </div>


              {/* HIGH PRIORITY */}

              <PrioritySection
                title="High Priority"
                description="Requires immediate attention"
                icon="!"
                items={highPriority}
                priorityClass="priority-high"
                onOpen={openComplaint}
                getStatusClass={getStatusClass}
                getPriorityClass={getPriorityClass}
                formatDate={formatDate}
              />


              {/* MEDIUM PRIORITY */}

              <PrioritySection
                title="Medium Priority"
                description="Regular complaints requiring action"
                icon="◷"
                items={mediumPriority}
                priorityClass="priority-medium"
                onOpen={openComplaint}
                getStatusClass={getStatusClass}
                getPriorityClass={getPriorityClass}
                formatDate={formatDate}
              />


              {/* LOW PRIORITY */}

              <PrioritySection
                title="Low Priority"
                description="Can be handled after urgent issues"
                icon="↓"
                items={lowPriority}
                priorityClass="priority-low"
                onOpen={openComplaint}
                getStatusClass={getStatusClass}
                getPriorityClass={getPriorityClass}
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
                        behavior: "smooth",
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
                      Mark as In Progress or Completed
                    </small>

                  </div>

                </button>


                <button
                  type="button"
                  className="quick-action"
                  onClick={() => {

                    if (selectedComplaint) {

                      document
                        .getElementById(
                          "complaint-details"
                        )
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });

                    } else {

                      alert(
                        "Open a complaint first to upload proof."
                      );

                    }

                  }}
                >

                  <span>
                    ▧
                  </span>

                  <div>

                    <strong>
                      Upload Proof Image
                    </strong>

                    <small>
                      Add evidence for completed work
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
                      {assignedComplaints.length}
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

                  {assignedComplaints
                    .slice(0, 4)
                    .map((complaint) => (

                      <div
                        className="activity-item"
                        key={complaint.id}
                      >

                        <span className="activity-line">
                          <i />
                        </span>

                        <div>

                          <strong>
                            {complaint.id}
                          </strong>

                          <p>

                            {complaint.status ===
                            "Completed"
                              ? "Complaint marked as completed"
                              : complaint.status ===
                                "In Progress"
                              ? "Complaint is being resolved"
                              : "Complaint assigned to you"}

                          </p>

                          <small>

                            {formatDateTime(
                              complaint.lastUpdatedAt ||
                              complaint.assignedDate ||
                              complaint.date
                            )}

                          </small>

                        </div>

                      </div>

                    ))}


                  {assignedComplaints.length === 0 && (

                    <p className="no-activity">
                      No recent activity.
                    </p>

                  )}

                </div>

              </section>

            </aside>

          </div>


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
                      {selectedComplaint.id}
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
                    onClick={closeComplaint}
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
                      "Pending"}

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
                      Assigned On
                    </span>

                    <strong>

                      {formatDate(
                        selectedComplaint.assignedDate ||
                        selectedComplaint.date
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
                        "Pending"
                      }
                      onChange={(event) =>
                        updateStatus(
                          event.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                    </select>

                  </div>


                  {/* RESOLUTION NOTE */}

                  <div className="resolution-field">

                    <label>
                      Resolution Note
                    </label>

                    <textarea
                      rows="5"
                      maxLength="500"
                      placeholder="Describe what you did to resolve this complaint..."
                      value={resolutionNote}
                      onChange={(event) =>
                        setResolutionNote(
                          event.target.value
                        )
                      }
                    />

                    <small>
                      {resolutionNote.length}/500
                    </small>

                  </div>


                  {/* PROOF IMAGE */}

                  <div className="proof-section">

                    <label>
                      Upload Proof Image
                    </label>

                    <p>
                      Add an image showing that the
                      complaint has been resolved.
                    </p>


                    <input
                      id="staff-proof-image"
                      type="file"
                      accept="image/*"
                      onChange={
                        handleProofUpload
                      }
                      hidden
                    />


                    {proofImage ? (

                      <div className="proof-preview">

                        <img
                          src={proofImage}
                          alt="Resolution proof"
                        />

                        <div>

                          <strong>
                            {proofName ||
                              "Proof Image"}
                          </strong>

                          <button
                            type="button"
                            onClick={() => {

                              setProofImage("");

                              setProofName("");

                            }}
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    ) : (

                      <label
                        htmlFor="staff-proof-image"
                        className="proof-upload-box"
                      >

                        <span>
                          ▧
                        </span>

                        <strong>
                          Choose Proof Image
                        </strong>

                        <small>
                          JPG, PNG or WEBP · Max 5 MB
                        </small>

                      </label>

                    )}

                  </div>


                  {/* COMPLETE */}

                  <button
                    type="button"
                    className="complete-complaint-btn"
                    onClick={
                      handleCompleteComplaint
                    }
                    disabled={
                      selectedComplaint.status ===
                        "Completed" &&
                      Boolean(
                        selectedComplaint.proofImage
                      )
                    }
                  >

                    ✓{" "}

                    {selectedComplaint.status ===
                    "Completed"
                      ? "Complaint Completed"
                      : "Mark as Completed"}

                  </button>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              FOOTER
          ================================================= */}

          <Footer />

        </main>

      </div>
    </>
  );
}

export default StaffDashboard;