import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const initialData = [
  {
    id: "CMP-1001",
    category: "Infrastructure",
    title: "Broken AC in Lab 3",
    date: "2026-08-20",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "CMP-1002",
    category: "Academic",
    title: "Delay in Assignment Grading",
    date: "2026-08-22",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "CMP-1003",
    category: "Hostel",
    title: "Water Supply Interruption",
    date: "2026-08-15",
    status: "Resolved",
    priority: "High",
  },
];

function StudentDashboard() {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem("campus_complaints");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [newComplaint, setNewComplaint] = useState({
    title: "",
    category: "Infrastructure",
    priority: "Low",
    description: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "campus_complaints",
      JSON.stringify(complaints)
    );
  }, [complaints]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const created = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newComplaint,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    setComplaints((previous) => [created, ...previous]);

    setNewComplaint({
      title: "",
      category: "Infrastructure",
      priority: "Low",
      description: "",
    });

    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("cfms_user");
    navigate("/login");
  };

  const pendingCount = complaints.filter(
    (complaint) => complaint.status === "Pending"
  ).length;

  const progressCount = complaints.filter(
    (complaint) => complaint.status === "In Progress"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  return (
    <div className="dashboard-layout">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

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

          <Link to="/track-complaint">
            Track Complaint
          </Link>

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


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="dashboard-content">

        {/* HEADER */}

        <header
          className="dashboard-header"
          id="overview"
        >

          <div>

            <span
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--primary)",
                fontSize: "10px",
                fontWeight: "800",
                letterSpacing: "1.8px",
              }}
            >
              CAMPUSVOICE STUDENT PORTAL
            </span>

            <h1>
              Student Dashboard
            </h1>

            <p>
              Track your reported issues and request resolutions.
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


        {/* =====================================================
            STATISTICS
            ===================================================== */}

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


        {/* =====================================================
            COMPLAINT HISTORY
            ===================================================== */}

        <div
          className="table-container"
          id="my-complaints"
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "20px",
              marginBottom: "20px",
            }}
          >

            <div>

              <span
                style={{
                  display: "block",
                  marginBottom: "7px",
                  color: "var(--primary)",
                  fontSize: "9px",
                  fontWeight: "800",
                  letterSpacing: "1.6px",
                }}
              >
                COMPLAINT HISTORY
              </span>

              <h2>
                My Complaints
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                }}
              >
                View and monitor the complaints you have submitted.
              </p>

            </div>

            <Link
              to="/track-complaint"
              style={{
                flexShrink: 0,
                color: "var(--primary)",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: "650",
              }}
            >
              Track a Complaint
            </Link>

          </div>


          <table className="custom-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>

            </thead>


            <tbody>

              {complaints.map((item) => (

                <tr key={item.id}>

                  <td>
                    <strong>
                      {item.id}
                    </strong>
                  </td>

                  <td>
                    {item.title}
                  </td>

                  <td>
                    {item.category}
                  </td>

                  <td>
                    {item.date}
                  </td>

                  <td>
                    <span
                      className={`badge priority-${item.priority.toLowerCase()}`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge status-${item.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {item.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* =====================================================
            ASSISTANCE SECTION
            ===================================================== */}

        <section
          style={{
            marginTop: "28px",
            padding: "25px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            boxShadow: "0 10px 30px var(--shadow)",
          }}
        >

          <span
            style={{
              display: "block",
              marginBottom: "8px",
              color: "var(--primary)",
              fontSize: "9px",
              fontWeight: "800",
              letterSpacing: "1.6px",
            }}
          >
            NEED ASSISTANCE?
          </span>

          <h2
            style={{
              margin: "0 0 8px",
              color: "var(--text)",
              fontSize: "18px",
            }}
          >
            Manage your campus concerns
          </h2>

          <p
            style={{
              margin: "0 0 20px",
              color: "var(--text-secondary)",
              fontSize: "12px",
              lineHeight: "1.6",
            }}
          >
            Submit a new complaint, track an existing complaint,
            or review your account information.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >

            <button
              type="button"
              className="btn-primary-large"
              onClick={() => setShowModal(true)}
            >
              Submit Complaint
            </button>

            <Link
              to="/track-complaint"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 18px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--background)",
                color: "var(--text)",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: "650",
              }}
            >
              Track Complaint
            </Link>

          </div>

        </section>


        {/* =====================================================
            SUBMIT COMPLAINT MODAL
            ===================================================== */}

        {showModal && (

          <div className="modal-overlay">

            <div className="modal-body">

              <h2>
                Submit New Complaint
              </h2>


              <form onSubmit={handleSubmit}>

                <div className="form-group">

                  <label>
                    Title
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Enter complaint title"
                    value={newComplaint.title}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        title: e.target.value,
                      })
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    value={newComplaint.category}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        category: e.target.value,
                      })
                    }
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

                  <label>
                    Priority
                  </label>

                  <select
                    value={newComplaint.priority}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        priority: e.target.value,
                      })
                    }
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


                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    rows="5"
                    required
                    placeholder="Describe the issue in detail..."
                    value={newComplaint.description}
                    onChange={(e) =>
                      setNewComplaint({
                        ...newComplaint,
                        description: e.target.value,
                      })
                    }
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

      </main>

    </div>
  );
}

export default StudentDashboard;