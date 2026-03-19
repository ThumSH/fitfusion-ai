"use client";

import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useMemo } from "react";
import * as THREE from "three";

export default function HumanModel() {
  const obj = useLoader(OBJLoader, "/models/human-body.obj");

  const cloned = useMemo(() => {
    const scene = obj.clone();

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        child.material = new THREE.MeshStandardMaterial({
          color: "#2c2c2c",
          roughness: 0.45,
          metalness: 0.5,
          envMapIntensity: 1.2,
        });
      }
    });

    return scene;
  }, [obj]);

  return (
    <primitive
      object={cloned}
      scale={0.14}
      position={[0, -1.3, 0]}
      rotation={[0, 0, 0]}
    />
  );
}
