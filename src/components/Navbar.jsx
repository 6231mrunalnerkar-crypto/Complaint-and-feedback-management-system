import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // =====================================================
  // THEME
  // =====================================================

  const [theme, setTheme] = useState(
    localStorage.getItem("cfms-theme") || "light"
  );

  // =====================================================
  // ROLE
  // =====================================================

  const role =
    localStorage.getItem("userRole") || "guest";

  // =====================================================
  // THEME TOGGLE
  // =====================================================

  const toggleTheme = () => {
    const newTheme =
      theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    localStorage.setItem(
      "cfms-theme",
      newTheme
    );

    document.documentElement.setAttribute(
      "data-theme",
      newTheme
    );

    // Notify other components/pages
    window.dispatchEvent(
      new Event("cfms-theme-change")
    );
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("cfms_user");

    setMobileMenuOpen(false);

    toast.success(
      "Logged out successfully"
    );

    navigate("/");
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigation = () => {
    setMobileMenuOpen(false);
  };

  // =====================================================
  // NAV LINK STYLE
  // =====================================================

  const navLinkStyle = ({ isActive }) => ({
    color: isActive
      ? "#34d399"
      : "#d1fae5",

    textDecoration: "none",

    fontWeight: isActive
      ? "700"
      : "500",

    fontSize: "14px",

    padding: "8px 12px",

    borderRadius: "6px",

    transition: "all 0.2s ease",

    background: isActive
      ? "rgba(52, 211, 153, 0.12)"
      : "transparent",

    whiteSpace: "nowrap",
  });

  // =====================================================
  // LOGOUT STYLE
  // =====================================================

  const logoutStyle = {
    marginLeft: "8px",

    background:
      "rgba(239, 68, 68, 0.10)",

    color: "#fca5a5",

    border:
      "1px solid rgba(239, 68, 68, 0.35)",

    padding: "7px 14px",

    borderRadius: "6px",

    fontSize: "13px",

    fontWeight: "700",

    cursor: "pointer",

    whiteSpace: "nowrap",

    transition: "all 0.2s ease",
  };

  // =====================================================
  // THEME BUTTON
  // =====================================================

  const themeButtonStyle = {
    marginLeft: "8px",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "6px",

    background: "#065f46",

    color: "#d1fae5",

    border:
      "1px solid #047857",

    padding: "7px 11px",

    borderRadius: "6px",

    fontSize: "13px",

    fontWeight: "600",

    cursor: "pointer",

    whiteSpace: "nowrap",

    transition: "all 0.2s ease",

    flexShrink: 0,
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <nav className="cfms-navbar">

      {/* =================================================
          NAVBAR CONTAINER
      ================================================= */}

      <div className="navbar-container">

        {/* =================================================
            BRAND
        ================================================= */}

        <NavLink
          to="/"
          onClick={handleNavigation}
          className="cfms-brand"
        >
          <span>CFMS</span>
          <strong>Portal</strong>
        </NavLink>

        {/* =================================================
            DESKTOP MENU
        ================================================= */}

        <div className="desktop-menu">

          {/* HOME */}

          <NavLink
            to="/"
            style={navLinkStyle}
            onClick={handleNavigation}
          >
            Home
          </NavLink>

          {/* LODGE COMPLAINT */}

          <NavLink
            to="/submit-complaint"
            style={navLinkStyle}
            onClick={handleNavigation}
          >
            Lodge Complaint
          </NavLink>

          {/* TRACK COMPLAINT */}

          <NavLink
            to="/track-complaint"
            style={navLinkStyle}
            onClick={handleNavigation}
          >
            Track Complaint
          </NavLink>

          {/* FEEDBACK */}

          <NavLink
            to="/feedback"
            style={navLinkStyle}
            onClick={handleNavigation}
          >
            Feedback
          </NavLink>

          {/* =================================================
              ADMIN
          ================================================= */}

          {role === "admin" && (
            <>
              <NavLink
                to="/admin-dashboard"
                style={navLinkStyle}
                onClick={handleNavigation}
              >
                Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/feedback"
                style={navLinkStyle}
                onClick={handleNavigation}
              >
                Analytics
              </NavLink>
            </>
          )}

          {/* =================================================
              STUDENT
          ================================================= */}

          {role === "student" && (
            <>
              <NavLink
                to="/student-dashboard"
                style={navLinkStyle}
                onClick={handleNavigation}
              >
                Student Dashboard
              </NavLink>

              <NavLink
                to="/my-complaints"
                style={navLinkStyle}
                onClick={handleNavigation}
              >
                My Complaints
              </NavLink>
            </>
          )}

          {/* =================================================
              STAFF
          ================================================= */}

          {role === "staff" && (
            <NavLink
              to="/staff-dashboard"
              style={navLinkStyle}
              onClick={handleNavigation}
            >
              Staff Dashboard
            </NavLink>
          )}

          {/* =================================================
              THEME
          ================================================= */}

          <button
            type="button"
            onClick={toggleTheme}
            style={themeButtonStyle}
            title={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
          >
            <span>
              {theme === "light"
                ? "🌙"
                : "☀️"}
            </span>

            <span>
              {theme === "light"
                ? "Dark"
                : "Light"}
            </span>
          </button>

          {/* =================================================
              LOGOUT

              Login button intentionally removed.
          ================================================= */}

          {role !== "guest" && (
            <button
              type="button"
              onClick={handleLogout}
              style={logoutStyle}
            >
              Logout
            </button>
          )}

        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          className="mobile-toggle"
          onClick={() =>
            setMobileMenuOpen(
              (previous) => !previous
            )
          }
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen
            ? "✕"
            : "☰"}
        </button>

      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileMenuOpen && (
        <div className="mobile-menu">

          {/* HOME */}

          <NavLink
            to="/"
            onClick={handleNavigation}
            style={navLinkStyle}
          >
            Home
          </NavLink>

          {/* LODGE COMPLAINT */}

          <NavLink
            to="/submit-complaint"
            onClick={handleNavigation}
            style={navLinkStyle}
          >
            Lodge Complaint
          </NavLink>

          {/* TRACK COMPLAINT */}

          <NavLink
            to="/track-complaint"
            onClick={handleNavigation}
            style={navLinkStyle}
          >
            Track Complaint
          </NavLink>

          {/* FEEDBACK */}

          <NavLink
            to="/feedback"
            onClick={handleNavigation}
            style={navLinkStyle}
          >
            Feedback
          </NavLink>

          {/* =================================================
              MOBILE ADMIN
          ================================================= */}

          {role === "admin" && (
            <>
              <NavLink
                to="/admin-dashboard"
                onClick={handleNavigation}
                style={navLinkStyle}
              >
                Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/feedback"
                onClick={handleNavigation}
                style={navLinkStyle}
              >
                Analytics
              </NavLink>
            </>
          )}

          {/* =================================================
              MOBILE STUDENT
          ================================================= */}

          {role === "student" && (
            <>
              <NavLink
                to="/student-dashboard"
                onClick={handleNavigation}
                style={navLinkStyle}
              >
                Student Dashboard
              </NavLink>

              <NavLink
                to="/my-complaints"
                onClick={handleNavigation}
                style={navLinkStyle}
              >
                My Complaints
              </NavLink>
            </>
          )}

          {/* =================================================
              MOBILE STAFF
          ================================================= */}

          {role === "staff" && (
            <NavLink
              to="/staff-dashboard"
              onClick={handleNavigation}
              style={navLinkStyle}
            >
              Staff Dashboard
            </NavLink>
          )}

          {/* =================================================
              MOBILE THEME
          ================================================= */}

          <button
            type="button"
            onClick={toggleTheme}
            className="mobile-theme-button"
          >
            {theme === "light"
              ? "🌙  Switch to Dark Mode"
              : "☀️  Switch to Light Mode"}
          </button>

          {/* =================================================
              MOBILE LOGOUT

              No Login button.
          ================================================= */}

          {role !== "guest" && (
            <button
              type="button"
              onClick={handleLogout}
              className="mobile-logout-button"
            >
              Logout
            </button>
          )}

        </div>
      )}

      {/* =====================================================
          NAVBAR CSS
      ===================================================== */}

      <style>{`

        .cfms-navbar {
          width: 100%;
          background: #064e3b;
          border-bottom: 1px solid #047857;
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.25s ease;
        }

        /* =================================================
           CONTAINER
        ================================================= */

        .navbar-container {
          width: 100%;
          max-width: 1400px;
          height: 64px;
          margin: 0 auto;

          padding: 0 20px;

          box-sizing: border-box;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;
        }

        /* =================================================
           BRAND
        ================================================= */

        .cfms-brand {
          display: flex;
          align-items: center;

          gap: 7px;

          color: #ffffff;

          text-decoration: none;

          font-size: 18px;

          font-weight: 700;

          white-space: nowrap;

          flex-shrink: 0;
        }

        .cfms-brand span {
          color: #34d399;
        }

        .cfms-brand strong {
          color: #ffffff;
        }

        /* =================================================
           DESKTOP MENU
        ================================================= */

        .desktop-menu {
          display: flex;

          align-items: center;

          justify-content: flex-end;

          gap: 3px;

          flex: 1;

          min-width: 0;
        }

        .desktop-menu a {
          color: #d1fae5 !important;
        }

        .desktop-menu a:hover {
          color: #ffffff !important;

          background:
            rgba(52, 211, 153, 0.15);
        }

        .desktop-menu a[aria-current="page"] {
          color: #34d399 !important;

          background:
            rgba(52, 211, 153, 0.12);
        }

        /* =================================================
           MOBILE TOGGLE
        ================================================= */

        .mobile-toggle {
          display: none;

          background: transparent;

          border: none;

          color: #ffffff;

          font-size: 24px;

          cursor: pointer;

          padding: 4px;
        }

        /* =================================================
           MOBILE MENU
        ================================================= */

        .mobile-menu {
          display: none;
        }

        /* =================================================
           MOBILE THEME
        ================================================= */

        .mobile-theme-button {
          width: 100%;

          margin-top: 8px;

          padding: 10px 12px;

          background: #065f46;

          color: #d1fae5;

          border: 1px solid #047857;

          border-radius: 6px;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          text-align: left;

          transition: all 0.2s ease;
        }

        .mobile-theme-button:hover {
          background: #047857;
          color: #ffffff;
        }

        /* =================================================
           MOBILE LOGOUT
        ================================================= */

        .mobile-logout-button {
          width: 100%;

          margin-top: 8px;

          padding: 10px;

          background:
            rgba(239, 68, 68, 0.08);

          color: #fca5a5;

          border:
            1px solid rgba(239, 68, 68, 0.35);

          border-radius: 6px;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;

          text-align: left;
        }

        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 1150px) {

          .desktop-menu {
            gap: 1px;
          }

          .desktop-menu a {
            font-size: 12px;

            padding: 7px 7px;
          }

          .desktop-menu button {
            font-size: 12px;

            padding: 7px 8px;
          }

        }

        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 950px) {

          .desktop-menu {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }

          .mobile-menu {
            display: flex;

            flex-direction: column;

            gap: 5px;

            padding:
              15px 20px 20px;

            background: #064e3b;

            border-top:
              1px solid #047857;

            border-bottom:
              1px solid #047857;
          }

          .navbar-container {
            height: 60px;
          }

        }

        /* =================================================
           DESKTOP ONLY
        ================================================= */

        @media (min-width: 951px) {

          .mobile-menu {
            display: none !important;
          }

        }

        /* =================================================
           SMALL MOBILE
        ================================================= */

        @media (max-width: 500px) {

          .navbar-container {
            padding: 0 15px;
          }

          .cfms-brand {
            font-size: 16px;
          }

        }

      `}</style>

    </nav>
  );
};

export default Navbar;