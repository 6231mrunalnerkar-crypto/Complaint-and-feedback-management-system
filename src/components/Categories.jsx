import React from "react";
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
      desc: "Wi-Fi connectivity, library services, sports equipment, and lab resources.",
      tag: "IT & Admin",
    },
    {
      title: "Administrative & Fees",
      desc: "Fee receipts, document verification, scholarship updates, and admissions.",
      tag: "Finance",
    },
  ];

  return (
    <section className="categories-section" id="categories">
      <div className="section-heading">
        <span>CATEGORIES</span>
        <h2>
          Explore complaint <strong>categories.</strong>
        </h2>
        <p>
          Select a category to understand how different campus issues are routed and handled.
        </p>
      </div>

      <div className="categories-grid">
        {categoriesList.map((cat, index) => (
          <div key={index} className="category-card">
            <span className="category-tag">{cat.tag}</span>
            <h3>{cat.title}</h3>
            <p>{cat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;