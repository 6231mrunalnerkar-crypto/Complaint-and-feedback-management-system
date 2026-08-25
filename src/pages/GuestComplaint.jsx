import React, { useState } from "react";
import { Link } from "react-router-dom";

function GuestComplaint() {
  const [submittedId, setSubmittedId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "Infrastructure",
    subject: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a random guest complaint tracking ID
    const randomId = `CMP-GUEST-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedId(randomId);
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
          ← Back to Home
        </Link>
      </div>

      <div className="complaint-status-card">
        <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Guest Complaint Form</h2>
        <p style={{ color: "#64748b", marginBottom: "24px" }}>
          Submit your issue directly without creating an account. You will receive a tracking ID.
        </p>

        {submittedId ? (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <h3 style={{ color: "#166534", marginBottom: "10px" }}>Complaint Submitted Successfully!</h3>
            <p style={{ color: "#15803d", marginBottom: "15px" }}>Please save your tracking ID to check status on the homepage:</p>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", background: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px dashed #166534", display: "inline-block", color: "#0f172a" }}>
              {submittedId}
            </div>
            <div style={{ marginTop: "20px" }}>
              <button className="btn-primary" onClick={() => { setSubmittedId(null); setFormData({ fullName: "", email: "", category: "Infrastructure", subject: "", description: "" }); }}>
                Submit Another Complaint
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Full Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Infrastructure">Infrastructure / Campus Facilities</option>
                <option value="Event/Guest Services">Event / Guest Services</option>
                <option value="Security">Security & Access</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Subject</label>
              <input
                type="text"
                required
                placeholder="Brief summary of the complaint"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>Description</label>
              <textarea
                rows="5"
                required
                placeholder="Detailed description of the issue..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-large" style={{ width: "100%", cursor: "pointer", border: "none" }}>
              Submit Guest Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default GuestComplaint;