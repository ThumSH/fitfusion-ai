/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type VideoBackgroundProps = {
  className?: string;
};

export default function VideoBackground({ className = "" }: VideoBackgroundProps) {
  const [useStaticBackground, setUseStaticBackground] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const connection = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    const saveData = Boolean(connection.connection?.saveData);
    const lowMemory = typeof connection.deviceMemory === "number" && connection.deviceMemory <= 4;

    if (reduceMotion || saveData || (isMobile && lowMemory)) {
      setUseStaticBackground(true);
    }
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black ${className}`}>
      {useStaticBackground ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-55"
          style={{ backgroundImage: "url('/gym-hero.jpg')" }}
        />
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/gym-hero.jpg"
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-55"
        >
          <source src="/find.webm" type="video/webm" />
        </video>
      )}

      {/* Single balanced overlay */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Soft edge vignette only */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Subtle neon ambient pulse */}
      <motion.div
        className="absolute inset-0 z-20 hidden md:block"
        animate={{ opacity: [0.015, 0.04, 0.015] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 20% 50%, #b9ff66 0%, transparent 40%)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 z-30 hidden opacity-[0.02] mix-blend-overlay md:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
