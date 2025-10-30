"use client";
import { motion } from "framer-motion";
import { Users, CalendarHeart, HandCoins, Sparkles, ShieldCheck } from "lucide-react";
import AnimatedBlobs from "./AnimatedBlobs";

const items = [
	{
		title: "Seamless Event Planning",
		desc: "Plan weddings, birthdays, and special occasions with ease using our all-in-one platform.",
		icon: <CalendarHeart />,
	},
	{
		title: "Trusted Providers",
		desc: "Connect with vetted event service providers that match your needs and budget.",
		icon: <Users />,
	},
	{
		title: "Smart Contributions",
		desc: "Easily receive financial support from friends and family through our contribution feature.",
		icon: <HandCoins />,
	},
	{
		title: "Personalized Experience",
		desc: "Get tailored recommendations and tools to make your event truly unforgettable.",
		icon: <Sparkles />,
	},
	{
		title: "Secure & Reliable",
		desc: "Enjoy peace of mind with secure payments, trusted services, and smooth event management.",
		icon: <ShieldCheck />,
	},
];

export default function Features() {
	return (
		<section id="features" className="py-20 h-full ">
			<AnimatedBlobs />
			<div className="max-w-8xl mx-auto px-6 lg:px-12 ">
				{/* Heading */}
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-[#6A8E22]">Why Choose Greeneves</h2>
					<p className="text-gray-600 mt-2">Everything you need to plan, manage, and celebrate unforgettable events.</p>
				</div>

				{/* Features Grid */}
				<div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
					{items.map((it, idx) => (
						<motion.div
							key={idx}
							whileHover={{ y: -8, scale: 1.02 }}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: idx * 0.08 }}
							viewport={{ once: true }}
							className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-[#f2f2f2]">
							{/* Icon Wrapper */}
							<div
								className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-white"
								style={{
									background: `linear-gradient(135deg, #6A8E22, #BAA261)`,
								}}>
								{it.icon}
							</div>

							{/* Title */}
							<h4 className="font-semibold text-[#6A8E22]">{it.title}</h4>
							<p className="text-sm text-gray-500 mt-2">{it.desc}</p>
						</motion.div>
					))}
				</div>

				<div className="mt-8 flex  mx-auto gap-4 items-center text-sm text-[#6B7280]">
					<span className="inline-flex items-center gap-2">
						💌 <strong>Personalized</strong> • Unique to your story
					</span>
					<span>•</span>
					<span>
						🎁 <strong>Contributions</strong> • Secure & simple
					</span>
					<span>•</span>
					<span>
						🤝 <strong>Vendors</strong> • Trusted providers
					</span>
				</div>
			</div>
		</section>
	);
}
