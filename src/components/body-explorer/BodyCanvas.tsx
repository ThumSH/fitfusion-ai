"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import HumanModel from "./HumanModel";
import MuscleHotspots from "./MuscleHotspots";
import CameraRig from "./CameraRig";
import type { MuscleGroupId } from "./ideal";

type BodyCanvasProps = {
  selected: MuscleGroupId | null;
  hovered: MuscleGroupId | null;
  onHover: (group: MuscleGroupId | null) => void;
  onSelect: (group: MuscleGroupId) => void;
};

export default function BodyCanvas({
  selected,
  hovered,
  onHover,
  onSelect,
}: BodyCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <div className="relative h-[620px] w-full overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-[#080d14]"
      style={{ boxShadow: "0 0 80px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      {/* Ambient glow rings */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(185,255,102,0.04) 0%, transparent 70%)" }}
        />
      </div>

      {/* Label */}
      <div className="pointer-events-none absolute left-6 top-6 z-20">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">3D Explorer</p>
      </div>

      {/* Drag hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">Drag to rotate · Scroll to zoom</p>
      </div>

      <Canvas
        camera={{ position: [0, 1.4, 3.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting setup — dramatic rim + fill */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-4, 4, 2]} intensity={1.2} color="#c8d8ff" />
        {/* Rim light from behind */}
        <directionalLight position={[0, 2, -4]} intensity={1.6} color="#b9ff66" />
        {/* Subtle under-fill */}
        <pointLight position={[0, -1.5, 1.5]} intensity={0.4} color="#4488ff" />

        <ContactShadows
          position={[0, -1.32, 0]}
          opacity={0.45}
          scale={3}
          blur={2.5}
          far={2}
          color="#000000"
        />

        <HumanModel />

        <MuscleHotspots
          selected={selected}
          hovered={hovered}
          onHover={onHover}
          onSelect={onSelect}
        />

        <CameraRig selected={selected} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={6}
          target={[0, 1.1, 0]}
          dampingFactor={0.06}
          enableDamping
          rotateSpeed={0.6}
          zoomSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}