"use client";

import SectionWrapper from "./SectionWrapper";

const faqs = [
  {
    question: "Is this only for advanced gym users?",
    answer:
      "No. The experience is positioned to be beginner-friendly and easy to follow.",
  },
  {
    question: "Can users benefit without going to a gym?",
    answer:
      "Yes. The workout planning flow is meant to support users with different equipment access and fitness situations.",
  },
  {
    question: "Does the app help with meals too?",
    answer:
      "Yes. The platform includes meal analysis and meal planning features to support nutrition decisions.",
  },
  {
    question: "Why does this feel different from a normal gym website?",
    answer:
      "Because it combines modern UI, AI assistance, and a connected product flow instead of static fitness content.",
  },
];

export default function FAQSection() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#b9ff66]">
          FAQ
        </p>
        <h2 className="section-title">Things users would want to know</h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-4">
        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="glass-card rounded-[1.5rem] p-6"
          >
            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
            <p className="mt-3 text-sm leading-7 text-white/70">{faq.answer}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}