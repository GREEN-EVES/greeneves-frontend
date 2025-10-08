"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function JoinOurTeam() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="relative h-screen w-full">
        <Image
          src="/team.jpg" // replace with your image path
          alt="Join Our Team"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient fade effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent via-white/80 to-white" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-serif text-gray-900">
          Join Our Team
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-4 max-w-2xl text-gray-700"
        >
          We’re always searching for qualified candidates to join our team! View
          our open job positions, or drop us a line at{" "}
          <a
            href="mailto:recruiting@greeneves.com"
            className="text-[#c3d265] font-medium"
          >
            recruiting@greeneves.com
          </a>{" "}
          for more information.
        </motion.p>

        <motion.a
          href="#"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#c3d265] to-[#6A8E22] text-white font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          Explore Careers →
        </motion.a>
      </div>
    </section>
  );
}
