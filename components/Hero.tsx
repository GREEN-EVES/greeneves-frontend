
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import AnimatedBlobs from "./AnimatedBlobs";

// Replace with your Greeneves hero images (couples, events, celebrations, etc.)
const images = ["/hero1.png", "/hero2.png", "/hero3.png", "/hero4.png", "/hero5.png"]; // add your image paths here


export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -80]);
  const [current, setCurrent] = useState(0);

  // Auto change carousel every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center"
      style={{ background: "linear-gradient(180deg,#ffffff 0%, #f8fafc 100%)" }}
    >


      <div className="max-w-8xl mx-auto lg:px-12 px-6 py-24 flex flex-col lg:flex-row items-center gap-12 ">
        {/* Text */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Make your{" "}
            <span className="gradient-text">celebration</span> unforgettable
            <span className="text-[#BAA261]"> —</span> with a personalized
            digital invitation.
          </h1>

          <p className="mt-6 text-[#6B7280] max-w-xl">
            Greeneves helps couples and event hosts create stunning{" "}
            <strong>custom event websites</strong> that double as modern
            invitations. Collect contributions from friends & family and connect
            with trusted event service providers—all in one place.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#features"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#6A8E22] to-[#BAA261] text-white font-semibold shadow-lg"
            >
              Get Started
            </a>
            <a
              href="#about"
              className="px-6 py-3 rounded-2xl glass border border-white/10 text-sm font-medium text-[#6A8E22]"
            >
              Learn More
            </a>
          </div>



          {/* <div className="mt-8 flex gap-4 items-center text-sm text-[#6B7280]" >
            <span className="inline-flex items-center gap-2">
              💌 <strong>Personalized</strong> • Unique to your story
            </span>
            <span>•</span>
            <span>🎁 <strong>Contributions</strong> • Secure & simple</span>
            <span>•</span>
            <span>🤝 <strong>Vendors</strong> • Trusted providers</span>
          </div> */}
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          className="flex-1 relative"
          style={{ y }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl relative w-full h-[420px]">
            {images.map((src, index) => (
              <motion.div
                key={src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{
                  opacity: current === index ? 1 : 0,
                  scale: current === index ? 1 : 1.05,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Image
                  src={src}
                  alt={`Greeneves Hero ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Stats cards */}
          <div className="mt-4 flex gap-4 justify-between">
            <div className="glass rounded-2xl p-3 shadow">
              <div className="text-xs text-[#C3AA94]">Couples served</div>
              <div className="font-semibold mt-1 text-[#6A8E22]">200+</div>
            </div>
            <div className="glass rounded-2xl p-3 shadow">
              <div className="text-xs text-[#C3AA94]">Contributions raised</div>
              <div className="font-semibold mt-1 text-[#6A8E22]">₦15M+</div>
            </div>
            <div className="glass rounded-2xl p-3 shadow">
              <div className="text-xs text-[#C3AA94]">Event providers</div>
              <div className="font-semibold mt-1 text-[#6A8E22]">50+</div>
            </div>
          </div>

          {/* Carousel indicators */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full ${i === current ? "bg-[#C3D265]" : "bg-[#C3AA94]"
                  }`}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </motion.div>
        <AnimatedBlobs />
      </div>
    </section>
  );
}

