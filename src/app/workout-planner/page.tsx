"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Ban,
  Brain,
  CheckCircle2,
  Clock3,
  Dumbbell,
  ExternalLink,
  Flame,
  Footprints,
  GlassWater,
  HeartPulse,
  Moon,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  TriangleAlert,
  Wind,
  Zap,
} from "lucide-react";
import AnimatedSection from "@/components/layout/AnimatedSection";
import WorkoutEvidenceCharts, {
  type WorkoutEvidenceMetric,
  type WorkoutEvidenceProfile,
} from "@/components/workout/WorkoutEvidenceCharts";
import WorkoutPlanPanel from "@/components/workout/WorkoutPlanPanel";
import VideoBackground from "./VideoBackground";

type IconType = ComponentType<{ className?: string; size?: number }>;

type FeatureCard = {
  icon: IconType;
  title: string;
  description: string;
};

type BenefitCard = {
  icon: IconType;
  category: string;
  title: string;
  description: string;
  points: string[];
  image: string;
};

type PhaseCard = {
  icon: IconType;
  phaseTag: string;
  title: string;
  subtitle: string;
  doList: string[];
  avoidList: string[];
  image: string;
};

type FocusCard = {
  title: string;
  image: string;
  blurb: string;
};

type StudyHighlight = {
  year: string;
  title: string;
  journal: string;
  takeaway: string;
  link: string;
};

const features: FeatureCard[] = [
  {
    icon: ShieldCheck,
    title: "Experience-Aware",
    description: "Volume and intensity scale to your current level.",
  },
  {
    icon: TimerReset,
    title: "Progressive Structure",
    description: "Sessions are organized for measurable progression.",
  },
  {
    icon: Dumbbell,
    title: "Home + Gym Modes",
    description: "Exercise pools adapt to your training environment.",
  },
];

const benefits: BenefitCard[] = [
  {
    icon: HeartPulse,
    category: "Health Base",
    title: "Physical Health",
    description: "Improves key markers that drive long-term performance.",
    points: [
      "Better blood sugar control and metabolic efficiency.",
      "Higher aerobic capacity and day-to-day energy.",
    ],
    image: "/ph-health.webp",
  },
  {
    icon: Brain,
    category: "Cognitive Edge",
    title: "Mental Performance",
    description: "Training stabilizes mood and sharpens focus quality.",
    points: [
      "Lower stress reactivity and better emotional control.",
      "Higher concentration and more consistent output.",
    ],
    image: "/gym-hero.jpg",
  },
  {
    icon: Moon,
    category: "Recovery Loop",
    title: "Sleep & Recovery",
    description: "Structured workouts reinforce deeper, more effective recovery.",
    points: [
      "Improves sleep pressure and recovery hormone profile.",
      "Faster tissue repair and better next-session readiness.",
    ],
    image: "/sleep-rec.webp",
  },
  {
    icon: Footprints,
    category: "Long-Term Fitness",
    title: "Longevity",
    description: "Strength and mobility protect quality of movement over time.",
    points: [
      "Supports bone, joint, and posture resilience.",
      "Reduces injury risk and preserves functional independence.",
    ],
    image: "/long.webp",
  },
];

const phases: PhaseCard[] = [
  {
    icon: Target,
    phaseTag: "Phase 01",
    title: "Before Workout",
    subtitle: "Prime the body before loading intensity.",
    doList: [
      "Hydrate and move 5-10 minutes before your first working set.",
      "Set one clear objective: strength, hypertrophy, or conditioning.",
      "Ramp up with lighter sets before heavy effort.",
    ],
    avoidList: [
      "Do not skip warm-up and jump straight into heavy reps.",
      "Do not test max loads without setup and support.",
    ],
    image: "/water.webp",
  },
  {
    icon: Zap,
    phaseTag: "Phase 02",
    title: "During Workout",
    subtitle: "Quality reps beat random volume every time.",
    doList: [
      "Keep technique stable before increasing load.",
      "Track reps, load, and perceived effort set by set.",
      "Use controlled rest instead of rushing every exercise.",
    ],
    avoidList: [
      "Do not chase failure on every set.",
      "Do not compromise form to lift heavier.",
    ],
    image: "/work.webp",
  },
  {
    icon: GlassWater,
    phaseTag: "Phase 03",
    title: "After Workout",
    subtitle: "Lock in recovery so each session compounds.",
    doList: [
      "Cool down, rehydrate, and restore breathing.",
      "Eat protein + carbs in a realistic recovery window.",
      "Log the session and adjust the next load intelligently.",
    ],
    avoidList: [
      "Do not stay sedentary immediately after hard sessions.",
      "Do not ignore pain that exceeds normal soreness.",
    ],
    image: "/after.webp",
  },
];

