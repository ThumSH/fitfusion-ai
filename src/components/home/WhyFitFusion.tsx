"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ShieldCheck, Target, Zap } from "lucide-react";

const points = [
  {
    icon: BrainCircuit,
    title: "AI with purpose",
    text: "Not random text generation — the product is positioned around fitness workflows users actually need.",
  },
  {
    icon: ShieldCheck,
    title: "Safer positioning",
    text: "The next sprint will add guardrails so generated workout and nutrition suggestions stay beginner-safe.",
  },
  {
    icon: Target,
    title: "Hackathon-ready story",
    text: "Three features connect into a clear value proposition instead of feeling like disconnected demos.",
  },
  {
    icon: Zap,
    title: "Modern premium UI",
    text: "Dark glassmorphism, neon athletic accents, and motion make the product look credible immediately.",
  },
];

export default function WhyFitFusion() {
  return (
    <section id="why-fitfusion" className="py-24">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[#b9ff66]">
              Why this works
            </p>
            <h2 className="section-title">
              This now looks like a real startup product, not just a demo page.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
              The visual system, information hierarchy, and cleaner component
              organization set you up to plug in the AI features without turning
              the codebase into a spaghetti gym bag.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {points.map((point, index) => {
              const Icon = point.icon;

              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="glass-card rounded-[1.75rem] p-6"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3 text-[#b9ff66]">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">
                    {point.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}