import heroImage from "../assets/images/hero.png";
import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <div className="badge">
          ⭐ Trusted by 5000+ Students
        </div>

        <h1>
          Complaint &
          <span> Feedback</span><br />
          Management System
        </h1>

        <p>
          A smart and secure platform where students can register complaints,
          track their status, submit feedback, and communicate with the
          administration efficiently.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">Register Complaint</button>

          <button className="secondary-btn">Track Complaint</button>
        </div>

      </div>

      <div className="hero-right">
        <img src={heroImage} alt="Hero" />
      </div>

    </section>
  );
}

export default Hero;