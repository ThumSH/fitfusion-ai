interface SectionHeaderProps {
  title: string;
  highlightWord?: string; // The word we want to color neon green
  description: string;
}

export default function SectionHeader({ title, highlightWord, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-16 px-4">
      <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-white mb-6">
        {title} {highlightWord && <span className="text-primary">{highlightWord}</span>}
      </h2>
      <p className="text-white/60 text-base md:text-lg font-medium leading-relaxed">
        {description}
      </p>
      {/* A sleek neon accent line to ground the header */}
      <div className="w-24 h-1 bg-linear-to-r from-transparent via-primary to-transparent mt-8 rounded-full opacity-50"></div>
    </div>
  );
}