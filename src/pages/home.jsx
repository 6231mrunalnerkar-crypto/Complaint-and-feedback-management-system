import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ComplaintTracker from "../components/ComplaintTracker";
import Stats from "../components/Stats";
import Categories from "../components/Categories";
import Features from "../components/Features";
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

        <Stats />

        <Categories />

        <Features />

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