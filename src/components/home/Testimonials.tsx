import { Star } from "lucide-react";
import SectionHeader from "../layout/SectionHeader";

export default function Testimonials() {
  const reviews = [
    {
      name: "Marcus T.",
      role: "Beginner Lifter",
      content: "I had no idea what to do in the gym. FitFusion gave me a 3-day split that actually made sense, and the meal analyzer keeps my protein in check.",
      rating: 5
    },
    {
      name: "Sarah L.",
      role: "Home Workout Athlete",
      content: "I only have dumbbells at home. The AI generated a completely custom routine for my equipment. It's like having a personal trainer in my pocket.",
      rating: 5
    },
    {
      name: "David K.",
      role: "Busy Professional",
      content: "The meal prep schedule is a lifesaver. I plug in my target macros and it tells me exactly how to batch-cook for the week. Highly recommend.",
      rating: 5
    }
  ];

  return (
    <section className="w-full py-12">
      <SectionHeader 
        title="Real People." 
        highlightWord="Real Results."
        description="Don't just take our word for it. See how FitFusion is helping beginners and veterans alike crush their fitness goals."
      />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm relative group hover:border-[#b9ff66]/50 transition-colors">
            {/* Glowing quote mark for aesthetic */}
            <div className="absolute top-4 right-6 text-6xl text-[#b9ff66] opacity-20 font-serif leading-none group-hover:opacity-40 transition-opacity"></div>
            
            <div className="flex gap-1 mb-6">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#b9ff66] text-[#b9ff66]" />
              ))}
            </div>
            
            <p className="text-white/70 italic mb-8 relative z-10 leading-relaxed">
              {review.content}
            </p>
            
            <div>
              <h4 className="text-white font-bold uppercase tracking-wide">{review.name}</h4>
              <p className="text-[#b9ff66] text-sm">{review.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}