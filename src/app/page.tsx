import HeroSection from "@/components/home/HeroSection";
import FeatureCards from "@/components/home/FeatureCards";
import WhyFitFusion from "@/components/home/WhyFitFusion";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <HeroSection />
      <FeatureCards />
      <WhyFitFusion />
      <CTASection />
    </main>
  );
}