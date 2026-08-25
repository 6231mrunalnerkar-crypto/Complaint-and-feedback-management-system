import "../styles/Features.css";

function Features() {
  const features = [
    {
      number: "01",
      title: "Complaint Submission",
      text: "Report campus issues through a structured and simple digital process.",
    },
    {
      number: "02",
      title: "Complaint Tracking",
      text: "Follow the progress of your complaint using a unique complaint ID.",
    },
    {
      number: "03",
      title: "Anonymous Reporting",
      text: "Raise sensitive concerns while protecting your personal identity.",
    },
    {
      number: "04",
      title: "Feedback Management",
      text: "Share ideas and suggestions that can help improve campus services.",
    },
    {
      number: "05",
      title: "Administrative Review",
      text: "Authorized staff can review, prioritize and manage submissions.",
    },
    {
      number: "06",
      title: "Resolution Updates",
      text: "Stay informed as your complaint moves through the resolution process.",
    },
  ];

  return (
  
  <section
      className="features scroll-reveal"
      id="features"
    >

      <div className="section-heading">

        <span>PLATFORM FEATURES</span>

        <h2>
          Everything you need to
          <br />
          <strong>make your voice count.</strong>
        </h2>

        <p>
          CampusVoice connects students and administrators through
          one organized platform designed for better communication,
          transparency and resolution.
        </p>

      </div>


      <div className="features-grid">

        {features.map((feature) => (
          <article
            className="feature-card"
            key={feature.number}
          >

            <span className="feature-number">
              {feature.number}
            </span>

            <div className="feature-icon">
              {feature.number === "01" && "＋"}
              {feature.number === "02" && "↗"}
              {feature.number === "03" && "◉"}
              {feature.number === "04" && "✦"}
              {feature.number === "05" && "▣"}
              {feature.number === "06" && "✓"}
            </div>

            <h3>
              {feature.title}
            </h3>

            <p>
              {feature.text}
            </p>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Features;