"use client";

import { motion } from "framer-motion";
import { ArrowRight, ScanSearch, Sparkles, UtensilsCrossed } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#b9ff66]/10 blur-3xl" />
      <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      <div className="absolute left-10 bottom-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="container-shell relative z-10 flex min-h-[92vh] items-center py-16">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b9ff66]/20 bg-[#b9ff66]/10 px-4 py-2 text-sm text-[#d7ffab]">
              <Sparkles size={16} />
              AI-powered fitness tools for real people
            </div>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Train with
              <span className="text-gradient"> structure</span>.
              <br />
              Eat with
              <span className="text-gradient"> intelligence</span>.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              FitFusion helps beginners and busy users build momentum with an
              AI workout planner, smart meal image analysis, and practical meal
              schedules that feel sustainable.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b9ff66] px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Explore Features
                <ArrowRight size={16} />
              </a>

              <a
                href="#why-fitfusion"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Why this stands out
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/60">
              <div>Workout plans tailored to goals</div>
              <div className="h-1 w-1 rounded-full bg-white/30" />
              <div>Image-based meal estimates</div>
              <div className="h-1 w-1 rounded-full bg-white/30" />
              <div>Beginner-friendly meal structure</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="glass-card neon-ring relative overflow-hidden rounded-[2rem] p-6 shadow-2xl shadow-black/30">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#b9ff66]/5" />

              <div className="relative space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-2xl bg-[#b9ff66]/15 p-3 text-[#b9ff66]">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Workout Planner
                      </p>
                      <p className="text-xs text-white/55">
                        Build a monthly plan from your stats and goals
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-white/70">
                    <div className="rounded-2xl bg-black/25 p-3">Goal: Lean muscle</div>
                    <div className="rounded-2xl bg-black/25 p-3">Days: 4 / week</div>
                    <div className="rounded-2xl bg-black/25 p-3">Level: Beginner</div>
                    <div className="rounded-2xl bg-black/25 p-3">Place: Home / Gym</div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-400/15 p-3 text-sky-300">
                      <ScanSearch size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Meal Analyzer
                      </p>
                      <p className="text-xs text-white/55">
                        Upload a plate and estimate calories fast
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-black/25 p-4 text-sm text-white/70">
                    AI detects likely foods, portions, calories, and practical
                    suggestions for improvement.
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-2xl bg-violet-400/15 p-3 text-violet-300">
                      <UtensilsCrossed size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Meal Planner
                      </p>
                      <p className="text-xs text-white/55">
                        Stay consistent with a simple routine
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-black/25 p-4 text-sm text-white/70">
                    <span>Breakfast · Lunch · Dinner · Snacks</span>
                    <span className="rounded-full bg-[#b9ff66] px-3 py-1 text-xs font-semibold text-black">
                      Weekly
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}