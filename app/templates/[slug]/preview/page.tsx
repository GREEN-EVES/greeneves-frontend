"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import TemplateRenderer from "@/components/templates/TemplateRenderer";

// Sample event data for preview
const getSampleEventData = (eventType: "wedding" | "birthday" = "wedding") => {
	if (eventType === "wedding") {
		return {
			id: "preview",
			userId: "preview",
			eventType: "wedding" as const,
			eventName: "Our Wedding",
			eventDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
			eventTime: "16:00",
			brideName: "Sarah",
			groomName: "Michael",
			ourStory: "We met in college during our freshman year. What started as a friendship over coffee and study sessions blossomed into a beautiful love story. After years of adventures, laughter, and growing together, we're ready to start our forever.",
			ceremonyTime: "16:00",
			ceremonyLocation: "St. Mary's Church",
			ceremonyVenue: "123 Church Street, Lagos, Nigeria",
			receptionTime: "18:00",
			receptionLocation: "The Grand Ballroom",
			receptionVenue: "456 Reception Ave, Lagos, Nigeria",
			venueName: "The Grand Ballroom",
			venueAddress: "456 Reception Ave, Lagos, Nigeria",
			venueCoordinates: {
				lat: 6.5244,
				lng: 3.3792,
			},
			dressCode: "Formal Attire - Black Tie Optional",
			bridalTrain: [
				{ name: "Emily Johnson", role: "Maid of Honor" },
				{ name: "Jessica Williams", role: "Bridesmaid" },
				{ name: "Amanda Davis", role: "Bridesmaid" },
			],
			groomsmen: [
				{ name: "James Smith", role: "Best Man" },
				{ name: "Robert Brown", role: "Groomsman" },
				{ name: "David Wilson", role: "Groomsman" },
			],
			contributionsEnabled: true,
			bankAccountDetails: {
				bankName: "First Bank of Nigeria",
				accountNumber: "1234567890",
				accountName: "Sarah & Michael Wedding",
			},
		};
	} else {
		return {
			id: "preview",
			userId: "preview",
			eventType: "birthday" as const,
			eventName: "Birthday Celebration",
			eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
			eventTime: "15:00",
			celebrantName: "Alexandra Johnson",
			age: 30,
			birthdayMessage: "Join us as we celebrate Alexandra's 30th birthday! It's going to be an unforgettable day filled with joy, laughter, and wonderful memories.",
			venueName: "The Garden Terrace",
			venueAddress: "789 Celebration Street, Lagos, Nigeria",
			venueCoordinates: {
				lat: 6.5244,
				lng: 3.3792,
			},
			contributionsEnabled: false,
		};
	}
};

const samplePhotos = [
	{
		id: "1",
		url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
		title: "Engagement Photo 1",
	},
	{
		id: "2",
		url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop",
		title: "Engagement Photo 2",
	},
	{
		id: "3",
		url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
		title: "Engagement Photo 3",
	},
	{
		id: "4",
		url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=600&fit=crop",
		title: "Engagement Photo 4",
	},
];

export default function TemplatePreviewPage() {
	const params = useParams();
	const slug = params?.slug as string;

	const [template, setTemplate] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [eventType, setEventType] = useState<"wedding" | "birthday">("wedding");

	useEffect(() => {
		if (slug) {
			fetchTemplate();
		}
	}, [slug]);

	const fetchTemplate = async () => {
		try {
			setLoading(true);
			setError(null);

			// Get event type from URL query parameter if provided
			const urlParams = new URLSearchParams(window.location.search);
			const eventTypeParam = urlParams.get('eventType') as "wedding" | "birthday" | null;

			// Fetch template by slug
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/templates/slug/${slug}`
			);

			if (!response.ok) {
				throw new Error("Template not found");
			}

			const templateData = await response.json();
			setTemplate(templateData);

			// Determine event type: URL param > template preference
			if (eventTypeParam) {
				setEventType(eventTypeParam);
			} else if (templateData.isBirthdaySuitable && !templateData.isWeddingSuitable) {
				setEventType("birthday");
			} else {
				// Default to wedding for templates that support both
				setEventType("wedding");
			}
		} catch (error) {
			console.error("Error fetching template:", error);
			setError("Failed to load template. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Heart className="h-8 w-8 text-primary animate-pulse mx-auto mb-4" />
					<p className="text-muted-foreground">Loading template preview...</p>
				</div>
			</div>
		);
	}

	if (error || !template) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-muted-foreground">{error || "Template not found"}</p>
				</div>
			</div>
		);
	}

	// Use the event type determined in fetchTemplate
	const sampleEventData = getSampleEventData(eventType);

	return (
		<div className="relative">
			{/* Preview Banner */}
			<div className="sticky top-0 z-50 bg-yellow-500 text-yellow-900 py-3 px-4 text-center font-medium shadow-md">
				<div className="container mx-auto flex items-center justify-between">
					<div className="flex-1 text-center">
						📋 Preview Mode - This is a sample preview of the &quot;{template.name}&quot; template
					</div>
					{template.isWeddingSuitable && template.isBirthdaySuitable && (
						<div className="flex gap-2">
							<button
								onClick={() => setEventType("wedding")}
								className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
									eventType === "wedding"
										? "bg-yellow-900 text-yellow-100"
										: "bg-yellow-600 text-yellow-100 hover:bg-yellow-700"
								}`}
							>
								Wedding
							</button>
							<button
								onClick={() => setEventType("birthday")}
								className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
									eventType === "birthday"
										? "bg-yellow-900 text-yellow-100"
										: "bg-yellow-600 text-yellow-100 hover:bg-yellow-700"
								}`}
							>
								Birthday
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Template Renderer */}
			<TemplateRenderer
				template={template}
				eventData={sampleEventData}
				photos={samplePhotos}
				customizations={{
					selectedColorScheme: template.colorSchemes?.[0]?.name,
					sectionVisibility: {},
					sectionOrder: [],
				}}
			/>
		</div>
	);
}
