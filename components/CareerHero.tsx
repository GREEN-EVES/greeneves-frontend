"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CareersHero() {
  return (
    <section
      id="careers-hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="/cares.jpg"
        alt="Team on mountain"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Curves Layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curve 1 */}
        <motion.path
          d="M-170,500 C200,200 800,1000 1600,200"
          stroke="white"
          strokeWidth="3"
          fill="none"
          strokeOpacity=".2"
          initial={{ pathLength: 0, y: 40 }}
          whileInView={{ pathLength: 1, y: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          viewport={{ once: true, amount: 0.3 }}
        />

        {/* Curve 2 */}
        <motion.path
          d="M-150,900 C200,100 1000,900 1700,100"
          stroke="white"
          strokeWidth="4"
          strokeOpacity=".4"
          fill="none"
          initial={{ pathLength: 0, y: 60 }}
          whileInView={{ pathLength: 1, y: 0 }}
          transition={{ duration: 3, ease: "easeInOut", delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        />

        {/* Curve 3 */}
        <motion.path
          d="M-150,300 C300,600 1200,0 1600,600"
          stroke="white"
          strokeWidth="3.5"
          fill="none"
           strokeOpacity=".1"
          initial={{ pathLength: 0, y: 30 }}
          whileInView={{ pathLength: 1, y: 0 }}
          transition={{ duration: 2.8, ease: "easeInOut", delay: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          Find Your Perfect Role
        </h1>
        <a
          href="#careers"
          className="px-6 py-3 rounded-md bg-white text-[#6A8E22] font-semibold shadow hover:bg-[#C3D265] transition"
        >
          Explore Careers
        </a>
      </div>
    </section>
  );
}
