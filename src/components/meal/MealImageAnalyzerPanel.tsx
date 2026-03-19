"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Beef,
  Camera,
  Check,
  Droplets,
  Flame,
  Loader2,
  Sparkles,
  Upload,
  Wheat,
  X,
} from "lucide-react";

interface Verdict {
  goal: string;
  rating: "Excellent" | "Good" | "Moderate" | "Poor";
  reason: string;
}

interface MealAnalysis {
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  ingredients: string[];
  portion_size: string;
  verdicts: Verdict[];
  summary: string;
  tip: string;
}

const FITNESS_GOALS = [
  { id: "bulking", label: "Bulking", desc: "Calorie surplus for muscle gain" },
  { id: "cutting", label: "Cutting", desc: "Calorie deficit for fat loss" },
  { id: "lean_bulk", label: "Lean Bulk", desc: "Slight surplus with cleaner macros" },
  { id: "maintenance", label: "Maintenance", desc: "Balanced intake for body recomposition" },
  { id: "keto", label: "Keto", desc: "Low carb and high fat approach" },
  { id: "athletic", label: "Athletic Performance", desc: "Fueling performance and recovery" },
] as const;

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

function getFriendlyError(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("quota") || lower.includes("rate limit") || lower.includes("429")) {
    return "AI usage limit reached right now. Retry shortly or check your API billing limits.";
  }

  if (lower.includes("model") && lower.includes("unavailable")) {
    return "The AI model is temporarily unavailable. Please retry in a moment.";
  }

  return message;
}

function ratingTone(rating: Verdict["rating"]) {
  switch (rating) {
    case "Excellent":
      return "text-[#b9ff66] border-[#b9ff66]/30 bg-[#b9ff66]/10";
    case "Good":
      return "text-[#eafbd1] border-[#b9ff66]/20 bg-[#b9ff66]/5";
    case "Moderate":
      return "text-white/80 border-white/20 bg-white/5";
    default:
      return "text-white/70 border-white/10 bg-white/5";
  }
}

export default function MealImageAnalyzerPanel() {
  const [selectedGoal, setSelectedGoal] = useState<string>(FITNESS_GOALS[0].id);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeGoal = useMemo(
    () => FITNESS_GOALS.find((goal) => goal.id === selectedGoal) ?? FITNESS_GOALS[0],
    [selectedGoal]
  );

  const handleFile = useCallback((candidate?: File) => {
    if (!candidate) return;

    if (!candidate.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    if (candidate.size > MAX_FILE_SIZE_BYTES) {
      setError("Image is too large. Keep it under 8MB for reliable analysis.");
      return;
    }

    setImage(candidate);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(candidate);
  }, []);

  const analyzeMeal = async () => {
    if (!image || !imagePreview) {
      setError("Upload a meal image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64 = imagePreview.split(",")[1];
      const response = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mimeType: image.type || "image/jpeg",
          goalLabel: activeGoal.label,
          goalDesc: activeGoal.desc,
        }),
      });

      const data = (await response.json()) as MealAnalysis & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze image.");
      }

      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(getFriendlyError(message));
    } finally {
      setLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <motion.div
      id="analyzer"
      className="scroll-mt-32 rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-2xl sm:p-10"
      style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h2 className="flex items-center gap-2 text-xl font-black uppercase tracking-wide text-[#b9ff66]">
          <Camera size={22} />
          Meal Image Analyzer
        </h2>
        <button
          type="button"
          onClick={resetAnalyzer}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors hover:border-[#b9ff66]/40 hover:text-[#b9ff66]"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Analysis Goal</label>
            <select
              value={selectedGoal}
              onChange={(event) => setSelectedGoal(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#b9ff66] focus:outline-none focus:ring-1 focus:ring-[#b9ff66] [&>option]:bg-[#0a0a0a]"
            >
              {FITNESS_GOALS.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className="relative rounded-2xl border-2 border-dashed p-4 transition-colors"
            style={{
              borderColor: dragOver ? "#b9ff66" : "rgba(255,255,255,0.18)",
              background: dragOver ? "rgba(185,255,102,0.08)" : "rgba(255,255,255,0.03)",
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              handleFile(event.dataTransfer.files[0]);
            }}
            onClick={() => !image && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Meal preview"
                  className="h-64 w-full rounded-xl object-cover sm:h-72"
                />
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    resetAnalyzer();
                  }}
                  className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/70 p-1.5 text-white/90 transition-colors hover:border-[#b9ff66]/40 hover:text-[#b9ff66]"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center sm:h-72">
                <div className="mb-3 rounded-2xl border border-[#b9ff66]/30 bg-[#b9ff66]/10 p-4">
                  <Upload size={24} className="text-[#b9ff66]" />
                </div>
                <p className="text-sm font-semibold text-white">Drop your meal image here</p>
                <p className="mt-1 text-xs text-white/60">or click to upload</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={analyzeMeal}
            disabled={loading || !imagePreview}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9ff66] px-6 py-3.5 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(185,255,102,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#b9ff66] disabled:hover:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze Meal
              </>
            )}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[#b9ff66]/30 bg-[#b9ff66]/8 p-3.5">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#b9ff66]" />
              <p className="text-sm text-white/85">{error}</p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          {!result ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <Camera size={28} className="text-[#b9ff66]" />
              <p className="mt-3 text-sm font-semibold text-white">No analysis yet</p>
              <p className="mt-1 max-w-xs text-xs text-white/60">
                Upload a meal image and run analysis to get calories, macros, and goal compatibility.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-black text-white">{result.meal_name}</h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#b9ff66]/30 bg-[#b9ff66]/10 px-3 py-1 text-xs font-semibold text-[#b9ff66]">
                  <Flame size={12} /> {result.calories} kcal
                </div>
                <p className="mt-2 text-xs text-white/60">{result.portion_size}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <Beef size={14} className="mx-auto text-[#b9ff66]" />
                  <p className="mt-1 text-lg font-bold text-white">{result.protein_g}g</p>
                  <p className="text-[11px] text-white/60">Protein</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <Wheat size={14} className="mx-auto text-white" />
                  <p className="mt-1 text-lg font-bold text-white">{result.carbs_g}g</p>
                  <p className="text-[11px] text-white/60">Carbs</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <Droplets size={14} className="mx-auto text-[#8fe84b]" />
                  <p className="mt-1 text-lg font-bold text-white">{result.fat_g}g</p>
                  <p className="text-[11px] text-white/60">Fat</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">Summary</p>
                <p className="text-sm leading-relaxed text-white/80">{result.summary}</p>
              </div>

              <div className="rounded-xl border border-[#b9ff66]/25 bg-[#b9ff66]/10 p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#dcf8b4]">Pro Tip</p>
                <p className="mt-1 text-sm text-white/85">{result.tip}</p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Goal Compatibility
                </p>
                <div className="space-y-2">
                  {result.verdicts.map((verdict, index) => (
                    <div
                      key={`${verdict.goal}-${index}`}
                      className={`flex items-start justify-between gap-3 rounded-xl border p-3 ${ratingTone(verdict.rating)}`}
                    >
                      <div>
                        <p className="text-sm font-semibold">{verdict.goal}</p>
                        <p className="mt-1 text-xs leading-relaxed">{verdict.reason}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-current/20 px-2 py-0.5 text-[11px] font-semibold uppercase">
                        {verdict.rating === "Excellent" || verdict.rating === "Good" ? (
                          <Check size={12} />
                        ) : (
                          <AlertTriangle size={12} />
                        )}
                        {verdict.rating}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
