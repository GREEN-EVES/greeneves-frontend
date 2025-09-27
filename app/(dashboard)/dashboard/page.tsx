"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useWeddingStore } from "@/stores/wedding";
import { useDesignStore } from "@/stores/design";
import Header from "@/components/Header";
import { Calendar, Heart, Users, Settings, FileText, Camera, Gift, MapPin, Globe, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
	const router = useRouter();
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);

	const { progress, fetchProgress, fetchWeddingInfo, weddingInfo } = useWeddingStore();
	const { fetchSelectedDesigns } = useDesignStore();

	// console.log(weddingInfo);
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
			return;
		}

		if (isAuthenticated) {
			fetchWeddingInfo().catch(() => {});
			fetchProgress().catch(() => {});
			fetchSelectedDesigns().catch(() => {});
		}
	}, [isAuthenticated, isLoading, router, fetchWeddingInfo, fetchProgress]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	const weddingProgress = progress?.overallProgress || 0;
	const daysUntilWedding = progress?.daysUntilWedding || 0;

	const quickStats = [
		{
			label: "Guest List",
			value: progress ? `${progress.guestManagement.total}` : "0",
			icon: Users,
			color: "text-blue-600",
		},
		{
			label: "RSVPs",
			value: progress ? `${progress.guestManagement.rsvped}/${progress.guestManagement.total}` : "0/0",
			icon: Heart,
			color: "text-pink-600",
		},
		{
			label: "Tasks Done",
			value: progress ? `${progress.timeline.completed}/${progress.timeline.total}` : "0/0",
			icon: Calendar,
			color: "text-green-600",
		},
		{
			label: "Budget Used",
			value: progress ? `${progress.budget.percentage}%` : "0%",
			icon: Gift,
			color: "text-purple-600",
		},
	];

	const recentActivities = [
		{ action: "Updated guest list", time: "2 hours ago", icon: Users },
		{ action: "Chose wedding venue", time: "1 day ago", icon: MapPin },
		{ action: "Sent save the dates", time: "3 days ago", icon: FileText },
		{ action: "Booked photographer", time: "1 week ago", icon: Camera },
	];

	const upcomingTasks = [
		{ task: "Finalize menu selections", due: "2 days", priority: "high" },
		{ task: "Send invitations", due: "1 week", priority: "medium" },
		{ task: "Book florist", due: "2 weeks", priority: "high" },
		{ task: "Choose wedding favors", due: "3 weeks", priority: "low" },
	];

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-foreground">
								Welcome back, {user?.displayName || user?.email?.split("@")[0] || "there"}!
							</h1>
							<p className="text-muted-foreground mt-2">
								Let&apos;s continue planning your perfect wedding
							</p>
						</div>
						<div className="text-right">
							<div className="text-2xl font-bold text-primary">{daysUntilWedding}</div>
							<div className="text-sm text-muted-foreground">days until your wedding</div>
						</div>
					</div>
				</div>

				{/* Wedding Progress */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Heart className="h-5 w-5 text-pink-600" />
							Wedding Planning Progress
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Overall Progress</span>
								<span>{weddingProgress}% Complete</span>
							</div>
							<Progress value={weddingProgress} className="h-2" />
						</div>
					</CardContent>
				</Card>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{quickStats.map((stat, index) => (
						<Card key={index}>
							<CardContent className="p-6">
								<div className="flex items-center space-x-3">
									<stat.icon className={`h-8 w-8 ${stat.color}`} />
									<div>
										<p className="text-2xl font-bold text-foreground">{stat.value}</p>
										<p className="text-sm text-muted-foreground">{stat.label}</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Recent Activities */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Your latest wedding planning updates</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentActivities.map((activity, index) => (
									<div key={index} className="flex items-center space-x-3">
										<activity.icon className="h-4 w-4 text-muted-foreground" />
										<div className="flex-1">
											<p className="text-sm font-medium">{activity.action}</p>
											<p className="text-xs text-muted-foreground">
												{activity.time}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Upcoming Tasks */}
					<Card>
						<CardHeader>
							<CardTitle>Upcoming Tasks</CardTitle>
							<CardDescription>Important items on your wedding checklist</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingTasks.map((task, index) => (
									<div key={index} className="flex items-center justify-between">
										<div className="flex-1">
											<p className="text-sm font-medium">{task.task}</p>
											<p className="text-xs text-muted-foreground">
												Due in {task.due}
											</p>
										</div>
										<span
											className={`px-2 py-1 rounded-full text-xs ${
												task.priority === "high"
													? "bg-red-100 text-red-800"
													: task.priority === "medium"
													? "bg-yellow-100 text-yellow-800"
													: "bg-gray-100 text-gray-800"
											}`}>
											{task.priority}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Wedding Website Section */}
				<Card className="mt-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="h-5 w-5 text-primary" />
							Wedding Website
						</CardTitle>
						<CardDescription>
							{weddingInfo 
								? "Your personalized wedding website is ready to share" 
								: "Create your beautiful wedding website"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{weddingInfo ? (
							<>
								<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border mb-4">
									<div className="flex-1">
										<p className="font-medium text-sm">Your Wedding Website:</p>
										<p className="text-xs text-muted-foreground font-mono mt-1">
											{typeof window !== "undefined"
												? `${window.location.origin}/wedding/${user?.id}`
												: `https://greeneves.com/wedding/${user?.id}`}
										</p>
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												if (typeof window !== "undefined" && user?.id) {
													navigator.clipboard.writeText(
														`${window.location.origin}/wedding/${user.id}`
													);
												}
											}}>
											<Copy className="h-4 w-4 mr-2" />
											Copy Link
										</Button>
										<Button
											size="sm"
											onClick={() => user?.id && window.open(`/wedding/${user.id}`, "_blank")}>
											View Site
										</Button>
									</div>
								</div>
								<div className="flex gap-3">
									<Button 
										onClick={() => router.push('/designs')}
										variant="outline"
										className="flex-1"
									>
										<Settings className="h-4 w-4 mr-2" />
										Change Design
									</Button>
									<Button 
										onClick={() => router.push(`/website-builder?edit=true`)}
										className="flex-1"
									>
										<FileText className="h-4 w-4 mr-2" />
										Edit Content
									</Button>
								</div>
							</>
						) : (
							<div className="text-center py-8">
								<Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2">Create Your Wedding Website</h3>
								<p className="text-muted-foreground mb-6">
									Choose a beautiful template and create your personalized wedding website in minutes
								</p>
								<div className="flex gap-3 justify-center">
									<Button 
										onClick={() => router.push('/designs')}
										size="lg"
									>
										<Heart className="h-4 w-4 mr-2" />
										Browse Templates
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Wedding Planning Tools */}
				<Card className="mt-6">
					<CardHeader>
						<CardTitle>Wedding Planning Tools</CardTitle>
						<CardDescription>Access all your planning tools in one place</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[
								{
									title: "Guest Management",
									desc: "Manage your guest list and RSVPs",
									icon: Users,
									href: "/guests",
								},
								{
									title: "Budget Tracker",
									desc: "Keep track of wedding expenses",
									icon: Gift,
									href: "/budget",
								},
								{
									title: "Timeline Planner",
									desc: "Plan your wedding day schedule",
									icon: Calendar,
									href: "/timeline",
								},
								{
									title: "Photo Gallery",
									desc: "Share and organize wedding photos",
									icon: Camera,
									href: "/photos",
								},
								{
									title: "Design Gallery",
									desc: "Browse wedding website designs",
									icon: Settings,
									href: "/designs",
								},
							].map((tool, index) => (
								<Card key={index} className="hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-gray-300">
									<CardContent className="p-8 text-center">
										<tool.icon className="h-12 w-12 text-gray-600 mx-auto mb-6" />
										<h3 className="text-xl font-bold text-gray-900 mb-3">{tool.title}</h3>
										<p className="text-gray-600 text-sm mb-6 leading-relaxed">{tool.desc}</p>
										<Button 
											variant="outline" 
											size="sm" 
											onClick={() => router.push(tool.href)}
											className="border-gray-300 text-gray-700 hover:bg-gray-50"
										>
											Open Tool
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
