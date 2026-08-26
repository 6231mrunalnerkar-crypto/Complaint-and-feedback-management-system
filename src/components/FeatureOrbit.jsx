import "../styles/FeatureOrbit.css";

function FeatureOrbit() {
  const features = [
    {
      title: "Easy Complaint Submission",
      description: "Submit campus concerns through a simple and organized process.",
      position: "feature-top-left",
    },
    {
      title: "Complaint Tracking",
      description: "Monitor the progress of submitted complaints in one place.",
      position: "feature-middle-left",
    },
    {
      title: "Feedback Collection",
      description: "Share feedback and help improve campus services.",
      position: "feature-bottom-left",
    },
    {
      title: "Department Assignment",
      description: "Complaints can be directed to the appropriate department.",
      position: "feature-top-right",
    },
    {
      title: "Status Updates",
      description: "Stay informed as your complaint moves through the process.",
      position: "feature-middle-right",
    },
    {
      title: "Analytics & Reports",
      description: "Administrators can monitor trends and generate useful reports.",
      position: "feature-bottom-right",
    },
  ];

  return (
    <section className="feature-orbit-section">

      <div className="feature-orbit-header">

        <span className="feature-orbit-label">
          KEY FEATURES
        </span>

        <h2>
          Everything you need to
          <span> be heard.</span>
        </h2>

        <p>
          CampusVoice brings complaint submission, tracking, feedback,
          and administration together in one centralized platform.
        </p>

      </div>


      <div className="feature-orbit">

        {/* Left Features */}

        <div className="feature-orbit-column feature-orbit-left">

          {features.slice(0, 3).map((feature) => (
            <div
              className={`orbit-feature-card ${feature.position}`}
              key={feature.title}
            >

              <div className="orbit-feature-number">
                {String(features.indexOf(feature) + 1).padStart(2, "0")}
              </div>

              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>

            </div>
          ))}

        </div>


        {/* Center */}

        <div className="orbit-center">

          <div className="orbit-ring orbit-ring-one"></div>
          <div className="orbit-ring orbit-ring-two"></div>

          <div className="orbit-center-content">

            <div className="orbit-logo">
              C
            </div>

            <strong>
              CampusVoice
            </strong>

            <span>
              Campus concerns,
              <br />
              properly heard.
            </span>

          </div>

        </div>


        {/* Right Features */}

        <div className="feature-orbit-column feature-orbit-right">

          {features.slice(3, 6).map((feature) => (

            <div
              className={`orbit-feature-card ${feature.position}`}
              key={feature.title}
            >

              <div className="orbit-feature-number">
                {String(features.indexOf(feature) + 1).padStart(2, "0")}
              </div>

              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default FeatureOrbit;