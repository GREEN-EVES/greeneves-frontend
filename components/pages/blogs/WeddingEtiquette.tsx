import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Image from "next/image";
import Footer from "@/components/Footer";

const ModernWeddingEtiquette: React.FC = () => {
	const router = useRouter();

	return (
		<>
			<Header />

			{/* Hero Section */}
			<section className="relative w-full h-[75vh] flex items-center justify-center overflow-hidden">
				{/* Background Image */}
				<Image
					src="/cares.jpg" // 👉 replace with your preferred image
					alt="Modern Wedding Etiquette background"
					fill
					className="object-cover transition-transform duration-500"
					priority
				/>

				{/* Transparent Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-[5]" />

				{/* Back Button */}
				<button
					onClick={() => router.back()}
					className="absolute top-28 left-12 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-md px-4 py-2 flex items-center gap-2 transition-all hover:scale-105 z-[50]"
					aria-label="Go back">
					<ArrowLeft size={20} />
					<span className="hidden sm:inline font-medium">Back</span>
				</button>

				{/* Hero Text */}
				<div className="relative z-[20] text-center px-4 md:px-8">
					<h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg leading-tight mb-4">
						Modern Wedding Etiquette: Do’s and Don’ts 💐
					</h1>
					<p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto italic">
						Because love is timeless — but good manners never go out of style.
					</p>
				</div>
			</section>

			{/* Main Content */}
			<article className="max-w-5xl mx-auto p-8 md:p-12 bg-white rounded-3xl shadow-xl -mt-20 relative z-20 border border-gray-100 font-sans">
				{/* Introduction */}
				<p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
					Whether you’re a couple planning your big day or a guest attending one, modern wedding etiquette is about
					being thoughtful, respectful, and authentic. Times have changed, but gracious behavior never goes out of
					fashion. Here’s your quick guide to navigating today’s wedding rules — without the stress.
				</p>

				{/* Main Content */}
				<section className="space-y-14">
					{/* 1. Do Respect Invitations */}
					<div>
						<h2 className="text-3xl font-bold text-[#5B7F1D] mb-3 flex items-center">
							<span className="text-4xl mr-3 text-gray-700">1.</span>
							Do RSVP On Time
						</h2>
						<p className="text-lg text-gray-600 pl-8 leading-relaxed">
							Whether attending or not, always <strong>respond promptly</strong> to your invitation. The
							couple relies on an accurate headcount for catering, seating, and logistics. Delayed RSVPs can
							create unnecessary chaos.
						</p>
					</div>

					{/* 2. Don’t Assume Plus Ones */}
					<div>
						<h2 className="text-3xl font-bold text-[#E6398D] mb-3 flex items-center">
							<span className="text-4xl mr-3 text-gray-700">2.</span>
							Don’t Bring an Uninvited Guest
						</h2>
						<p className="text-lg text-gray-600 pl-8 leading-relaxed">
							If your invitation doesn’t specify “+1,” assume it’s for you only. Wedding guest lists are
							carefully curated and budgeted — adding extra guests can strain both space and finances.
						</p>
					</div>

					{/* 3. Do Be Present */}
					<div>
						<h2 className="text-3xl font-bold text-[#5B7F1D] mb-3 flex items-center">
							<span className="text-4xl mr-3 text-gray-700">3.</span>
							Do Put Away Your Phone During the Ceremony
						</h2>
						<p className="text-lg text-gray-600 pl-8 leading-relaxed">
							It’s tempting to snap a photo, but trust the professionals. Be fully present for the moment.
							Couples cherish seeing faces, not phones, in their wedding photos.
						</p>
					</div>

					{/* 4. Don’t Upstage the Couple */}
					<div>
						<h2 className="text-3xl font-bold text-[#E6398D] mb-3 flex items-center">
							<span className="text-4xl mr-3 text-gray-700">4.</span>
							Don’t Wear White (or Outshine the Bride)
						</h2>
						<p className="text-lg text-gray-600 pl-8 leading-relaxed">
							Unless requested, avoid white or off-white attire. Respect the spotlight — it’s the couple’s
							day to shine. Subtle elegance is always better than stealing attention.
						</p>
					</div>

					{/* 5. Do Show Gratitude */}
					<div>
						<h2 className="text-3xl font-bold text-[#5B7F1D] mb-3 flex items-center">
							<span className="text-4xl mr-3 text-gray-700">5.</span>
							Do Thank Your Guests (or Hosts)
						</h2>
						<p className="text-lg text-gray-600 pl-8 leading-relaxed">
							If you’re the couple, send handwritten thank-you notes within a few weeks after the wedding.
							Guests, be sure to thank the hosts personally before leaving. Kindness leaves the best
							impression.
						</p>
					</div>

					{/* 6. Don’t Overshare Online */}
					<div>
						<h2 className="text-3xl font-bold text-[#E6398D] mb-3 flex items-center">
							<span className="text-4xl mr-3 text-gray-700">6.</span>
							Don’t Post Before the Couple Does
						</h2>
						<p className="text-lg text-gray-600 pl-8 leading-relaxed">
							Wait until the couple shares official photos before posting your own. And if they’ve requested
							a “phone-free” ceremony, honor that wish entirely.
						</p>
					</div>
				</section>

				{/* Divider */}
				<div className="my-12 border-t border-gray-200"></div>

				{/* Conclusion */}
				<footer className="text-center">
					<p className="text-xl text-gray-700 font-light leading-relaxed">
						Etiquette isn’t about rules — it’s about{" "}
						<span className="font-semibold text-[#E6398D]">respect, empathy, and joy</span>. Keep those at the
						heart of your celebration, and you’ll never go wrong. 💖
					</p>
				</footer>
			</article>
			<Footer />
		</>
	);
};

export default ModernWeddingEtiquette;
