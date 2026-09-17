import { Link } from "react-router-dom";

const Footer = () => {
  const role = localStorage.getItem("userRole") || "guest";
  const isAdmin = role === "admin";

  return (
    <footer
      style={{
        background: "#064e3b",
        borderTop: "1px solid #047857",
        color: "#d1fae5",
        padding: "40px 20px 24px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "32px",
            paddingBottom: "30px",
          }}
        >

          {/* BRAND */}

          <div>
            <Link
              to="/"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  color: "#34d399",
                  fontSize: "20px",
                  fontWeight: "800",
                }}
              >
                C
              </span>

              <strong
                style={{
                  color: "#ffffff",
                  fontSize: "19px",
                }}
              >
                CampusVoice
              </strong>
            </Link>

            <p
              style={{
                color: "#a7f3d0",
                fontSize: "13px",
                lineHeight: "1.7",
                margin: 0,
                maxWidth: "330px",
              }}
            >
              {isAdmin
                ? "Administrative management portal for monitoring complaints, reviewing feedback and improving campus services."
                : "A centralized platform that helps students raise concerns, share feedback and stay connected with campus administration."}
            </p>
          </div>

          {/* PORTAL */}

          <div>
            <h4
              style={{
                color: "#ffffff",
                fontSize: "14px",
                marginBottom: "14px",
              }}
            >
              {isAdmin ? "Administration" : "Explore"}
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
              }}
            >
              {isAdmin ? (
                <>
                  <Link
                    to="/admin-dashboard"
                    style={{
                      color: "#a7f3d0",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/admin-dashboard"
                    style={{
                      color: "#a7f3d0",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Complaint Management
                  </Link>

                  <Link
                    to="/admin-dashboard"
                    style={{
                      color: "#a7f3d0",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Feedback Management
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    style={{
                      color: "#a7f3d0",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Home
                  </Link>

                  <Link
                    to="/#features"
                    style={{
                      color: "#a7f3d0",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Features
                  </Link>

                  <Link
                    to="/#how-it-works"
                    style={{
                      color: "#a7f3d0",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    How It Works
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ACCOUNT / SYSTEM */}

          <div>
            <h4
              style={{
                color: "#ffffff",
                fontSize: "14px",
                marginBottom: "14px",
              }}
            >
              {isAdmin ? "System" : "Account"}
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "9px",
              }}
            >
              {isAdmin ? (
                <>
                  <span
                    style={{
                      color: "#a7f3d0",
                      fontSize: "13px",
                    }}
                  >
                    Complaint Monitoring
                  </span>

                  <span
                    style={{
                      color: "#a7f3d0",
                      fontSize: "13px",
                    }}
                  >
                    Feedback Analysis
                  </span>

                  <span
                    style={{
                      color: "#6ee7b7",
                      fontSize: "13px",
                    }}
                  >
                    System Status: Active
                  </span>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    style={{
                      color: "#a7f3d0",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Student Login
                  </Link>

                  <Link
                    to="/register"
                    style={{
                      color: "#a7f3d0",
                      textDecoration: "none",
                      fontSize: "13px",
                    }}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}

        <div
          style={{
            borderTop: "1px solid #047857",
            paddingTop: "20px",
            textAlign: "center",
            color: "#6ee7b7",
            fontSize: "12px",
          }}
        >
          © 2026 CampusVoice · Complaint & Feedback
          Management System
        </div>
      </div>
    </footer>
  );
};

export default Footer;