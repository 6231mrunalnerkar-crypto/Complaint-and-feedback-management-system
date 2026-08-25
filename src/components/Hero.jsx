import React from "react";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <span className="hero-badge">COMPLAINT AND FEEDBACK MANAGEMENT SYSTEM</span>
        <h1>
          Your concerns, <br />
          <span className="highlight-text">properly heard.</span>
        </h1>
        <p className="hero-subtext">Campus concerns.</p>
        <p className="hero-description">
          Submit complaints, share feedback and track resolutions through one
          simple and transparent platform built for your campus.
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="btn-primary-large">
            Submit a Complaint
          </Link>
          <a href="#track" className="btn-secondary-large">
            Track Complaint
          </a>
        </div>

        <div className="hero-auth-prompt">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-chip">Log In</Link>
          <Link to="/register" className="auth-chip outline">Register</Link>
        </div>
      </div>

      <div className="hero-card-container">
        <div className="complaint-status-card">
          <div className="card-header">
            <span>COMPLAINT STATUS</span>
            <span className="status-badge">Active</span>
          </div>

          <h2>Check your complaint</h2>
          <p>Enter your complaint ID to view its current status and updates.</p>

          <div className="search-box">
            <input type="text" placeholder="Enter complaint ID" />
            <button className="btn-search">Check Status</button>
          </div>

          <div className="status-timeline">
            <div className="timeline-item">
              <span>Complaint status</span>
              <strong>Track after submission</strong>
            </div>
            <div className="timeline-item">
              <span>Status updates</span>
              <span className="status-active-text">Available throughout the process</span>
            </div>
          </div>

          <p className="card-footer-text">
            Use the complaint ID provided after submitting an issue to check its progress.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;