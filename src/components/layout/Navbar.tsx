"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Dumbbell, ArrowUpRight } from "lucide-react";

const navItems = [
  { label: "Workout Planner", href: "/workout-planner" },
   { label: "Gym Finder", href: "/gym-finder" },
  { label: "Meal Planner", href: "/meal-planner" },
  { label: "Why FitFusion", href: "#" },
   { label: "Who are we", href: "/Why" },
  { label: "Contact", href: "#contact", isSpecial: true },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 },
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6"
    >
      <div className="w-full max-w-7xl flex items-center justify-between">
        
        {/* Logo Section */}
        <motion.div whileHover={{ scale: 1.05 }} className="flex-1">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="bg-[#b9ff66] p-2 rounded-xl text-black shadow-[0_0_15px_rgba(185,255,102,0.3)]"
            >
              <Dumbbell size={22} strokeWidth={2.5} />
            </motion.div>
            <span className="text-white font-black text-2xl tracking-tight hidden sm:block">
              FIT<span className="text-[#b9ff66]">FUSION</span>
            </span>
          </Link>
        </motion.div>

        {/* Centered Menu */}
        <nav className="relative flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <AnimatePresence>
            {navItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative px-5 py-2.5 text-sm font-semibold transition-colors duration-300 rounded-full flex items-center gap-1
                  ${hoveredIndex === index ? "text-black" : "text-gray-300"}
                  ${item.isSpecial && hoveredIndex !== index ? "bg-white/5" : ""}
                `}
              >
                <span className="relative z-10 flex items-center gap-1">
                  {item.label}
                  {item.isSpecial && <ArrowUpRight size={14} opacity={0.6} />}
                </span>
                
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[#b9ff66] rounded-full"
                    style={{ 
                      boxShadow: "0 0 25px rgba(185, 255, 102, 0.6)",
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                    }}
                  />
                )}
              </Link>
            ))}
          </AnimatePresence>
        </nav>

        {/* Join Now Button with Neon Animation */}
        <div className="flex-1 flex justify-end hidden md:flex">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-[1.5px] overflow-hidden rounded-full group transition-all duration-300"
          >
            {/* Rotating Neon Line */}
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#b9ff66_0%,transparent_20%,#b9ff66_50%,transparent_70%,#b9ff66_100%)] opacity-100" />
            
            {/* Inner Button Content */}
            <span className="relative z-10 flex items-center justify-center bg-[#0a0a0a] text-white text-xs font-bold py-2.5 px-6 rounded-full group-hover:bg-[#b9ff66] group-hover:text-black transition-all duration-300">
              JOIN NOW
            </span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}