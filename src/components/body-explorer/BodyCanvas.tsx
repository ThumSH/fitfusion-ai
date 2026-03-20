"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { memo, useRef, useMemo } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import HumanModel from "./HumanModel";
import MuscleHotspots from "./MuscleHotspots";
import CameraRig from "./CameraRig";
import type { MuscleGroupId } from "./ideal";

type BodyCanvasProps = {
  selected: MuscleGroupId | null;
  onHover: (group: MuscleGroupId | null) => void;
  onSelect: (group: MuscleGroupId) => void;
};

/* Static shadow: a simple radial gradient texture on a plane, zero per-frame cost */
function StaticShadow() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(0,0,0,0.35)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.12)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]} receiveShadow={false}>
      <planeGeometry args={[2.5, 2.5]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </mesh>
  );
}

function BodyCanvas({ selected, onHover, onSelect }: BodyCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const isLowPowerDevice = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    return typeof memory === "number" ? memory <= 4 : false;
  }, []);

  const dpr: [number, number] = isLowPowerDevice ? [1, 1.2] : [1, 1.5];

  return (
    <div
      className="relative h-155 w-full overflow-hidden rounded-[2.5rem] border border-white/6 bg-[#060606]"
      style={{ boxShadow: "0 0 80px 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(185,255,102,0.04) 0%, transparent 70%)" }}
        />
      </div>

      <div className="pointer-events-none absolute left-6 top-6 z-20">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">3D Explorer</p>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">Drag to rotate - Scroll to zoom</p>
      </div>

      <Canvas
        camera={{ position: [0, 1.4, 3.2], fov: 32 }}
        gl={{ antialias: !isLowPowerDevice, alpha: true, powerPreference: "high-performance" }}
        dpr={dpr}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 5]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-3, 3, -2]} intensity={1.4} color="#f0f0f0" />
        <directionalLight position={[0, 2, -4]} intensity={1.2} color="#b9ff66" />

        <StaticShadow />

        <HumanModel />

        <MuscleHotspots selected={selected} onHover={onHover} onSelect={onSelect} />

        <CameraRig selected={selected} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom
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

export default memo(BodyCanvas);
