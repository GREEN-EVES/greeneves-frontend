"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const words = ["Celebrate", "Announce", "Save the Date", "Contribute", "Plan"];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  // Cycle through words every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex items-center justify-center h-[220px] w-full overflow-hidden p-0 m-0">
      {/* Background image with reduced opacity and brand gradient overlay */}
      <div className="absolute inset-0">
        <Image
          src="/olivegreen.jpg" // replace with your own image
          alt="Wedding celebration background"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#505a11] to-[#6A8E22]/60" />
      </div>

      {/* Content */}
      <div className="relative text-center px-6">
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold drop-shadow-lg flex flex-col md:flex-row gap-2 md:gap-3 justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={words[index]}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
          <span className="inline-block">with Greeneves</span>
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 inline-flex items-center gap-2 bg-[#BAA261] text-white px-6 py-3 rounded-lg font-medium shadow-md"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </section>
  );
}
