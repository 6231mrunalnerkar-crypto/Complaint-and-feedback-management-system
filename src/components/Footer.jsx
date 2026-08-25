import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="nav-logo">
            <div className="logo-box">C</div>
            <span>CampusVoice</span>
          </div>
          <p>
            Empowering students and administration through efficient, transparent,
            and anonymous complaint management.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#track">Track Status</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Portal Access</h4>
          <ul>
            <li><a href="/login">Student Login</a></li>
            <li><a href="/register">Student Register</a></li>
            <li><a href="/login">Admin Portal</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CampusVoice. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;