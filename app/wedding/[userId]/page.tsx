"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import TemplateRenderer from "@/components/templates/TemplateRenderer";

interface EventData {
	id: string;
	userId: string;
	eventType: "wedding" | "birthday";
	eventName?: string;
	eventDate: string;
	eventTime?: string;
	venueName?: string;
	venueAddress?: string;
	venueCoordinates?: {
		lat: number;
		lng: number;
	};
	brideName?: string;
	groomName?: string;
	celebrantName?: string;
	age?: number;
	ourStory?: string;
	birthdayMessage?: string;
	coverImageUrl?: string;
	storyImageUrl?: string;
	galleryImages?: string[];
	ceremonyTime?: string;
	ceremonyLocation?: string;
	ceremonyVenue?: string;
	receptionTime?: string;
	receptionLocation?: string;
	receptionVenue?: string;
	eventSchedule?: string;
	dressCode?: string;
	bridalTrain?: Array<{ name: string; role: string; image?: string }>;
	groomsmen?: Array<{ name: string; role: string; image?: string }>;
	contributionsEnabled?: boolean;
	bankAccountDetails?: {
		bankName: string;
		accountNumber: string;
		accountName: string;
	};
	selectedTemplate?: any;
	templateCustomization?: any;
	customColors?: any;
}

interface Photo {
	id: string;
	url: string;
	title?: string;
	description?: string;
}

export default function WeddingWebsite() {
	const params = useParams();
	const userId = params?.userId as string;

	const [eventData, setEventData] = useState<EventData | null>(null);
	const [template, setTemplate] = useState<any>(null);
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (userId) {
			fetchEventData();
		}
	}, [userId]);

	const fetchEventData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch event info from the public API
			const eventResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/public/wedding-info/${userId}`
			);

			if (!eventResponse.ok) {
				throw new Error("Event not found");
			}

			const event = await eventResponse.json();
			setEventData(event);

			// Fetch the template with sections if event has one
			if (event.selectedTemplateId) {
				try {
					const templateResponse = await fetch(
						`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/templates/${event.selectedTemplateId}`
					);

					if (templateResponse.ok) {
						const templateData = await templateResponse.json();
						setTemplate(templateData);
					}
				} catch (err) {
					console.error("Error fetching template:", err);
					// Continue without template - will show basic layout
				}
			}

			// Fetch photos
			try {
				const photosResponse = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/uploads/public/photos/${userId}`
				);

				if (photosResponse.ok) {
					const photosData = await photosResponse.json();
					const photosWithFullUrls = (photosData.photos || []).map((photo: any) => ({
						...photo,
						url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${photo.url}`,
					}));
					setPhotos(photosWithFullUrls);
				}
			} catch (err) {
				console.error("Error fetching photos:", err);
				setPhotos([]);
			}
		} catch (error) {
			console.error("Error fetching event data:", error);
			setError("Failed to load event. Please check the URL and try again.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Heart className="h-8 w-8 text-primary animate-pulse mx-auto mb-4" />
					<p className="text-muted-foreground">Loading event details...</p>
				</div>
			</div>
		);
	}

	if (error || !eventData) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-muted-foreground">{error || "Event not found"}</p>
				</div>
			</div>
		);
	}

	// If template exists, use TemplateRenderer
	if (template) {
		return (
			<TemplateRenderer
				template={template}
				eventData={eventData}
				photos={photos}
				customizations={{
					selectedColorScheme: eventData.customColors?.name,
					sectionVisibility: eventData.templateCustomization?.sectionVisibility,
					sectionOrder: eventData.templateCustomization?.sectionOrder,
				}}
			/>
		);
	}

	// Fallback: Basic event display (for events without templates)
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="text-center max-w-2xl mx-auto p-8">
				<Heart className="h-12 w-12 text-primary mx-auto mb-4" />
				<h1 className="text-4xl font-light mb-4">
					{eventData.eventType === "wedding"
						? `${eventData.brideName} & ${eventData.groomName}`
						: eventData.celebrantName || eventData.eventName}
				</h1>
				<p className="text-xl text-muted-foreground mb-2">
					{new Date(eventData.eventDate).toLocaleDateString("en-US", {
						weekday: "long",
						month: "long",
						day: "numeric",
						year: "numeric",
					})}
				</p>
				{eventData.venueName && (
					<p className="text-lg text-muted-foreground">{eventData.venueName}</p>
				)}
				<div className="mt-8 text-sm text-muted-foreground">
					<p>This event is being set up.</p>
					<p>Check back soon for more details!</p>
				</div>
			</div>
		</div>
	);
}
