"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ScanSearch, Sparkles, UtensilsCrossed } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Workout Planner",
    description:
      "Generate a safer monthly workout roadmap using body stats, goals, experience, and available equipment.",
    accent: "from-[#b9ff66]/20 to-transparent",
    badge: "Personalized",
  },
  {
    icon: ScanSearch,
    title: "Meal Analyzer",
    description:
      "Upload meal images and get estimated calories, likely ingredients, and practical nutrition guidance.",
    accent: "from-sky-400/20 to-transparent",
    badge: "Image AI",
  },
  {
    icon: UtensilsCrossed,
    title: "Meal Planner",
    description:
      "Build an easy schedule for beginners who need a structured eating rhythm without overcomplication.",
    accent: "from-violet-400/20 to-transparent",
    badge: "Beginner-first",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="relative py-24">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[#b9ff66]">
            Core Features
          </p>
          <h2 className="section-title">Three tools. One fitness flow.</h2>
          <p className="section-subtitle mt-5">
            Instead of giving users random motivation, FitFusion gives them a
            practical system: train smarter, understand food better, and stay
            consistent week by week.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-80`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-white">
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {feature.description}
                  </p>

                  <a
                    href="#"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#d8ffaf] transition group-hover:translate-x-1"
                  >
                    Coming next in Sprint B/C/D
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}