import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([
    { id: "CMP-1001", student: "Rahul Sharma", title: "Broken AC in Lab 3", category: "Infrastructure", date: "2026-08-20", priority: "High", status: "In Progress" },
    { id: "CMP-1002", student: "Priya Patel", title: "Delay in Assignment Grading", category: "Academic", date: "2026-08-22", priority: "Medium", status: "Pending" },
    { id: "CMP-1003", student: "Amit Verma", title: "Water Supply Interruption", category: "Hostel", date: "2026-08-15", priority: "High", status: "Resolved" },
    { id: "CMP-GUEST-4821", student: "Guest User", title: "Parking gate access issue", category: "Security", date: "2026-08-24", priority: "Low", status: "Pending" },
  ]);

  const [filterCategory, setFilterCategory] = useState("All");

  const handleStatusChange = (id, newStatus) => {
    setComplaints(complaints.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  const filteredComplaints = filterCategory === "All"
    ? complaints
    : complaints.filter((c) => c.category === filterCategory);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-box">A</div>
          <span>Admin Portal</span>
        </div>
        <nav className="sidebar-menu">
          <a href="#overview" className="active">Overview</a>
          <a href="#all-complaints">All Complaints</a>
          <Link to="/" className="logout-btn">Log Out</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Admin Control Panel</h1>
            <p>Manage, assign, and update resolution statuses across campus.</p>
          </div>
        </header>

        {/* Stats Summary */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Complaints</h3>
            <p>{complaints.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Action</h3>
            <p>{complaints.filter((c) => c.status === "Pending").length}</p>
          </div>
          <div className="stat-card">
            <h3>Resolved</h3>
            <p>{complaints.filter((c) => c.status === "Resolved").length}</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2>Incoming Complaints</h2>
            
            {/* Category Filter Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <label style={{ fontSize: "0.9rem", color: "#64748b" }}>Filter by Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              >
                <option value="All">All Categories</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Submitted By</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong></td>
                  <td>{item.student}</td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td><span className={`badge priority-${item.priority.toLowerCase()}`}>{item.priority}</span></td>
                  <td><span className={`badge status-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span></td>
                  <td>
                    {/* Direct Status Update Dropdown */}
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "0.85rem" }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;