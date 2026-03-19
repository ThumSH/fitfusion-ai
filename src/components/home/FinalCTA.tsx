"use client";

import { ArrowRight } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

export default function FinalCTA() {
  return (
    <SectionWrapper className="pt-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#b9ff66]/10 via-white/[0.04] to-sky-400/10 p-8 sm:p-10 lg:p-14">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#b9ff66]/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#b9ff66]">
            Ready to begin
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Make fitness planning feel clean, modern, and intelligent.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
            FitFusion brings together training guidance, food understanding, and
            consistency tools in one experience.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#b9ff66] px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]">
            Get Started
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}