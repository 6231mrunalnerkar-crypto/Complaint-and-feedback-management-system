import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Portal.css";

function PortalLayout({
  children,
  role,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("cfms_user");
    navigate("/");
  };

  const getRoleName = () => {
    if (role === "student") return "Student Portal";
    if (role === "staff") return "Staff Portal";
    if (role === "admin") return "Admin Portal";

    return "CampusVoice Portal";
  };

  return (
    <div className="portal-page">

      <Navbar />

      <div className="portal-navigation">

        <div className="portal-nav-container">

          <div className="portal-title">
            <span className="portal-role">
              {getRoleName()}
            </span>
          </div>


          <div className="portal-links">

            {role === "student" && (
              <>
                <Link to="/student-dashboard">
                  Dashboard
                </Link>

                <Link to="/submit-complaint">
                  Submit Complaint
                </Link>

                <Link to="/track-complaint">
                  Track Complaint
                </Link>
              </>
            )}


            {role === "staff" && (
              <>
                <Link to="/staff-dashboard">
                  Dashboard
                </Link>

                <Link to="/staff-dashboard">
                  Assigned Complaints
                </Link>

                <Link to="/staff-dashboard">
                  Feedback
                </Link>
              </>
            )}


            {role === "admin" && (
              <>
                <Link to="/admin-dashboard">
                  Dashboard
                </Link>

                <Link to="/admin-dashboard">
                  Complaints
                </Link>

                <Link to="/admin-dashboard">
                  Users
                </Link>

                <Link to="/admin-dashboard">
                  Reports
                </Link>
              </>
            )}

          </div>


          <button
            type="button"
            className="portal-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      <main className="portal-content">
        {children}
      </main>


      <Footer />

    </div>
  );
}

export default PortalLayout;