const focusZones: FocusCard[] = [
  { title: "Chest Focus", image: "/download.webp", blurb: "Push mechanics, pressing angles, controlled tempo." },
  { title: "Back Focus", image: "/row.webp", blurb: "Scapular control, pull strength, posture support." },
  { title: "Shoulder Focus", image: "/shoulder.webp", blurb: "Stable overhead range and joint-friendly loading." },
  { title: "Arm Focus", image: "/arm.webp", blurb: "Biceps/triceps detail work after heavy compounds." },
  { title: "Core Focus", image: "/core.webp", blurb: "Bracing, anti-rotation, and movement transfer." },
  { title: "Leg Focus", image: "/leg.webp", blurb: "Squat/hinge patterns for power and durability." },
];

const mentalEvidenceMetrics: WorkoutEvidenceMetric[] = [
  { label: "Walking/Jogging for depression", value: "SMD -0.62", score: 88 },
  { label: "Yoga for depression", value: "SMD -0.55", score: 80 },
  { label: "Strength training for depression", value: "SMD -0.49", score: 74 },
  { label: "Daily +1000 steps depression risk", value: "-9% risk", score: 67 },
];

const physicalEvidenceMetrics: WorkoutEvidenceMetric[] = [
  { label: "7000 vs 2000 steps CVD incidence", value: "-25% risk", score: 85 },
  { label: "12000 vs 2000 steps CVD incidence", value: "-39% risk", score: 93 },
  { label: "Each +5000 steps CVD incidence", value: "-10% risk", score: 62 },
  { label: "Exercise intervention systolic BP", value: "-3.25 mmHg", score: 57 },
];

const evidenceProfiles: WorkoutEvidenceProfile[] = [
  { name: "Aerobic-Focused Training", physical: 86, mental: 78, sleep: 70, cognition: 68 },
  { name: "Resistance-Focused Training", physical: 80, mental: 74, sleep: 62, cognition: 71 },
];

const recentWorkoutStudies: StudyHighlight[] = [
  {
    year: "2024",
    title: "Exercise treatment for depression: network meta-analysis",
    journal: "BMJ",
    takeaway: "Walking/jogging, yoga, and strength training showed meaningful antidepressant effects.",
    link: "https://pubmed.ncbi.nlm.nih.gov/38355154/",
  },
  {
    year: "2024",
    title: "Daily steps and depression symptoms",
    journal: "JAMA Network Open",
    takeaway: "Each +1000 steps/day linked to 9% lower depression risk; ~7000 steps/day linked to 31% lower risk.",
    link: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2828073",
  },
  {
    year: "2024",
    title: "Daily steps and cardiovascular outcomes",
    journal: "Eur J Prev Cardiol",
    takeaway: "Higher daily step counts associated with lower CVD incidence and mortality in dose-response pattern.",
    link: "https://pubmed.ncbi.nlm.nih.gov/38659024/",
  },
  {
    year: "2024",
    title: "Physical activity and sleep disorders",
    journal: "Nutrients",
    takeaway: "Higher objectively measured daily steps linked to lower prevalence of sleep disorders.",
    link: "https://pubmed.ncbi.nlm.nih.gov/39556996/",
  },
  {
    year: "2025",
    title: "Exercise intervention effects on major CVD risks",
    journal: "Front Public Health",
    takeaway: "Meta-analysis showed reductions in systolic/diastolic blood pressure and resting heart rate.",
    link: "https://pubmed.ncbi.nlm.nih.gov/40443938/",
  },
  {
    year: "2025",
    title: "Mind-body exercise and anxiety/depression in older adults",
    journal: "PeerJ",
    takeaway: "Significant reductions in depression and anxiety symptoms with mind-body training modalities.",
    link: "https://pubmed.ncbi.nlm.nih.gov/39952828/",
  },
];

