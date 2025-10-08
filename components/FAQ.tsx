"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Greeneves?",
    answer:
      "Greeneves is a platform that provides couples and event hosts with personalized websites for invitations, contributions, and seamless event planning.",
  },
  {
    question: "How does Greeneves help with invitations?",
    answer:
      "Instead of traditional paper cards, you get a unique and elegant website where guests can view event details, RSVP, and save the date.",
  },
  {
    question: "Can Greeneves help me raise contributions?",
    answer:
      "Yes! We provide a secure contribution system that allows friends and family to support your event financially.",
  },
  {
    question: "Do you connect me with event service providers?",
    answer:
      "Absolutely. Greeneves partners with trusted event vendors so you can find photographers, decorators, and other providers within your budget.",
  },
  {
    question: "Is Greeneves safe to use?",
    answer:
      "Yes. We ensure your data and contributions are securely handled with industry-standard protections.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-4xl mx-auto py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-[#6A8E22]">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about Greeneves, your personalized event
          companion.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white shadow-md hover:shadow-lg border border-gray-100 transition"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-5 text-left text-lg font-semibold text-gray-800"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {faq.question}
              <ChevronDown
                className={`w-6 h-6 text-[#6A8E22] transition-transform duration-300 ${
                  openIndex === idx ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, maxHeight: 0 }}
                  animate={{ opacity: 1, maxHeight: 300 }}
                  exit={{ opacity: 0, maxHeight: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-5 text-gray-600 leading-relaxed border-t border-[#C3D265]/40">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
