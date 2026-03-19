export default function VideoBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#020617]">
      
      {/* 1. Lightened the dark overlay from /80 to /50 so more video comes through */}
      <div className="absolute inset-0 z-10 bg-[#020617]/50 backdrop-blur-sm" />

      {/* The Video Element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        /* 2. Increased video opacity from opacity-40 to opacity-80 */
        className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-luminosity"
      >
        <source src="/find.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
