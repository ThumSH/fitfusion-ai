/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { easing } from "maath";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { muscleData } from "./Data";
import type { MuscleGroupId } from "./ideal";

type CameraRigProps = {
  selected: MuscleGroupId | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
};

const EPSILON = 0.002; // Stop damping when within this distance

export default function CameraRig({ selected, controlsRef }: CameraRigProps) {
  const { camera } = useThree();

  const desiredPosition = useRef(new THREE.Vector3(0, 1.0, 4.5));
  const desiredTarget = useRef(new THREE.Vector3(0, 0.5, 0));
  const isSettled = useRef(true);

  useEffect(() => {
    if (!selected) {
      desiredPosition.current.set(0, 1.0, 4.5);
      desiredTarget.current.set(0, 0.5, 0);
    } else {
      const data = muscleData[selected];
      desiredPosition.current.set(...data.cameraPosition);
      desiredTarget.current.set(...data.cameraTarget);
    }
    // Kick out of settled state so the animation runs
    isSettled.current = false;
  }, [selected]);

  useFrame((state, delta) => {
    // Once settled, skip all work — no micro-adjustments, no OrbitControls fighting
    if (isSettled.current) return;

    easing.damp3(state.camera.position, desiredPosition.current, 0.65, delta);

    if (controlsRef.current) {
      easing.damp3(controlsRef.current.target, desiredTarget.current, 0.65, delta);
      controlsRef.current.update();
    }

    // Check if we've arrived
    const posDist = state.camera.position.distanceTo(desiredPosition.current);
    const targetDist = controlsRef.current
      ? controlsRef.current.target.distanceTo(desiredTarget.current)
      : 0;

    if (posDist < EPSILON && targetDist < EPSILON) {
      // Snap to exact target to prevent floating-point drift
      state.camera.position.copy(desiredPosition.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(desiredTarget.current);
        controlsRef.current.update();
      }
      isSettled.current = true;
    }
  });

  return null;
}