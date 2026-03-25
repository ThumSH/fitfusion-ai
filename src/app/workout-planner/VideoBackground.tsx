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
        className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
      >
        <source src="/run.webm" type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(185,255,102,0.18),transparent_32%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_5%,rgba(255,255,255,0.08),transparent_26%)]" />
    </div>
  );
}
