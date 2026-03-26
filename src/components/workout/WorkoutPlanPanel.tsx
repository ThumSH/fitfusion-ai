/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@clerk/nextjs";
import {
  Loader2,
  Clock,
  ArrowRight,
  Flame,
  Activity,
  Dumbbell,
  Timer,
  Zap,
  AlertCircle,
  ClipboardCheck,
  ClipboardCopy,
  Save,
  History,
} from "lucide-react";
import type { WorkoutFormPayload, WorkoutHistoryItem } from "@/types/workout-history";

type WorkoutForm = WorkoutFormPayload;

type WorkoutExercise = {
  name: string;
  reps: string;
  rest: string;
};

type WorkoutSession = {
  day: number;
  title: string;
  note: string;
  warmup: string[];
  exercises: WorkoutExercise[];
};

type HomeWorkoutDB = {
  fatBurn: string[];
  push: string[];
  pull: string[];
  legs: string[];
  core: string[];
  hiit: string[];
};

type GymWorkoutDB = {
  push: string[];
  pull: string[];
  legs: string[];
  core: string[];
};

type WorkoutTheme = {
  t: string;
  m: string[];
};

type Particle = {
  id: number;
  x: string;
  y: string;
  opacity: number;
  duration: number;
  delay: number;
  moveY: string;
};

type WorkoutApiResponse = {
  plan?: string;
  error?: string;
};

type WorkoutHistoryResponse = {
  items?: WorkoutHistoryItem[];
  error?: string;
};

type SaveWorkoutHistoryResponse = {
  item?: WorkoutHistoryItem;
  error?: string;
};

const DEFAULT_FORM: WorkoutForm = {
  age: "",
  weight: "",
  height: "",
  goal: "Bulking (Gain Muscle Mass)",
  experience: "Beginner (0-6 months)",
  daysPerWeek: "5",
  workoutDuration: "30",
  environment: "home",
  notes: "",
};

function normalizeWorkoutError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("quota") || lower.includes("rate limit") || lower.includes("429")) {
    return "Workout AI limit reached for now. Retry shortly or check Gemini API usage limits.";
  }
  if (lower.includes("model") && lower.includes("unavailable")) {
    return "Gemini model is temporarily unavailable. Retry shortly.";
  }
  return message;
}

