import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("campusvoice-theme") === "dark";
  });

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("campusvoice-theme", theme);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            C
          </div>

          <div className="brand-text">
            <span className="brand-name">
              CampusVoice
            </span>

            <span className="brand-caption">
              Campus concerns, properly heard.
            </span>
          </div>
        </Link>


        {/* Navigation Links */}
        <div className="navbar-links">

          <Link to="/#how-it-works">
            How It Works
          </Link>

          <Link to="/#categories">
            Categories
          </Link>

          <Link to="/about">
            About
          </Link>

        </div>


        {/* Theme Toggle */}
        <div className="navbar-actions">

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;