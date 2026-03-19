/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Utensils, Activity, Target, Sparkles, Loader2, AlertCircle, Camera } from "lucide-react";
import ReactMarkdown from "react-markdown";
import VideoBackground from "./VideoBackground";
import MealImageAnalyzerPanel from "@/components/meal/MealImageAnalyzerPanel";

export default function MealPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<"planner" | "analyzer">("planner");

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

  const switchTool = (tool: "planner" | "analyzer") => {
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate plan");
      }
      
      setMealPlan(result.plan);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong connecting to the AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-background pt-28 pb-12 text-white overflow-hidden">
      
      <VideoBackground />

      {/* Ambient glow blobs to enhance the glassmorphism effect */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-125 w-225 -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />

        <div className="relative z-10 container-shell mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(185,255,102,0.15)]">
            <Utensils size={28} strokeWidth={2.5} />
          </div>
          <h1 className="mb-4 text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            AI <span className="text-primary drop-shadow-[0_0_20px_rgba(185,255,102,0.3)]">Nutrition Lab</span>
          </h1>
          <p className="mb-10 text-lg font-light text-white/60">
            Generate meal protocols and analyze meal images in one focused flow.
          </p>

          <div className="mx-auto mb-10 flex w-full max-w-xl rounded-2xl border border-white/12 bg-black/30 p-1.5 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => switchTool("planner")}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[11px] sm:text-sm font-bold uppercase tracking-wider transition-all ${
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
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[11px] sm:text-sm font-bold uppercase tracking-wider transition-all ${
                activeTool === "analyzer"
                  ? "bg-primary text-black shadow-[0_0_20px_rgba(185,255,102,0.28)]"
                  : "text-white/75 hover:text-white"
              }`}
            >
              <Camera size={16} />
              Image Analyzer
            </button>
          </div>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          {activeTool === "planner" ? (
            <div id="planner" className="scroll-mt-32">
              {/* Form Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-2xl sm:p-10"
                style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Age</label>
                      <input required type="number" name="age" placeholder="e.g. 25" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/80">Weight (kg)</label>
                      <input required type="number" name="weight" placeholder="e.g. 75" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Target size={16} className="text-primary" /> Primary Goal
                    </label>
                    <select required name="goal" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all [&>option]:bg-[#0a0a0a]">
                      <option value="">Select a goal...</option>
                      <option value="lean_bulk">Lean Bulking (Muscle Gain, Minimal Fat)</option>
                      <option value="dirty_bulk">Aggressive Bulking (Max Mass)</option>
                      <option value="cut">Cutting (Fat Loss, Maintain Muscle)</option>
                      <option value="maintenance">Maintenance (Recomp)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                      <Activity size={16} className="text-primary" /> Dietary Preferences / Allergies
                    </label>
                    <input type="text" name="preferences" placeholder="e.g. Vegetarian, lactose intolerant, no nuts" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-red-200 border border-red-500/20 backdrop-blur-md">
                      <AlertCircle size={18} className="text-red-400" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(185,255,102,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-primary disabled:hover:scale-100 disabled:hover:shadow-none">
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Generating Protocol...</>
                    ) : (
                      <><Sparkles size={18} /> Generate Meal & Supplement Plan</>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* AI Result Section */}
              {mealPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-3xl border border-primary/20 bg-black/20 p-6 sm:p-10 backdrop-blur-2xl"
                  style={{ boxShadow: "0 8px 40px rgba(185,255,102,0.06)" }}
                >
                  <h2 className="mb-8 flex items-center gap-3 text-2xl font-black uppercase tracking-wide text-primary border-b border-primary/10 pb-4">
                    <Sparkles size={24} />
                    Your Custom Protocol
                  </h2>

                  <div className="w-full">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className="mt-8 mb-4 text-3xl font-black uppercase tracking-wide text-white" {...props} />,
                        h2: ({node, ...props}) => <h2 className="mt-8 mb-4 text-xl font-bold uppercase tracking-wider text-primary" {...props} />,
                        h3: ({node, ...props}) => <h3 className="mt-6 mb-3 text-lg font-semibold text-white/90" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 text-sm leading-relaxed text-white/70" {...props} />,
                        ul: ({node, ...props}) => <ul className="mb-6 ml-6 list-outside list-disc space-y-2 text-sm marker:text-primary" {...props} />,
                        ol: ({node, ...props}) => <ol className="mb-6 ml-6 list-outside list-decimal space-y-2 text-sm text-white/70 marker:text-primary" {...props} />,
                        li: ({node, ...props}) => <li className="text-white/70 pl-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-white bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20" {...props} />,
                        table: ({node, ...props}) => <div className="overflow-x-auto mb-6"><table className="w-full text-sm text-left border-collapse" {...props} /></div>,
                        th: ({node, ...props}) => <th className="border-b border-primary/30 py-3 px-4 text-primary font-semibold uppercase tracking-wider text-xs" {...props} />,
                        td: ({node, ...props}) => <td className="border-b border-white/5 py-3 px-4 text-white/70" {...props} />,
                      }}
                    >
                      {mealPlan}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <MealImageAnalyzerPanel />
          )}
        </div>
      </div>
    </div>
  );
}
