/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { muscleData } from "./Data";
import type { MuscleGroupId, SubMuscle } from "./ideal";

type MuscleInfoPanelProps = {
  selected: MuscleGroupId | null;
};

export default function MuscleInfoPanel({ selected }: MuscleInfoPanelProps) {
  const [activeSubMuscle, setActiveSubMuscle] = useState<SubMuscle | null>(null);

  useEffect(() => {
    setActiveSubMuscle(null);
  }, [selected]);

  if (!selected) {
    return (
      <div className="glass-card rounded-4xl p-6 text-white/70">
        <h3 className="text-xl font-semibold text-white">Muscle Explorer</h3>
        <p className="mt-3 text-sm leading-7">
          Select a muscle region on the 3D model to reveal its anatomical blueprint and training data.
        </p>
      </div>
    );
  }

  const group = muscleData[selected];

  return (
    <div className="glass-card relative flex flex-col overflow-hidden rounded-4xl p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex h-full flex-col"
        >
          {/* Header */}
          <div className="mb-5 border-b border-white/10 pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">{group.label} Anatomy</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{group.description}</p>
          </div>

          {/* Anatomy Image — clean, no overlay nodes */}
          <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-[#090909] shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
            <p className="absolute left-4 top-3 z-20 text-xs font-semibold uppercase tracking-wider text-white/40">
              Structural Map
            </p>

            <motion.img
              key={`img-${selected}`}
              src={group.imageUrl}
              alt={`${group.label} anatomy`}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-contain p-3 drop-shadow-[0_0_15px_rgba(185,255,102,0.08)]"
            />
          </div>

          {/* Sub-Muscle List — replaces inaccurate overlay nodes */}
          <div className="mb-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Muscle Regions
            </p>
            <div className="space-y-1.5">
              {group.subMuscles.map((sub, index) => {
                const isActive = activeSubMuscle?.name === sub.name;

                return (
                  <motion.div
                    key={`${selected}-sub-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + index * 0.06,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className={`group cursor-pointer rounded-lg border px-3.5 py-2.5 transition-all duration-250 ${
                      isActive
                        ? "border-primary/30 bg-primary/8"
                        : "border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/4"
                    }`}
                    onMouseEnter={() => setActiveSubMuscle(sub)}
                    onMouseLeave={() => setActiveSubMuscle(null)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Index pip */}
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold tracking-wide transition-colors duration-250 ${
                          isActive
                            ? "bg-primary/25 text-primary"
                            : "bg-white/8 text-white/35 group-hover:text-white/50"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <span
                        className={`text-xs font-medium transition-colors duration-250 ${
                          isActive ? "text-primary" : "text-white/70 group-hover:text-white/85"
                        }`}
                      >
                        {sub.name}
                      </span>

                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          layoutId="active-muscle-dot"
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(185,255,102,0.5)]"
                        />
                      )}
                    </div>

                    {/* Expanded description */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden pl-8 text-[11px] leading-[1.6] text-white/55"
                        >
                          {sub.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Workouts & Tips grid — unchanged */}
          <div className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Workouts</h4>
              <ul className="mt-3 space-y-2 text-xs text-white/70">
                {group.workouts.map((workout) => (
                  <li key={workout} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" /> {workout}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">Pro Tips</h4>
              <ul className="mt-3 space-y-2 text-xs text-white/70">
                {group.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-left">
                    <span className="mt-1 text-primary">{">"}</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}