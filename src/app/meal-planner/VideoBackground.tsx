export default function VideoBackground() {
  return (
    // Absolute position keeps the effect within the page section and avoids covering the global footer
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0b1020]">
      
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
        className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
      >
        {/* The path starts with '/' which tells Next.js to look in the public folder */}
        <source src="/food-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
