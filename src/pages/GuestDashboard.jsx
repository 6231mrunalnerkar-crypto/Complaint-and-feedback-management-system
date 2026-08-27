import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const GuestDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "var(--page-background)",
          color: "var(--page-text)",
          padding: "50px 20px",
          fontFamily: "sans-serif",
          boxSizing: "border-box",
          transition:
            "background-color 0.25s ease, color 0.25s ease",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* ================= HEADER ================= */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                background: "var(--guest-badge-bg)",
                border: "1px solid var(--guest-badge-border)",
                borderRadius: "20px",
                color: "var(--primary)",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                marginBottom: "14px",
              }}
            >
              🔒 ANONYMOUS GUEST ACCESS
            </div>

            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                margin: "0 0 12px",
                color: "var(--page-text)",
              }}
            >
              Welcome to CampusVoice
            </h1>

            <p
              style={{
                color: "var(--muted-text)",
                fontSize: "15px",
                lineHeight: "1.6",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Submit a complaint or share feedback anonymously.
              No account or personal information is required.
            </p>
          </div>

          {/* ================= MAIN OPTIONS ================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {/* ================= SUBMIT COMPLAINT ================= */}

            <div
              style={{
                background: "var(--card-background)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "28px",
                textAlign: "center",
                transition:
                  "background-color 0.25s ease, border-color 0.25s ease",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "0 auto 18px",
                  borderRadius: "12px",
                  background: "var(--success-soft)",
                  border: "1px solid var(--success-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              >
                📝
              </div>

              <h2
                style={{
                  fontSize: "20px",
                  margin: "0 0 10px",
                  color: "var(--page-text)",
                }}
              >
                Submit Complaint
              </h2>

              <p
                style={{
                  color: "var(--muted-text)",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  marginBottom: "22px",
                }}
              >
                Report a campus issue anonymously and
                receive a unique reference ID to track
                its progress.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/submit-complaint")
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#10b981",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Submit Complaint
              </button>
            </div>

            {/* ================= SUBMIT FEEDBACK ================= */}

            <div
              style={{
                background: "var(--card-background)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "28px",
                textAlign: "center",
                transition:
                  "background-color 0.25s ease, border-color 0.25s ease",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "0 auto 18px",
                  borderRadius: "12px",
                  background: "var(--info-soft)",
                  border: "1px solid var(--info-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              >
                ⭐
              </div>

              <h2
                style={{
                  fontSize: "20px",
                  margin: "0 0 10px",
                  color: "var(--page-text)",
                }}
              >
                Submit Feedback
              </h2>

              <p
                style={{
                  color: "var(--muted-text)",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  marginBottom: "22px",
                }}
              >
                Share your experience after a complaint
                has been resolved. Feedback is submitted
                anonymously.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/feedback")
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#38bdf8",
                  color: "#030712",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Submit Feedback
              </button>
            </div>
          </div>

          {/* ================= TRACK COMPLAINT ================= */}

          <div
            style={{
              marginTop: "20px",
              background: "var(--card-background)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "22px",
              textAlign: "center",
              transition:
                "background-color 0.25s ease, border-color 0.25s ease",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: "16px",
                color: "var(--page-text)",
              }}
            >
              Already submitted a complaint?
            </h3>

            <p
              style={{
                color: "var(--muted-text)",
                fontSize: "13px",
                margin: "0 0 16px",
              }}
            >
              Use your complaint reference ID to check
              the latest status.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/track-complaint")
              }
              style={{
                padding: "10px 20px",
                background: "transparent",
                color: "var(--primary)",
                border: "1px solid var(--primary)",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Track Complaint
            </button>
          </div>

          {/* ================= BACK HOME ================= */}

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              display: "block",
              margin: "28px auto 0",
              padding: "10px 20px",
              background: "transparent",
              color: "var(--muted-text)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← Back to Home
          </button>
        </div>
      </main>

      {/* ================= FOOTER ================= */}

      <footer
        style={{
          background: "var(--footer-background)",
          borderTop: "1px solid var(--border)",
          padding: "28px 20px",
          color: "var(--muted-text)",
          textAlign: "center",
          fontFamily: "sans-serif",
          transition:
            "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <div
          style={{
            color: "var(--page-text)",
            fontWeight: "700",
            fontSize: "16px",
            marginBottom: "6px",
          }}
        >
          <span style={{ color: "var(--primary)" }}>
            C
          </span>
          ampusVoice
        </div>

        <p
          style={{
            margin: "0",
            fontSize: "12px",
          }}
        >
          Anonymous Complaint & Feedback Management
          System
        </p>

        <p
          style={{
            margin: "12px 0 0",
            fontSize: "11px",
          }}
        >
          © 2026 CampusVoice. All rights reserved.
        </p>
      </footer>

      {/* ================= THEME VARIABLES ================= */}

      <style>{`

        :root {
          --page-background: #f8fafc;
          --page-text: #111827;

          --card-background: #ffffff;

          --muted-text: #6b7280;

          --border: #e5e7eb;

          --primary: #10b981;

          --guest-badge-bg: rgba(16, 185, 129, 0.08);
          --guest-badge-border: rgba(16, 185, 129, 0.25);

          --success-soft: rgba(16, 185, 129, 0.10);
          --success-border: rgba(16, 185, 129, 0.25);

          --info-soft: rgba(56, 189, 248, 0.10);
          --info-border: rgba(56, 189, 248, 0.25);

          --footer-background: #f1f5f9;
        }

        html[data-theme="dark"] {
          --page-background: #030712;
          --page-text: #ffffff;

          --card-background: #111827;

          --muted-text: #9ca3af;

          --border: #1f2937;

          --primary: #10b981;

          --guest-badge-bg: rgba(56, 189, 248, 0.08);
          --guest-badge-border: rgba(56, 189, 248, 0.25);

          --success-soft: rgba(16, 185, 129, 0.10);
          --success-border: rgba(16, 185, 129, 0.25);

          --info-soft: rgba(56, 189, 248, 0.10);
          --info-border: rgba(56, 189, 248, 0.25);

          --footer-background: #020617;
        }

      `}</style>
    </>
  );
};

export default GuestDashboard;