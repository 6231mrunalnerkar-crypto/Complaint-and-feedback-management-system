import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const handleMouseMove = (event) => {
      const rect = hero.getBoundingClientRect();

      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      hero.style.setProperty("--mouse-x", `${x}`);
      hero.style.setProperty("--mouse-y", `${y}`);
    };

    const handleMouseLeave = () => {
      hero.style.setProperty("--mouse-x", "0");
      hero.style.setProperty("--mouse-y", "0");
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-grid"></div>

      <div className="hero-glow hero-glow-one"></div>
      <div className="hero-glow hero-glow-two"></div>

      <div className="hero-container">

        <div className="hero-content scroll-reveal">

          <div className="hero-marquee">
            <div className="hero-marquee-track">
              <span>COMPLAINT AND FEEDBACK MANAGEMENT SYSTEM</span>
              <span>COMPLAINT AND FEEDBACK MANAGEMENT SYSTEM</span>
              <span>COMPLAINT AND FEEDBACK MANAGEMENT SYSTEM</span>
            </div>
          </div>

          <h1>
            Your concerns,
            <br />
            <span>properly heard.</span>
          </h1>

          <p className="hero-subtitle">
            A smarter voice for your campus.
          </p>

          <p className="hero-description">
            CampusVoice gives students a simple and transparent way to
            report complaints, share feedback, track progress and stay
            informed throughout the resolution process.
          </p>

          <div className="hero-buttons">

            <Link
              to="/guest-complaint"
              className="hero-primary-btn"
            >
              Submit a Complaint
            </Link>

            <a
              href="#complaint-tracker"
              className="hero-secondary-btn"
            >
              Track Complaint
            </a>

          </div>

        </div>


        <div className="hero-auth-card scroll-reveal reveal-delay-2">

          <span className="auth-card-label">
            CAMPUSVOICE ACCESS
          </span>

          <h2>
            Manage your concerns
          </h2>

          <p>
            Sign in to submit and track complaints, or create
            an account to get started.
          </p>

          <div className="auth-card-buttons">

            <Link
              to="/login"
              className="auth-login-btn"
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="auth-register-btn"
            >
              Register
            </Link>

          </div>

          <div className="auth-card-footer">
            Your account keeps complaints and feedback organized
            in one place.
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;