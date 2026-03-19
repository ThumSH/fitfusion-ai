"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "../layout/SectionHeader";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const faqs = [
    {
      question: "Do I need prior gym experience to use FitFusion?",
      answer: "Not at all. FitFusion is designed specifically with beginners in mind. Our AI generates easy-to-follow routines and clear meal plans so you know exactly what to do from day one."
    },
    {
      question: "How does the AI Meal Analyzer work?",
      answer: "Simply input what you plan to eat, and our AI will break down the macros (protein, carbs, fats) and tell you if it aligns with your current fitness goals."
    },
    {
      question: "Can I use FitFusion if I workout at home?",
      answer: "Yes! When generating your workout plan, simply tell the AI what equipment you have available (even if it's just bodyweight), and it will tailor the routine accordingly."
    },
    {
      question: "Is FitFusion completely free to use?",
      answer: "We offer a generous free tier that includes basic AI workout generation. Advanced features like deep meal analysis and progression tracking are available on our premium plans."
    }
  ];

  return (
    <section className="w-full py-12">
      <SectionHeader 
        title="Got Questions?" 
        highlightWord="We Got Answers"
        description="Everything you need to know about how FitFusion works and how it can transform your fitness journey."
      />

      <div className="max-w-3xl mx-auto px-6 mt-12 flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index}
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                isOpen ? "bg-white/10 border-[#b9ff66]/50" : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left"
              >
                <span className={`font-semibold text-lg ${isOpen ? "text-[#b9ff66]" : "text-white"}`}>
                  {faq.question}
                </span>
                {isOpen ? (
                  <Minus className="text-[#b9ff66] flex-shrink-0" size={24} />
                ) : (
                  <Plus className="text-white/60 flex-shrink-0" size={24} />
                )}
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-white/60 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}