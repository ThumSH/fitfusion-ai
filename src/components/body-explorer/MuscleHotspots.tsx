/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRef, useMemo, useCallback, useEffect, createContext, useContext, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MuscleGroupId } from "./ideal";

/* ─── Types ─── */
type MuscleHotspotsProps = {
  selected: MuscleGroupId | null;
  onHover: (group: MuscleGroupId | null) => void;
  onSelect: (group: MuscleGroupId) => void;
};

type HotspotDef = {
  id: MuscleGroupId;
  position: [number, number, number];
  scale: [number, number, number];
};

/* ─── Hotspot definitions ─── */
const hotspots: HotspotDef[] = [
  { id: "chest",     position: [0, 0.72, 0.28],    scale: [0.44, 0.38, 0.12] },
  { id: "shoulders", position: [0, 1.02, 0.15],    scale: [1.1, 0.22, 0.18] },
  { id: "arms",      position: [0.62, 0.55, 0.1],  scale: [0.2, 0.85, 0.15] },
  { id: "abs",       position: [0, 0.38, 0.24],    scale: [0.5, 0.42, 0.12] },
  { id: "legs",      position: [0, -0.95, 0.12],   scale: [0.7, 1.5, 0.2] },
  { id: "back",      position: [0, 0.72, -0.22],   scale: [0.75, 0.75, 0.12] },
];

/* Shared hover ref via context — sprites read this in useFrame, zero React re-renders */
const HoverContext = createContext<React.RefObject<MuscleGroupId | null>>({ current: null });

/* ─── Touch detection ─── */
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  }, []);
  return isTouch;
}

/* ─── Reticle texture ─── */
function createReticleTexture(active: boolean): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const cy = size / 2;
  ctx.clearRect(0, 0, size, size);

  const baseColor = active ? "#b9ff66" : "rgba(255,255,255,0.7)";
  const glowColor = active ? "rgba(185,255,102,0.25)" : "rgba(255,255,255,0.06)";

  if (active) {
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(185,255,102,0.12)";
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  ctx.lineWidth = active ? 2.5 : 1.5;
  ctx.strokeStyle = baseColor;
  const ringRadius = 42;
  const arcLength = Math.PI * 0.35;
  for (let i = 0; i < 4; i++) {
    const startAngle = (i * Math.PI) / 2 + Math.PI / 8;
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, startAngle, startAngle + arcLength);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.strokeStyle = active ? "rgba(185,255,102,0.5)" : "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const tickInner = 28;
  const tickOuter = 38;
  ctx.strokeStyle = baseColor;
  ctx.lineWidth = active ? 2 : 1.2;
  ctx.beginPath(); ctx.moveTo(cx, cy - tickInner); ctx.lineTo(cx, cy - tickOuter); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy + tickInner); ctx.lineTo(cx, cy + tickOuter); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - tickInner, cy); ctx.lineTo(cx - tickOuter, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + tickInner, cy); ctx.lineTo(cx + tickOuter, cy); ctx.stroke();

  const d = active ? 6 : 4;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = baseColor;
  ctx.fillRect(-d / 2, -d / 2, d, d);
  ctx.restore();

  if (active) {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
    grad.addColorStop(0, "rgba(185,255,102,0.35)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 55);
  bgGrad.addColorStop(0, glowColor);
  bgGrad.addColorStop(1, "transparent");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ─── Sprite visual ─── */
const LERP_EPSILON = 0.005;

function ReticleSprite({
  id,
  position,
  selected,
  activeTexture,
  inactiveTexture,
}: {
  id: MuscleGroupId;
  position: [number, number, number];
  selected: MuscleGroupId | null;
  activeTexture: THREE.CanvasTexture;
  inactiveTexture: THREE.CanvasTexture;
}) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const materialRef = useRef<THREE.SpriteMaterial>(null);
  const wasActiveRef = useRef(false);
  const isSettledRef = useRef(true);
  const hoverRef = useContext(HoverContext);

  useFrame((_, delta) => {
    if (!spriteRef.current || !materialRef.current) return;

    const isActive = selected === id || hoverRef.current === id;

    // Texture swap — only on state change
    if (isActive !== wasActiveRef.current) {
      materialRef.current.map = isActive ? activeTexture : inactiveTexture;
      materialRef.current.needsUpdate = true;
      wasActiveRef.current = isActive;
      isSettledRef.current = false; // kick animation
    }

    // Skip lerp math entirely once settled
    if (isSettledRef.current) return;

    const t = 1 - Math.exp(-8 * delta);
    const targetScale = isActive ? 0.32 : 0.22;
    const targetOpacity = isActive ? 1 : 0.5;

    const s = spriteRef.current.scale;
    s.x = THREE.MathUtils.lerp(s.x, targetScale, t);
    s.y = THREE.MathUtils.lerp(s.y, targetScale, t);
    materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, t);

    // Check if animation is done
    if (
      Math.abs(s.x - targetScale) < LERP_EPSILON &&
      Math.abs(materialRef.current.opacity - targetOpacity) < LERP_EPSILON
    ) {
      s.x = targetScale;
      s.y = targetScale;
      materialRef.current.opacity = targetOpacity;
      isSettledRef.current = true;
    }
  });

  return (
    <sprite ref={spriteRef} position={position} scale={[0.22, 0.22, 1]}>
      <spriteMaterial
        ref={materialRef}
        map={inactiveTexture}
        transparent
        opacity={0.5}
        depthTest={false}
        depthWrite={false}
      />
    </sprite>
  );
}

