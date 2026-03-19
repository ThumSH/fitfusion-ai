"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Apple, TrendingUp, ArrowRight, Compass } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Brain,
    title: "AI Workout Generation",
    description:
      "Tell the AI your experience level and available equipment. It builds a science-backed split tailored to your body.",
    tag: "Instant",
    tagColor: "bg-white/10 text-white/50",
    featured: false,
  },
  {
    number: "02",
    icon: Apple,
    title: "Smart Meal Analysis",
    description:
      "Upload meal details and get macro calculations plus beginner-friendly prep schedules aligned to your caloric goals.",
    tag: "Precision",
    tagColor: "bg-white/10 text-white/50",
    featured: false,
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Execute, Track, Improve",
    description:
      "Follow your personalized routine, monitor consistency, and let FitFusion refine your approach as your strength and endurance evolve.",
    tag: "Progress",
    tagColor: "bg-white/10 text-white/50",
    featured: false,
  },
  {
    number: "04",
    icon: Compass,
    title: "Stay Guided Anywhere",
    description:
      "From home workouts to gym sessions, FitFusion keeps your training, nutrition, and planning aligned so you never lose momentum.",
    tag: "Support",
    tagColor: "bg-[#b9ff66]/15 text-[#b9ff66]",
    featured: true,
  },
];

function Barbell() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-48 h-48 rounded-full bg-[#b9ff66]/10 blur-[60px]" />

      <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }} className="relative z-10">
        <svg width="260" height="88" viewBox="0 0 260 88" fill="none">
          <path d="M48 44 L78 44 L98 28 L130 58 L162 28 L182 44 L212 44" stroke="#313131" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="18" y="12" width="14" height="64" rx="5" fill="#151515" stroke="#b9ff66" strokeWidth="1.5" />
          <rect x="4" y="22" width="11" height="44" rx="3" fill="#232323" stroke="#363636" strokeWidth="1" />
          <rect x="228" y="12" width="14" height="64" rx="5" fill="#151515" stroke="#b9ff66" strokeWidth="1.5" />
          <rect x="245" y="22" width="11" height="44" rx="3" fill="#232323" stroke="#363636" strokeWidth="1" />
        </svg>

        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          {[4, 3, 2].map((h, i) => (
            <motion.div
              key={i}
              className="w-[2px] rounded-full bg-[#b9ff66]"
              style={{ height: h * 4 }}
              animate={{ opacity: [0.6, 0.15, 0.6] }}
              transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute w-40 h-40 rounded-full border border-[#b9ff66]/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#b9ff66]/60" />
      </motion.div>
    </div>
  );
}

function StepCard({ step, index, active }: { step: typeof STEPS[0]; index: number; active: boolean }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col gap-6 p-8 rounded-[30px] border transition-all duration-500 cursor-default overflow-hidden ${
        step.featured
          ? "bg-[#b9ff66]/8 border-[#b9ff66]/25 hover:border-[#b9ff66]/50"
          : "bg-white/[0.03] border-white/8 hover:border-[#b9ff66]/30 hover:bg-white/[0.06]"
      }`}
    >
      <span className="absolute top-5 right-6 text-8xl font-black italic text-white/[0.04] select-none leading-none pointer-events-none">{step.number}</span>

      <div className="flex items-start justify-between">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            step.featured ? "bg-[#b9ff66]/15 group-hover:bg-[#b9ff66]/25" : "bg-white/[0.06] group-hover:bg-[#b9ff66]/12"
          }`}
        >
          <Icon size={22} className="text-[#b9ff66]" />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.22em] px-3 py-1.5 rounded-full border border-white/10 ${step.tagColor}`}>{step.tag}</span>
      </div>

      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Step {step.number}</p>
        <h3 className="text-2xl md:text-[28px] font-black italic uppercase text-white leading-tight tracking-tight">{step.title}</h3>
      </div>

      <p className="text-base text-white/58 leading-relaxed font-medium">{step.description}</p>

      <motion.div
        className="absolute bottom-0 left-8 right-8 h-[1.5px] rounded-full bg-[#b9ff66]"
        initial={{ scaleX: 0 }}
        animate={active ? { scaleX: 1 } : {}}
        transition={{ delay: 0.6 + index * 0.15, duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
}

export default function UsageShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="w-full py-28 relative overflow-hidden bg-black">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#b9ff66]/4 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-5"
        >
          <div className="flex items-center gap-2 bg-[#b9ff66]/10 border border-[#b9ff66]/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b9ff66] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b9ff66]">How It Works</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9] text-white">
            Master Your{" "}
            <span className="relative inline-block">
              <span className="text-[#b9ff66]">Routine.</span>
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] bg-[#b9ff66] rounded-full"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/55 font-medium leading-relaxed max-w-3xl">
            FitFusion is your all-in-one AI fitness system. We help you generate personalized workouts, build practical meal plans, analyze nutrition from meals, and stay consistent whether you train at home or at the gym.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8 items-start">
          <div className="flex flex-col gap-5">
            {STEPS.slice(0, 2).map((step, i) => (
              <div key={step.number} className="flex flex-col gap-4">
                <StepCard step={step} index={i} active={isInView} />
                {i < 1 && (
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex-1 h-px bg-white/8" />
                    <ArrowRight size={12} className="text-white/15" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center lg:py-10 lg:px-4 min-h-[200px]"
          >
            <Barbell />
          </motion.div>

          <div className="flex flex-col gap-5">
            {STEPS.slice(2, 4).map((step, i) => (
              <div key={step.number} className="flex flex-col gap-4">
                <StepCard step={step} index={i + 2} active={isInView} />
                {i < 1 && (
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex-1 h-px bg-white/8" />
                    <ArrowRight size={12} className="text-white/15" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.55 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { val: "4", label: "Complete AI Steps" },
            { val: "Workout + Meal", label: "Unified Planning" },
            { val: "Home To Gym", label: "Adaptive Guidance" },
          ].map((m) => (
            <div key={m.label} className="flex flex-col items-center text-center gap-1 py-5 rounded-2xl bg-white/[0.03] border border-white/8">
              <span className="text-2xl font-black italic text-[#b9ff66] tracking-tighter">{m.val}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/35">{m.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 py-7 px-8 rounded-[28px] bg-white/[0.03] border border-white/8"
        >
          <p className="text-base font-bold italic text-white/50 text-center sm:text-left max-w-md">
            Join <span className="text-white/80">50,000+ users</span> using FitFusion to train smarter, eat better, and stay consistent with AI support.
          </p>
          <button className="shrink-0 bg-[#b9ff66] text-black font-black uppercase italic tracking-widest text-sm px-8 py-4 rounded-2xl hover:shadow-[0_0_30px_-5px_rgba(185,255,102,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
            Build My Plan
          </button>
        </motion.div>
      </div>
    </section>
  );
}
