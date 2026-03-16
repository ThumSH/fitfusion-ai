import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="container-shell flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#b9ff66] text-black">
            <Dumbbell size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">FitFusion AI</p>
            <p className="text-xs text-white/55">
              Smarter training. Better nutrition. Cleaner consistency.
            </p>
          </div>
        </div>

        <p className="text-sm text-white/50">
          Built for hackathon impact, polished like a real product.
        </p>
      </div>
    </footer>
  );
}