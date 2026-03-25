"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Brain,
  Apple,
  TrendingUp,
  ArrowRight,
  Compass,
} from "lucide-react";

type LottieAnimation = {
  destroy: () => void;
};

type LottieGlobal = {
  loadAnimation: (config: {
    container: Element;
    renderer: "svg" | "canvas" | "html";
    loop: boolean;
    autoplay: boolean;
    path: string;
    rendererSettings?: {
      preserveAspectRatio?: string;
    };
  }) => LottieAnimation;
};

declare global {
  interface Window {
    lottie?: LottieGlobal;
  }
}

const STEPS = [
  {
    number: "01",
    icon: Brain,
    title: "AI Workout Generation",
    description:
      "Tell FitFusion your experience level and available equipment. It builds a more structured split that matches your starting point.",
    tag: "Instant",
    featured: false,
  },
  {
    number: "02",
    icon: Apple,
    title: "Smart Meal Analysis",
    description:
      "Analyze meals faster with AI-powered macro estimates and practical nutrition guidance that feels easier to follow.",
    tag: "Precision",
    featured: false,
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Execute, Track, Improve",
    description:
      "Stay consistent with a cleaner system for following routines, tracking momentum, and improving over time.",
    tag: "Progress",
    featured: false,
  },
  {
    number: "04",
    icon: Compass,
    title: "Stay Guided Anywhere",
    description:
      "From gym sessions to home workouts, FitFusion keeps training, meals, and planning aligned in one direction.",
    tag: "Support",
    featured: true,
  },
];

function CenterCore() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animation: LottieAnimation | null = null;
    let isCancelled = false;

    const bootAnimation = () => {
      if (isCancelled || !containerRef.current || !window.lottie) return;

      animation = window.lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/fitness.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
        },
      });
    };

    if (window.lottie) {
      bootAnimation();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[data-lottie-loader="true"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", bootAnimation, { once: true });
      } else {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
        script.async = true;
        script.dataset.lottieLoader = "true";
        script.onload = bootAnimation;
        document.head.appendChild(script);
      }
    }

    return () => {
      isCancelled = true;
      animation?.destroy();
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-52 w-52 rounded-full bg-primary/10 blur-[70px]" />

      <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-[30px] border border-primary/20 bg-primary/8 p-2 backdrop-blur-xl shadow-[0_0_40px_rgba(185,255,102,0.08)] sm:h-52 sm:w-52">
        <div className="absolute inset-2.5 rounded-[22px] border border-white/8 bg-black/30" />
        <div
          ref={containerRef}
          className="relative z-10 h-full w-full"
          aria-label="Fitness animation"
        />
      </div>
    </div>
  );
}

function StepCard({
  step,
  index,
  active,
}: {
  step: (typeof STEPS)[0];
  index: number;
  active: boolean;
}) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.62,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative overflow-hidden rounded-[28px] border p-6 sm:p-7 transition-all duration-500 ${
        step.featured
          ? "border-primary/22 bg-primary/[0.07] hover:border-primary/45"
          : "border-white/10 bg-white/[0.035] hover:border-primary/25 hover:bg-white/5.5"
      }`}
    >
      <div className="absolute right-5 top-4 pointer-events-none text-[64px] font-semibold tracking-[-0.06em] text-white/4 sm:text-[78px]">
        {step.number}
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
              step.featured
                ? "bg-primary/14 group-hover:bg-primary/22"
                : "bg-white/6 group-hover:bg-primary/12"
            }`}
          >
            <Icon size={20} className="text-primary" />
          </div>

          <span
            className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${
              step.featured
                ? "border-primary/20 bg-primary/12 text-primary"
                : "border-white/10 bg-white/6 text-white/50"
            }`}
          >
            {step.tag}
          </span>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/32">
            Step {step.number}
          </p>
          <h3 className="max-w-[18ch] text-xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-2xl">
            {step.title}
          </h3>
        </div>

        <p className="text-sm leading-7 text-white/60 sm:text-[15px]">
          {step.description}
        </p>

        <motion.div
          className="h-[1.5px] rounded-full bg-primary/80"
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : {}}
          transition={{
            delay: 0.5 + index * 0.12,
            duration: 0.45,
            ease: "easeOut",
          }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </motion.div>
  );
}

export default function UsageShowcase() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="usage-showcase"
      ref={ref}
      className="relative w-full overflow-hidden bg-black py-24 sm:py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-[32%] h-56 w-2xl -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="container-shell relative z-10 flex flex-col gap-14 sm:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">
              How It Works
            </span>
          </div>

          <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            A clearer path from
            <span className="text-gradient"> planning to progress</span>.
          </h2>

          <p className="max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            FitFusion brings workouts, meal guidance, nutrition analysis, and
            consistency tracking into one cleaner system so users can move with
            more confidence.
          </p>
        </motion.div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <div className="flex flex-col gap-5">
            {STEPS.slice(0, 2).map((step, i) => (
              <div key={step.number} className="flex flex-col gap-4">
                <StepCard step={step} index={i} active={isInView} />
                {i < 1 && (
                  <div className="flex items-center gap-2 px-2">
                    <div className="h-px flex-1 bg-white/8" />
                    <ArrowRight size={12} className="text-white/18" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: 0.25,
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex min-h-45 items-center justify-center px-2 py-2 lg:min-h-130 lg:px-4"
          >
            <CenterCore />
          </motion.div>

          <div className="flex flex-col gap-5">
            {STEPS.slice(2, 4).map((step, i) => (
              <div key={step.number} className="flex flex-col gap-4">
                <StepCard step={step} index={i + 2} active={isInView} />
                {i < 1 && (
                  <div className="flex items-center gap-2 px-2">
                    <div className="h-px flex-1 bg-white/8" />
                    <ArrowRight size={12} className="text-white/18" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.48, duration: 0.52 }}
          className="grid gap-3 sm:grid-cols-3"
        >
          {[
            { val: "4", label: "Core AI Steps" },
            { val: "Workout + Meal", label: "Unified Flow" },
            { val: "Home To Gym", label: "Flexible Guidance" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-5 text-center"
            >
              <div className="text-2xl font-semibold tracking-[-0.05em] text-primary">
                {m.val}
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {m.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.56, duration: 0.52 }}
          className="flex flex-col items-center justify-between gap-5 rounded-[28px] border border-white/8 bg-white/[0.035] px-6 py-6 sm:flex-row sm:px-8"
        >
          <p className="max-w-xl text-center text-sm leading-7 text-white/58 sm:text-left sm:text-[15px]">
            Join users building smarter routines, better nutrition habits, and
            stronger consistency with FitFusion’s AI-guided system.
          </p>

          <a
            href="/gym-finder"
            className="shrink-0 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-black transition duration-300 hover:brightness-110"
          >
            Build My Plan
          </a>
        </motion.div>
      </div>
    </section>
  );
}
