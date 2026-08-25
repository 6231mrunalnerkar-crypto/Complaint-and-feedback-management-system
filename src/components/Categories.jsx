import "../styles/Categories.css";

function Categories() {
  const categoriesList = [
    {
      title: "Academic Issues",
      desc: "Course registration, grading queries, faculty feedback, and class schedules.",
      tag: "Academic",
    },
    {
      title: "Hostel & Housing",
      desc: "Room maintenance, cleanliness, mess food quality, and facility issues.",
      tag: "Infrastructure",
    },
    {
      title: "Campus Facilities",
      desc: "Wi-Fi connectivity, library services, sports equipment, and laboratory resources.",
      tag: "Campus Services",
    },
    {
      title: "Administrative & Fees",
      desc: "Fee receipts, document verification, scholarship updates, and admissions.",
      tag: "Administration",
    },
  ];

  return (
    <section className="categories-section" id="categories">

      <div className="categories-heading">
        <span>CATEGORIES</span>

        <h2>
          Explore complaint{" "}
          <strong>categories.</strong>
        </h2>

        <p>
          Choose the category that best matches your concern so it can
          be directed to the appropriate campus team.
        </p>
      </div>

      <div className="categories-grid">

        {categoriesList.map((category) => (
          <article
            key={category.title}
            className="category-card"
          >

            <div className="category-top">
              <span className="category-tag">
                {category.tag}
              </span>

              <span className="category-number">
                {String(categoriesList.indexOf(category) + 1).padStart(2, "0")}
              </span>
            </div>

            <h3>
              {category.title}
            </h3>

            <p>
              {category.desc}
            </p>

          </article>
        ))}

      </div>

    </section>
  );
}

export default Categories;