const redFlags = [
  "Starting too heavy before owning technique",
  "Switching programs every week",
  "Confusing soreness with progress",
  "Undereating protein and fluids",
];

export default function WorkoutPlannerPage() {
  return (
    <div className="relative bg-black text-white">
      <section className="relative min-h-[92vh] overflow-hidden">
        <VideoBackground />
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-125 w-225 -translate-x-1/2 rounded-full bg-primary/10 blur-[170px]" />

        <div className="container-shell relative z-10 grid min-h-[92vh] items-center gap-10 pt-28 pb-20 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-black/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#dff8be] backdrop-blur-xl">
              <Sparkles size={13} />
              Gemini Training Engine
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl">
              AI Workout <span className="text-primary drop-shadow-[0_0_20px_rgba(185,255,102,0.3)]">Architect</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Generate a structured plan and learn the habits that improve health, mindset, recovery, and long-term
              adherence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#planner-tool"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-black tracking-[0.18em] text-black uppercase transition hover:brightness-110"
              >
                Open Planner
                <ArrowRight size={14} />
              </a>
              <a
                href="#training-insights"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-5 py-3 text-xs font-bold tracking-[0.18em] text-white/80 uppercase transition hover:border-primary/35 hover:text-white"
              >
                Learn Structure
                <ArrowDown size={14} />
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl"
            >
              <div className="mb-3 inline-flex rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary">
                <TrendingUp size={16} />
              </div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase">Performance Layer</p>
              <p className="mt-1 text-sm text-white/75">Progressive overload with practical week-to-week continuity.</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl"
            >
              <div className="mb-3 inline-flex rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary">
                <HeartPulse size={16} />
              </div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase">Health Layer</p>
              <p className="mt-1 text-sm text-white/75">Better cardio-respiratory fitness and metabolic resilience.</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-xl sm:col-span-2 lg:col-span-1"
            >
              <div className="mb-3 inline-flex rounded-xl border border-primary/30 bg-primary/10 p-2 text-primary">
                <Wind size={16} />
              </div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-primary uppercase">Recovery Layer</p>
              <p className="mt-1 text-sm text-white/75">Sleep, hydration, and session quality drive adaptation speed.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="planner-tool" className="relative z-10 bg-black pt-8 pb-16 sm:pb-20 scroll-mt-32">
        <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="container-shell relative z-10">
          <AnimatedSection delay={120}>
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Featured Section</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                Workout Planner Generator
              </h2>
              <p className="mt-3 text-sm text-white/65">
                Start here first. Build your custom routine, then scroll down for training guidance and best practices.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={180}>
            <div className="mx-auto max-w-5xl">
              <WorkoutPlanPanel compact />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={260}>
            <div className="mx-auto mt-8 flex max-w-5xl items-center justify-center rounded-2xl border border-white/10 bg-black/35 px-5 py-3 backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold tracking-[0.18em] text-white/70 uppercase">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} className="text-primary" /> Guided Timing
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Flame size={13} className="text-primary" /> Intensity Logic
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Target size={13} className="text-primary" /> Goal-Based Splits
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="training-insights" className="relative z-10 bg-black py-16 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-8 z-0 h-90 w-90 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="container-shell relative z-10 space-y-10">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title} delay={index * 90}>
                  <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                    <div className="mb-2 inline-flex rounded-lg border border-primary/25 bg-primary/10 p-2 text-primary">
                      <Icon size={16} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-white/60">{item.description}</p>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection delay={120}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Training Benefits</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                Health + Mentality + Consistency
              </h2>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {["Health Base", "Cognitive Edge", "Recovery Loop", "Long-Term Fitness"].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white/75 uppercase"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {benefits.map((card, index) => {
              const Icon = card.icon;
              return (
                <AnimatedSection key={card.title} delay={170 + index * 80}>
                  <motion.article
                    whileHover={{ y: -3, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-black/55 to-black/20 backdrop-blur-xl"
                  >
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image src={card.image} alt={card.title} fill className="object-cover object-center opacity-75" />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full border border-primary/35 bg-black/50 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-primary uppercase">
                        {card.category}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="mb-4 inline-flex rounded-xl border border-primary/25 bg-primary/10 p-2.5 text-primary">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-lg font-black tracking-wide text-white uppercase">{card.title}</h3>
                      <p className="mt-2 text-sm text-white/65">{card.description}</p>
                      <div className="mt-4 space-y-2">
                        {card.points.map((point) => (
                          <p key={point} className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs text-white/75">
                            {point}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection delay={250}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Recent Evidence</p>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Mental + Physical Health Research Snapshot
              </h3>
              <p className="mt-3 text-xs leading-6 text-white/65">
                Charts summarize effect signals from recent meta-analyses and cohort data on exercise.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={280}>
            <WorkoutEvidenceCharts
              mentalMetrics={mentalEvidenceMetrics}
              physicalMetrics={physicalEvidenceMetrics}
              profiles={evidenceProfiles}
            />
          </AnimatedSection>

          <AnimatedSection delay={330}>
            <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Brain size={18} />
                <p className="text-xs font-bold tracking-[0.18em] uppercase">Recent Study Links</p>
              </div>
              <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                {recentWorkoutStudies.map((study) => (
                  <a
                    key={study.title}
                    href={study.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-white/10 bg-white/3 p-3 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold tracking-[0.16em] text-primary uppercase">{study.year}</p>
                        <p className="mt-1 text-xs font-semibold text-white/85">{study.title}</p>
                        <p className="mt-0.5 text-[11px] text-white/60">{study.journal}</p>
                        <p className="mt-1 text-[11px] leading-5 text-white/70">{study.takeaway}</p>
                      </div>
                      <ExternalLink size={14} className="mt-0.5 shrink-0 text-white/50" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={290}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Focus Categories</p>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Visual Training Zones
              </h3>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {focusZones.map((zone, index) => (
              <AnimatedSection key={zone.title} delay={320 + index * 70}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="group overflow-hidden rounded-2xl border border-white/12 bg-black/40"
                >
                  <div className="relative h-40 w-full">
                    <Image src={zone.image} alt={zone.title} fill className="object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/15 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-black tracking-wide text-white uppercase">{zone.title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">{zone.blurb}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={300}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Execution System</p>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                What To Do Before, During, And After
              </h3>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <AnimatedSection key={phase.title} delay={360 + index * 100}>
                  <div className="h-full overflow-hidden rounded-2xl border border-white/12 bg-black/35 backdrop-blur-xl">
                    <div className="relative h-32 w-full overflow-hidden">
                      <Image src={phase.image} alt={phase.title} fill className="object-cover object-center opacity-80" />
                      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full border border-primary/30 bg-black/50 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-primary uppercase">
                        {phase.phaseTag}
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="inline-flex rounded-xl border border-primary/25 bg-primary/10 p-2.5 text-primary">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black tracking-wide text-white uppercase">{phase.title}</h3>
                          <p className="mt-1 text-sm text-white/65">{phase.subtitle}</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="mb-2 text-xs font-bold tracking-wider text-primary uppercase">Do</p>
                        <div className="space-y-2">
                          {phase.doList.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                              <p className="text-xs leading-5 text-white/85">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/5 p-4">
                        <p className="mb-2 text-xs font-bold tracking-wider text-red-300 uppercase">Avoid</p>
                        <div className="space-y-2">
                          {phase.avoidList.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <Ban size={14} className="mt-0.5 shrink-0 text-red-300" />
                              <p className="text-xs leading-5 text-white/80">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection delay={520}>
            <div className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <TriangleAlert size={18} />
                <p className="text-xs font-bold tracking-[0.2em] uppercase">Common Progress Killers</p>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {redFlags.map((item) => (
                  <p key={item} className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-xs text-white/75">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
