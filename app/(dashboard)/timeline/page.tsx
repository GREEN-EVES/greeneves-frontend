"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Check, Plus } from "lucide-react";

export default function TimelinePage() {
	const router = useRouter();
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);

	// Mock timeline data - replace with real API calls
	const timelineEvents = [
		{
			id: "1",
			title: "Send Save the Dates",
			description: "Design and send save the dates to all guests",
			dueDate: "2025-01-15",
			completed: true,
			category: "Invitations",
		},
		{
			id: "2",
			title: "Book Wedding Venue",
			description: "Secure the perfect venue for ceremony and reception",
			dueDate: "2025-02-01",
			completed: true,
			category: "Venue",
		},
		{
			id: "3",
			title: "Choose Wedding Photographer",
			description: "Research and book wedding photographer",
			dueDate: "2025-02-15",
			completed: false,
			category: "Photography",
		},
		{
			id: "4",
			title: "Send Wedding Invitations",
			description: "Design and mail wedding invitations",
			dueDate: "2025-06-01",
			completed: false,
			category: "Invitations",
		},
		{
			id: "5",
			title: "Final Headcount",
			description: "Confirm final guest count with venue",
			dueDate: "2025-08-01",
			completed: false,
			category: "Planning",
		},
	];

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
			
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">Timeline Planner</h1>
					<p className="text-muted-foreground">Plan your wedding day schedule and important milestones</p>
				</div>

				<div className="flex justify-between items-center mb-6">
					<div className="flex gap-4">
						<Card className="p-4">
							<div className="text-2xl font-bold text-green-600">{timelineEvents.filter(e => e.completed).length}</div>
							<div className="text-sm text-muted-foreground">Completed</div>
						</Card>
						<Card className="p-4">
							<div className="text-2xl font-bold text-orange-600">{timelineEvents.filter(e => !e.completed).length}</div>
							<div className="text-sm text-muted-foreground">Pending</div>
						</Card>
						<Card className="p-4">
							<div className="text-2xl font-bold text-primary">{timelineEvents.length}</div>
							<div className="text-sm text-muted-foreground">Total Tasks</div>
						</Card>
					</div>
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Add Event
					</Button>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Wedding Timeline
						</CardTitle>
						<CardDescription>Track your wedding planning milestones</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{timelineEvents.map((event, index) => (
								<div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
									<div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
										event.completed 
											? 'bg-green-100 border-green-500' 
											: 'bg-muted border-muted-foreground'
									}`}>
										{event.completed && <Check className="h-3 w-3 text-green-600" />}
									</div>
									
									<div className="flex-1">
										<div className="flex items-start justify-between">
											<div>
												<h3 className={`font-semibold ${event.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
													{event.title}
												</h3>
												<p className="text-sm text-muted-foreground mt-1">{event.description}</p>
												<div className="flex items-center gap-4 mt-2">
													<div className="flex items-center gap-1 text-xs text-muted-foreground">
														<Clock className="h-3 w-3" />
														{new Date(event.dueDate).toLocaleDateString()}
													</div>
													<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
														{event.category}
													</span>
												</div>
											</div>
											<Button 
												variant="ghost" 
												size="sm"
												onClick={() => {
													// Toggle completed status - implement API call here
													console.log(`Toggle event ${event.id}`);
												}}
											>
												{event.completed ? 'Mark Pending' : 'Mark Complete'}
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}