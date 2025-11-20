"use client";

import { notFound, useRouter } from "next/navigation";
import { getTemplateMetadata } from "@/components/event-templates/registry";
import Link from "next/link";
import Header from "@/components/Header";
import { ArrowLeft, ShoppingCart, Shield, Check, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useTemplateStore } from "@/stores/template";
import { useUIStore } from "@/stores/ui";
import { DesignTemplate } from "@/types";
import Image from "next/image";

// Fetch template from database
async function getTemplateBySlug(slug: string) {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
		const response = await fetch(`${apiUrl}/templates/slug/${slug}`, {
			cache: "no-store",
		});

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching template:", error);
		return null;
	}
}

export default function TemplateCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
	const router = useRouter();
	const [slug, setSlug] = useState<string>("");
	const [template, setTemplate] = useState<DesignTemplate | null>(null);
	const [loading, setLoading] = useState(true);
	const [checkingOwnership, setCheckingOwnership] = useState(false);
	const [hasAccess, setHasAccess] = useState(false);
	const [isPurchasing, setIsPurchasing] = useState(false);

	const { isAuthenticated, user } = useAuthStore();
	const { purchaseTemplate } = useTemplateStore();
	console.log(hasAccess);
	const showToast = useUIStore((state) => state.showToast);

	// Unwrap params
	useEffect(() => {
		params.then((p) => setSlug(p.slug));
	}, [params]);

	// Fetch template data
	useEffect(() => {
		if (!slug) return;

		const fetchData = async () => {
			setLoading(true);

			// Try to get template from database first
			const dbTemplate = await getTemplateBySlug(slug);

			// Fallback to registry if not in database
			const registryTemplate = getTemplateMetadata(slug);

			const fetchedTemplate = dbTemplate || registryTemplate;

			if (!fetchedTemplate) {
				notFound();
			}

			setTemplate(fetchedTemplate);
			setLoading(false);
		};

		fetchData();
	}, [slug]);

	// Check ownership for premium templates
	useEffect(() => {
		if (!template || !isAuthenticated) {
			setHasAccess(!template?.isPremium);
			return;
		}

		const checkOwnership = async () => {
			if (!template.isPremium) {
				setHasAccess(true);
				return;
			}

			setCheckingOwnership(true);
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/payments/check-ownership/${template.id}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("access_token")}`,
						},
					}
				);

				const data = await response.json();
				setHasAccess(data.hasAccess);

				// If user already owns template, redirect to event setup
				if (data.hasAccess) {
					showToast("You already own this template!", "success");
					router.push(`/event-setup?template=${template.id}`);
				}
			} catch (error) {
				console.error("Failed to check ownership:", error);
				setHasAccess(false);
			} finally {
				setCheckingOwnership(false);
			}
		};

		checkOwnership();
	}, [template, isAuthenticated, router, showToast]);

	const handlePurchase = async () => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		if (!user?.email || !template?.price) {
			showToast("Missing required information", "error");
			return;
		}

		setIsPurchasing(true);
		try {
			const authorizationUrl = await purchaseTemplate(template.id, user.email, template?.price);

			// Redirect to Paystack payment page
			window.location.href = authorizationUrl;
		} catch (error) {
			console.error("Purchase error:", error);
			showToast("Failed to initialize payment. Please try again.", "error");
			setIsPurchasing(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading checkout...</p>
				</div>
			</div>
		);
	}

	if (!template) {
		notFound();
	}

	// Redirect free templates to event setup
	if (!template.isPremium) {
		router.push(`/event-setup?template=${template.id}`);
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			{/* Checkout Container */}
			<div className="pt-24 pb-16 px-4">
				<div className="max-w-6xl mx-auto">
					{/* Back Button */}
					<Link
						href={`/designs/${slug}`}
						className="inline-flex items-center gap-2 text-gray-600 hover:text-[#7c8925] transition-colors font-medium mb-6">
						<ArrowLeft className="w-5 h-5" />
						Back to Preview
					</Link>

					<div className="grid lg:grid-cols-5 gap-8">
						{/* Left Column - Template Preview */}
						<div className="lg:col-span-3">
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
								{/* Template Image */}
								<div className="relative">
									<Image
										src={template.previewImage}
										alt={template.name}
										className="w-full h-64 md:h-96 object-cover"
									/>
									<div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
										<Star className="w-4 h-4 fill-current" />
										Premium
									</div>
								</div>

								{/* Template Details */}
								<div className="p-6">
									<h1 className="text-3xl font-bold text-gray-900 mb-2">{template.name}</h1>
									<p className="text-gray-600 mb-4">
										{template.description ||
											`Beautiful ${template.eventType.toLowerCase()} template with modern design`}
									</p>

									{/* Features */}
									<div className="border-t border-gray-200 pt-4">
										<h3 className="text-lg font-semibold text-gray-900 mb-3">
											What's Included:
										</h3>
										<ul className="space-y-2">
											<li className="flex items-start gap-2">
												<Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
												<span className="text-gray-700">
													Fully customizable event website
												</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
												<span className="text-gray-700">
													RSVP management system
												</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
												<span className="text-gray-700">
													Photo gallery with unlimited images
												</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
												<span className="text-gray-700">
													Event countdown timer
												</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
												<span className="text-gray-700">
													Mobile-responsive design
												</span>
											</li>
											<li className="flex items-start gap-2">
												<Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
												<span className="text-gray-700">
													Shareable event URL
												</span>
											</li>
										</ul>
									</div>

									{/* Preview Link */}
									<div className="mt-6 pt-6 border-t border-gray-200">
										<Link
											href={`/designs/${slug}`}
											className="font-medium inline-flex items-center gap-2 hover:opacity-80 transition"
											style={{ color: "hsl(68 61% 34%)" }}>
											View Full Template Preview →
										</Link>
									</div>
								</div>
							</div>

							{/* Social Proof Section */}
							<div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">What Our Customers Say</h3>
								<div className="space-y-4">
									<div className="border-l-4 border-green-500 pl-4">
										<div className="flex items-center gap-1 mb-1">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className="w-4 h-4 text-yellow-400 fill-current"
												/>
											))}
										</div>
										<p className="text-gray-700 italic mb-2">
											"This template made creating our wedding website so easy! Our
											guests loved it."
										</p>
										<p className="text-sm text-gray-500">- Sarah & Michael</p>
									</div>
									<div className="border-l-4 border-green-500 pl-4">
										<div className="flex items-center gap-1 mb-1">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className="w-4 h-4 text-yellow-400 fill-current"
												/>
											))}
										</div>
										<p className="text-gray-700 italic mb-2">
											"Beautiful design and super easy to customize. Worth every
											naira!"
										</p>
										<p className="text-sm text-gray-500">- Chioma O.</p>
									</div>
								</div>
							</div>
						</div>

						{/* Right Column - Purchase Summary */}
						<div className="lg:col-span-2">
							<div className="sticky top-24">
								<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
									<h2 className="text-xl font-bold text-gray-900 mb-4">Purchase Summary</h2>

									{/* Pricing */}
									<div className="border-b border-gray-200 pb-4 mb-4">
										<div className="flex justify-between items-center mb-2">
											<span className="text-gray-600">Template Price</span>
											<span className="text-2xl font-bold text-gray-900">
												₦{template.price}
											</span>
										</div>
										<p className="text-sm text-gray-500">
											One-time payment • Lifetime access
										</p>
									</div>

									{/* Purchase Button */}
									{checkingOwnership ? (
										<div className="flex justify-center py-4">
											<div
												className="animate-spin rounded-full h-6 w-6 border-b-2"
												style={{ borderColor: "hsl(68 61% 34%)" }}></div>
										</div>
									) : (
										<button
											onClick={handlePurchase}
											disabled={isPurchasing}
											className="w-full text-white py-4 rounded-lg text-lg font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-lg hover:shadow-xl"
											style={{ backgroundColor: "hsl(68 61% 34%)" }}
											onMouseEnter={(e) =>
												!isPurchasing &&
												(e.currentTarget.style.backgroundColor =
													"hsl(68 61% 28%)")
											}
											onMouseLeave={(e) =>
												!isPurchasing &&
												(e.currentTarget.style.backgroundColor =
													"hsl(68 61% 34%)")
											}>
											{isPurchasing ? (
												<>
													<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
													Processing...
												</>
											) : (
												<>
													<ShoppingCart className="w-5 h-5" />
													Purchase Now
												</>
											)}
										</button>
									)}

									{/* Trust Signals */}
									<div className="space-y-3 pt-4 border-t border-gray-200">
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Shield className="w-5 h-5 text-green-600" />
											<span>Secure payment via Paystack</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Check className="w-5 h-5 text-green-600" />
											<span>Instant access after payment</span>
										</div>
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Check className="w-5 h-5 text-green-600" />
											<span>No monthly fees or subscriptions</span>
										</div>
									</div>

									{/* Paystack Badge */}
									<div className="mt-6 pt-6 border-t border-gray-200">
										<p className="text-xs text-gray-500 text-center mb-2">
											Payments secured by
										</p>
										<div className="flex justify-center">
											<div
												className="text-white px-4 py-2 rounded font-bold text-sm shadow-md"
												style={{ backgroundColor: "hsl(68 61% 34%)" }}>
												PAYSTACK
											</div>
										</div>
									</div>
								</div>

								{/* Additional Info */}
								<div className="mt-4 text-center">
									<Link
										href="/designs"
										className="text-sm text-gray-600 hover:text-[#7c8925] transition-colors">
										Browse More Templates
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
