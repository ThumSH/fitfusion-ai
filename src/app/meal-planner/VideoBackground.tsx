type VideoBackgroundProps = {
  className?: string;
};

export default function VideoBackground({ className = "" }: VideoBackgroundProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden bg-background ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-75"
      >
        <source src="/food-bg.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* 2. Top-to-bottom gradient: lighter at the top for the header, fading into the dark page background at the bottom */}
      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/30 via-black/50 to-background" />
      
      {/* 3. Radial vignette: darkens the corners to focus the user's eye on the center content */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.6)_100%)]" />
    </div>
  );
}
