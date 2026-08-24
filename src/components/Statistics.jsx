import { FaClipboardList, FaCheckCircle, FaComments, FaBuilding } from "react-icons/fa";
import "../styles/Statistics.css";

function Statistics() {
  return (
    <section className="statistics">

      <div className="stats-heading">
        <h2>System Overview</h2>
        <p>
          Our platform helps institutions manage complaints efficiently
          while maintaining transparency and accountability.
        </p>
      </div>

      <div className="stats-container">

        <div className="stat-card">
          <FaClipboardList className="stat-icon"/>
          <h1>1200+</h1>
          <p>Complaints Registered</p>
        </div>

        <div className="stat-card">
          <FaCheckCircle className="stat-icon"/>
          <h1>980+</h1>
          <p>Resolved Complaints</p>
        </div>

        <div className="stat-card">
          <FaComments className="stat-icon"/>
          <h1>450+</h1>
          <p>Feedback Submitted</p>
        </div>

        <div className="stat-card">
          <FaBuilding className="stat-icon"/>
          <h1>15+</h1>
          <p>Departments Connected</p>
        </div>

      </div>

    </section>
  );
}

export default Statistics;