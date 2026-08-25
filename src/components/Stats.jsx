import "../styles/Stats.css";

function Stats() {
  return (
    <section className="stats-section">

      <div className="stats-container">

        <div className="stat-item">
          <strong>Simple</strong>
          <span>Complaint submission</span>
        </div>

        <div className="stat-item">
          <strong>Transparent</strong>
          <span>Status tracking</span>
        </div>

        <div className="stat-item">
          <strong>Organized</strong>
          <span>Administrative workflow</span>
        </div>

        <div className="stat-item">
          <strong>Secure</strong>
          <span>Student feedback</span>
        </div>

      </div>

    </section>
  );
}

export default Stats;