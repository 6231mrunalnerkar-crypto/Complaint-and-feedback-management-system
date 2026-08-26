import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const initialComplaints = [
  {
    id: "CMP-1001",
    category: "Hostel",
    title: "Water leakage in room 204",
    status: "Pending",
    date: "2026-08-25",
    priority: "High",
  },
  {
    id: "CMP-1002",
    category: "Library",
    title: "AC not working on 2nd floor",
    status: "Resolved",
    date: "2026-08-24",
    priority: "Medium",
  },
  {
    id: "CMP-1003",
    category: "Canteen",
    title: "Food quality issue",
    status: "Pending",
    date: "2026-08-26",
    priority: "Low",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("complaints");

  const [complaints] = useState(() => {
    try {
      const saved = localStorage.getItem("cfms_complaints");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error loading complaints:", error);
    }

    localStorage.setItem(
      "cfms_complaints",
      JSON.stringify(initialComplaints)
    );

    return initialComplaints;
  });

  const [feedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem("cfms_feedbacks");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    }

    return [];
  });

  /* =====================================================
     STATISTICS
     ===================================================== */

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const inProgressComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "In Progress" ||
      complaint.status === "In-Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const totalFeedbacks = feedbacks.length;

  const avgRating =
    totalFeedbacks > 0
      ? (
          feedbacks.reduce(
            (total, feedback) => total + Number(feedback.rating || 0),
            0
          ) / totalFeedbacks
        ).toFixed(1)
      : "0.0";

  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("campusvoice-user");
    localStorage.removeItem("cfms-user");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =====================================================
     STATUS CLASS
     ===================================================== */

  const getStatusClass = (status) => {
    if (status === "Resolved") {
      return "resolved";
    }

    if (
      status === "In Progress" ||
      status === "In-Progress"
    ) {
      return "progress";
    }

    return "pending";
  };

  /* =====================================================
     PRIORITY CLASS
     ===================================================== */

  const getPriorityClass = (priority) => {
    return priority
      ? priority.toLowerCase()
      : "low";
  };

  return (
    <div className="admin-page">

      {/* =================================================
          PORTAL NAVBAR
          ================================================= */}

      <header className="admin-portal-navbar">

        <div className="admin-nav-container">

          {/* Brand */}

          <Link to="/" className="admin-brand">

            <div className="admin-logo">
              C
            </div>

            <div className="admin-brand-text">

              <span className="admin-brand-name">
                CampusVoice
              </span>

              <span className="admin-brand-caption">
                Campus concerns, properly heard.
              </span>

            </div>

          </Link>


          {/* Navigation */}

          <nav className="admin-nav-links">

            <Link to="/admin-dashboard">
              Dashboard
            </Link>

            <a href="#complaints">
              Complaints
            </a>

            <a href="#feedback">
              Feedback
            </a>

          </nav>


          {/* Right Side */}

          <div className="admin-nav-actions">

            <span className="admin-role">
              ADMIN
            </span>

            <button
              type="button"
              className="admin-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="admin-main">

        <div className="admin-container">


          {/* =================================================
              PAGE HEADER
              ================================================= */}

          <section className="admin-header">

            <div>

              <span className="admin-eyebrow">
                CAMPUSVOICE ADMINISTRATION
              </span>

              <h1>
                Admin Control Center
              </h1>

              <p>
                Manage complaints, review feedback and monitor
                campus activities.
              </p>

            </div>

            <div className="system-status">

              <span className="status-dot"></span>

              System Status: Live

            </div>

          </section>


          {/* =================================================
              STATISTICS
              ================================================= */}

          <section className="admin-stats">

            <div className="admin-stat-card">

              <span>
                TOTAL FEEDBACKS
              </span>

              <strong>
                {totalFeedbacks}
              </strong>

            </div>


            <div className="admin-stat-card">

              <span>
                AVERAGE RATING
              </span>

              <strong>
                {avgRating}
                <small> / 5</small>
              </strong>

            </div>


            <div className="admin-stat-card">

              <span>
                TOTAL COMPLAINTS
              </span>

              <strong>
                {totalComplaints}
              </strong>

            </div>


            <div className="admin-stat-card">

              <span>
                PENDING
              </span>

              <strong>
                {pendingComplaints}
              </strong>

            </div>


            <div className="admin-stat-card">

              <span>
                RESOLVED
              </span>

              <strong>
                {resolvedComplaints}
              </strong>

            </div>

          </section>


          {/* =================================================
              TABS
              ================================================= */}

          <section
            className="admin-content"
            id="complaints"
          >

            <div className="admin-tabs">

              <button
                type="button"
                className={
                  activeTab === "complaints"
                    ? "admin-tab active"
                    : "admin-tab"
                }
                onClick={() =>
                  setActiveTab("complaints")
                }
              >
                Complaints ({totalComplaints})
              </button>


              <button
                type="button"
                className={
                  activeTab === "feedbacks"
                    ? "admin-tab active"
                    : "admin-tab"
                }
                onClick={() =>
                  setActiveTab("feedbacks")
                }
              >
                Feedbacks ({totalFeedbacks})
              </button>

            </div>


            {/* =================================================
                COMPLAINT PANEL
                ================================================= */}

            {activeTab === "complaints" && (

              <div className="admin-panel">

                <div className="panel-heading">

                  <div>

                    <h2>
                      Complaint Management
                    </h2>

                    <p>
                      Review and monitor complaints submitted
                      by students.
                    </p>

                  </div>

                  <span className="panel-count">
                    {totalComplaints} Records
                  </span>

                </div>


                {complaints.length === 0 ? (

                  <div className="empty-state">

                    <h3>
                      No complaints recorded
                    </h3>

                    <p>
                      Student complaints will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="complaint-list">

                    {complaints.map((complaint) => (

                      <div
                        className="admin-complaint-card"
                        key={complaint.id}
                      >

                        <div className="complaint-information">

                          <div className="complaint-meta">

                            <span className="complaint-id">
                              {complaint.id}
                            </span>

                            <span className="complaint-category">
                              {complaint.category}
                            </span>

                          </div>


                          <h3>
                            {complaint.title}
                          </h3>


                          <small>
                            Submitted on {complaint.date}
                          </small>

                        </div>


                        <div className="complaint-status-area">

                          <span
                            className={`admin-priority ${getPriorityClass(
                              complaint.priority
                            )}`}
                          >
                            {complaint.priority || "Low"}
                          </span>


                          <span
                            className={`admin-status ${getStatusClass(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            )}


            {/* =================================================
                FEEDBACK PANEL
                ================================================= */}

            {activeTab === "feedbacks" && (

              <div
                className="admin-panel"
                id="feedback"
              >

                <div className="panel-heading">

                  <div>

                    <h2>
                      Submitted Feedback
                    </h2>

                    <p>
                      Review feedback submitted by students.
                    </p>

                  </div>

                  <span className="panel-count">
                    {totalFeedbacks} Records
                  </span>

                </div>


                {feedbacks.length === 0 ? (

                  <div className="empty-state">

                    <div className="empty-icon">
                      ✓
                    </div>

                    <h3>
                      No feedbacks submitted yet
                    </h3>

                    <p>
                      Student feedback will appear here once
                      submitted.
                    </p>

                  </div>

                ) : (

                  <div className="feedback-list">

                    {feedbacks.map((feedback, index) => (

                      <div
                        className="feedback-card"
                        key={feedback.id || index}
                      >

                        <div className="feedback-top">

                          <div>

                            <span className="feedback-category">
                              {feedback.category || "General"}
                            </span>

                            <span className="feedback-rating">
                              {"★".repeat(
                                Number(feedback.rating || 0)
                              )}

                              <span>
                                {" "}
                                ({feedback.rating || 0}/5)
                              </span>
                            </span>

                          </div>

                          <small>
                            {feedback.date || "Recently"}
                          </small>

                        </div>


                        <h3>
                          {feedback.subject ||
                            "Student Feedback"}
                        </h3>


                        <p className="feedback-message">
                          "{feedback.message || "No message provided."}"
                        </p>


                        <div className="feedback-user">

                          Submitted By:{" "}

                          <strong>
                            {feedback.name || "Student"}
                          </strong>

                          {feedback.studentId && (
                            <>
                              {" "}
                              (ID: {feedback.studentId})
                            </>
                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            )}

          </section>


          {/* =================================================
              ADMIN INFORMATION
              ================================================= */}

          <section className="admin-bottom-card">

            <div>

              <span className="admin-eyebrow">
                CAMPUSVOICE ADMINISTRATION
              </span>

              <h2>
                Keep campus concerns organized.
              </h2>

              <p>
                Monitor complaints, review feedback and ensure
                submitted concerns reach the appropriate
                administrative team.
              </p>

            </div>


            <Link
              to="/"
              className="admin-home-button"
            >
              ← Back to Home
            </Link>

          </section>


        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;