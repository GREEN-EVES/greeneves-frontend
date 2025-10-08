"use client";
import { motion } from "framer-motion";

export default function About() {
    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >


                    <img src="/about-us.jpg" alt="About visual" className="rounded-3xl shadow-2xl w-full object-cover h-[420px]" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-3xl font-bold">We craft delightful products</h3>
                    <p className="text-gray-600 mt-4">
                        Our design decisions focus on clarity, motion, and emotional polish. Everything you see is tuned to communicate trust,
                        delight and simplicity — from the rounded corners to the weight of headings.
                    </p>

                    <ul className="mt-6 grid grid-cols-1 gap-3">
                        <li className="flex items-start gap-3">
                            <span className="text-green-500  mt-1">✔</span>
                            <span>Component-based patterns for speed & consistency</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-indigo-500 mt-1">✔</span>
                            <span>Motion used sparingly for emphasis</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-indigo-500 mt-1">✔</span>
                            <span>Accessible colors and responsive typography</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </section>
    );
}
