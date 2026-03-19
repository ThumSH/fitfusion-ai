"use client";

import { motion } from "framer-motion";
import SectionWrapper from "./SectionWrapper";

const stats = [
  { value: "3", label: "AI-powered fitness tools" },
  { value: "24/7", label: "Smart planning support" },
  { value: "Beginner", label: "Friendly user experience" },
  { value: "Modern", label: "Premium product design" },
];

export default function StatsStrip() {
  return (
    <SectionWrapper className="py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="glass-card rounded-3xl p-6 text-center"
          >
            <div className="text-3xl font-bold text-[#b9ff66]">{stat.value}</div>
            <p className="mt-2 text-sm text-white/70">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}