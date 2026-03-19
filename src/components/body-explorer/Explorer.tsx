"use client";

import { useState } from "react";
import BodyCanvas from "./BodyCanvas";
import MuscleInfoPanel from "./InfoPanel";
import type { MuscleGroupId } from "./ideal";

const groups: { id: MuscleGroupId; label: string; icon: string }[] = [
  { id: "chest",     label: "Chest",     icon: "◈" },
  { id: "shoulders", label: "Shoulders", icon: "◎" },
  { id: "arms",      label: "Arms",      icon: "⊕" },
  { id: "abs",       label: "Abs",       icon: "▣" },
  { id: "legs",      label: "Legs",      icon: "◧" },
  { id: "back",      label: "Back",      icon: "◪" },
];

const muscleAccentColor: Record<MuscleGroupId, string> = {
  chest:     "#b9ff66",
  shoulders: "#66d4ff",
  arms:      "#ff9f66",
  abs:       "#c266ff",
  legs:      "#66ffe0",
  back:      "#ff6688",
};

export default function BodyExplorerSection() {
  const [selected, setSelected] = useState<MuscleGroupId | null>("chest");
  const [hovered, setHovered]   = useState<MuscleGroupId | null>(null);

  const active = hovered || selected;
  const activeColor = active ? muscleAccentColor[active] : "#b9ff66";

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow blob */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px] transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${activeColor}18 0%, transparent 70%)` }}
      />

      <div className="container-shell relative z-10">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em]" style={{ color: activeColor }}>
            Interactive Body Explorer
          </p>
          <h2 className="section-title">
            Explore your muscles,<br />
            <span style={{ color: activeColor }} className="transition-colors duration-500">
              master your training
            </span>
          </h2>
          <p className="section-subtitle mt-4 text-white/45">
            Click any muscle region on the 3D model or use the quick-select below.
          </p>
        </div>

        {/* Quick-select pill tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {groups.map(({ id, label, icon }) => {
            const isActive = selected === id;
            const color = muscleAccentColor[id];
            return (
              <button
                key={id}
                onClick={() => setSelected(isActive ? null : id)}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  borderColor: isActive ? `${color}55` : "rgba(255,255,255,0.08)",
                  background:  isActive ? `${color}14` : "rgba(255,255,255,0.03)",
                  color:       isActive ? color : "rgba(255,255,255,0.45)",
                  boxShadow:   isActive ? `0 0 20px -4px ${color}44` : "none",
                }}
              >
                <span style={{ fontSize: 12 }}>{icon}</span>
                {label}
              </button>
            );
          })}

          {/* Reset */}
          <button
            onClick={() => setSelected(null)}
            className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/30 transition-all duration-200 hover:border-white/20 hover:text-white/60"
          >
            Reset
          </button>
        </div>

        {/* Main grid */}
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <BodyCanvas
            selected={selected}
            hovered={hovered}
            onHover={setHovered}
            onSelect={setSelected}
          />

          <MuscleInfoPanel selected={active} />
        </div>
      </div>
    </section>
  );
}