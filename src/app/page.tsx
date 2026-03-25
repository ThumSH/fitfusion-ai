import BackgroundFX from "@/components/home/BackgroundFX";
import HeroSection from "@/components/home/HeroSection";
import UsageShowcase from "@/components/home/UsageShowcase";
import StatsStrip from "@/components/home/StatsStrip";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";
import AnimatedSection from "@/components/layout/AnimatedSection";
import BMICalculatorWrapper from "@/components/BMICalculatorWrapper";

// 1. Import our new Client Wrapper instead of the raw Explorer
import ExplorerWrapper from "@/components/body-explorer/ExplorerWrapper";

export default function HomePage() {
  return (
    <div className="relative w-full flex flex-col gap-24 pb-20">
      <BackgroundFX />

      <AnimatedSection delay={200}>
        <HeroSection />
      </AnimatedSection>

       <AnimatedSection delay={200}>
        <UsageShowcase />
      </AnimatedSection>
      
      {/* 3. Use the Wrapper here */}
      <AnimatedSection>
        <ExplorerWrapper />
      </AnimatedSection>

      <AnimatedSection>
        <BMICalculatorWrapper />
      </AnimatedSection>

      <AnimatedSection>
        <StatsStrip />
      </AnimatedSection>

      <AnimatedSection>
        <HowItWorks />
      </AnimatedSection>

      <AnimatedSection>
        <WhyChooseUs />
      </AnimatedSection>

      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>

      <AnimatedSection>
        <FAQSection />
      </AnimatedSection>

      <AnimatedSection delay={100}>
        <FinalCTA />
      </AnimatedSection>
    </div>
  );
}
