import "../styles/Stats.css";

function Stats() {
  const statItems = [
    { title: "Simple", description: "Complaint submission" },
    { title: "Transparent", description: "Status tracking" },
    { title: "Organized", description: "Administrative workflow" },
    { title: "Secure", description: "Student feedback" },
  ];

  return (
    <section className="stats-section" aria-label="Platform highlights">
      <div className="stats-container">
        {statItems.map((item, index) => (
          <div key={index} className="stat-item">
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;