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

export default function CameraRig({ selected, controlsRef }: CameraRigProps) {
  const { camera } = useThree();

  // Match these to the new zoomed-out coordinates in BodyCanvas
  const desiredPosition = useRef(new THREE.Vector3(0, 1.0, 4.5));
  const desiredTarget = useRef(new THREE.Vector3(0, 0.5, 0));

  useEffect(() => {
    if (!selected) {
      // Zoom out to see the whole body when nothing is selected
      desiredPosition.current.set(0, 1.0, 4.5);
      desiredTarget.current.set(0, 0.5, 0);
      return;
    }

    const data = muscleData[selected];
    desiredPosition.current.set(...data.cameraPosition);
    desiredTarget.current.set(...data.cameraTarget);
  }, [selected]);

  useFrame((state, delta) => {
    // Increased to 0.65 for a slower, smoother, bug-free transition
    easing.damp3(state.camera.position, desiredPosition.current, 0.65, delta);

    if (controlsRef.current) {
      easing.damp3(controlsRef.current.target, desiredTarget.current, 0.65, delta);
      controlsRef.current.update();
    }
  });

  return null;
}