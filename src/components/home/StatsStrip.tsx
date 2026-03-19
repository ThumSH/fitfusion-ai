"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Activity, Flame, Trophy, ArrowUpRight } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  rawValue: number;
  suffix: string;
  display: string;
  label: string;
  sublabel: string;
  change: string;
}

function useCountUp(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);

  return count;
}

function formatCount(n: number, suffix: string, display: string) {
  if (suffix === "%" ) return `${n}%`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
  return display;
}

function StatCard({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const count = useCountUp(stat.rawValue, 1800 + index * 100, active);
  const displayVal = formatCount(count, stat.suffix, stat.display);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center text-center px-4 py-2"
    >
      {/* Divider (all except first) */}
      {index > 0 && (
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-14 w-px bg-white/10" />
      )}

      {/* Icon pill */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 group-hover:border-primary/30">
          {stat.icon}
        </div>
        {/* Glow dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_2px_rgba(185,255,102,0.6)] animate-pulse" />
      </div>

      {/* Counter */}
      <div className="relative">
        <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white leading-none tabular-nums">
          {displayVal}
        </h3>
        {/* Subtle underline accent */}
        <motion.div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={active ? { width: "60%" } : {}}
          transition={{ delay: 0.8 + index * 0.12, duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Label */}
      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.22em] text-white/50 group-hover:text-white/70 transition-colors">
        {stat.label}
      </p>

      {/* Sub-label with change badge */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-white/25">{stat.sublabel}</span>
        <span className="flex items-center gap-0.5 bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 text-[9px] font-black text-primary uppercase tracking-wider">
          <ArrowUpRight size={9} />
          {stat.change}
        </span>
      </div>
    </motion.div>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats: Stat[] = [
    {
      icon: <Users className="text-primary" size={22} />,
      rawValue: 50000,
      suffix: "+",
      display: "50K+",
      label: "Active Lifters",
      sublabel: "Worldwide community",
      change: "+12% mo",
    },
    {
      icon: <Activity className="text-primary" size={22} />,
      rawValue: 1200000,
      suffix: "M",
      display: "1.2M",
      label: "Workouts Generated",
      sublabel: "AI-personalised plans",
      change: "+8% wk",
    },
    {
      icon: <Flame className="text-primary" size={22} />,
      rawValue: 850000,
      suffix: "K",
      display: "850K",
      label: "Meals Analyzed",
      sublabel: "Nutrition insights",
      change: "+5% wk",
    },
    {
      icon: <Trophy className="text-primary" size={22} />,
      rawValue: 99,
      suffix: "%",
      display: "99%",
      label: "Goal Completion",
      sublabel: "Avg. user satisfaction",
      change: "All time",
    },
  ];

  return (
    <section ref={ref} className="w-full relative py-20 overflow-hidden">
      {/* Background strip */}
      <div className="absolute inset-0 bg-white/2.5 border-y border-white/10 backdrop-blur-md z-0" />

      {/* Ambient orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-primary/6 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-primary/6 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Scanline texture overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <div className="h-px w-12 bg-white/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25">
            Platform Milestones
          </span>
          <div className="h-px w-12 bg-white/10" />
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-4">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} active={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
