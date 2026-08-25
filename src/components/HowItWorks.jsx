import "../styles/HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Submit",
      text: "Describe your complaint, concern or suggestion and provide the relevant details."
    },
    {
      number: "02",
      title: "Receive your ID",
      text: "Your submission receives a unique complaint ID that can be used for tracking."
    },
    {
      number: "03",
      title: "Review",
      text: "The appropriate administrative team reviews the complaint and determines the next action."
    },
    {
      number: "04",
      title: "Resolution",
      text: "The issue is addressed and the complaint status is updated throughout the process."
    }
  ];

  return (
    <section className="how-section" id="how-it-works">

      <div className="how-heading">
        <span>HOW IT WORKS</span>

        <h2>
          From concern to
          <strong> resolution.</strong>
        </h2>

        <p>
          A simple process designed to make communication
          between students and administration easier.
        </p>
      </div>

      <div className="steps-container">

        {steps.map((step) => (
          <div className="step-card" key={step.number}>

            <span className="step-number">
              {step.number}
            </span>

            <h3>
              {step.title}
            </h3>

            <p>
              {step.text}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;