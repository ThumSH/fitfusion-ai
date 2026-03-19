"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  AlertCircle,
  Building2,
  ClipboardCheck,
  ClipboardCopy,
  Dumbbell,
  Flame,
  Home,
  Loader2,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";

type WorkoutForm = {
  age: string;
  height: string;
  weight: string;
  goal: string;
  experience: string;
  daysPerWeek: string;
  workoutDuration: string;
  environment: "home" | "gym";
  notes: string;
};

const DEFAULT_FORM: WorkoutForm = {
  age: "",
  height: "",
  weight: "",
  goal: "Muscle Gain",
  experience: "Beginner",
  daysPerWeek: "4",
  workoutDuration: "45",
  environment: "gym",
  notes: "",
};

const INPUT_CLASS =
  "w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#b9ff66] focus:outline-none focus:ring-1 focus:ring-[#b9ff66]";

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

export default function WorkoutPlanPanel() {
  const [formData, setFormData] = useState<WorkoutForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const summary = useMemo(
    () => [
      {
        icon: <Target size={13} />,
        label: formData.goal,
      },
      {
        icon: <Timer size={13} />,
        label: `${formData.workoutDuration} min x ${formData.daysPerWeek} days`,
      },
      {
        icon: formData.environment === "gym" ? <Building2 size={13} /> : <Home size={13} />,
        label: formData.environment === "gym" ? "Gym Program" : "Home Program",
      },
    ],
    [formData]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copyPlan = async () => {
    if (!plan) return;
    await navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);
    setCopied(false);

    try {
      const response = await fetch("/api/workout-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { plan?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate workout plan.");
      }

      setPlan(data.plan ?? "");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong while generating your workout plan.";
      setError(normalizeWorkoutError(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="workout" className="scroll-mt-32 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/12 bg-black/30 p-6 backdrop-blur-2xl sm:p-10"
        style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.35)" }}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h2 className="flex items-center gap-2 text-2xl font-black uppercase tracking-wide text-[#b9ff66]">
            <Dumbbell size={22} />
            AI Workout Planner
          </h2>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#b9ff66]/25 bg-[#b9ff66]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#dff8be]">
            <Sparkles size={12} />
            Gemini Live
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {summary.map((item, idx) => (
            <span
              key={`${item.label}-${idx}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/80"
            >
              <span className="text-[#b9ff66]">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Body Metrics</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Age</label>
                <input
                  required
                  type="number"
                  min={12}
                  max={90}
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Height (cm)</label>
                <input
                  required
                  type="number"
                  min={120}
                  max={230}
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Weight (kg)</label>
                <input
                  required
                  type="number"
                  min={35}
                  max={250}
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">Training Setup</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Goal</label>
                <select name="goal" value={formData.goal} onChange={handleChange} className={INPUT_CLASS + " [&>option]:bg-[#0a0a0a]"}>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Fat Loss">Fat Loss</option>
                  <option value="Strength">Strength</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Experience</label>
                <select name="experience" value={formData.experience} onChange={handleChange} className={INPUT_CLASS + " [&>option]:bg-[#0a0a0a]"}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Days / Week</label>
                <select name="daysPerWeek" value={formData.daysPerWeek} onChange={handleChange} className={INPUT_CLASS + " [&>option]:bg-[#0a0a0a]"}>
                  {[2, 3, 4, 5, 6].map((day) => (
                    <option key={day} value={String(day)}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Session Length</label>
                <select name="workoutDuration" value={formData.workoutDuration} onChange={handleChange} className={INPUT_CLASS + " [&>option]:bg-[#0a0a0a]"}>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="75">75 min</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Environment</label>
                <select name="environment" value={formData.environment} onChange={handleChange} className={INPUT_CLASS + " [&>option]:bg-[#0a0a0a]"}>
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Injuries, equipment limits, movement preferences..."
              className={INPUT_CLASS}
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9ff66] px-6 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(185,255,102,0.45)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#b9ff66] disabled:hover:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Building Workout Blueprint...
              </>
            ) : (
              <>
                <Flame size={17} />
                Generate Workout Plan
              </>
            )}
          </button>
        </form>
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-white/10 bg-black/25 p-6 backdrop-blur-xl"
        >
          <p className="mb-4 text-sm font-semibold text-[#dff8be]">Gemini is crafting your training plan...</p>
          <div className="space-y-3">
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-white/10" />
          </div>
        </motion.div>
      )}

      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#b9ff66]/20 bg-black/25 p-6 backdrop-blur-2xl sm:p-10"
          style={{ boxShadow: "0 8px 42px rgba(185,255,102,0.08)" }}
        >
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#b9ff66]/10 pb-4">
            <h3 className="flex items-center gap-3 text-2xl font-black uppercase tracking-wide text-[#b9ff66]">
              <Dumbbell size={24} />
              Your Workout Blueprint
            </h3>
            <button
              type="button"
              onClick={copyPlan}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors hover:border-[#b9ff66]/40 hover:text-[#b9ff66]"
            >
              {copied ? <ClipboardCheck size={14} /> : <ClipboardCopy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="w-full">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => (
                  <h1 className="mb-4 mt-8 text-3xl font-black uppercase tracking-wide text-white" {...props} />
                ),
                h2: ({node, ...props}) => (
                  <h2 className="mb-4 mt-8 text-xl font-bold uppercase tracking-wider text-[#b9ff66]" {...props} />
                ),
                h3: ({node, ...props}) => <h3 className="mb-3 mt-6 text-lg font-semibold text-white/90" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-sm leading-relaxed text-white/75" {...props} />,
                ul: ({node, ...props}) => (
                  <ul className="mb-6 ml-6 list-outside list-disc space-y-2 text-sm marker:text-[#b9ff66]" {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol className="mb-6 ml-6 list-outside list-decimal space-y-2 text-sm text-white/75 marker:text-[#b9ff66]" {...props} />
                ),
                li: ({node, ...props}) => <li className="pl-1 text-white/75" {...props} />,
                strong: ({node, ...props}) => (
                  <strong
                    className="rounded border border-[#b9ff66]/20 bg-[#b9ff66]/10 px-1.5 py-0.5 font-semibold text-white"
                    {...props}
                  />
                ),
                table: ({node, ...props}) => (
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm" {...props} />
                  </div>
                ),
                th: ({node, ...props}) => (
                  <th
                    className="border-b border-[#b9ff66]/30 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#b9ff66]"
                    {...props}
                  />
                ),
                td: ({node, ...props}) => <td className="border-b border-white/5 px-4 py-3 text-white/75" {...props} />,
              }}
            >
              {plan}
            </ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
}
