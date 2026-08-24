import { FaClipboardList, FaSearch, FaComments, FaUserSecret } from "react-icons/fa";
import "../styles/Features.css";

function Features() {
  return (
    <section className="features">

      <h2>Why Choose Our System?</h2>

      <p className="feature-subtitle">
        A modern complaint and feedback platform designed for students,
        faculty, and administrators.
      </p>

      <div className="feature-container">

        <div className="feature-card">
          <FaClipboardList className="icon" />
          <h3>Easy Complaint</h3>
          <p>
            Submit complaints online within minutes from any device.
          </p>
        </div>

        <div className="feature-card">
          <FaSearch className="icon" />
          <h3>Real-Time Tracking</h3>
          <p>
            Track your complaint status from submission to resolution.
          </p>
        </div>

        <div className="feature-card">
          <FaComments className="icon" />
          <h3>Feedback System</h3>
          <p>
            Share suggestions and rate institutional services.
          </p>
        </div>

        <div className="feature-card">
          <FaUserSecret className="icon" />
          <h3>Anonymous Mode</h3>
          <p>
            Guests can submit complaints anonymously without registration.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Features;