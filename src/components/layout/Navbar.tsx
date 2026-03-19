"use client";

import { useState, useEffect } from "react"
import Link from "next/link";
import { Menu, X, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Trigger the glassmorphism effect when the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Workout Planner", href: "/workout-planner" },
    { name: "Meal Planner", href: "/meal-planner#planner" },
    { name: "Gym Finder", href: "/gym-finder" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[90] transition-all duration-300 ${
        isScrolled
          ? "bg-black/85 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/50"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        
        {/* LEFT: Brand Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <Dumbbell className="text-[#b9ff66] group-hover:-rotate-45 transition-transform duration-300" size={28} />
            <span className="text-xl lg:text-2xl font-bold uppercase tracking-wider text-white whitespace-nowrap">
              Fit<span className="text-[#b9ff66]">Fusion</span>
            </span>
          </Link>
        </div>

        {/* CENTER: Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center gap-4 lg:gap-6 xl:gap-8 min-w-0">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[15px] font-semibold text-white/70 hover:text-[#b9ff66] transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* RIGHT: Get Started Button */}
        <div className="hidden md:flex items-center justify-end">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-[1.5px] overflow-hidden rounded-full group transition-all duration-300"
          >
            {/* Rotating Neon Line */}
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#b9ff66_0%,transparent_20%,#b9ff66_50%,transparent_70%,#b9ff66_100%)] opacity-100" />
            
            {/* Inner Button Content */}
            <Link
              href="/Why"
              className="relative z-10 flex items-center justify-center bg-[#0a0a0a] text-white text-xs font-bold py-2.5 px-6 rounded-full group-hover:bg-[#b9ff66] group-hover:text-black transition-all duration-300"
            >
             About Us
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Hamburger Toggle */}
        <div className="md:hidden flex ml-auto">
          <button
            className="text-white hover:text-[#b9ff66] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 py-6" : "max-h-0 py-0 border-transparent opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              className="text-lg font-medium text-white/70 hover:text-[#b9ff66] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/meal-planner#planner" className="bg-[#b9ff66] text-black px-8 py-3 rounded-full font-bold text-sm w-10/12 mt-2 text-center">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
