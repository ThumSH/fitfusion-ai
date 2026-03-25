"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Dumbbell,
  ScanLine,
  BarChart3,
  Play,
} from "lucide-react";

const slides = [
  {
    icon: Dumbbell,
    eyebrow: "AI workout planning",
    headingPrefix: "Train with",
    headingAccent: " structure",
    headingSuffix: ".",
    description:
      "Build momentum with cleaner workout guidance designed for beginners and busy users.",
    detailTitle: "Structured routines that match your level",
    detailBody:
      "FitFusion creates a more guided starting point so users can train with less confusion and more consistency.",
    statLabel: "Plan quality",
    statValue: "Adaptive",
  },
  {
    icon: ScanLine,
    eyebrow: "Meal macro scan",
    headingPrefix: "Eat with",
    headingAccent: " intelligence",
    headingSuffix: ".",
    description:
      "Use AI-powered food analysis to estimate calories, protein, and carbs with less guesswork.",
    detailTitle: "Understand meals with clearer macro estimates",
    detailBody:
      "Turn food photos into quick nutrition insights that help users make better choices without overthinking.",
    statLabel: "Meal insight",
    statValue: "Instant",
  },
  {
    icon: BarChart3,
    eyebrow: "Progress momentum",
    headingPrefix: "Grow with",
    headingAccent: " momentum",
    headingSuffix: ".",
    description:
      "Track consistency more clearly with a simple system that helps users stay focused over time.",
    detailTitle: "See progress and keep moving forward",
    detailBody:
      "FitFusion helps users stay locked in with a cleaner view of trends, habits, and improvement over time.",
    statLabel: "Trend",
    statValue: "Growing",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentSlide = useMemo(() => slides[activeSlide], [activeSlide]);
  const CurrentIcon = currentSlide.icon;

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(sectionEl);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHeroVisible) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isHeroVisible]);

  useEffect(() => {
    if (!isHeroVisible) return;

    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [isHeroVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-svh overflow-hidden bg-black"
    >
      {/* Right-side video zone */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] -z-20">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-[0.94]"
        >
          <source src="/Hero.webm" type="video/webm" />
        </video>

        <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.74)_18%,rgba(0,0,0,0.34)_34%,rgba(0,0,0,0.08)_55%,rgba(0,0,0,0.02)_100%)]" />
        <div className="absolute inset-0 bg-black/42 lg:hidden" />
      </div>

      {/* Ambient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[5%] top-[10%] h-40 w-40 rounded-full bg-primary/10 blur-[90px]" />
        <div className="absolute left-[16%] bottom-[10%] h-52 w-52 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute right-[8%] top-[8%] h-56 w-56 rounded-full bg-white/7 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,255,102,0.06),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(185,255,102,0.04),transparent_22%)]" />
      </div>

      <div className="container-shell relative z-10 flex min-h-svh items-center py-4 sm:py-6 lg:py-6">
        <div className="w-full lg:max-w-150">
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium text-[#d7ffab] backdrop-blur-md"
            >
              <Sparkles size={14} />
              Built for beginners
            </motion.div>

            {/* Animated heading area */}
            <div className="relative mt-4 w-full max-w-2xl min-h-45 sm:min-h-50 lg:min-h-53.75">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-0 w-full"
                >
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/82 sm:text-xs">
                    {currentSlide.eyebrow}
                  </p>

                  <h1 className="max-w-2xl text-3xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-4xl lg:text-[3.45rem]">
                    {currentSlide.headingPrefix}
                    <span className="text-gradient">{currentSlide.headingAccent}</span>
                    {currentSlide.headingSuffix}
                  </h1>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/66 sm:text-[15px]">
                    {currentSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.52, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 max-w-xl text-sm leading-6 text-white/68 sm:text-[15px]"
            >
              FitFusion was designed for first-time gym users. It teaches what to do before workouts,
              how to train step-by-step, and how to stay consistent from week one.
            </motion.p>

            {/* Product highlights synced with main heading slide */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.68,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-140 rounded-[28px] border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-xl shadow-[0_18px_80px_rgba(0,0,0,0.28)]"
            >
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Product highlights
                </div>

                <div className="flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        activeSlide === index
                          ? "w-7 bg-primary"
                          : "w-2.5 bg-white/18 hover:bg-white/28"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative min-h-50 sm:min-h-53.75">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`details-${activeSlide}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    className="absolute inset-0 space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                        <CurrentIcon size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/82">
                          {currentSlide.eyebrow}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold leading-tight text-white sm:text-xl">
                          {currentSlide.detailTitle}
                        </h3>
                      </div>
                    </div>

                    <p className="max-w-xl text-sm leading-6 text-white/64 sm:text-[15px]">
                      {currentSlide.detailBody}
                    </p>

                    <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-black/24 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/36">
                          {currentSlide.statLabel}
                        </p>
                        <p className="mt-1 text-sm font-medium text-white/82">
                          {currentSlide.statValue}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-white/44">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {isHeroVisible ? "Live preview active" : "Preview paused"}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* CTA buttons below highlights */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.62,
                delay: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
            >
              <a
                href="/gym-finder"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-black transition duration-300 hover:brightness-110"
              >
                Build My Plan
                <ArrowRight size={16} />
              </a>

              <a
                href="#usage-showcase"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white/88 backdrop-blur-md transition duration-300 hover:bg-white/10 hover:text-white"
              >
                <Play size={15} />
                See How It Works
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
