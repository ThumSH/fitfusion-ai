"use client";

import { Brain, Camera, ClipboardList, Activity } from "lucide-react";
import Image from "next/image";
import SectionWrapper from "./SectionWrapper";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us your goals",
    text: "Users provide body details, goals, and preferences so the platform can personalize the experience.",
  },
  {
    icon: Brain,
    title: "AI builds the plan",
    text: "Smart generation turns raw inputs into practical workout and meal guidance.",
  },
  {
    icon: Camera,
    title: "Track and improve",
    text: "Users can analyze meals, stay aligned with nutrition, and stay consistent over time.",
  },
];

export default function HowItWorks() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-primary">How it works</p>
        <h2 className="section-title text-4xl font-bold text-white">A clean flow from goal to action</h2>
        <p className="section-subtitle mt-5 text-lg text-white/65">
          FitFusion guides the user through planning, analysis, and consistency in one connected fitness experience.
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="w-full rounded-[2.5rem] border border-white/10 bg-white/5 p-3 glass-card">
          <div className="relative w-full aspect-square md:aspect-4/3 lg:aspect-square overflow-hidden rounded-4xl">
            <Image
              src="/gym-hero.jpg"
              alt="FitFusion app experience"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/65 p-4 backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8 sm:w-80">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
                <Activity size={24} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Daily Goal Met</p>
                <p className="text-xs text-white/60">AI adjusted your next workout</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="group relative flex gap-6 rounded-4xl border border-transparent p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/5 glass-card"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-primary transition-colors group-hover:bg-primary group-hover:text-black">
                    <Icon size={24} />
                  </div>
                  {index !== steps.length - 1 && <div className="h-full w-px bg-white/10" />}
                </div>

                <div className="pb-4">
                  <div className="mb-2 text-sm font-medium tracking-wider text-primary/75">STEP 0{index + 1}</div>
                  <h3 className="mb-3 text-2xl font-semibold text-white transition-colors group-hover:text-primary">{step.title}</h3>
                  <p className="text-base leading-relaxed text-white/65">{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
