// src/app/meal-image-analyzer/page.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Upload, X, Zap, Flame, Beef, Wheat, Droplets,
  ChevronDown, ArrowLeft, Sparkles, AlertTriangle, Check,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Types ───
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

// ─── Constants ───
const FITNESS_GOALS = [
  { id: "bulking", label: "Bulking", icon: "💪", desc: "High calorie surplus for muscle gain" },
  { id: "cutting", label: "Cutting", icon: "🔥", desc: "Calorie deficit for fat loss" },
  { id: "lean", label: "Lean Bulk", icon: "⚡", desc: "Slight surplus, minimal fat gain" },
  { id: "maintain", label: "Maintenance", icon: "⚖️", desc: "Sustain current physique" },
  { id: "keto", label: "Keto", icon: "🥑", desc: "High fat, very low carb" },
  { id: "athlete", label: "Athletic", icon: "🏃", desc: "Performance & recovery focused" },
] as const;

const LOADING_MESSAGES = [
  "Scanning your plate...",
  "Counting those macros...",
  "Consulting the nutrition database...",
  "Rating goal compatibility...",
  "Almost there...",
];

function formatAnalysisError(message: string) {
  const lower = message.toLowerCase();

  if (
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("429") ||
    lower.includes("billing")
  ) {
    return "Usage limit reached for the AI service. Please verify billing or wait a bit and retry.";
  }

  return message;
}

// ─── Macro Ring SVG Component ───
function MacroRing({
  label,
  value,
  unit,
  pct,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  unit: string;
  pct: number;
  color: string;
  icon: LucideIcon;
}) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-24 h-24">
        <svg width={96} height={96} viewBox="0 0 96 96">
          <circle cx={48} cy={48} r={r} fill="none" stroke="#2A2A30" strokeWidth={5} />
          <motion.circle
            cx={48}
            cy={48}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeDasharray={circ}
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white font-mono">{value}</span>
          <span className="text-[11px] text-zinc-500 -mt-0.5">{unit}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Icon size={13} color={color} />
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Badge Component ───
function Badge({
  children,
  color,
  bg,
}: {
  children: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
      style={{ color, background: bg, borderColor: `${color}22` }}
    >
      {children}
    </span>
  );
}

// ─── Verdict Card ───
function VerdictCard({ goal, rating, reason }: Verdict) {
  const styles: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    Excellent: { color: "#b9ff66", bg: "rgba(185,255,102,0.14)", icon: <Check size={14} /> },
    Good: { color: "#e8f9d2", bg: "rgba(185,255,102,0.08)", icon: <Check size={14} /> },
    Moderate: { color: "#ffffff", bg: "rgba(255,255,255,0.08)", icon: <AlertTriangle size={14} /> },
    Poor: { color: "#b3b3b8", bg: "rgba(255,255,255,0.06)", icon: <X size={14} /> },
  };
  const s = styles[rating] || styles.Moderate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-[#121215] border border-[#2A2A30]"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{goal}</span>
        <Badge color={s.color} bg={s.bg}>
          {s.icon}
          <span className="ml-0.5">{rating}</span>
        </Badge>
      </div>
      <p className="text-[13px] text-zinc-500 leading-relaxed mt-2">{reason}</p>
    </motion.div>
  );
}

