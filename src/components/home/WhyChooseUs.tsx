import { Zap, Target, ShieldCheck, Activity } from "lucide-react";
import SectionHeader from "../layout/SectionHeader";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Zap className="text-primary w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />,
      title: "Lightning Fast AI",
      description: "Generate complete, scientifically-backed workout and meal plans in seconds, not hours."
    },
    {
      icon: <Target className="text-primary w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />,
      title: "Hyper-Personalized",
      description: "No cookie-cutter routines. Every schedule adapts to your specific experience level and goals."
    },
    {
      icon: <Activity className="text-primary w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />,
      title: "Beginner Friendly",
      description: "We eliminate gym anxiety by providing clear, actionable steps and meal prep guides for real people."
    },
    {
      icon: <ShieldCheck className="text-primary w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />,
      title: "Data Driven Results",
      description: "Our algorithms analyze your macros and performance to ensure you are always progressing."
    }
  ];

  return (
    <section className="w-full py-12">
      <SectionHeader 
        title="Why Choose" 
        highlightWord="FitFusion"
        description="We combine cutting-edge artificial intelligence with proven fitness principles to give you the ultimate unfair advantage."
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="group bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-primary/50 transition-all cursor-default"
          >
            {feature.icon}
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}