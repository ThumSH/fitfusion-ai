export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black space-y-8">
      
      {/* Container for the animated rings */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        
        {/* Outer slow spinning ring with low opacity */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary/40 animate-[spin_3s_linear_infinite]" />
        
        {/* Inner fast spinning bright ring */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        
        {/* Central glowing core (AI feel) */}
        <div className="w-8 h-8 bg-primary rounded-full blur-sm animate-pulse" />
      </div>

      {/* Brand Text pulsing */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-white text-2xl font-bold tracking-[0.2em] animate-pulse">
          FITFUSION
        </h2>
        <p className="text-primary text-sm font-mono tracking-widest opacity-80">
          Loading...
        </p>
      </div>
      
    </div>
  );
}
