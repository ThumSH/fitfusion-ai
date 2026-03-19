"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type SectionWrapperProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

export default function SectionWrapper({
  id,
  children,
  className = "",
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`relative py-24 ${className}`}
    >
      <div className="container-shell">{children}</div>
    </motion.section>
  );
}