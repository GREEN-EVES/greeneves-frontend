"use client";

import { notFound, useRouter } from "next/navigation";
import { getTemplateComponent, getTemplateMetadata } from "@/components/event-templates/registry";
import { getDummyDataByEventType } from "@/components/event-templates/dummy-data";
import Link from "next/link";
import Header from "@/components/Header";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useTemplateStore } from "@/stores/template";
import { useUIStore } from "@/stores/ui";
import { DesignTemplate } from "@/types";

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

export default function TemplatePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
	const router = useRouter();
	const [slug, setSlug] = useState<string>("");
	const [template, setTemplate] = useState<DesignTemplate | null>(null);
	const [loading, setLoading] = useState(true);
	const [checkingOwnership, setCheckingOwnership] = useState(false);
	const [hasAccess, setHasAccess] = useState(false);
	const [isPurchasing, setIsPurchasing] = useState(false);

	const { isAuthenticated, user } = useAuthStore();
	const { purchaseTemplate } = useTemplateStore();
	const showToast = useUIStore((state) => state.showToast);

	console.log(isPurchasing);
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
			setHasAccess(!template?.isPremium); // Free templates always have access
			return;
		}

		const checkOwnership = async () => {
			// Free templates don't need ownership check
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
			} catch (error) {
				console.error("Failed to check ownership:", error);
				setHasAccess(false);
			} finally {
				setCheckingOwnership(false);
			}
		};

		checkOwnership();
	}, [template, isAuthenticated]);

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
			const authorizationUrl = await purchaseTemplate(template.id, user.email, template.price);

			// Redirect to Paystack payment page
			window.location.href = authorizationUrl;
		} catch (error) {
			console.error("Purchase error:", error);
			showToast("Failed to initialize payment. Please try again.", "error");
			setIsPurchasing(false);
		}
	};

	const handleUseTemplate = () => {
		if (!isAuthenticated) {
			router.push(`/register?template=${template?.id}&redirect=event-setup`);
			return;
		}

		router.push(`/event-setup?template=${template?.id}`);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading template...</p>
				</div>
			</div>
		);
	}

	if (!template) {
		notFound();
	}

	// Get the template component
	const TemplateComponent = getTemplateComponent(template.componentPath);

	if (!TemplateComponent) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center px-4">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Template Not Available</h1>
					<p className="text-gray-600">The template component could not be loaded.</p>
				</div>
			</div>
		);
	}

	// Get dummy data based on event type
	const dummyEvent = getDummyDataByEventType(template.eventType);

	// Override template in dummy data to match current template
	const eventData = {
		...dummyEvent,
		template: {
			id: template.id,
			name: template.name,
			slug: template.slug,
			componentPath: template.componentPath,
		},
	};

	return (
		<div className="relative">
			{/* Header Navigation */}
			<Header />

			{/* Back Button - Below Header */}
			<div className="pt-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<Link
						href="/designs"
						className="inline-flex items-center gap-2 text-gray-600 hover:text-[#7c8925] transition-colors font-medium">
						<ArrowLeft className="w-5 h-5" />
						Back to Gallery
					</Link>
				</div>
			</div>

			{/* Preview Banner - Fixed below header */}
			<div className="sticky top-20 z-40 text-white py-3 px-4 shadow-lg" style={{ backgroundColor: "hsl(68 61% 34%)" }}>
				<div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-4">
						<span className="text-sm font-semibold">📋 PREVIEW MODE</span>
						<span className="text-sm opacity-90">
							{template.name} • {template.eventType}
						</span>
					</div>
					<div className="flex items-center gap-3 flex-wrap">
						{template.isPremium ? (
							hasAccess ? (
								<>
									<span className="bg-green-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
										✓ Purchased
									</span>
									<button
										onClick={handleUseTemplate}
										className="bg-white hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
										style={{ color: "hsl(68 61% 34%)" }}>
										Use This Template →
									</button>
								</>
							) : (
								<>
									<span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
										₦{template.price}
									</span>
									<button
										onClick={() => router.push(`/designs/${slug}/checkout`)}
										className="bg-white hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
										style={{ color: "hsl(68 61% 34%)" }}>
										<ShoppingCart className="w-4 h-4" />
										Go to Checkout
									</button>
								</>
							)
						) : (
							<>
								<span className="bg-green-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
									FREE
								</span>
								<button
									onClick={handleUseTemplate}
									className="bg-white hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
									style={{ color: "hsl(68 61% 34%)" }}>
									Use This Template →
								</button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Render template with dummy data */}
			<TemplateComponent event={eventData} />

			{/* Footer Note */}
			<div className="bg-gray-900 text-white py-8 px-4 text-center">
				<p className="text-sm opacity-75 mb-4">
					This is a preview with sample data. Your actual event details will replace this content.
				</p>

				{checkingOwnership ? (
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
					</div>
				) : (
					<div className="flex gap-4 justify-center flex-wrap">
						<Link
							href="/designs"
							className="underline text-sm hover:opacity-80 transition"
							style={{ color: "hsl(68 61% 60%)" }}>
							← Back to Gallery
						</Link>

						{/* Show different buttons based on template access */}
						{!template.isPremium ? (
							// Free template - always show use button
							<button
								onClick={handleUseTemplate}
								className="text-white px-6 py-2 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg"
								style={{ backgroundColor: "hsl(68 61% 34%)" }}
								onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "hsl(68 61% 28%)")}
								onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "hsl(68 61% 34%)")}>
								Use This Template
							</button>
						) : hasAccess ? (
							// Premium template (owned) - show use button
							<button
								onClick={handleUseTemplate}
								className="text-white px-6 py-2 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg"
								style={{ backgroundColor: "hsl(68 61% 34%)" }}
								onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "hsl(68 61% 28%)")}
								onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "hsl(68 61% 34%)")}>
								Use This Template
							</button>
						) : (
							// Premium template (not owned) - show purchase button
							<>
								<button
									onClick={() => router.push(`/designs/${slug}/checkout`)}
									className="text-white px-6 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-md hover:shadow-lg"
									style={{ backgroundColor: "hsl(68 61% 34%)" }}
									onMouseEnter={(e) =>
										(e.currentTarget.style.backgroundColor = "hsl(68 61% 28%)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.backgroundColor = "hsl(68 61% 34%)")
									}>
									<ShoppingCart className="w-4 h-4" />
									Go to Checkout - ₦{template.price}
								</button>
								<span className="text-gray-400 text-sm self-center">
									Preview only - purchase required to use
								</span>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
