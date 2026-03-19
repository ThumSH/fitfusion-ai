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

// 1. Import our new Client Wrapper instead of the raw Explorer
import ExplorerWrapper from "@/components/body-explorer/ExplorerWrapper";

import dynamic from "next/dynamic";

// 2. The calculator can stay dynamic (without ssr: false)
const PerfectFitFusionCalculator = dynamic(() => import("@/components/BMICalculator"), {
  loading: () => (
    <div className="h-100 w-full flex items-center justify-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
      <p className="text-white/60 font-medium animate-pulse">Loading Calculator Module...</p>
    </div>
  ),
});

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
        <PerfectFitFusionCalculator />
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