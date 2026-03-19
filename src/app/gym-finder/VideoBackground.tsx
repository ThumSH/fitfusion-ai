"use client";

import { motion } from "framer-motion";

export default function VideoBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      {/* Video Layer — clearly visible */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-55"
      >
        <source src="/find.webm" type="video/webm" />
      </video>

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
        className="absolute inset-0 z-20"
        animate={{ opacity: [0.015, 0.04, 0.015] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 20% 50%, #b9ff66 0%, transparent 40%)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 z-30 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}