"use client";

import { motion } from "framer-motion"; // Changed from "motion/react" to "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden bg-black">
      {/* Right Side Video - 65% width for clarity */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[65%] -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-90"
        >
          <source src="/Hero.webm" type="video/webm" />
        </video>
        
        {/* The Blend Gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/60 to-transparent lg:block hidden" />
        
        {/* Mobile overlay */}
        <div className="absolute inset-0 bg-black/50 lg:hidden block" />
      </div>

      <div className="container-shell relative z-10 flex min-h-[92vh] items-center py-16">
        <div className="grid w-full items-center lg:grid-cols-12 gap-8">
          
          {/* Left Content Side - 5 columns */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs text-[#d7ffab]">
              <Sparkles size={14} />
              AI-powered fitness tools
            </div>

            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Train with
              <span className="text-gradient"> structure</span>.
              <br />
              Eat with
              <span className="text-gradient"> intelligence</span>.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              FitFusion helps beginners and busy users build momentum with an
              AI workout planner and smart meal analysis.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row w-full lg:w-auto">
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110"
              >
                Get Started
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="mt-10 space-y-3 text-xs text-white/40">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                Tailored Workout Plans
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                AI Meal Estimates
              </div>
            </div>
          </motion.div>

          {/* Right side spacer */}
          <div className="lg:col-span-7" />
        </div>
      </div>
    </section>
  );
}