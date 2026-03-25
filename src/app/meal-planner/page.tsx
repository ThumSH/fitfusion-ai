"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  Beef,
  Brain,
  Camera,
  Droplets,
  ExternalLink,
  FlaskConical,
  Loader2,
  Pill,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Utensils,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import AnimatedSection from "@/components/layout/AnimatedSection";
import VideoBackground from "./VideoBackground";
import MealImageAnalyzerPanel from "@/components/meal/MealImageAnalyzerPanel";
import NutritionEvidenceCharts from "@/components/meal/NutritionEvidenceCharts";

type Tool = "planner" | "analyzer";
type IconType = ComponentType<{ className?: string; size?: number }>;

type GoalMode = {
  mode: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  summary: string;
  image: string;
};

type ProteinGuide = {
  title: string;
  range: string;
  split: string;
  note: string;
  image: string;
};

type SupplementCard = {
  icon: IconType;
  product: string;
  dose: string;
  timing: string;
  purpose: string;
  caution: string;
};

type ShakeCard = {
  title: string;
  timing: string;
  recipe: string;
  focus: string;
  image: string;
};

type EvidenceBar = {
  label: string;
  value: string;
  score: number;
  sourceTag: string;
};

type EvidenceProfile = {
  name: string;
  performance: number;
  recovery: number;
  sleep: number;
};

type StudyCard = {
  year: string;
  title: string;
  journal: string;
  takeaway: string;
  link: string;
};

const highlights = [
  {
    icon: ShieldCheck,
    title: "Goal-Aware Protocols",
    description: "Plans adapt to bulking, cutting, maintenance, and diet constraints.",
  },
  {
    icon: Camera,
    title: "Image Analyzer",
    description: "Upload meals for AI-based calories and macro estimation.",
  },
  {
    icon: TimerReset,
    title: "Practical Structure",
    description: "Actionable meal flow you can follow daily without complexity.",
  },
];

const goalModes: GoalMode[] = [
  {
    mode: "Lean Bulk",
    calories: "+150 to +300 kcal",
    protein: "1.6-2.2 g/kg",
    carbs: "3-5 g/kg",
    fat: "0.6-0.9 g/kg",
    summary: "Controlled surplus for muscle gain with minimal fat accumulation.",
    image: "/shoulder.png",
  },
  {
    mode: "Aggressive Bulk",
    calories: "+300 to +500 kcal",
    protein: "1.6-2.0 g/kg",
    carbs: "4-6 g/kg",
    fat: "0.7-1.0 g/kg",
    summary: "Faster mass gain when training volume is high and recovery is strong.",
    image: "/chest.png",
  },
  {
    mode: "Cutting",
    calories: "-300 to -500 kcal",
    protein: "1.8-2.4 g/kg",
    carbs: "2-4 g/kg",
    fat: "0.6-0.8 g/kg",
    summary: "Fat loss while preserving lean mass through high protein intake.",
    image: "/abs.png",
  },
  {
    mode: "Maintenance / Recomp",
    calories: "Near maintenance",
    protein: "1.6-2.2 g/kg",
    carbs: "2.5-4 g/kg",
    fat: "0.7-0.9 g/kg",
    summary: "Body recomposition by keeping calories stable and training progressive.",
    image: "/back.png",
  },
];

const proteinGuides: ProteinGuide[] = [
  {
    title: "Beginner Lifters",
    range: "1.6-1.8 g/kg / day",
    split: "3-4 meals, 25-40 g each",
    note: "Prioritize consistency and whole-food protein before advanced stacking.",
    image: "/arm.png",
  },
  {
    title: "Intermediate / Advanced",
    range: "1.8-2.2 g/kg / day",
    split: "4-5 feedings, 30-45 g each",
    note: "Higher training load benefits from tighter protein distribution.",
    image: "/legs.jpg",
  },
  {
    title: "During Cutting",
    range: "2.0-2.4 g/kg / day",
    split: "4-5 feedings, include pre-sleep",
    note: "Helps retain muscle in calorie deficit with hard training.",
    image: "/abs.png",
  },
];

