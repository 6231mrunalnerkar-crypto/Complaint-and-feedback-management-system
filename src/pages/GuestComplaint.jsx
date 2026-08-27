import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { saveComplaint } from "../utils/mockData";

const GuestComplaint = () => {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const [formData, setFormData] = useState({
    category: "Library",
    priority: "Medium",
    subject: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.subject.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newId = `CFMS-2026-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    const complaintObj = {
      id: newId,
      category: formData.category,
      priority: formData.priority,
      subject: formData.subject.trim(),
      description: formData.description.trim(),

      // Anonymous guest information
      anonymous: true,
      submittedBy: "Guest",

      status: "Pending",

      date: new Date()
        .toISOString()
        .split("T")[0],
    };

    saveComplaint(complaintObj);

    setReferenceId(newId);
    setSubmitted(true);

    toast.success(
      "Anonymous complaint submitted successfully!"
    );
  };

  // ================= SUCCESS SCREEN =================

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#030712",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "16px",
            padding: "32px",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
          }}
        >

          <span
            style={{
              color: "#10b981",
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            ANONYMOUS SUBMISSION SUCCESSFUL
          </span>

          <h2
            style={{
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: "bold",
              margin: "8px 0 4px",
            }}
          >
            Complaint Submitted
          </h2>

          <p
            style={{
              color: "#9ca3af",
              fontSize: "14px",
              marginBottom: "24px",
              lineHeight: "1.6",
            }}
          >
            Your complaint has been submitted anonymously.
            No personal information was required.
          </p>

          {/* Reference ID */}

          <div
            style={{
              border: "1px dashed #10b981",
              background: "rgba(16, 185, 129, 0.05)",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                textTransform: "uppercase",
              }}
            >
              Reference ID
            </span>

            <div
              style={{
                color: "#38bdf8",
                fontSize: "20px",
                fontWeight: "bold",
                marginTop: "4px",
              }}
            >
              {referenceId}
            </div>
          </div>

          <p
            style={{
              color: "#fbbf24",
              fontSize: "12px",
              marginBottom: "20px",
            }}
          >
            Save this Reference ID to track your complaint later.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >

            <button
              onClick={() =>
                navigate(
                  `/track-complaint?id=${referenceId}`
                )
              }
              style={{
                padding: "12px",
                background: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Track Complaint
            </button>

            <button
              onClick={() => {
                setSubmitted(false);

                setFormData({
                  category: "Library",
                  priority: "Medium",
                  subject: "",
                  description: "",
                });
              }}
              style={{
                padding: "12px",
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Lodge Another Complaint
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px",
                background: "transparent",
                color: "#9ca3af",
                border: "1px solid #374151",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Back to Home
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ================= FORM =================

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#030712",
        color: "#ffffff",
        padding: "32px 20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#111827",
          border: "1px solid #1f2937",
          padding: "32px",
          borderRadius: "12px",
        }}
      >

        {/* Anonymous Notice */}

        <div
          style={{
            marginBottom: "24px",
            padding: "14px 16px",
            background: "rgba(56, 189, 248, 0.08)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "8px",
          }}
        >

          <div
            style={{
              color: "#38bdf8",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "5px",
            }}
          >
            🔒 ANONYMOUS REPORTING
          </div>

          <div
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              lineHeight: "1.5",
            }}
          >
            No name, email, password, student ID, or account
            is required. Your complaint will be submitted anonymously.
          </div>

        </div>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "8px",
          }}
        >
          Lodge a Complaint
        </h1>

        <p
          style={{
            color: "#9ca3af",
            fontSize: "14px",
            marginBottom: "24px",
          }}
        >
          Register your concern for campus administration review.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >

          {/* Category + Priority */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "#9ca3af",
                  marginBottom: "6px",
                }}
              >
                Category*
              </label>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#090d16",
                  border: "1px solid #374151",
                  color: "#fff",
                  borderRadius: "8px",
                  outline: "none",
                }}
              >
                <option value="Library">Library</option>
                <option value="Hostel">Hostel</option>
                <option value="Canteen">Canteen</option>
                <option value="Academic">Academic</option>
                <option value="Infrastructure">
                  Infrastructure
                </option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "#9ca3af",
                  marginBottom: "6px",
                }}
              >
                Priority*
              </label>

              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#090d16",
                  border: "1px solid #374151",
                  color: "#fff",
                  borderRadius: "8px",
                  outline: "none",
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

          </div>

          {/* Subject */}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                color: "#9ca3af",
                marginBottom: "6px",
              }}
            >
              Subject / Title*
            </label>

            <input
              type="text"
              placeholder="Briefly describe your issue"
              value={formData.subject}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subject: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "#090d16",
                border: "1px solid #374151",
                color: "#fff",
                borderRadius: "8px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Description */}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                color: "#9ca3af",
                marginBottom: "6px",
              }}
            >
              Detailed Description*
            </label>

            <textarea
              rows="4"
              placeholder="Provide details about your concern..."
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "#090d16",
                border: "1px solid #374151",
                color: "#fff",
                borderRadius: "8px",
                outline: "none",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Submit */}

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            Submit Anonymous Complaint
          </button>

        </form>

      </div>
    </div>
  );
};

export default GuestComplaint;