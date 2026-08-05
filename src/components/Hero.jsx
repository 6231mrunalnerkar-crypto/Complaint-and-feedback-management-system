import "../styles/Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="heroLeft">

        <h1>
          Complaint &
          Feedback
          Management
          System
        </h1>

        <p>

          Submit complaints,
          track their status,
          and provide valuable
          feedback in one place.

        </p>

        <div className="heroButtons">

          <button className="primary">
            Register Complaint
          </button>

          <button className="secondary">
            Track Complaint
          </button>

        </div>

      </div>

      <div className="heroRight">

        <img
        src="https://illustrations.popsy.co/blue/digital-nomad.svg"
        alt="hero"
        />

      </div>

    </section>
  );
}

export default Hero;