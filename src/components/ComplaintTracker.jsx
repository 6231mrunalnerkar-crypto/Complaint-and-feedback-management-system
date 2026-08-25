import { useState } from "react";
import "../styles/ComplaintTracker.css";

function ComplaintTracker() {
  const [complaintId, setComplaintId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = (event) => {
    event.preventDefault();

    const searchId = complaintId.trim();

    if (!searchId) {
      setResult(null);
      setError("Please enter a complaint ID.");
      return;
    }

    const saved = localStorage.getItem("campus_complaints");

    const complaints = saved ? JSON.parse(saved) : [];

    const complaint = complaints.find(
      (item) =>
        item.id.toLowerCase() === searchId.toLowerCase()
    );

    if (!complaint) {
      setResult(null);
      setError("No complaint was found with this ID.");
      return;
    }

    setError("");
    setResult(complaint);
  };

  return (
  <section
  className="complaint-tracker-section scroll-reveal"
  id="complaint-tracker"
>

      <div className="tracker-container">

        <div className="tracker-heading">

          <span>
            COMPLAINT TRACKING
          </span>

          <h2>
            Stay informed about
            <strong> your complaint.</strong>
          </h2>

          <p>
            Enter the complaint ID provided after submission
            to view the latest status and available updates.
          </p>

        </div>


        <div className="tracker-card">

          <form
            className="tracker-form"
            onSubmit={handleTrack}
          >

            <div className="tracker-field">

              <label htmlFor="complaintId">
                Complaint ID
              </label>

              <input
                id="complaintId"
                type="text"
                placeholder="Example: CMP-1001"
                value={complaintId}
                onChange={(event) => {
                  setComplaintId(event.target.value);
                  setError("");
                }}
              />

            </div>

            <button type="submit">
              Check Status
            </button>

          </form>


          {error && (
            <div className="tracker-error">
              {error}
            </div>
          )}


          {result && (
            <div className="tracker-result">

              <div className="tracker-result-title">
                <span>Complaint found</span>
                <strong>{result.id}</strong>
              </div>

              <div className="tracker-details">

                <div>
                  <span>Title</span>
                  <strong>{result.title}</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>{result.category}</strong>
                </div>

                <div>
                  <span>Date</span>
                  <strong>{result.date}</strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>{result.priority}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong className="tracker-status">
                    {result.status}
                  </strong>
                </div>

              </div>

              <div className="tracker-progress">

                <div className="tracker-progress-label">
                  <span>Progress</span>
                  <strong>
                    {result.status === "Resolved"
                      ? "100%"
                      : result.status === "In Progress"
                        ? "65%"
                        : "30%"}
                  </strong>
                </div>

                <div className="tracker-progress-bar">
                  <div
                    className={
                      result.status === "Resolved"
                        ? "progress-complete"
                        : result.status === "In Progress"
                          ? "progress-active"
                          : "progress-pending"
                    }
                  ></div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default ComplaintTracker;