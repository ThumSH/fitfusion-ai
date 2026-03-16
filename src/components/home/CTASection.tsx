"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#b9ff66]/10 via-white/[0.04] to-sky-400/10 p-8 sm:p-10 lg:p-14"
        >
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#b9ff66]/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
              <Sparkles size={16} />
              Sprint A completed foundation
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Next up: wire the AI workout planner into a real product flow.
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
              After this UI pass, Sprint B should build the first end-to-end
              feature: form input, server route, Gemini response, and polished
              result cards.
            </p>

            <div className="mt-8">
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full bg-[#b9ff66] px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Continue to Sprint B
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}