/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { muscleData } from "./Data";
import type { MuscleGroupId, SubMuscle } from "./ideal";

type MuscleInfoPanelProps = {
  selected: MuscleGroupId | null;
};

// --- Framer Motion Variants ---
const mapContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3, // Waits slightly longer so the image can load first
      staggerChildren: 0.12, // Slightly faster staggered pop-ins
    },
  },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
};

export default function MuscleInfoPanel({ selected }: MuscleInfoPanelProps) {
  const [activeSubMuscle, setActiveSubMuscle] = useState<SubMuscle | null>(null);

  useEffect(() => {
    setActiveSubMuscle(null);
  }, [selected]);

  if (!selected) {
    return (
      <div className="glass-card rounded-[2rem] p-6 text-white/70">
        <h3 className="text-xl font-semibold text-white">Muscle Explorer</h3>
        <p className="mt-3 text-sm leading-7">
          Select a muscle region on the 3D model to reveal its anatomical blueprint and training data.
        </p>
      </div>
    );
  }

  const group = muscleData[selected];

  return (
    <div className="glass-card relative flex flex-col overflow-hidden rounded-[2rem] p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex h-full flex-col"
        >
          {/* Header Section */}
          <div className="mb-6 border-b border-white/10 pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-[#b9ff66]">
              {group.label} Anatomy
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              {group.description}
            </p>
          </div>

          {/* THE SMART BLUEPRINT MAP */}
          <div className="relative mb-6 h-56 w-full overflow-hidden rounded-xl border border-white/10 bg-[#0b0f19] p-4 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
            
            <p className="absolute left-4 top-3 z-20 text-xs font-semibold uppercase tracking-wider text-white/40">
              Structural Map
            </p>

            {/* UPGRADED: High-Tech Image Reveal */}
            <motion.img
              key={`img-${selected}`}
              src={group.imageUrl}
              alt={`${group.label} Anatomy`}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              // Removed opacity-80, added a subtle glowing drop-shadow
              className="absolute inset-0 h-full w-full object-contain p-2 drop-shadow-[0_0_15px_rgba(185,255,102,0.08)]"
            />

            {/* The Nodes */}
            <motion.div
              variants={mapContainerVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 z-10"
            >
              {group.subMuscles?.map((sub, index) => {
                const isActive = activeSubMuscle?.name === sub.name;

                return (
                  <motion.div
                    key={`${selected}-${index}`}
                    variants={nodeVariants}
                    className="group absolute flex cursor-pointer flex-col items-center justify-center"
                    style={{
                      top: `${sub.y}%`,
                      left: `${sub.x}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseEnter={() => setActiveSubMuscle(sub)}
                    onMouseLeave={() => setActiveSubMuscle(null)}
                  >
                    {/* Node Dot */}
                    <div className="relative flex h-6 w-6 items-center justify-center transition-transform duration-300 group-hover:scale-125">
                      <div className={`absolute h-full w-full rounded-full transition-all duration-300 ${isActive ? "scale-150 animate-pulse bg-[#b9ff66]/40" : "bg-white/10"}`} />
                      <div className={`z-10 h-2.5 w-2.5 rounded-full transition-colors duration-300 ${isActive ? "bg-[#b9ff66] shadow-[0_0_12px_#b9ff66]" : "bg-white/70 group-hover:bg-white"}`} />
                    </div>

                    {/* UPGRADED: Protected Text Label */}
                    <span 
                      className={`absolute top-7 w-max rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur-sm transition-colors duration-300 ${
                        isActive ? "text-[#b9ff66] border border-[#b9ff66]/30" : "text-white/60 border border-transparent group-hover:text-white"
                      }`}
                    >
                      {sub.name.split(" ").slice(0, 2).join(" ")}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* DYNAMIC SUB-MUSCLE INFO DISPLAY */}
          <div className="min-h-[100px] rounded-xl bg-white/5 p-4 transition-colors">
            <AnimatePresence mode="wait">
              {activeSubMuscle ? (
                <motion.div
                  key={activeSubMuscle.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="text-sm font-semibold text-[#b9ff66]">
                    {activeSubMuscle.name}
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-white/80">
                    {activeSubMuscle.description}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full items-center justify-center text-center"
                >
                  <p className="text-xs italic text-white/40">
                    Hover over a node on the map above to view specific muscle details.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Workouts and Tips */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Workouts
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-white/70">
                {group.workouts.map((workout) => (
                  <li key={workout} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#b9ff66]" /> {workout}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Pro Tips
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-white/70">
                {group.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-left">
                    <span className="mt-1 text-[#b9ff66]">▹</span> {tip}
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