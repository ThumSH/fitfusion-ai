export default function VideoBackground() {
  return (
    // Fixed position ensures it covers the whole screen even if you scroll
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0b1020]">
      
      {/* This is a dark overlay. Even with low opacity, videos can have bright spots 
        that make your white text hard to read. This overlay ensures perfect contrast. 
      */}
      <div className="absolute inset-0 z-10 bg-[#0b1020]/70" />

      {/* The Video Element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-400 mix-blend-luminosity"
      >
        {/* The path starts with '/' which tells Next.js to look in the public folder */}
        <source src="/sliit.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}