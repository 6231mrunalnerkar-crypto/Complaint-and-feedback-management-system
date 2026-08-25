import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <Stats />

        <Features />

        <HowItWorks />
      </main>
    </>
  );
}

export default Home;