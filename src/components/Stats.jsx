import "../styles/Stats.css";

function Stats() {
  const stats = [
    {
      value: "01",
      title: "Simple",
      text: "Easy complaint submission"
    },
    {
      value: "02",
      title: "Transparent",
      text: "Clear status tracking"
    },
    {
      value: "03",
      title: "Organized",
      text: "Structured administration"
    },
    {
      value: "04",
      title: "Secure",
      text: "Responsible reporting"
    }
  ];

  return (
  
  <section className="stats-section scroll-reveal">      <div className="stats-container">

        {stats.map((stat) => (
          <div className="stat-item" key={stat.value}>

            <span className="stat-number">
              {stat.value}
            </span>

            <div>
              <strong>{stat.title}</strong>
              <p>{stat.text}</p>
            </div>

          </div>
        ))}

      </div>
    </section>
  );
}

export default Stats;