import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-box">C</div>
          <span>CampusVoice</span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn-secondary">
            Log In
          </Link>
          <Link to="/register" className="btn-primary">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;