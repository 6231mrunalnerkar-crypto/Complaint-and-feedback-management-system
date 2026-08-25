import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-system-label">
            COMPLAINT AND FEEDBACK MANAGEMENT SYSTEM
          </div>

          <h1>
            Your concerns,
            <br />
            <span>properly heard.</span>
          </h1>

          <p className="hero-subtitle">Campus concerns.</p>

          <p>
            Submit complaints, share feedback and track resolutions through one
            simple and transparent platform built for your campus.
          </p>

          <div className="hero-buttons">
            <a href="/login" className="primary-btn">
              Submit a Complaint
            </a>
            <a href="#track" className="secondary-btn">
              Track Complaint
            </a>
          </div>

          <div className="auth-section">
            <span>Already have an account?</span>
            <a href="/login" className="hero-login-btn">
              Log In
            </a>
            <a href="/register" className="hero-register-btn">
              Register
            </a>
          </div>
        </div>

        <div className="complaint-card" id="track">
          <div className="complaint-card-header">
            <span>COMPLAINT STATUS</span>
            <span className="status-indicator">Active</span>
          </div>

          <h3>Check your complaint</h3>

          <p>
            Enter your complaint ID to view its current status and updates.
          </p>

          <form className="complaint-search" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Enter complaint ID" />
            <button type="submit">Check Status</button>
          </form>

          <div className="complaint-info">
            <div className="info-row">
              <span>Complaint status</span>
              <strong>Track after submission</strong>
            </div>

            <div className="info-row">
              <span>Status updates</span>
              <strong className="status-text">
                Available throughout the process
              </strong>
            </div>
          </div>

          <div className="complaint-footer">
            Use the complaint ID provided after submitting an issue to check its
            progress.
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;