/* ─── Desktop: hover raycasting (disabled on touch) ─── */
function DesktopHoverRaycaster({
  hitboxes,
  internalHoverRef,
  onHover,
}: {
  hitboxes: THREE.Mesh[];
  internalHoverRef: React.RefObject<MuscleGroupId | null>;
  onHover: (group: MuscleGroupId | null) => void;
}) {
  const { camera, raycaster, pointer } = useThree();
  const committedToReactRef = useRef<MuscleGroupId | null>(null);
  const currentCursorRef = useRef("default");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTargetRef = useRef<MuscleGroupId | null>(null);
  const frameCountRef = useRef(0);

  const clearPending = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    pendingTargetRef.current = null;
  }, []);

  const notifyReact = useCallback(
    (id: MuscleGroupId | null) => {
      if (committedToReactRef.current === id) return;
      committedToReactRef.current = id;
      onHover(id);
    },
    [onHover]
  );

  useFrame(() => {
    // Raycast every 3rd frame on desktop — 20 raycasts/sec at 60fps is plenty
    frameCountRef.current++;
    if (frameCountRef.current % 3 !== 0) return;

    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(hitboxes, false);

    const closestId: MuscleGroupId | null =
      intersections.length > 0
        ? (intersections[0].object.userData.muscleId as MuscleGroupId)
        : null;

    internalHoverRef.current = closestId;

    const nextCursor = closestId ? "pointer" : "default";
    if (currentCursorRef.current !== nextCursor) {
      document.body.style.cursor = nextCursor;
      currentCursorRef.current = nextCursor;
    }

    if (closestId === committedToReactRef.current) {
      clearPending();
      return;
    }

    if (closestId === null) {
      clearPending();
      notifyReact(null);
      return;
    }

    if (committedToReactRef.current === null) {
      clearPending();
      notifyReact(closestId);
      return;
    }

    if (pendingTargetRef.current === closestId) return;

    clearPending();
    pendingTargetRef.current = closestId;
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      pendingTargetRef.current = null;
      notifyReact(closestId);
    }, 50);
  });

  useEffect(() => {
    return () => clearPending();
  }, [clearPending]);

  return null;
}

/* ─── Main component ─── */
export default function MuscleHotspots({ selected, onHover, onSelect }: MuscleHotspotsProps) {
  const isTouch = useIsTouchDevice();

  const activeTexture = useMemo(() => createReticleTexture(true), []);
  const inactiveTexture = useMemo(() => createReticleTexture(false), []);

  const internalHoverRef = useRef<MuscleGroupId | null>(null);

  const hitboxes = useMemo(() => {
    return hotspots.map((h) => {
      const geo = new THREE.BoxGeometry(1, 1, 1);
      const mat = new THREE.MeshBasicMaterial({ visible: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...h.position);
      mesh.scale.set(...h.scale);
      mesh.updateMatrixWorld(true);
      mesh.userData.muscleId = h.id;
      return mesh;
    });
  }, []);

  // On mobile: direct tap handler per hitbox
  const handleTap = useCallback(
    (id: MuscleGroupId) => {
      onSelect(id);
    },
    [onSelect]
  );

  // On desktop: click reads from hover ref
  const handleDesktopClick = useCallback(() => {
    if (internalHoverRef.current) {
      onSelect(internalHoverRef.current);
    }
  }, [onSelect]);

  return (
    <HoverContext.Provider value={internalHoverRef}>
      <group>
        {/* Desktop only: continuous hover raycasting */}
        {!isTouch && (
          <DesktopHoverRaycaster
            hitboxes={hitboxes}
            internalHoverRef={internalHoverRef}
            onHover={onHover}
          />
        )}

        {/* Hitboxes — different behavior per platform */}
        {hotspots.map((h, i) => (
          <mesh
            key={`hitbox-${h.id}-${i}`}
            position={h.position}
            scale={h.scale}
            onClick={(e) => {
              e.stopPropagation();
              if (isTouch) {
                handleTap(h.id);
              } else {
                handleDesktopClick();
              }
            }}
            // Desktop hover via raycaster, not mesh events
            visible={false}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        ))}

        {/* Visual reticles */}
        {hotspots.map((h, i) => (
          <ReticleSprite
            key={`reticle-${h.id}-${i}`}
            id={h.id}
            position={h.position}
            selected={selected}
            activeTexture={activeTexture}
            inactiveTexture={inactiveTexture}
          />
        ))}
      </group>
    </HoverContext.Provider>
  );
}