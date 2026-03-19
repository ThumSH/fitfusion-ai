export default function VideoBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        // Increased opacity slightly to punch through the frosted glass cards
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-75"
      >
        <source src="/sliit.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 1. Vertical Gradient: Lighter at the top, fading into the dark theme color at the bottom */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/30 via-black/60 to-background" />
      
      {/* 2. Radial Vignette: Darkens the edges to frame your team cards beautifully in the center */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.7)_100%)]" />
    </div>
  );
}