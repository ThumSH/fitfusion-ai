"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-black text-white">
      
      {/* --- BACKGROUND VIDEO LAYER (Right Aligned) --- */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <div className="relative w-full lg:w-2/3 h-full">
          <video
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          
          {/* Vertical Gradient Mask (The "Fade" between text and video) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent lg:via-black/30" />
          
          {/* Bottom Fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-6 md:px-12 z-10">
        <div className="max-w-3xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Gemini Badge */}
            <motion.div 
              variants={itemVariants} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm"
            >
              <div className="bg-[#ccff00] p-0.5 rounded-sm">
                <Sparkles className="w-3 h-3 text-black" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Powered by Gemini AI
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants} 
              className="text-6xl md:text-8xl font-[900] tracking-tighter leading-[0.9] uppercase italic"
            >
              FORGE YOUR <br />
              <span className="text-[#ccff00] drop-shadow-[0_0_20px_rgba(204,255,0,0.3)]">ULTIMATE</span> <br />
              PHYSIQUE
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              variants={itemVariants} 
              className="text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed mt-2"
            >
              Experience the next generation of fitness. Upload your meals for instant AI calorie analysis and generate optimal workout plans tailored to your goals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-6">
              <button className="flex items-center justify-center gap-3 px-8 py-4 text-black font-black bg-[#ccff00] rounded-full hover:bg-[#b3e600] transition-all hover:scale-105 active:scale-95 group">
                START YOUR JOURNEY 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center justify-center px-8 py-4 text-white font-bold bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all backdrop-blur-md">
                VIEW GYM CULTURE
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Right Attribution */}
      <div className="absolute bottom-8 right-12 hidden lg:flex items-center gap-2 opacity-40">
        <Sparkles className="w-4 h-4 text-[#ccff00]" />
        <span className="text-[10px] text-white font-medium uppercase tracking-widest italic">
          AI Precision Training
        </span>
      </div>

    </section>
  );
}