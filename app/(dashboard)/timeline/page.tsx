"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic";
import { useAuthStore } from "@/stores/auth";
import { useEventStore } from "@/stores/event";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

const Header = dynamicImport(() => import("@/components/Header"), {
	ssr: false,
	loading: () => <div className="h-[80px]" />,
});

interface TimelineEvent {
	time: string;
	title: string;
	description?: string;
}

export default function TimelinePage() {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);
	const { events, currentEventId, fetchEvents } = useEventStore();

	// Derive currentEvent from events array to ensure we get fresh data
	const currentEvent = events.find((e) => e.id === currentEventId) || null;

	const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
			return;
		}

		if (isAuthenticated) {
			fetchEvents().catch(() => {});
		}
	}, [isAuthenticated, isLoading, router, fetchEvents]);

	useEffect(() => {
		// Load timeline events from current event's schedule
		if (currentEvent?.eventSchedule) {
			setTimelineEvents(currentEvent.eventSchedule);
		} else {
			setTimelineEvents([]);
		}
	}, [currentEvent]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		router.push("/login");
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8 pt-24">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">Timeline Planner</h1>
					<p className="text-muted-foreground">Plan your wedding day schedule and important milestones</p>
				</div>

				<div className="flex justify-between items-center mb-6">
					<div className="flex gap-4">
						<Card className="p-4">
							<div className="text-2xl font-bold text-primary">{timelineEvents.length}</div>
							<div className="text-sm text-muted-foreground">Schedule Items</div>
						</Card>
					</div>
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Add Schedule Item
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							{currentEvent?.eventType === "birthday" ? "Birthday" : "Event"} Schedule
						</CardTitle>
						<CardDescription>
							{currentEvent
								? `Your ${currentEvent.eventType === "birthday" ? "birthday" : "event"} day timeline`
								: "Your event day timeline"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{timelineEvents.length === 0 ? (
							<div className="text-center py-12">
								<Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2">No schedule items yet</h3>
								<p className="text-muted-foreground mb-4">
									{currentEvent
										? "Add schedule items for your event day"
										: "Create an event to start planning your schedule"}
								</p>
								{currentEvent && (
									<Button>
										<Plus className="h-4 w-4 mr-2" />
										Add First Schedule Item
									</Button>
								)}
							</div>
						) : (
							<div className="space-y-4">
								{timelineEvents.map((event, index) => (
									<div
										key={index}
										className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
										<div className="flex-shrink-0 w-16 text-center">
											<div className="text-sm font-semibold text-primary">
												{event.time}
											</div>
										</div>
										<div className="flex-1">
											<h4 className="font-semibold text-foreground">
												{event.title}
											</h4>
											{event.description && (
												<p className="text-sm text-muted-foreground mt-1">
													{event.description}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