const supplementStack: SupplementCard[] = [
  {
    icon: FlaskConical,
    product: "Whey Protein",
    dose: "20-35 g per serving",
    timing: "Post-workout or as a protein gap filler",
    purpose: "Fast protein delivery to hit your daily target.",
    caution: "Check lactose tolerance and total calorie budget.",
  },
  {
    icon: Pill,
    product: "Creatine Monohydrate",
    dose: "3-5 g daily",
    timing: "Any time, consistently every day",
    purpose: "Supports strength output, repeat performance, and lean mass.",
    caution: "Hydrate properly and avoid megadosing.",
  },
  {
    icon: Beef,
    product: "Casein / Slow Protein",
    dose: "25-40 g",
    timing: "Night or long no-meal gaps",
    purpose: "Supports amino acid availability during longer fasting windows.",
    caution: "Use when whole-food protein intake is low.",
  },
  {
    icon: Droplets,
    product: "Electrolytes + Water",
    dose: "Based on sweat loss and climate",
    timing: "Pre and intra workout",
    purpose: "Improves performance stability and recovery quality.",
    caution: "Watch sodium if medically restricted.",
  },
];

const shakes: ShakeCard[] = [
  {
    title: "Pre-Workout Fuel Shake",
    timing: "60-90 mins before training",
    recipe: "Whey + oats + banana + water/milk",
    focus: "Energy and amino availability for session quality.",
    image: "/gym-hero.jpg",
  },
  {
    title: "Post-Workout Recovery Shake",
    timing: "Within 1-2 hours post training",
    recipe: "Whey + fruit + low-fat milk + creatine",
    focus: "Protein synthesis and glycogen replenishment.",
    image: "/best.webp",
  },
  {
    title: "High-Calorie Bulk Shake",
    timing: "Between meals in bulking phase",
    recipe: "Whey + peanut butter + oats + yogurt + berries",
    focus: "Adds calories without heavy digestive load.",
    image: "/legs.jpg",
  },
];

const nutritionZones = [
  { title: "Chest / Push Days", image: "/chest.png", note: "Higher carbs can improve pressing output." },
  { title: "Back / Pull Days", image: "/back.png", note: "Protein distribution supports pulling volume." },
  { title: "Leg Days", image: "/legs.jpg", note: "Big sessions often need strongest carb allocation." },
  { title: "Core Focus", image: "/abs.png", note: "Cutting phases benefit from protein-dense timing." },
  { title: "Shoulder Focus", image: "/shoulder.png", note: "Hydration supports overhead work quality." },
  { title: "Arm Focus", image: "/arm.png", note: "Use shakes to close protein gaps." },
];

const creatineEvidenceBars: EvidenceBar[] = [
  { label: "Lean body mass gain", value: "+1.14 kg", score: 86, sourceTag: "Creatine + RT meta (2024)" },
  { label: "Body fat percentage", value: "-0.88%", score: 68, sourceTag: "Creatine + RT meta (2024)" },
  { label: "Lower-limb strength", value: "SMD 0.29", score: 58, sourceTag: "Aged meta (2025)" },
  { label: "Lean tissue mass", value: "SMD 0.27", score: 54, sourceTag: "Aged meta (2025)" },
];

const proteinEvidenceBars: EvidenceBar[] = [
  { label: "Post-exercise fat-free mass", value: "+0.54 kg", score: 64, sourceTag: "Network meta (2023)" },
  { label: "Post-exercise skeletal muscle", value: "+0.34 kg", score: 52, sourceTag: "Network meta (2023)" },
  { label: "Night protein handgrip", value: "+2.85 kg", score: 72, sourceTag: "Network meta (2023)" },
  { label: "Night protein leg press", value: "+12.12 kg", score: 90, sourceTag: "Network meta (2023)" },
];

const evidenceProfiles: EvidenceProfile[] = [
  { name: "Creatine Strategy", performance: 84, recovery: 73, sleep: 62 },
  { name: "Protein Strategy", performance: 74, recovery: 68, sleep: 45 },
];

