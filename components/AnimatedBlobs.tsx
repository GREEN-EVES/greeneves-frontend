"use client";
import { motion } from "framer-motion";

/* decorative animated gradient blobs behind hero */
export default function AnimatedBlobs() {
  return (
    <>
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: .5, x: -20 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute -left-20 -top-16 w-[420px] h-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.18), rgba(139,92,246,0.06))",
          filter: "blur(60px)",
          zIndex: 0
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: .5, x: 20 }}
        transition={{ duration: 1.4 }}
        className="pointer-events-none absolute -right-12 top-12 w-[520px] h-[520px] rounded-full"
        style={{
          background: "radial-gradient(circle at 70% 70%, rgba(6,182,212,0.16), rgba(6,182,212,0.04))",
          filter: "blur(70px)",
          zIndex: 0
        }}
      />

<motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: .3, x: 20 }}
        transition={{ duration: 1.4 }}
        className="pointer-events-none absolute -left-12 bottom-0 w-[720px] h-[720px] rounded-full"
        style={{
          background: "radial-gradient(circle at 70% 70%, rgba(170, 190, 120, 0.6), rgba(6,182,212,0.04))",
          filter: "blur(70px)",
          zIndex: 0
        }}
      />


      
    </>
  );
}
