"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="relative bg-white text-gray-800 overflow-hidden">
      {/* Animated Blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0"
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ repeat: Infinity, duration: 20 }}
      />
      <motion.div
        className="absolute top-20 right-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0"
        animate={{ x: [0, -40, 40, 0], y: [0, 30, -30, 0] }}
        transition={{ repeat: Infinity, duration: 25 }}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/olivegreen.jpg" // replace with your image
          alt="Wedding celebration background"
          fill
          priority
          className="object-cover opacity-90"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#505a11] to-[#6A8E22]/70" />

        {/* Text Content */}
        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Greeneves
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-100">
            Redefining event invitations and planning through creativity,
            technology, and community.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/team-office-v2.jpg"
              alt="Greeneves Event Website"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold mb-6">Our Story</h2>
            <p className="text-lg leading-relaxed mb-4">
              Greeneves was conceived in 2024, shortly before my wedding. I
              wanted something truly unique to make our invitation stand
              out—a personalized website for myself and my wife, Esther.
              Unfortunately, with so much to do, I couldn’t bring the idea
              to life in time. But I knew I had discovered something that
              could benefit other couples and event hosts.
            </p>
            <p className="text-lg leading-relaxed">
              That idea gave birth to Greeneves. Today, we create custom and
              personalized event websites that transform the way people
              announce and celebrate their special moments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Vision & Mission
          </motion.h2>
          <p className="text-lg mb-4">
            <strong>Vision:</strong> To redefine event invitations and
            planning by building a community where every celebration is
            personal, digital, and unforgettable.
          </p>
          <p className="text-lg">
            <strong>Mission:</strong> To empower couples and event hosts
            with custom event websites that elevate their celebrations,
            while also connecting them to trusted service providers and
            enabling seamless contributions from family and friends.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative py-20 px-6 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-semibold text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          Core Values
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Creativity",
              desc: "Crafting unique digital experiences for every event.",
            },
            {
              title: "Personalization",
              desc: "Ensuring every website reflects the host’s story and style.",
            },
            {
              title: "Convenience",
              desc: "Simplifying event planning through contributions and trusted vendors.",
            },
            {
              title: "Trust",
              desc: "Providing reliable service providers that meet needs and budget.",
            },
            {
              title: "Community",
              desc: "Building a supportive network that connects hosts, guests, and providers.",
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              className="bg-white shadow-lg rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