const recentStudies: StudyCard[] = [
  {
    year: "2025",
    title: "Creatine + RT in older adults",
    journal: "Eur Rev Aging Phys Act",
    takeaway: "Improved lower-limb strength and lean tissue mass versus placebo + RT.",
    link: "https://pubmed.ncbi.nlm.nih.gov/41388441/",
  },
  {
    year: "2024",
    title: "Creatine + RT body composition meta-analysis",
    journal: "J Strength Cond Res",
    takeaway: "Extra lean body mass gains with concurrent reductions in fat mass.",
    link: "https://pubmed.ncbi.nlm.nih.gov/39074168/",
  },
  {
    year: "2024",
    title: "Single-dose creatine under sleep deprivation",
    journal: "Scientific Reports",
    takeaway: "Improved cognitive performance/processing speed during acute sleep loss protocol.",
    link: "https://pubmed.ncbi.nlm.nih.gov/38418482/",
  },
  {
    year: "2023/2024",
    title: "Protein timing/type network meta-analysis",
    journal: "Int J Sport Nutr Exerc Metab",
    takeaway: "Post-exercise and nighttime protein timing most favorable for muscle-strength outcomes.",
    link: "https://pubmed.ncbi.nlm.nih.gov/38039960/",
  },
  {
    year: "2023",
    title: "Protein intake and sleep outcomes meta-analysis",
    journal: "Nutrition Reviews",
    takeaway: "No clear overall sleep effect, with only small sensitivity-signal for subjective sleep quality.",
    link: "https://pubmed.ncbi.nlm.nih.gov/36083207/",
  },
  {
    year: "2024",
    title: "Protein source and sleep quality cohorts",
    journal: "Eur J Clin Nutr",
    takeaway: "Plant protein sources associated with better sleep quality vs some animal-source patterns.",
    link: "https://www.nature.com/articles/s41430-024-01414-y",
  },
];

