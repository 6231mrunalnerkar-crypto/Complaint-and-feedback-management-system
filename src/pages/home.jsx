import "../styles/Global.css";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ComplaintTracker from "../components/ComplaintTracker";
import FeatureOrbit from "../components/FeatureOrbit";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import useScrollReveal from "../hooks/useScrollReveal";

function HomeContent() {
  useScrollReveal();

  return (
    <div className="app">

      <Navbar />

      <main>

        <Hero />

        <ComplaintTracker />

        <FeatureOrbit />

        <Categories />

        <HowItWorks />

      </main>

      <Footer />

    </div>
  );
}

function Home() {
  return <HomeContent />;
}

export default Home;