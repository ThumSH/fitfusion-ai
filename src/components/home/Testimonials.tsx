"use client";

import SectionWrapper from "./SectionWrapper";

const testimonials = [
  {
    name: "Ayesha",
    role: "Beginner User",
    quote:
      "The whole experience feels easy to understand. I don’t feel overwhelmed when planning meals and workouts.",
  },
  {
    name: "Ravindu",
    role: "Busy Student",
    quote:
      "I like that it feels modern and simple. It gives structure without making fitness feel complicated.",
  },
  {
    name: "Nethmi",
    role: "Health-focused User",
    quote:
      "The meal analysis idea is super useful. It makes the product feel smarter than a normal gym website.",
  },
];

export default function Testimonials() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#b9ff66]">
          User vibe
        </p>
        <h2 className="section-title">A platform users can actually connect with</h2>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="glass-card rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <p className="text-sm leading-7 text-white/70">“{item.quote}”</p>
            <div className="mt-6">
              <h3 className="text-base font-semibold text-white">{item.name}</h3>
              <p className="text-sm text-white/45">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}