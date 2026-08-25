import { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <nav className="navbar">

      <div className="nav-container">

        {/* Logo */}
        <a href="#home" className="nav-logo">
          <div className="logo-box">C</div>
          <span>CampusVoice</span>
        </a>


        {/* Navigation */}
        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#features">Features</a>

          <a href="#how-it-works">How It Works</a>

          <a href="#about">About</a>

        </div>


        {/* Right Side */}
        <div className="nav-actions">

          <button
            className="theme-btn"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >
            {darkMode ? "Light" : "Dark"}
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;