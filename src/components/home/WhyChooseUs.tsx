"use client";

import { ShieldCheck, Sparkles, Zap, LayoutDashboard } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

const items = [
  {
    icon: Sparkles,
    title: "AI-first fitness support",
    text: "A modern experience designed around smart, personalized guidance.",
  },
  {
    icon: ShieldCheck,
    title: "Safer user direction",
    text: "Designed to steer users toward realistic plans instead of random intensity.",
  },
  {
    icon: Zap,
    title: "Fast and accessible",
    text: "Beginner-friendly interactions that reduce friction and keep momentum high.",
  },
  {
    icon: LayoutDashboard,
    title: "Beautiful product feel",
    text: "A polished interface that makes the app feel credible and investor-ready.",
  },
];

export default function WhyChooseUs() {
  return (
    <SectionWrapper>
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#b9ff66]">
            Why choose FitFusion
          </p>
          <h2 className="section-title">
            Built for people who want structure, not confusion
          </h2>
          <p className="mt-6 text-base leading-8 text-white/70">
            The goal is simple: make fitness planning feel smart, clean,
            supportive, and actually usable for beginners.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-card rounded-[1.75rem] p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-white/5 p-3 text-[#b9ff66]">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}