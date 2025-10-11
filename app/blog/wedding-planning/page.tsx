'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Image from "next/image";
import Footer from "@/components/Footer";

const WeddingPlanningBlog: React.FC = () => {
    const router = useRouter();

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="relative w-full h-[75vh] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <Image
                    src="/wed.jpg"
                    alt="Wedding planning background"
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
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                    <span className="hidden sm:inline font-medium">Back</span>
                </button>

                {/* Hero Text */}
                <div className="relative z-[20] text-center px-4 md:px-8">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-lg leading-tight mb-4">
                        Say “I Do” to Stress-Free Wedding Planning 🥂
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto italic">
                        Your quick guide to planning a wedding that’s joyful, organized, and totally stress-free.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <article className="max-w-5xl mx-auto p-8 md:p-12 bg-white rounded-3xl shadow-xl -mt-20 relative z-20 border border-gray-100 font-sans">
                {/* Introduction */}
                <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed">
                    Getting engaged is a dream come true, but the next step—planning the
                    wedding—can quickly feel overwhelming. Take a deep breath! With a
                    focused approach, you can navigate the process with joy (and a lot
                    less stress).
                </p>

                {/* Main Content */}
                <section className="space-y-14">
                    {/* 1. Budget */}
                    <div>
                        <h2 className="text-3xl font-bold text-[#5B7F1D] mb-3 flex items-center">
                            <span className="text-4xl mr-3 text-gray-700">1.</span>
                            Set Your Budget
                            <span className="text-base font-normal ml-2 text-gray-500">(The Non-Negotiable)</span>
                        </h2>
                        <p className="text-lg text-gray-600 pl-8 leading-relaxed">
                            This is the first and most critical step. Decide on a{" "}
                            <strong>firm total budget</strong> with your partner. A clear
                            budget will guide every decision you make—from vendor choices to
                            the guest list—and is the best way to prevent future stress.
                        </p>
                    </div>

                    {/* 2. Vision */}
                    <div>
                        <h2 className="text-3xl font-bold text-[#5B7F1D] mb-3 flex items-center">
                            <span className="text-4xl mr-3 text-gray-700">2.</span>
                            Define Your Vision & Guest List
                        </h2>
                        <p className="text-lg text-gray-600 pl-8 leading-relaxed">
                            What’s your “vibe”? A rustic celebration? A black-tie affair? Once
                            you know the style, draft a <strong>realistic guest list</strong>.
                            The number of guests dictates your venue size and cost, so these
                            two steps go hand-in-hand.
                        </p>
                    </div>

                    {/* 3. Big Three */}
                    <div>
                        <h2 className="text-3xl font-bold text-[#5B7F1D] mb-3 flex items-center">
                            <span className="text-4xl mr-3 text-gray-700">3.</span>
                            Book Your “Big Three” Early
                        </h2>
                        <p className="text-lg text-gray-600 pl-8 leading-relaxed">
                            Popular vendors often book up{" "}
                            <strong>12–18 months in advance</strong>. Secure these early to
                            lock in your date and peace of mind:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-3 pl-12 text-gray-700 font-medium">
                            <li>
                                <strong>The Venue:</strong> Locks in the date and sets the tone.
                            </li>
                            <li>
                                <strong>The Photographer:</strong> Captures your once-in-a-lifetime memories.
                            </li>
                            <li>
                                <strong>The Caterer:</strong> Defines your guests’ experience (often tied to the venue).
                            </li>
                        </ul>
                    </div>

                    {/* 4. Organization */}
                    <div>
                        <h2 className="text-3xl font-bold text-[#5B7F1D] mb-3 flex items-center">
                            <span className="text-4xl mr-3 text-gray-700">4.</span>
                            Organize, Delegate & Be Flexible
                        </h2>
                        <p className="text-lg text-gray-600 pl-8 leading-relaxed">
                            Use a digital spreadsheet or planning app to manage tasks,
                            payments, and RSVPs. Delegate smaller tasks to your wedding party
                            —it’s perfectly okay to ask for help! And remember, perfection
                            isn’t the goal—celebration is. Focus on what truly matters:{" "}
                            <strong>marrying your person.</strong>
                        </p>
                    </div>
                </section>

                {/* Divider */}
                <div className="my-12 border-t border-gray-200"></div>

                {/* Conclusion */}
                <footer className="text-center">
                    <p className="text-xl text-gray-700 font-light leading-relaxed">
                        Happy planning! Focus on the big picture —{" "}
                        <span className="font-semibold text-[#E6398D]">celebrating your love</span>. ❤️
                    </p>
                </footer>
            </article>
            <Footer />
        </>
    );
};

export default WeddingPlanningBlog;
