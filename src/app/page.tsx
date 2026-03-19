import BackgroundFX from "@/components/home/BackgroundFX";
import HeroSection from "@/components/home/HeroSection";
import StatsStrip from "@/components/home/StatsStrip";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";
import BodyExplorerSection from "@/components/body-explorer/Explorer";
import PerfectFitFusionCalculator from "@/components/BMICalculator";



export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <BackgroundFX />

      <HeroSection />
      <BodyExplorerSection />
      <PerfectFitFusionCalculator />
      <StatsStrip />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </main>
  );
}