function buildPreviewPlan(formData: WorkoutForm): WorkoutSession[] {
  const { age, height, weight, goal, experience, workoutDuration, daysPerWeek, environment } = formData;

  const isHome = environment === "home";
  const isBeginner = experience.includes("Beginner");
  const isAdvanced = experience.includes("Advanced");
  const isCutting = goal.includes("Cutting") || goal.includes("Loss") || goal.includes("Lean");
  const isStrength = goal.includes("Strength");

  const days = Number.parseInt(daysPerWeek, 10) || 5;
  const duration = Number.parseInt(workoutDuration, 10) || 30;

  const userAge = Number.parseInt(age, 10) || 25;
  const userWeight = Number.parseFloat(weight) || 70;
  const userHeight = Number.parseFloat(height) || 170;
  const bmi = userWeight / Math.pow(userHeight / 100, 2);

  const isLowImpact = userAge >= 45 || bmi >= 28;
  const exerciseCount = duration === 20 ? 3 : duration === 30 ? 4 : duration === 45 ? 5 : 6;

  let sessionStyle = {
    label: "3 x 10-12 Reps",
    rest: "60S REST",
    note: "Control the weight. Focus on the muscle contraction.",
  };

  if (isCutting) {
    sessionStyle = {
      label: duration <= 30 ? "40s Work" : "45s Work",
      rest: duration <= 30 ? "20S REST" : "15S REST",
      note: `Perform each exercise for ${duration <= 30 ? "40s" : "45s"}, rest ${duration <= 30 ? "20s" : "15s"}. Complete 3-4 full rounds.`,
    };
  } else if (isStrength) {
    sessionStyle = {
      label: isBeginner ? "3 x 8 Reps" : isAdvanced ? "5 x 3-5 Reps" : "4 x 5 Reps",
      rest: isAdvanced ? "150S REST" : "120S REST",
      note: "Heavy resistance. Rest long enough to stay strong.",
    };
  } else {
    sessionStyle = {
      label: isBeginner ? "3 x 10 Reps" : "4 x 8-12 Reps",
      rest: "90S REST",
      note: "Focus on time under tension and progressive overload.",
    };
  }

  if (isLowImpact) {
    const restInt = Number.parseInt(sessionStyle.rest, 10);
    sessionStyle.rest = Number.isNaN(restInt) ? "90S REST" : `${restInt + 30}S REST`;
    sessionStyle.note += " Adjusted for joint health.";
  } else if (userAge < 25) {
    sessionStyle.note += " Prime metabolic phase. Push the intensity!";
  }

  const homeDB: HomeWorkoutDB = {
      fatBurn: isLowImpact
        ? ["Step Jacks", "Box Squats", "Incline Push-ups", "Slow Mountain Climbers", "Plank", "High Knee Marches"]
        : ["Jumping Jacks", "Bodyweight Squats", "Push-ups", "Mountain Climbers", "Plank", "Burpees"],
      push: isLowImpact
        ? ["Wall Push-ups", "Chair Dips", "Knee Push-ups", "Arm Circles", "Superman Holds", "Plank to Down Dog"]
        : ["Incline Push-ups", "Chair Dips", "Pike Push-ups", "Arm Circles", "Superman Holds", "Diamond Push-ups"],
      pull: ["Door Frame Rows", "Superman Holds", "Reverse Snow Angels", "Towel Pull-ins", "Bird-Dog", "Prone Swimmers"],
      legs: isLowImpact
        ? ["Assisted Lunges", "Glute Bridges", "Wall Sit", "Calf Raises", "Sumo Squats", "Step-ups"]
        : ["Lunges", "Glute Bridges", "Wall Sit", "Calf Raises", "Sumo Squats", "Jump Squats"],
      core: ["Bicycle Crunches", "Leg Raises", "Russian Twists", "High Knees", "Shoulder Taps", "Flutter Kicks"],
      hiit: isLowImpact
        ? ["Speed Squats", "Fast Punches", "Step Jacks", "Glute Kickbacks", "Brisk Marching", "Standing Crunches"]
        : ["Burpees", "Skater Hops", "Jump Squats", "Butt Kicks", "Mountain Climbers", "High Knees"],
  };

  const gymDB: GymWorkoutDB = {
      push: isBeginner
        ? ["Machine Chest Press", "DB Overhead Press", "Tricep Rope Pushdowns", "Lateral Raises", "Push-ups", "Pec Deck Machine"]
        : ["Bench Press", "Dumbbell Flyes", "Weighted Dips", "Overhead Press", "Tricep Extensions", "Cable Crossovers"],
      pull: isBeginner
        ? ["Seated Rows", "Lat Pulldowns", "Face Pulls", "Bicep Curls", "Back Extensions", "Machine Shrugs"]
        : ["Deadlifts", "Barbell Rows", "Pullups", "Hammer Curls", "Face Pulls", "Dumbbell Pullovers"],
      legs: isLowImpact
        ? ["Leg Press", "Leg Extensions", "Seated Calf Raises", "Goblet Squats", "Hamstring Curls", "Hip Abductions"]
        : isBeginner
          ? ["Leg Press", "Leg Extensions", "Calf Raises", "Goblet Squats", "Hamstring Curls", "Walking Lunges"]
          : ["Barbell Squats", "Romanian Deadlifts", "Leg Press", "Walking Lunges", "Calf Raises", "Hip Thrusts"],
      core: ["Hanging Leg Raises", "Cable Crunches", "Ab Wheel", "Weighted Plank", "Russian Twists", "Decline Crunches"],
  };

  const warmups = {
    home: isLowImpact
      ? ["Arm Circles - 1 min", "Torso Twists - 1 min", "High Knee Marches - 1 min"]
      : ["Jumping Jacks - 1 min", "Arm Circles - 1 min", "Bodyweight Squats - 1 min"],
    gym: isLowImpact
      ? ["Stationary Bike - 5 mins", "Dynamic Arm Swings - 1 min", "Bodyweight Squats - 1 min"]
      : ["Treadmill / Bike - 5 mins", "Dynamic Arm Swings - 1 min", "Bodyweight Lunges - 1 min"],
  };

  const plan: WorkoutSession[] = [];
  const activeDB = isHome ? homeDB : gymDB;
  const activeWarmup = isHome ? warmups.home : warmups.gym;

  for (let i = 1; i <= days; i += 1) {
    let dailyMoves: string[] = [];
    let title = "";

    if (isCutting && isHome) {
      const themes: WorkoutTheme[] = [
        { t: "Full Body Fat Burner", m: homeDB.fatBurn },
        { t: "Core + Cardio Intensity", m: homeDB.core },
        { t: "Upper Body Sculpt", m: homeDB.push },
        { t: "Lower Body Blast", m: homeDB.legs },
        { t: "HIIT Fat Melt", m: homeDB.hiit },
        { t: "Core & Stability", m: homeDB.core },
        { t: "Full Body Hybrid", m: homeDB.fatBurn },
      ];
      const fallbackTheme: WorkoutTheme = themes[0] ?? {
        t: "Full Body Fat Burner",
        m: homeDB.fatBurn,
      };
      const theme = themes[(i - 1) % themes.length] ?? fallbackTheme;
      title = theme.t;
      dailyMoves = theme.m;
    } else {
      const rotation = (i - 1) % 3;
      if (rotation === 0) {
        title = "Push Focus";
        dailyMoves = activeDB.push;
      } else if (rotation === 1) {
        title = "Pull Focus";
        dailyMoves = activeDB.pull;
      } else {
        title = "Legs & Core";
        dailyMoves = activeDB.legs;
      }
    }

    plan.push({
      day: i,
      title,
      note: sessionStyle.note,
      warmup: activeWarmup,
      exercises: dailyMoves.slice(0, exerciseCount).map((ex) => ({
        name: ex,
        reps: sessionStyle.label,
        rest: sessionStyle.rest,
      })),
    });
  }

  return plan;
}

