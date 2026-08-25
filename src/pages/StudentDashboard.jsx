import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const initialData = [
  { id: "CMP-1001", category: "Infrastructure", title: "Broken AC in Lab 3", date: "2026-08-20", status: "In Progress", priority: "High" },
  { id: "CMP-1002", category: "Academic", title: "Delay in Assignment Grading", date: "2026-08-22", status: "Pending", priority: "Medium" },
  { id: "CMP-1003", category: "Hostel", title: "Water Supply Interruption", date: "2026-08-15", status: "Resolved", priority: "High" },
];

function StudentDashboard() {
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

  // Save to LocalStorage whenever complaints state updates
  useEffect(() => {
    localStorage.setItem("campus_complaints", JSON.stringify(complaints));
  }, [complaints]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newComplaint,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };
    setComplaints([created, ...complaints]);
    setNewComplaint({ title: "", category: "Infrastructure", priority: "Low", description: "" });
    setShowModal(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-box">C</div>
          <span>CampusVoice</span>
        </div>
        <nav className="sidebar-menu">
          <a href="#overview" className="active">Overview</a>
          <a href="#my-complaints">My Complaints</a>
          <Link to="/profile">Profile</Link>
          <Link to="/" className="logout-btn">Log Out</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>
            <p>Track your reported issues and request resolutions.</p>
          </div>
          <button className="btn-primary-large" onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
            + Submit New Complaint
          </button>
        </header>

        {/* Stats Summary */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Complaints</h3>
            <p>{complaints.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{complaints.filter((c) => c.status === "Pending").length}</p>
          </div>
          <div className="stat-card">
            <h3>Resolved</h3>
            <p>{complaints.filter((c) => c.status === "Resolved").length}</p>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="table-container">
          <h2>Recent Complaints</h2>
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
                  <td><strong>{item.id}</strong></td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.date}</td>
                  <td><span className={`badge priority-${item.priority.toLowerCase()}`}>{item.priority}</span></td>
                  <td><span className={`badge status-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Window */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-body">
              <h2>Submit New Complaint</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    required
                    value={newComplaint.title}
                    onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Academic">Academic</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Canteen">Canteen</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    required
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Submit</button>
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