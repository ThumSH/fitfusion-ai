"use client";

import dynamic from "next/dynamic";

const BMICalculator = dynamic(() => import("@/components/BMICalculator"), {
  ssr: false,
  loading: () => (
    <div className="h-100 w-full flex items-center justify-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
      <p className="text-white/60 font-medium animate-pulse">Loading Calculator Module...</p>
    </div>
  ),
});

export default function BMICalculatorWrapper() {
  return <BMICalculator />;
}
