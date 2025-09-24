import { CallToActionSection } from './components/CallToActionSection';
import { HeroSection } from './components/HeroSection';
import { LandingFooter } from './components/LandingFooter';
import { LandingHeader } from './components/LandingPageHeader';
import { MethodologySection } from './components/MethodolySection';
import { PartnersSection } from './components/PartnersSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SoluctionSection';
import { TeamSection } from './components/TeamSection';

const LandingPage = () => {
  return (
    <div className="bg-brand-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <MethodologySection />
        <TeamSection />
        <PartnersSection />
        <CallToActionSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