export default function MealPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("planner");

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === "#analyzer") {
        setActiveTool("analyzer");
        return;
      }
      setActiveTool("planner");
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const switchTool = (tool: Tool) => {
    setActiveTool(tool);
    if (typeof window !== "undefined") {
      const hash = tool === "analyzer" ? "#analyzer" : "#planner";
      window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMealPlan(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as { plan?: string; error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate plan");
      }

      setMealPlan(result.plan ?? null);
      setTimeout(() => {
        document.getElementById("meal-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong connecting to the AI.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative bg-black text-white">
      <section className="relative min-h-[92vh] overflow-hidden">
        <VideoBackground />
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-125 w-225 -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />

        <div className="container-shell relative z-10 flex min-h-[92vh] items-center pt-28 pb-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-black/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#dff8be] backdrop-blur-xl">
              <Sparkles size={13} />
              Gemini Nutrition Engine
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl">
              AI <span className="text-primary drop-shadow-[0_0_20px_rgba(185,255,102,0.3)]">Meal Planner</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Build your personalized nutrition protocol first, then optimize protein intake, shakes, supplements, and
              phase strategy with the visual guides below.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#nutrition-tool"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-black tracking-[0.18em] text-black uppercase transition hover:brightness-110"
              >
                Open Planner
                <ArrowDown size={14} />
              </a>
              <a
                href="#nutrition-education"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-5 py-3 text-xs font-bold tracking-[0.18em] text-white/80 uppercase transition hover:border-primary/35 hover:text-white"
              >
                Learn Intake System
                <ArrowDown size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="nutrition-tool" className="relative z-10 bg-black pt-8 pb-16 sm:pb-20 scroll-mt-32">
        <div className="pointer-events-none absolute left-1/2 top-6 z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />

        <div className="container-shell relative z-10 space-y-8 px-4 sm:px-6">
          <AnimatedSection delay={100}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Featured Section</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                Meal Planner Generator
              </h2>
              <p className="mt-3 text-sm text-white/65">
                Start here first. Generate your AI plan, then use the guide sections to fine-tune it.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title} delay={index * 80}>
                  <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                    <div className="mb-2 inline-flex rounded-lg border border-primary/25 bg-primary/10 p-2 text-primary">
                      <Icon size={16} />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-white/60">{item.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection delay={160}>
            <div className="mx-auto flex w-full max-w-xl rounded-2xl border border-white/12 bg-black/30 p-1.5 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => switchTool("planner")}
                className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all sm:text-sm ${
                  activeTool === "planner"
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(185,255,102,0.28)]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <Utensils size={16} />
                Meal Planner
              </button>
              <button
                type="button"
                onClick={() => switchTool("analyzer")}
                className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-wider transition-all sm:text-sm ${
                  activeTool === "analyzer"
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(185,255,102,0.28)]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                <Camera size={16} />
                Image Analyzer
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={240}>
            {activeTool === "planner" ? (
              <div id="planner" className="mx-auto max-w-3xl scroll-mt-32">
                <div
                  className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-2xl sm:p-10"
                  style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Age</label>
                        <input
                          required
                          type="number"
                          name="age"
                          placeholder="e.g. 25"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Weight (kg)</label>
                        <input
                          required
                          type="number"
                          name="weight"
                          placeholder="e.g. 75"
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                        <Target size={16} className="text-primary" /> Primary Goal
                      </label>
                      <select
                        required
                        name="goal"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [&>option]:bg-[#0a0a0a]"
                      >
                        <option value="">Select a goal...</option>
                        <option value="lean_bulk">Lean Bulking (Muscle Gain, Minimal Fat)</option>
                        <option value="dirty_bulk">Aggressive Bulking (Max Mass)</option>
                        <option value="cut">Cutting (Fat Loss, Maintain Muscle)</option>
                        <option value="maintenance">Maintenance (Recomp)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-white/80">
                        <Activity size={16} className="text-primary" /> Dietary Preferences / Allergies
                      </label>
                      <input
                        type="text"
                        name="preferences"
                        placeholder="e.g. Vegetarian, lactose intolerant, no nuts"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200 backdrop-blur-md">
                        <AlertCircle size={18} className="text-red-400" />
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-black tracking-widest text-black uppercase transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(185,255,102,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-primary disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> Generating Protocol...
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} /> Generate Meal & Supplement Plan
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>

                {mealPlan && (
                  <motion.div
                    id="meal-result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 rounded-3xl border border-primary/20 bg-black/20 p-6 backdrop-blur-2xl sm:p-10"
                    style={{ boxShadow: "0 8px 40px rgba(185,255,102,0.06)" }}
                  >
                    <h2 className="mb-8 flex items-center gap-3 border-b border-primary/10 pb-4 text-2xl font-black tracking-wide text-primary uppercase">
                      <Sparkles size={24} />
                      Your Custom Protocol
                    </h2>

                    <div className="w-full">
                      <ReactMarkdown
                        components={{
                          h1: (props) => (
                            <h1 className="mt-8 mb-4 text-3xl font-black tracking-wide text-white uppercase" {...props} />
                          ),
                          h2: (props) => (
                            <h2 className="mt-8 mb-4 text-xl font-bold tracking-wider text-primary uppercase" {...props} />
                          ),
                          h3: (props) => <h3 className="mt-6 mb-3 text-lg font-semibold text-white/90" {...props} />,
                          p: (props) => <p className="mb-4 text-sm leading-relaxed text-white/70" {...props} />,
                          ul: (props) => (
                            <ul className="mb-6 ml-6 list-disc list-outside space-y-2 text-sm marker:text-primary" {...props} />
                          ),
                          ol: (props) => (
                            <ol
                              className="mb-6 ml-6 list-decimal list-outside space-y-2 text-sm text-white/70 marker:text-primary"
                              {...props}
                            />
                          ),
                          li: (props) => <li className="pl-1 text-white/70" {...props} />,
                          strong: (props) => (
                            <strong
                              className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-semibold text-white"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {mealPlan}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="scroll-mt-32">
                <MealImageAnalyzerPanel />
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      <section id="nutrition-education" className="relative z-10 bg-black py-16 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-10 z-0 h-90 w-90 -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />

        <div className="container-shell relative z-10 space-y-10 px-4 sm:px-6">
          <AnimatedSection delay={120}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Phase Guide</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
                Bulking, Lean Bulk, Cut, Maintenance
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {goalModes.map((mode, index) => (
              <AnimatedSection key={mode.mode} delay={160 + index * 80}>
                <motion.article
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-2xl border border-white/12 bg-black/35 backdrop-blur-xl"
                >
                  <div className="relative h-36 w-full">
                    <Image src={mode.image} alt={mode.mode} fill className="object-cover object-center opacity-75" />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/25 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-primary/35 bg-black/50 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-primary uppercase">
                      {mode.mode}
                    </div>
                  </div>

                  <div className="space-y-3 p-5 sm:p-6">
                    <p className="text-sm leading-6 text-white/75">{mode.summary}</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/80">Calories: {mode.calories}</p>
                      <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/80">Protein: {mode.protein}</p>
                      <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/80">Carbs: {mode.carbs}</p>
                      <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/80">Fat: {mode.fat}</p>
                    </div>
                  </div>
                </motion.article>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={240}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Protein System</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
                Daily Protein Intake Targets
              </h3>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {proteinGuides.map((item, index) => (
              <AnimatedSection key={item.title} delay={280 + index * 80}>
                <div className="overflow-hidden rounded-2xl border border-white/12 bg-black/35 backdrop-blur-xl">
                  <div className="relative h-32 w-full">
                    <Image src={item.image} alt={item.title} fill className="object-cover object-center opacity-75" />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                  </div>
                  <div className="space-y-2 p-5">
                    <p className="text-sm font-black tracking-wide text-white uppercase">{item.title}</p>
                    <p className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-semibold text-[#dff8be]">
                      {item.range}
                    </p>
                    <p className="text-xs text-white/80">{item.split}</p>
                    <p className="text-xs leading-5 text-white/65">{item.note}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={360}>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {supplementStack.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.product} className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
                    <div className="mb-3 flex items-start gap-3">
                      <div className="rounded-xl border border-primary/25 bg-primary/10 p-2 text-primary">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-wide text-white uppercase">{item.product}</p>
                        <p className="mt-1 text-xs text-[#dff8be]">{item.dose}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/80">Timing: {item.timing}</p>
                      <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/80">Purpose: {item.purpose}</p>
                      <p className="rounded-lg border border-red-400/20 bg-red-500/5 px-3 py-2 text-white/75">Note: {item.caution}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={390}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Evidence Dashboard</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
                Creatine + Protein Impact Charts
              </h3>
              <p className="mt-3 text-xs leading-6 text-white/65">
                Bar lengths are normalized for visual comparison. Exact effect values are shown on each row.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={420}>
            <NutritionEvidenceCharts
              creatineMetrics={creatineEvidenceBars}
              proteinMetrics={proteinEvidenceBars}
              profiles={evidenceProfiles}
            />
          </AnimatedSection>

          <AnimatedSection delay={540}>
            <div className="rounded-2xl border border-white/12 bg-black/35 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Brain size={18} />
                <p className="text-xs font-bold tracking-[0.18em] uppercase">Recent Studies (2023-2025)</p>
              </div>
              <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                {recentStudies.map((study) => (
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

          <AnimatedSection delay={420}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Shake Templates</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
                Practical Protein Shake Options
              </h3>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {shakes.map((shake, index) => (
              <AnimatedSection key={shake.title} delay={460 + index * 80}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-2xl border border-white/12 bg-black/35"
                >
                  <div className="relative h-34 w-full">
                    <Image src={shake.image} alt={shake.title} fill className="object-cover object-center opacity-80" />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                  </div>
                  <div className="space-y-2 p-5">
                    <p className="text-sm font-black tracking-wide text-white uppercase">{shake.title}</p>
                    <p className="text-xs text-[#dff8be]">{shake.timing}</p>
                    <p className="text-xs text-white/80">Recipe: {shake.recipe}</p>
                    <p className="text-xs text-white/65">{shake.focus}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={560}>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Visual Categories</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight text-white uppercase sm:text-3xl">
                Muscle Nutrition Zones
              </h3>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {nutritionZones.map((zone, index) => (
              <AnimatedSection key={zone.title} delay={600 + index * 70}>
                <div className="group overflow-hidden rounded-2xl border border-white/12 bg-black/40">
                  <div className="relative h-40 w-full">
                    <Image
                      src={zone.image}
                      alt={zone.title}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-black tracking-wide text-white uppercase">{zone.title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">{zone.note}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={760}>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
              <p className="text-xs font-bold tracking-[0.2em] text-[#dff8be] uppercase">Important</p>
              <p className="mt-2 text-xs leading-6 text-white/90">
                This guide is educational. If you have medical conditions, medication interactions, or kidney concerns,
                confirm protein and supplement decisions with a licensed clinician.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
