import {
  FaEdit,
  FaUserCheck,
  FaTools,
  FaCheckCircle
} from "react-icons/fa";

import "../styles/HowItWorks.css";

function HowItWorks() {

  return (

    <section className="howItWorks">

      <h2>How It Works</h2>

      <p className="workSubTitle">
        Follow these simple steps to register and resolve your complaint.
      </p>

      <div className="steps">

        <div className="step">

          <div className="circle">
            <FaEdit />
          </div>

          <h3>Step 1</h3>

          <h4>Submit Complaint</h4>

          <p>
            Student or guest registers a complaint using the online form.
          </p>

        </div>

        <div className="arrow">➜</div>

        <div className="step">

          <div className="circle">
            <FaUserCheck />
          </div>

          <h3>Step 2</h3>

          <h4>Admin Review</h4>

          <p>
            The administrator reviews and assigns the complaint.
          </p>

        </div>

        <div className="arrow">➜</div>

        <div className="step">

          <div className="circle">
            <FaTools />
          </div>

          <h3>Step 3</h3>

          <h4>Processing</h4>

          <p>
            The responsible department works to resolve the issue.
          </p>

        </div>

        <div className="arrow">➜</div>

        <div className="step">

          <div className="circle">
            <FaCheckCircle />
          </div>

          <h3>Step 4</h3>

          <h4>Resolved</h4>

          <p>
            Student tracks the complaint until it is successfully resolved.
          </p>

        </div>

      </div>

    </section>

  );

}

export default HowItWorks;