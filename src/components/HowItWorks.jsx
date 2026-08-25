import "../styles/HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Submit",
      text: "Describe your concern and provide the relevant details."
    },
    {
      number: "02",
      title: "Get your ID",
      text: "Receive a unique complaint ID for tracking your submission."
    },
    {
      number: "03",
      title: "Review",
      text: "The appropriate administrative team reviews the complaint."
    },
    {
      number: "04",
      title: "Resolve",
      text: "Your complaint is addressed and the status is updated."
    }
  ];

  return (
<section
  className="how-section scroll-reveal"
  id="how-it-works"
>
      <div className="how-heading">

        <span>HOW IT WORKS</span>

        <h2>
          From concern to
          <strong> resolution.</strong>
        </h2>

        <p>
          A simple four-step process designed to make communication
          between students and administration easier.
        </p>

      </div>

      <div className="steps-container">

        {steps.map((step, index) => (
          <div className="step-card" key={step.number}>

            <div className="step-top">
              <span>{step.number}</span>

              {index < steps.length - 1 && (
                <div className="step-line"></div>
              )}
            </div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;