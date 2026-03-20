"use client";

import { useState, useCallback, useDeferredValue } from "react";
import { MousePointerClick, Cpu, Dumbbell } from "lucide-react";
import BodyCanvas from "./BodyCanvas";
import MuscleInfoPanel from "./InfoPanel";
import SectionHeader from "../layout/SectionHeader";
import type { MuscleGroupId } from "./ideal";

const groups: { id: MuscleGroupId; label: string; icon: string }[] = [
  { id: "chest", label: "Chest", icon: "01" },
  { id: "shoulders", label: "Shoulders", icon: "02" },
  { id: "arms", label: "Arms", icon: "03" },
  { id: "abs", label: "Abs", icon: "04" },
  { id: "legs", label: "Legs", icon: "05" },
  { id: "back", label: "Back", icon: "06" },
];

const ACCENT = "#b9ff66";

export default function BodyExplorerSection() {
  const [selected, setSelected] = useState<MuscleGroupId | null>(null);
  const [hovered, setHovered] = useState<MuscleGroupId | null>(null);
  const deferredHovered = useDeferredValue(hovered);

  // Keep selected info stable while users orbit the model.
  const panelTarget = selected ?? deferredHovered;

  // Background glow reacts only to selected (clicks), not hover
  // This prevents the entire section from re-rendering on every hover
  const glowColor = selected ? ACCENT : ACCENT;

  // Stable callbacks prevent BodyCanvas from re-rendering when Explorer re-renders
  const handleHover = useCallback((id: MuscleGroupId | null) => setHovered(id), []);
  const handleSelect = useCallback((id: MuscleGroupId) => setSelected(id), []);

  return (
    <section className="w-full py-24 relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-225 w-225 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px] transition-all duration-700 z-0"
        style={{ background: `radial-gradient(circle, ${glowColor}18 0%, transparent 70%)` }}
      />

      <div className="relative z-10">
        <SectionHeader
          title="The Anatomy"
          highlightWord="Engine"
          description="A fully interactive, AI-driven mapping of the human muscular system. Stop guessing what to train and start targeting your goals with precision."
        />

        <div className="max-w-4xl mx-auto mt-2 mb-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <MousePointerClick className="text-primary" size={24} />
            </div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">1. Isolate And Select</h4>
            <p className="text-white/60 text-xs leading-relaxed">Rotate the 3D model and select any major muscle group to start a focused breakdown.</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Cpu className="text-primary" size={24} />
            </div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">2. AI Analysis</h4>
            <p className="text-white/60 text-xs leading-relaxed">The engine explains how each sub-muscle connects and functions in movement.</p>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Dumbbell className="text-primary" size={24} />
            </div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-1">3. Execute</h4>
            <p className="text-white/60 text-xs leading-relaxed">Unlock targeted workouts and training cues optimized for that exact region.</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {groups.map(({ id, label, icon }) => {
            const isActive = selected === id;
            return (
              <button
                key={id}
                onClick={() => setSelected(isActive ? null : id)}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  borderColor: isActive ? `${ACCENT}55` : "rgba(255,255,255,0.08)",
                  background: isActive ? `${ACCENT}14` : "rgba(255,255,255,0.03)",
                  color: isActive ? ACCENT : "rgba(255,255,255,0.45)",
                  boxShadow: isActive ? `0 0 20px -4px ${ACCENT}44` : "none",
                }}
              >
                <span style={{ fontSize: 12 }}>{icon}</span>
                {label}
              </button>
            );
          })}

          <button
            onClick={() => setSelected(null)}
            className="rounded-full border border-white/8 bg-white/3 px-4 py-2 text-sm font-medium text-white/30 transition-all duration-200 hover:border-white/20 hover:text-white/60 hover:scale-105"
          >
            Reset
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-start">
          <div className="w-full drop-shadow-2xl">
            <BodyCanvas
              selected={selected}
              onHover={handleHover}
              onSelect={handleSelect}
            />
          </div>
          <div className="w-full h-full">
            <MuscleInfoPanel selected={panelTarget} />
          </div>
        </div>
      </div>
    </section>
  );
}