// ─── Main Page Component ───
export default function MealImageAnalyzerPage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState("bulking");
  const [goalOpen, setGoalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState<MealAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const analyze = async () => {
    if (!image || !imagePreview) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingMsg(0);

    // Cycle loading messages
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);

    try {
      const base64 = imagePreview.split(",")[1];
      const goal = FITNESS_GOALS.find((g) => g.id === selectedGoal)!;

      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mimeType: image.type || "image/jpeg",
          goalLabel: goal.label,
          goalDesc: goal.desc,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(formatAnalysisError(message));
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  const activeGoal = FITNESS_GOALS.find((g) => g.id === selectedGoal)!;
  const totalMacroG = result ? result.protein_g + result.carbs_g + result.fat_g : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E8E8ED] flex flex-col items-center px-4 pb-16">
      <div className="w-full max-w-160">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 pt-7 pb-5">
          <Link
            href="/"
            className="bg-[#121215] border border-[#2A2A30] rounded-xl p-2 text-zinc-500 hover:text-white hover:border-primary/40 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 bg-linear-to-r from-white via-primary to-white bg-clip-text text-transparent">
              <Camera size={22} className="text-primary" />
              Meal Analyzer
            </h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">
              Snap your plate — get instant macro intel
            </p>
          </div>
        </div>

        {/* ── Goal Selector ── */}
        {!result && (
          <div className="mb-5 relative">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5 block">
              Your fitness goal
            </label>
            <button
              onClick={() => setGoalOpen(!goalOpen)}
              className="w-full bg-[#121215] border rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer text-[15px] font-medium transition-colors"
              style={{ borderColor: goalOpen ? "#b9ff66" : "#2A2A30" }}
            >
              <span>
                {activeGoal.icon} {activeGoal.label}{" "}
                <span className="text-zinc-500 font-normal text-[13px]">
                  — {activeGoal.desc}
                </span>
              </span>
              <ChevronDown
                size={16}
                className="text-zinc-500 transition-transform"
                style={{ transform: goalOpen ? "rotate(180deg)" : "none" }}
              />
            </button>

            <AnimatePresence>
              {goalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#16161A] border border-[#2A2A30] rounded-xl shadow-2xl overflow-hidden"
                >
                  {FITNESS_GOALS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSelectedGoal(g.id);
                        setGoalOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm hover:bg-[#1A1A1F] transition-colors"
                      style={{
                        background:
                          selectedGoal === g.id ? "rgba(185,255,102,0.12)" : undefined,
                        borderLeft:
                          selectedGoal === g.id
                            ? "3px solid #b9ff66"
                            : "3px solid transparent",
                      }}
                    >
                      <span className="text-lg">{g.icon}</span>
                      <div>
                        <div className="font-semibold text-white">{g.label}</div>
                        <div className="text-xs text-zinc-500">{g.desc}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Upload Zone ── */}
        {!result && (
          <motion.div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !image && fileRef.current?.click()}
            className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center transition-all"
            style={{
              border: `2px dashed ${dragOver ? "#b9ff66" : "#2A2A30"}`,
              background: dragOver
                ? "rgba(185,255,102,0.1)"
                : image
                  ? "transparent"
                  : "#121215",
              minHeight: image ? "auto" : 220,
              cursor: image ? "default" : "pointer",
            }}
            whileHover={!image ? { borderColor: "#b9ff66" } : {}}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {image && imagePreview ? (
              <div className="relative w-full">
                <Image
    src={imagePreview}
    alt="Meal preview"
    fill
    className="object-cover block rounded-xl"
  />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-black/90 transition-colors"
                >
                  <X size={16} color="#fff" />
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mb-3 border border-primary/30">
                  <Upload size={24} className="text-primary" />
                </div>
                <p className="text-[15px] font-semibold text-white">
                  Drop your meal photo here
                </p>
                <p className="text-[13px] text-zinc-500 mt-1">
                  or click to browse &middot; JPG, PNG, WEBP
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Analyze Button ── */}
        {image && !result && (
          <motion.button
            onClick={analyze}
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-4 py-3.5 rounded-xl border-none text-[15px] font-bold flex items-center justify-center gap-2 transition-all disabled:cursor-default cursor-pointer"
            style={{
              background: loading
                ? "#121215"
                : "linear-gradient(135deg, #8fe84b 0%, #b9ff66 55%, #d9ffb2 100%)",
              color: loading ? "#8888A0" : "#060706",
              boxShadow: loading ? "none" : "0 8px 28px rgba(185,255,102,0.24)",
            }}
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.99 } : {}}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {LOADING_MESSAGES[loadingMsg]}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze Meal
              </>
            )}
          </motion.button>
        )}

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 p-4 rounded-2xl bg-[rgba(185,255,102,0.06)] border border-[rgba(185,255,102,0.28)] text-[13px]"
            >
              <div className="flex items-start justify-center gap-2.5 text-left">
                <AlertTriangle size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-[13px] text-[#f1f3e8] leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              {/* Meal image + name */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl overflow-hidden bg-[#121215] border border-[#2A2A30]"
              >
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={result.meal_name}
                    className="w-full max-h-70 object-cover"
                  />
                )}
                <div className="px-5 py-4">
                  <h2 className="text-[22px] font-bold">{result.meal_name}</h2>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge color="#b9ff66" bg="rgba(185,255,102,0.12)">
                      <Flame size={12} /> {result.calories} kcal
                    </Badge>
                    <Badge color="#f2f2f5" bg="rgba(255,255,255,0.06)">
                      {result.portion_size}
                    </Badge>
                  </div>
                </div>
              </motion.div>

              {/* Macros */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-2xl bg-[#121215] border border-[#2A2A30]"
              >
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                  Macronutrient Breakdown
                </h3>
                <div className="flex justify-around flex-wrap gap-3">
                  <MacroRing
                    label="Protein"
                    value={result.protein_g}
                    unit="g"
                    pct={totalMacroG ? (result.protein_g / totalMacroG) * 100 : 0}
                    color="#b9ff66"
                    icon={Beef}
                  />
                  <MacroRing
                    label="Carbs"
                    value={result.carbs_g}
                    unit="g"
                    pct={totalMacroG ? (result.carbs_g / totalMacroG) * 100 : 0}
                    color="#ffffff"
                    icon={Wheat}
                  />
                  <MacroRing
                    label="Fat"
                    value={result.fat_g}
                    unit="g"
                    pct={totalMacroG ? (result.fat_g / totalMacroG) * 100 : 0}
                    color="#8fe84b"
                    icon={Droplets}
                  />
                </div>

                {/* Secondary nutrients */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#2A2A30]">
                  {[
                    { label: "Fiber", val: `${result.fiber_g}g` },
                    { label: "Sugar", val: `${result.sugar_g}g` },
                    { label: "Sodium", val: `${result.sodium_mg}mg` },
                  ].map((n) => (
                    <div key={n.label} className="text-center">
                      <div className="text-base font-bold text-white font-mono">
                        {n.val}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{n.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Ingredients */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl bg-[#121215] border border-[#2A2A30]"
              >
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                  Detected Ingredients
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.ingredients.map((ing, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="px-3 py-1 rounded-full text-[13px] font-medium bg-[#16161A] text-white border border-[#2A2A30]"
                    >
                      {ing}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Verdicts */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-5 rounded-2xl bg-[#121215] border border-[#2A2A30]"
              >
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                  <Zap size={13} />
                  Goal Compatibility
                </h3>
                <div className="flex flex-col gap-2">
                  {result.verdicts.map((v, i) => (
                    <VerdictCard key={i} {...v} />
                  ))}
                </div>
              </motion.div>

              {/* Summary & Tip */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-5 rounded-2xl border border-primary/25"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(185,255,102,0.12), rgba(255,255,255,0.05))",
                }}
              >
                <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-1.5">
                  <Sparkles size={15} /> AI Summary
                </h3>
                <p className="text-sm text-white leading-relaxed mb-3">
                  {result.summary}
                </p>
                <div className="p-3 rounded-lg bg-[rgba(185,255,102,0.08)] border border-primary/25">
                  <span className="text-xs font-bold text-[#dff8be] uppercase tracking-wider">
                    💡 Pro tip
                  </span>
                  <p className="text-[13px] text-white mt-1 leading-snug">
                    {result.tip}
                  </p>
                </div>
              </motion.div>

              {/* Analyze another */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={reset}
                className="w-full py-3.5 rounded-xl border border-[#2A2A30] bg-[#121215] text-white text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[rgba(185,255,102,0.08)] hover:border-primary/40 transition-colors"
              >
                <Camera size={16} /> Analyze Another Meal
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
