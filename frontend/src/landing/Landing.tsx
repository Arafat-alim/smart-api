import './landing.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import BentoFeatures from './components/BentoFeatures';
import Walkthrough from './components/Walkthrough';
import HowItWorks from './components/HowItWorks';
import StatsAndCTA from './components/StatsAndCTA';
import Footer from './components/Footer';
import BackgroundGlow from './components/BackgroundGlow';

export default function Landing() {
  return (
    <div className="lp-root">
      <BackgroundGlow color="var(--lp-indigo)" top="-120px" left="-80px" size={520} />
      <BackgroundGlow color="var(--lp-violet)" top="480px" right="-160px" size={480} />

      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <BentoFeatures />
      <Walkthrough />
      <HowItWorks />
      <StatsAndCTA />
      <Footer />
    </div>
  );
}
