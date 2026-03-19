"use client";

import { motion } from "framer-motion";
import { Dumbbell, ShieldCheck, Sparkles, TimerReset } from "lucide-react";
import WorkoutPlanPanel from "@/components/workout/WorkoutPlanPanel";
import VideoBackground from "./VideoBackground";

export default function WorkoutPlannerPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-14 pt-28 text-white">
      <VideoBackground />
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-125 w-225 -translate-x-1/2 rounded-full bg-primary/10 blur-[170px]" />

      <div className="relative z-10 container-shell mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-10 max-w-4xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-black/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#dff8be] backdrop-blur-xl">
            <Sparkles size={13} />
            Gemini Training Engine
          </div>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(185,255,102,0.15)]">
            <Dumbbell size={28} strokeWidth={2.5} />
          </div>
          <h1
            className="mb-4 text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}
          >
            AI Workout <span className="text-primary drop-shadow-[0_0_20px_rgba(185,255,102,0.3)]">Architect</span>
          </h1>
          <p className="text-lg font-light text-white/60">
            Build a practical Gemini-powered training blueprint customized to your body stats, goal, schedule,
            and training environment.
          </p>

          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
              <div className="mb-2 inline-flex rounded-lg border border-primary/25 bg-primary/10 p-2 text-primary">
                <ShieldCheck size={16} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Experience-Aware</p>
              <p className="mt-1 text-xs text-white/60">Adjusts volume and intensity to your level.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
              <div className="mb-2 inline-flex rounded-lg border border-primary/25 bg-primary/10 p-2 text-primary">
                <TimerReset size={16} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">4-Week Progression</p>
              <p className="mt-1 text-xs text-white/60">Includes progression logic and recovery rules.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
              <div className="mb-2 inline-flex rounded-lg border border-primary/25 bg-primary/10 p-2 text-primary">
                <Dumbbell size={16} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Home + Gym Options</p>
              <p className="mt-1 text-xs text-white/60">Gives alternatives based on your environment.</p>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <WorkoutPlanPanel />
        </div>
      </div>
    </div>
  );
}
