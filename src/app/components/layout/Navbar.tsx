// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-black/50 backdrop-blur-lg border-b border-white/10"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <Activity className="w-8 h-8 text-[#ccff00] group-hover:scale-110 transition-transform" />
        <span className="text-2xl font-black tracking-tighter text-white">
          FIT<span className="text-[#ccff00]">FUSION</span>
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link href="#workouts" className="hover:text-white transition-colors">
          Workouts
        </Link>
        <Link href="#ai-meal-prep" className="hover:text-white transition-colors">
          AI Meal Prep
        </Link>
        <Link href="#culture" className="hover:text-white transition-colors">
          Gym Culture
        </Link>
      </nav>

      <button className="px-6 py-2.5 text-sm font-bold text-black bg-[#ccff00] rounded-full hover:bg-[#b3e600] transition-colors shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:shadow-[0_0_25px_rgba(204,255,0,0.5)]">
        Join Now
      </button>
    </motion.header>
  );
}