function ParticleBackground() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.3,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      moveY: `${Math.random() * -100 - 50}px`,
    }));
    setParticles(newParticles);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-1 w-1 rounded-full bg-[#ccff00]"
          style={{ left: p.x, top: p.y, opacity: p.opacity }}
          animate={{
            y: [0, p.moveY],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function WorkoutPlanPanel({ compact = false }: { compact?: boolean }) {
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [apiPlan, setApiPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<WorkoutHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [formData, setFormData] = useState<WorkoutForm>(DEFAULT_FORM);

  const previewPlan = useMemo(() => buildPreviewPlan(formData), [formData]);

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await fetch("/api/workout-history?limit=8");
      const data = (await response.json()) as WorkoutHistoryResponse;
      if (!response.ok) {
        throw new Error(data.error || "Failed to load history.");
      }
      setHistoryItems(data.items ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load history.";
      setHistoryError(message);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [userId]);

  const saveCurrentPlan = useCallback(async () => {
    if (!userId || !apiPlan) return;
    setIsSavingPlan(true);
    setSaveMessage(null);
    try {
      const response = await fetch("/api/workout-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generatedPlan: apiPlan,
          formData,
        }),
      });
      const data = (await response.json()) as SaveWorkoutHistoryResponse;
      if (!response.ok) {
        throw new Error(data.error || "Failed to save plan.");
      }
      setSaveMessage("Plan saved to your account.");
      await loadHistory();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save plan.";
      setSaveMessage(message);
    } finally {
      setIsSavingPlan(false);
    }
  }, [apiPlan, formData, loadHistory, userId]);

  const loadHistoryItemIntoView = (item: WorkoutHistoryItem) => {
    setFormData(item.formData);
    setApiPlan(item.generatedPlan);
    setShowResult(true);
    setError(null);
    setCopied(false);
    setSaveMessage(null);
    setTimeout(() => {
      document.getElementById("workout-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!userId) {
      setHistoryItems([]);
      setHistoryError(null);
      return;
    }
    void loadHistory();
  }, [isAuthLoaded, loadHistory, userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowResult(false);
    setApiPlan(null);
    setError(null);
    setCopied(false);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/workout-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as WorkoutApiResponse;
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate workout plan.");
      }

      setApiPlan(data.plan ?? null);
      setShowResult(true);

      setTimeout(() => {
        document.getElementById("workout-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong while generating your workout plan.";
      setError(normalizeWorkoutError(message));
      setShowResult(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const copyPlan = async () => {
    if (!apiPlan) return;
    await navigator.clipboard.writeText(apiPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const selectClass =
    "w-full cursor-pointer rounded-xl border border-white/10 bg-[#1a1a1a] p-4 text-white outline-none transition-all focus:border-[#ccff00]";

  return (
    <section
      id="workout"
      className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/45 shadow-2xl backdrop-blur-xl ${
        compact ? "p-6 md:p-8" : "p-8 md:p-12"
      }`}
    >
      <ParticleBackground />

      {!compact && (
        <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden opacity-[0.02]">
          <div className="absolute inset-0 flex flex-col justify-around">
            <h2 className="text-center text-[20vw] leading-none font-black italic uppercase text-white">ELITE</h2>
            <h2
              className="text-center text-[20vw] leading-none font-black italic uppercase text-transparent"
              style={{ WebkitTextStroke: "1px white" }}
            >
              PROTOCOL
            </h2>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl">
        {!compact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <div className="mb-4 inline-block rounded-full bg-[#ccff00] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
              FitFusion AI Lab
            </div>
            <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white md:text-7xl">
              WORKOUT <span className="text-[#ccff00]">ARCHITECT</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
              Old workflow, upgraded stack: neon UI, animated experience, video-backed atmosphere, and live Gemini API-powered planning.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] border border-white/8 bg-[#111]/80 p-8 shadow-2xl backdrop-blur-xl md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">1. Personal Metrics</label>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    name="age"
                    min={12}
                    max={90}
                    placeholder="Age"
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-[#ccff00]"
                    onChange={handleChange}
                    value={formData.age}
                    required
                  />
                  <input
                    type="number"
                    name="height"
                    min={120}
                    max={230}
                    placeholder="cm"
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-[#ccff00]"
                    onChange={handleChange}
                    value={formData.height}
                    required
                  />
                  <input
                    type="number"
                    name="weight"
                    min={35}
                    max={250}
                    placeholder="kg"
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none focus:border-[#ccff00]"
                    onChange={handleChange}
                    value={formData.weight}
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">2. Environment</label>
                <div className="grid grid-cols-2 gap-4">
                  {(["home", "gym"] as const).map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, environment: env }))}
                      className={`rounded-xl border py-4 font-bold uppercase transition-all ${
                        formData.environment === env
                          ? "border-[#ccff00] bg-[#ccff00] text-black"
                          : "border-white/10 bg-white/5 text-zinc-400"
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">3. Level</label>
                <select name="experience" className={selectClass} value={formData.experience} onChange={handleChange}>
                  <option className="bg-zinc-900" value="Beginner (0-6 months)">Beginner (0-6 months)</option>
                  <option className="bg-zinc-900" value="Intermediate (6 months-2 years)">Intermediate (6 months-2 years)</option>
                  <option className="bg-zinc-900" value="Advanced (2+ years)">Advanced (2+ years)</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">4. Primary Goal</label>
                <select name="goal" className={selectClass} value={formData.goal} onChange={handleChange}>
                  <option className="bg-zinc-900" value="Bulking (Gain Muscle Mass)">Bulking (Gain Muscle Mass)</option>
                  <option className="bg-zinc-900" value="Cutting (Lose Fat & Get Lean)">Cutting (Lose Fat & Get Lean)</option>
                  <option className="bg-zinc-900" value="Strength Training">Strength Training</option>
                  <option className="bg-zinc-900" value="Weight Loss">Weight Loss</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  5. Commitment: {formData.daysPerWeek} Days
                </label>
                <input
                  type="range"
                  name="daysPerWeek"
                  min="1"
                  max="7"
                  value={formData.daysPerWeek}
                  onChange={handleChange}
                  className="h-1 w-full appearance-none rounded-lg bg-zinc-800 accent-[#ccff00]"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">6. Session Time</label>
                <select name="workoutDuration" className={selectClass} value={formData.workoutDuration} onChange={handleChange}>
                  <option className="bg-zinc-900" value="20">20 minutes</option>
                  <option className="bg-zinc-900" value="30">30 minutes</option>
                  <option className="bg-zinc-900" value="45">45 minutes</option>
                  <option className="bg-zinc-900" value="60">60 minutes</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">7. Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Injuries, exercise dislikes, equipment limits..."
                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition-all focus:border-[#ccff00]"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#ccff00] py-6 text-xl font-black uppercase italic text-black transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" />
                  GENERATING...
                </>
              ) : (
                <>
                  INITIATE ARCHITECT <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              id="workout-result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-24 space-y-16 pb-10"
            >
              <div className="relative text-center">
                <div className="absolute top-1/2 left-0 -z-10 h-px w-full bg-white/5" />
                <h3 className="inline-block bg-black px-8 text-4xl font-black uppercase italic tracking-tighter text-white">
                  Active <span className="text-[#ccff00]">Blueprints</span>
                </h3>
              </div>

              {isGenerating && (
                <div className="rounded-2xl border border-white/10 bg-white/2 p-6">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#dff8be]">
                    <Loader2 size={16} className="animate-spin" /> Gemini is crafting your plan...
                  </p>
                  <div className="space-y-2">
                    <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-2">
                <div className="space-y-8">
                  <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                    <p className="text-[11px] font-semibold tracking-[0.15em] text-[#ccff00]/90 uppercase">Preview Schedule</p>
                    <p className="mt-1 text-sm text-white/65">
                      Your quick visual split by day. Detailed Gemini programming appears in the panel on the right.
                    </p>
                  </div>

                  <div className="space-y-8 xl:max-h-300 xl:overflow-y-auto xl:pr-2">
                    {previewPlan.map((session, sIdx) => (
                      <motion.div
                        key={session.day}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: sIdx * 0.08 }}
                        viewport={{ once: true }}
                        className="group relative"
                      >
                        <div className="absolute top-0 -left-4 hidden h-full w-1 bg-white/5 transition-colors group-hover:bg-[#ccff00]/30 md:-left-8 md:block" />

                        <div className="flex flex-col gap-8 lg:flex-row">
                          <div className="space-y-4 lg:w-[34%]">
                            <div className="w-fit -skew-x-12 bg-[#ccff00] px-4 py-1 text-sm font-black italic text-black">
                              DAY {String(session.day).padStart(2, "0")}
                            </div>
                            <h4 className="text-3xl leading-tight font-black italic uppercase text-white">{session.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                              <Clock className="h-3 w-3" /> {formData.workoutDuration} Minute Session
                            </div>
                            <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                              <p className="text-[11px] leading-relaxed italic text-zinc-400">{session.note}</p>
                            </div>
                          </div>

                          <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-[#0d0d0d] p-6 shadow-2xl transition-all group-hover:border-[#ccff00]/20 lg:w-[66%] lg:p-8">
                            <div className="mb-8 flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-4">
                              <div className="rounded-lg bg-orange-500/20 p-2">
                                <Flame className="h-5 w-5 text-orange-500" />
                              </div>
                              <div>
                                <h5 className="text-xs font-black tracking-widest text-white uppercase">Warmup</h5>
                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                  {session.warmup.map((w, wIdx) => (
                                    <span key={wIdx} className="text-[11px] font-medium text-zinc-500">
                                      • {w}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {session.exercises.map((ex, idx) => (
                                <motion.div
                                  key={`${ex.name}-${idx}`}
                                  whileHover={{ scale: 1.01 }}
                                  className="group/item relative flex items-center justify-between rounded-2xl border border-white/5 bg-linear-to-r from-white/1 to-transparent p-5 transition-all hover:border-[#ccff00]/40"
                                >
                                  <div className="flex items-center gap-6">
                                    <div className="text-4xl font-black italic text-[#ccff00]/20 transition-colors group-hover/item:text-[#ccff00]/80">
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <h6 className="text-lg font-bold text-white transition-colors group-hover/item:text-[#ccff00]">{ex.name}</h6>
                                      <div className="mt-1 flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide text-zinc-500 uppercase">
                                          <Dumbbell className="h-3 w-3" /> {ex.reps}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-zinc-800" />
                                        <span className="flex items-center gap-1 text-[10px] font-bold tracking-wide text-zinc-500 uppercase">
                                          <Timer className="h-3 w-3" /> {ex.rest}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="hidden opacity-0 transition-opacity group-hover/item:opacity-100 sm:block">
                                    <Zap className="h-5 w-5 fill-[#ccff00] text-[#ccff00]" />
                                  </div>

                                  <div
                                    className="absolute bottom-0 left-0 h-0.5 bg-[#ccff00] opacity-0 transition-all group-hover/item:opacity-100"
                                    style={{ width: `${(idx + 1) * (100 / session.exercises.length)}%` }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="min-w-0">
                  {apiPlan ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-4xl border border-[#ccff00]/25 bg-black/50 p-6 backdrop-blur-xl md:p-8"
                    >
                      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <h4 className="flex items-center gap-2 text-xl font-black tracking-wide text-[#ccff00] uppercase">
                          <Activity size={20} />
                          Gemini Detailed Plan
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={copyPlan}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold tracking-wider text-white/80 uppercase transition-colors hover:border-[#ccff00]/40 hover:text-[#ccff00]"
                          >
                            {copied ? <ClipboardCheck size={14} /> : <ClipboardCopy size={14} />}
                            {copied ? "Copied" : "Copy"}
                          </button>

                          {isAuthLoaded && userId && (
                            <button
                              type="button"
                              onClick={saveCurrentPlan}
                              disabled={isSavingPlan}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-[#ccff00]/35 bg-[#ccff00]/10 px-3 py-2 text-xs font-semibold tracking-wider text-[#ddf6bf] uppercase transition-colors hover:border-[#ccff00]/55 hover:text-[#f4ffd8] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isSavingPlan ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                              {isSavingPlan ? "Saving" : "Save Plan"}
                            </button>
                          )}
                        </div>
                      </div>

                      {!userId && isAuthLoaded && (
                        <p className="mb-4 text-xs font-medium text-white/55">
                          Sign in to save this plan to your account and load it later.
                        </p>
                      )}

                      {saveMessage && (
                        <div className="mb-4 rounded-xl border border-[#ccff00]/25 bg-[#ccff00]/8 px-3 py-2 text-xs font-semibold text-[#ddf6bf]">
                          {saveMessage}
                        </div>
                      )}

                      <ReactMarkdown
                        components={{
                          h1: (props) => (
                            <h1 className="mb-4 mt-8 text-3xl font-black tracking-wide text-white uppercase" {...props} />
                          ),
                          h2: (props) => (
                            <h2 className="mb-4 mt-8 text-xl font-bold tracking-wider text-[#ccff00] uppercase" {...props} />
                          ),
                          h3: (props) => <h3 className="mb-3 mt-6 text-lg font-semibold text-white/90" {...props} />,
                          p: (props) => <p className="mb-4 text-sm leading-relaxed text-white/75" {...props} />,
                          ul: (props) => (
                            <ul className="mb-6 ml-6 list-disc space-y-2 text-sm marker:text-[#ccff00]" {...props} />
                          ),
                          ol: (props) => (
                            <ol className="mb-6 ml-6 list-decimal space-y-2 text-sm marker:text-[#ccff00]" {...props} />
                          ),
                          li: (props) => <li className="pl-1 text-white/75" {...props} />,
                          table: (props) => (
                            <div className="mb-6 overflow-x-auto rounded-xl border border-white/10">
                              <table className="min-w-full border-collapse text-sm text-white/80" {...props} />
                            </div>
                          ),
                          thead: (props) => <thead className="bg-white/5" {...props} />,
                          th: (props) => (
                            <th className="border border-white/10 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-[#ccff00]" {...props} />
                          ),
                          td: (props) => <td className="border border-white/10 px-3 py-2 align-top" {...props} />,
                          code: (props) => (
                            <code className="wrap-break-word rounded bg-white/10 px-1.5 py-0.5 text-xs text-[#dff8be]" {...props} />
                          ),
                          strong: (props) => (
                            <strong
                              className="rounded border border-[#ccff00]/25 bg-[#ccff00]/10 px-1.5 py-0.5 font-semibold text-white"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {apiPlan}
                      </ReactMarkdown>
                    </motion.div>
                  ) : (
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-xl">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#ccff00]/90 uppercase">
                        Gemini Output
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-white/65">
                        Generate a plan to see the AI detailed breakdown, progress notes, and coaching instructions here.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {userId && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl md:p-6"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="flex items-center gap-2 text-lg font-black uppercase tracking-wide text-white">
                      <History size={18} className="text-primary" />
                      My Saved Workout Plans
                    </h4>
                    <button
                      type="button"
                      onClick={loadHistory}
                      className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-white/75 uppercase transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      Refresh
                    </button>
                  </div>

                  {isHistoryLoading && (
                    <p className="flex items-center gap-2 text-sm text-white/65">
                      <Loader2 size={14} className="animate-spin text-primary" />
                      Loading saved plans...
                    </p>
                  )}

                  {historyError && !isHistoryLoading && (
                    <p className="text-sm text-red-200">{historyError}</p>
                  )}

                  {!isHistoryLoading && !historyError && historyItems.length === 0 && (
                    <p className="text-sm text-white/60">No saved plans yet. Save your current plan to start your history.</p>
                  )}

                  {!isHistoryLoading && historyItems.length > 0 && (
                    <div className="space-y-3">
                      {historyItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/2 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary/85">
                              {item.formData.goal}
                            </p>
                            <p className="mt-1 text-xs text-white/65">
                              {new Date(item.createdAt).toLocaleString()} | {item.formData.environment.toUpperCase()} |{" "}
                              {item.formData.workoutDuration} min | {item.formData.daysPerWeek} days/week
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => loadHistoryItemIntoView(item)}
                            className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#ddf6bf] transition-colors hover:border-primary/50 hover:bg-primary/15"
                          >
                            Load
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              <div className="pt-8 text-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-[#ccff00]/20 bg-[#ccff00]/10 px-6 py-3">
                  <Activity className="h-5 w-5 text-[#ccff00]" />
                  <span className="text-sm font-bold tracking-tight text-white uppercase italic">
                    Ready to Begin the Session?
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
