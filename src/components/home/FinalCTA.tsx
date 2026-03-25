import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChefHat, Dumbbell, Info, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    // Reduced the padding drastically to let the container hug the edges of the screen
    <section className="w-full bg-black p-3 md:p-5">
      {/* Removed strict max-widths to allow massive scaling on ultra-wide monitors */}
      <div className="mx-auto w-full max-w-480">
        
        {/* Switched to viewport-relative heights (vh) so the container stays proportional, reducing extreme image cropping */}
        <div className="relative flex min-h-150 w-full flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-primary/40 bg-[#0a0a0a] pb-24 pt-32 lg:h-[85vh] lg:min-h-200 lg:max-h-250">
          
          {/* Adjusted the image to standard center focus and lowered opacity for that dark, cinematic look */}
          <Image
            src="/best.webp"
            alt="Gym equipment rack"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40 grayscale"
            priority={false}
          />

          {/* Simplified gradient overlay to ensure text remains highly legible */}
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/40 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,255,102,0.06),transparent_65%)]" />

          {/* Content Container */}
         <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-black/40 px-5 py-2 backdrop-blur-xl">
              <Sparkles size={14} className="text-primary" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#dff8be]">
                Limited Availability 2026
              </span>
            </div>

            {/* Scaled down typography */}
            <h2 className="max-w-5xl text-4xl font-medium leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              <span
                className="block text-white"
                style={{ fontFamily: "Georgia, Times New Roman, serif" }}
              >
                Your Routine.
              </span>
              <span
                className="mt-1 block italic text-primary"
                style={{ fontFamily: "Georgia, Times New Roman, serif" }}
              >
                Our AI Masterpiece.
              </span>
            </h2>

            {/* Reduced paragraph size and margin */}
            <p className="mt-8 max-w-2xl text-base font-medium leading-relaxed text-white/60 md:text-lg lg:text-xl">
              From workout architecture to meal optimization, FitFusion delivers one connected system that keeps
              your training sharp, your nutrition precise, and your progress consistent.
            </p>

            {/* Slightly tightened button to match the new proportions */}
            <Link
              href="/workout-planner#workout"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-white pl-8 pr-3 py-2.5 text-[13px] font-black uppercase tracking-[0.2em] text-black transition-all duration-300 hover:scale-[1.02] hover:bg-[#f3ffd9] hover:shadow-[0_0_40px_-10px_rgba(185,255,102,0.6)] active:scale-[0.98]"
            >
              Build My Plan
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>

        {/* Action Cards Grid - now flows perfectly under the newly expanded massive hero block */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:mt-8 md:grid-cols-3 md:gap-6">
          <Link
            href="/Why"
            className="group flex items-center gap-5 rounded-4xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-primary/40 hover:bg-white/10"
          >
            <div className="rounded-2xl bg-primary/20 p-4 transition-transform group-hover:scale-110">
              <Info className="text-primary" size={28} />
            </div>
            <div>
              <h3 className="mb-1.5 text-base font-bold uppercase text-white">Why FitFusion?</h3>
              <p className="text-sm text-white/60">Learn the science behind the AI.</p>
            </div>
          </Link>

          <Link
            href="/meal-planner"
            className="group flex items-center gap-5 rounded-4xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-primary/40 hover:bg-white/10"
          >
            <div className="rounded-2xl bg-primary/20 p-4 transition-transform group-hover:scale-110">
              <ChefHat className="text-primary" size={28} />
            </div>
            <div>
              <h3 className="mb-1.5 text-base font-bold uppercase text-white">Meal Planner</h3>
              <p className="text-sm text-white/60">Analyze your macros instantly.</p>
            </div>
          </Link>

          <Link
            href="/gym-finder"
            className="group flex items-center gap-5 rounded-4xl border border-white/10 bg-white/5 p-8 transition-colors hover:border-primary/40 hover:bg-white/10"
          >
            <div className="rounded-2xl bg-primary/20 p-4 transition-transform group-hover:scale-110">
              <Dumbbell className="text-primary" size={28} />
            </div>
            <div>
              <h3 className="mb-1.5 text-base font-bold uppercase text-white">Gym Finder</h3>
              <p className="text-sm text-white/60">Locate the best gyms near you.</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
