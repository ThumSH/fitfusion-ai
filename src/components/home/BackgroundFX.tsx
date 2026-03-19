export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-[#b9ff66]/10 blur-3xl animate-pulse" />
      <div className="absolute right-[10%] top-[18%] h-80 w-80 rounded-full bg-sky-400/10 blur-3xl animate-pulse" />
      <div className="absolute left-[20%] bottom-[10%] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl animate-pulse" />
      <div className="absolute right-[20%] bottom-[15%] h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl animate-pulse" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,22,0.2)_45%,rgba(5,8,22,0.75)_100%)]" />
    </div>
  );
}