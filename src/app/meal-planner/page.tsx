/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, Activity, Target, Sparkles, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import VideoBackground from "../meal-planner/VideoBackground"; // Make sure this file exists in the same folder!

export default function MealPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    // The main wrapper is relative and hides overflow so the background video stays perfectly contained
    <div className="relative min-h-screen bg-[#0b1020] pt-28 pb-12 text-white overflow-hidden">
      
      {/* This is your video background component.
        Remember to place 'food-bg.mp4' in your public/ folder! 
      */}
      <VideoBackground />

      {/* The z-10 ensures all your content sits ABOVE the video.
      */}
      <div className="relative z-10 container-shell mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b9ff66]/10 text-[#b9ff66] shadow-lg shadow-[#b9ff66]/10">
            <Utensils size={32} />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            AI Meal & Nutrition Planner
          </h1>
          <p className="mb-10 text-lg text-white/60">
            Get a customized nutrition plan and meal timetable tailored for your specific goals, including macro breakdowns and supplement timing.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md sm:p-10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Age</label>
                  <input required type="number" name="age" placeholder="e.g. 25" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#b9ff66] focus:outline-none focus:ring-1 focus:ring-[#b9ff66] transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Weight (kg)</label>
                  <input required type="number" name="weight" placeholder="e.g. 75" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#b9ff66] focus:outline-none focus:ring-1 focus:ring-[#b9ff66] transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <Target size={16} className="text-[#b9ff66]" /> Primary Goal
                </label>
                <select required name="goal" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#b9ff66] focus:outline-none focus:ring-1 focus:ring-[#b9ff66] transition-all [&>option]:bg-[#0b1020]">
                  <option value="">Select a goal...</option>
                  <option value="lean_bulk">Lean Bulking (Muscle Gain, Minimal Fat)</option>
                  <option value="dirty_bulk">Aggressive Bulking (Max Mass)</option>
                  <option value="cut">Cutting (Fat Loss, Maintain Muscle)</option>
                  <option value="maintenance">Maintenance (Recomp)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <Activity size={16} className="text-[#b9ff66]" /> Dietary Preferences / Allergies
                </label>
                <input type="text" name="preferences" placeholder="e.g. Vegetarian, lactose intolerant, no nuts" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#b9ff66] focus:outline-none focus:ring-1 focus:ring-[#b9ff66] transition-all" />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-red-400 border border-red-500/20">
                  <AlertCircle size={18} />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9ff66] px-6 py-4 text-base font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100">
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Generating Plan...</>
                ) : (
                  <><Sparkles size={20} /> Generate Meal & Supplement Plan</>
                )}
              </button>
            </form>
          </motion.div>

          {/* AI Result Section with Custom Markdown Styling */}
          {mealPlan && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-8 rounded-3xl border border-[#b9ff66]/30 bg-[#b9ff66]/5 p-6 sm:p-10 shadow-xl backdrop-blur-md"
             >
               <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-[#b9ff66] border-b border-[#b9ff66]/20 pb-4">
                  <Sparkles size={24} />
                  Your Custom Nutrition Protocol
               </h2>
               
               <div className="w-full">
                 <ReactMarkdown
                   components={{
                     h1: ({node, ...props}) => <h1 className="mt-8 mb-4 text-3xl font-bold text-white" {...props} />,
                     h2: ({node, ...props}) => <h2 className="mt-8 mb-4 text-2xl font-semibold text-[#b9ff66]" {...props} />,
                     h3: ({node, ...props}) => <h3 className="mt-6 mb-3 text-xl font-medium text-white/90" {...props} />,
                     p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-white/80" {...props} />,
                     ul: ({node, ...props}) => <ul className="mb-6 ml-6 list-outside list-disc space-y-2 marker:text-[#b9ff66]" {...props} />,
                     ol: ({node, ...props}) => <ol className="mb-6 ml-6 list-outside list-decimal space-y-2 text-white/80 marker:text-[#b9ff66]" {...props} />,
                     li: ({node, ...props}) => <li className="text-white/80 pl-2" {...props} />,
                     strong: ({node, ...props}) => <strong className="font-semibold text-white bg-[#b9ff66]/10 px-1 py-0.5 rounded" {...props} />,
                     table: ({node, ...props}) => <div className="overflow-x-auto mb-6"><table className="w-full text-left border-collapse" {...props} /></div>,
                     th: ({node, ...props}) => <th className="border-b border-[#b9ff66]/30 py-3 px-4 text-[#b9ff66] font-medium" {...props} />,
                     td: ({node, ...props}) => <td className="border-b border-white/10 py-3 px-4 text-white/80" {...props} />,
                   }}
                 >
                   {mealPlan}
                 </ReactMarkdown>
               </div>
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}