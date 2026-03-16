"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Workout Planner", href: "#features" },
  { label: "Meal Analyzer", href: "#features" },
  { label: "Meal Planner", href: "#features" },
  { label: "Why FitFusion", href: "#why-fitfusion" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-shell pt-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-6",
            isScrolled
              ? "glass-card border-white/15 shadow-2xl shadow-black/30"
              : "bg-white/[0.03] border border-white/10"
          )}
        >
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#b9ff66] text-black shadow-lg shadow-[#b9ff66]/20">
              <Dumbbell size={18} />
            </div>
            <div>
              <p className="text-sm font-medium tracking-[0.28em] text-white/60">
                FITFUSION
              </p>
              <p className="text-base font-semibold text-white">AI Fitness</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-white/70 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full bg-[#b9ff66] px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              <Sparkles size={16} />
              Try FitFusion
            </a>
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-[#0b1020]/95 p-4 shadow-2xl md:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}

              <a
                href="#features"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-[#b9ff66] px-4 py-3 text-sm font-semibold text-black"
              >
                Try FitFusion
              </a>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}