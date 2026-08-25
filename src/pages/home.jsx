import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

// Explicit CSS Imports
import "../styles/Navbar.css";
import "../styles/Hero.css";
import "../styles/Stats.css";
import "../styles/Features.css";
import "../styles/Categories.css";
import "../styles/HowItWorks.css";
import "../styles/Footer.css";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Categories />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default Home;