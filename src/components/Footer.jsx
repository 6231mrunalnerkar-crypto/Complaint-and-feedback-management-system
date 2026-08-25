import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer" id="about">

      <div className="footer-container">

        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">C</span>
            <span>CampusVoice</span>
          </Link>

          <p>
            A centralized platform that helps students raise concerns,
            share feedback and stay connected with campus administration.
          </p>

        </div>

        <div className="footer-links">

          <h4>Explore</h4>

          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>

        </div>

        <div className="footer-links">

          <h4>Account</h4>

          <Link to="/login">Student Login</Link>
          <Link to="/register">Create Account</Link>

        </div>

      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} CampusVoice
        </span>

        <span>
          Complaint & Feedback Management System
        </span>
      </div>

    </footer>
  );
}

export default Footer;