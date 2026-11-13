"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      onViewportEnter={(entry) => {
        if (!reduced)
          entry?.target.animate(
            [
              { opacity: 0.35, transform: "translateY(22px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 600,
              delay: delay * 1000,
              easing: "cubic-bezier(.2,.65,.3,1)",
              fill: "backwards",
            },
          );
      }}
    >
      {children}
    </motion.div>
  );
}
