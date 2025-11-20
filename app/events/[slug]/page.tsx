import { notFound } from "next/navigation";
import { getTemplateComponent } from "@/components/event-templates/registry";
import { Event } from "@/components/event-templates/types";

async function getEventBySlug(slug: string): Promise<Event | null> {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
		const response = await fetch(`${apiUrl}/public/events/${slug}`, {
			cache: "no-store", // Always fetch fresh data
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		console.log(data, "data");
		return data;
	} catch (error) {
		console.error("Error fetching event:", error);
		return null;
	}
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const event = await getEventBySlug(slug);

	// If event not found, show 404
	if (!event) {
		notFound();
	}

	// Get the template component from registry
	const componentPath = event.template?.componentPath;
	if (!componentPath) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center px-4">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Template Not Found</h1>
					<p className="text-gray-600">This event doesn't have a template assigned.</p>
				</div>
			</div>
		);
	}

	const TemplateComponent = getTemplateComponent(componentPath);

	if (!TemplateComponent) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center px-4">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Template Not Available</h1>
					<p className="text-gray-600">The template for this event could not be loaded.</p>
				</div>
			</div>
		);
	}

	// Render the template with event data
	return <TemplateComponent event={event} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const event = await getEventBySlug(slug);

	if (!event) {
		return {
			title: "Event Not Found",
		};
	}

	// Normalize event type to uppercase for comparison
	const eventType = event.eventType?.toUpperCase();

	// Generate title with fallbacks
	let title = event.eventName || "Event";
	if (eventType === "WEDDING") {
		if (event.brideName && event.groomName) {
			title = `${event.brideName} & ${event.groomName} - Wedding`;
		} else {
			title = `${event.eventName || "Wedding Celebration"}`;
		}
	} else if (eventType === "BIRTHDAY") {
		if (event.celebrantName) {
			title = `${event.celebrantName}'s Birthday Celebration`;
		} else {
			title = `${event.eventName || "Birthday Celebration"}`;
		}
	}

	// Generate description with fallbacks
	let description = `Join us for ${event.eventName}`;
	if (eventType === "WEDDING" && event.brideName && event.groomName) {
		description = `Join us in celebrating the wedding of ${event.brideName} and ${event.groomName}`;
	} else if (eventType === "BIRTHDAY" && event.celebrantName) {
		description = `Celebrate ${event.celebrantName}'s ${event.age ? `${event.age}th ` : ""}birthday`;
	}

	return {
		title,
		description,
	};
}
