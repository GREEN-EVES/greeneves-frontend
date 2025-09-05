"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, Users, Camera, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import DesignGallery from "@/components/DesignGallery";

export default function Home() {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, isLoading, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			{/* Hero Section */}
			<HeroSection />

			{/* Design Gallery Preview Section */}
			<section className="py-16 bg-background">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-display font-bold mb-4">Popular Wedding Designs</h2>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Browse our most loved wedding website designs. Each template is fully customizable to match your
						unique style.
					</p>
					<div className="mb-8">
						<DesignGallery />
					</div>
					<Link href="/designs">
						<Button size="lg" variant="outline" className="text-lg px-8 py-6">
							View All Designs
						</Button>
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<div className="container mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Plan Your Perfect Day</h2>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex justify-center mb-4">
								<Calendar className="w-12 h-12 text-primary" />
							</div>
							<CardTitle>Wedding Dashboard</CardTitle>
							<CardDescription>
								Track your progress with a comprehensive dashboard showing your planning status
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex justify-center mb-4">
								<Users className="w-12 h-12 text-primary" />
							</div>
							<CardTitle>Guest Management</CardTitle>
							<CardDescription>
								Manage your guest list, track RSVPs, and handle plus-ones effortlessly
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex justify-center mb-4">
								<MapPin className="w-12 h-12 text-primary" />
							</div>
							<CardTitle>Vendor Directory</CardTitle>
							<CardDescription>
								Find and coordinate with wedding vendors, track bookings and payments
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex justify-center mb-4">
								<Heart className="w-12 h-12 text-primary" />
							</div>
							<CardTitle>Wedding Websites</CardTitle>
							<CardDescription>
								Create beautiful, personalized wedding websites for your guests
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex justify-center mb-4">
								<Camera className="w-12 h-12 text-primary" />
							</div>
							<CardTitle>Photo Gallery</CardTitle>
							<CardDescription>
								Share engagement photos and wedding memories with your loved ones
							</CardDescription>
						</CardHeader>
					</Card>

					<Card className="text-center hover:shadow-lg transition-shadow">
						<CardHeader>
							<div className="flex justify-center mb-4">
								<Calendar className="w-12 h-12 text-primary" />
							</div>
							<CardTitle>Timeline Planning</CardTitle>
							<CardDescription>
								Stay organized with wedding timeline and task management tools
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-primary/5 py-16">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl font-bold mb-6">Ready to Start Planning?</h2>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Join thousands of couples who have planned their perfect wedding with Green Eves. Start your journey
						today.
					</p>
					<Link href="/register">
						<Button size="lg" className="text-lg px-8 py-6">
							Get Started Free
						</Button>
					</Link>
				</div>
			</div>

			<Footer />
		</div>
	);
}
