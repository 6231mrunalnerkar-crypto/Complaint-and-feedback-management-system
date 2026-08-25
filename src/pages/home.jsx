import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Stats />
        <Features />
        <Categories />
        <HowItWorks />
      </main>

      <Footer />
    </>
  );
}

export default Home;