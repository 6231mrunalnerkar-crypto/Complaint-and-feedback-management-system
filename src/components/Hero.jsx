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

          <p className="hero-subtitle">
            Campus concerns.
          </p>

          <p>
            Submit complaints, share feedback and track
            resolutions through one simple and transparent
            platform built for your campus.
          </p>

          <div className="hero-buttons">

            <button className="primary-btn">
              Submit a Complaint
            </button>

            <button className="secondary-btn">
              Track Complaint
            </button>

          </div>

          <div className="auth-section">

            <span>Already have an account?</span>

            <button className="hero-login-btn">
              Log In
            </button>

            <button className="hero-register-btn">
              Register
            </button>

          </div>

        </div>


        <div className="complaint-card">

          <div className="complaint-card-header">

            <span>COMPLAINT STATUS</span>

            <span className="status-indicator">
              Active
            </span>

          </div>

          <h3>
            Check your complaint
          </h3>

          <p>
            Enter your complaint ID to view its current
            status and updates.
          </p>

          <div className="complaint-search">

            <input
              type="text"
              placeholder="Enter complaint ID"
            />

            <button>
              Check Status
            </button>

          </div>

          <div className="complaint-info">

            <div className="info-row">
              <span>Complaint status</span>

              <strong>
                Track after submission
              </strong>
            </div>

            <div className="info-row">
              <span>Status updates</span>

              <strong className="status-text">
                Available throughout the process
              </strong>
            </div>

          </div>

          <div className="complaint-footer">
            Use the complaint ID provided after submitting
            an issue to check its progress.
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;