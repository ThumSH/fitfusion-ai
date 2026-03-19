"use client";

import { Html } from "@react-three/drei";
import type { MuscleGroupId } from "./ideal";

type MuscleHotspotsProps = {
  selected: MuscleGroupId | null;
  hovered: MuscleGroupId | null;
  onHover: (group: MuscleGroupId | null) => void;
  onSelect: (group: MuscleGroupId) => void;
};

type HotspotConfig = {
  id: MuscleGroupId;
  position: [number, number, number];
  scale: [number, number, number];
};

const hotspots: HotspotConfig[] = [
  { id: "chest", position: [0, 0.7, 0.25], scale: [0.5, 0.55, 0.25] },
  { id: "shoulders", position: [0, 1, 0.15], scale: [1.12, 0.3, 0.35] },
  { id: "arms", position: [0.62, 0.55, 0.1], scale: [0.2, 0.9, 0.22] },
  { id: "arms", position: [-0.62, 0.55, 0.1], scale: [0.2, 0.9, 0.22] },
  { id: "abs", position: [0, 0.45, 0.22], scale: [0.62, 0.6, 0.28] },
  { id: "legs", position: [0, -0.95, 0.12], scale: [0.7, 1.55, 0.32] },
  { id: "back", position: [0, 0.7, -0.2], scale: [0.8, 0.8, 0.25] },
];

function HotspotBox({
  id,
  position,
  scale,
  selected,
  hovered,
  onHover,
  onSelect,
}: HotspotConfig & MuscleHotspotsProps) {
  const isActive = selected === id || hovered === id;

  return (
    <group position={position}>
      {/* Invisible hitbox for reliable pointer events */}
      <mesh
        scale={scale}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* HTML Overlay - Pointer events disabled here to fix click bugs! */}
      <Html center distanceFactor={4} zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
        <div
          className={`relative flex h-6 w-6 items-center justify-center transition-all duration-500 ease-out ${
            isActive ? "scale-125 opacity-100" : "scale-100 opacity-50"
          }`}
        >
          {/* High-tech Crosshair Structure */}
          <div className={`absolute h-[2px] w-full transition-colors duration-300 ${isActive ? "bg-[#b9ff66] shadow-[0_0_12px_#b9ff66]" : "bg-white"}`} />
          <div className={`absolute h-full w-[2px] transition-colors duration-300 ${isActive ? "bg-[#b9ff66] shadow-[0_0_12px_#b9ff66]" : "bg-white"}`} />
          
          {/* Diamond center */}
          <div className={`absolute h-2 w-2 rotate-45 transition-colors duration-300 ${isActive ? "bg-[#b9ff66]" : "bg-transparent"}`} />
        </div>
      </Html>
    </group>
  );
}

export default function MuscleHotspots(props: MuscleHotspotsProps) {
  return (
    <>
      {hotspots.map((hotspot, index) => (
        <HotspotBox
          key={`${hotspot.id}-${index}`}
          {...hotspot}
          selected={props.selected}
          hovered={props.hovered}
          onHover={props.onHover}
          onSelect={props.onSelect}
        />
      ))}
    </>
  );
}