"use client";
import { motion } from "framer-motion";
// bg-gradient-to-r from-[#505a11] to-[#6A8E22]
export default function CTA() {
  return (
    <section id="cta" className="py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="   bg-gradient-to-r from-[#505a11] to-[#b9b232] text-white rounded-3xl p-12 shadow-2xl"
        >
          <h3 className="text-3xl font-bold">Ready to create something memorable?</h3>
          <p className="mt-4 text-white/90">Start with a beautiful base and customize to taste — production-ready components included.</p>
          <div className="mt-6 flex justify-center gap-4">
            <a href="#" className="px-6 py-3 bg-white/10 rounded-xl font-semibold">Get started</a>
            <a href="#" className="px-6 py-3 bg-white/20 rounded-xl font-medium">Contact sales</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
