import "../styles/Features.css";

function Features() {
  const features = [
    {
      number: "01",
      title: "Complaint Submission",
      text: "Submit campus complaints through a structured and simple digital process."
    },
    {
      number: "02",
      title: "Complaint Tracking",
      text: "Track the progress of submitted complaints using a unique complaint ID."
    },
    {
      number: "03",
      title: "Anonymous Reporting",
      text: "Submit sensitive concerns without displaying your personal identity when appropriate."
    },
    {
      number: "04",
      title: "Feedback Management",
      text: "Share suggestions and feedback that can help improve campus services."
    },
    {
      number: "05",
      title: "Administrative Review",
      text: "Authorized staff can review, prioritize and manage complaints efficiently."
    },
    {
      number: "06",
      title: "Resolution Updates",
      text: "Students can receive updates as their complaint moves through the resolution process."
    }
  ];

  return (
    <section className="features" id="features">

      <div className="section-heading">

        <span>PLATFORM FEATURES</span>

        <h2>
          A better way to manage{" "}
          <strong>campus concerns.</strong>
        </h2>

        <p>
          CFMS provides students and administrators with a centralized
          platform for reporting, reviewing and resolving campus concerns.
        </p>

      </div>


      <div className="features-grid">

        {features.map((feature) => (

          <div
            className="feature-card"
            key={feature.number}
          >

            <span className="feature-number">
              {feature.number}
            </span>

            <h3>
              {feature.title}
            </h3>

            <p>
              {feature.text}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;