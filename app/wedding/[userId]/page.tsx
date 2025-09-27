"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Heart, Users, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeddingInfo {
	id: string;
	coupleNames: string;
	weddingDate: string;
	ceremonyTime: string;
	ceremonyLocation: string;
	receptionTime: string;
	receptionLocation: string;
	themeColor: string;
	coverPhotoUrl?: string;
	story?: string;
	tagline?: string;
	locationCity?: string;
	displayName?: string;
}

interface Photo {
	id: string;
	url: string;
	title?: string;
	description?: string;
}

interface RSVPForm {
	guestName: string;
	email: string;
	response: string;
	message: string;
	dietaryRestrictions: string;
	plusOnesCount: number;
}

export default function WeddingWebsite() {
	const params = useParams();
	const userId = params?.userId as string;
	const { toast } = useToast();

	const [weddingInfo, setWeddingInfo] = useState<WeddingInfo | null>(null);
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);
	const [rsvpLoading, setRsvpLoading] = useState(false);
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
	const [timeUntilWedding, setTimeUntilWedding] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
	});
	const [rsvpForm, setRsvpForm] = useState<RSVPForm>({
		guestName: "",
		email: "",
		response: "",
		message: "",
		dietaryRestrictions: "",
		plusOnesCount: 0,
	});

	useEffect(() => {
		if (userId) {
			fetchWeddingData();
		}
	}, [userId]);

	// Photo carousel effect
	useEffect(() => {
		if (photos.length > 1) {
			const interval = setInterval(() => {
				setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
			}, 5000);
			return () => clearInterval(interval);
		}
	}, [photos]);

	// Countdown timer effect
	useEffect(() => {
		if (weddingInfo?.weddingDate) {
			const updateCountdown = () => {
				const now = new Date().getTime();
				const weddingDate = new Date(weddingInfo.weddingDate).getTime();
				const distance = weddingDate - now;

				if (distance > 0) {
					setTimeUntilWedding({
						days: Math.floor(distance / (1000 * 60 * 60 * 24)),
						hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
						minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
					});
				}
			};

			updateCountdown();
			const interval = setInterval(updateCountdown, 60000); // Update every minute
			return () => clearInterval(interval);
		}
	}, [weddingInfo?.weddingDate]);

	const fetchWeddingData = async () => {
		try {
			// Fetch wedding info from the public API
			const weddingResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/public/wedding-info/${userId}`
			);
			if (weddingResponse.ok) {
				const weddingData = await weddingResponse.json();
				setWeddingInfo(weddingData);
			} else {
				// Fallback to mock data if API is not available
				const mockWeddingInfo: WeddingInfo = {
					id: userId,
					coupleNames: "Emma & James '25",
					weddingDate: "2025-08-16",
					ceremonyTime: "4:00 PM",
					ceremonyLocation: "St. Mary's Church, 123 Main St",
					receptionTime: "6:00 PM",
					receptionLocation: "Grand Ballroom, Hotel Paradise",
					themeColor: "hsl(var(--primary))",
					tagline: "Two are better than one\n—for love, for life, for laughter.",
					locationCity: "Lagos, Nigeria",
					coverPhotoUrl: "",
					displayName: "Emma",
					story: "Our journey began quietly in a discipleship class at university—just a passing moment, yet divinely planted. Years later, while pursuing my Master's, I earnestly prayed for a life partner. Though surrounded by interest and pressure, my heart found no peace.\n\nIn 2021, during an outreach, I saw her again. Something stirred in me, but I hesitated. The distance and uncertainty made me dismiss the thought—yet her image remained in my heart.\n\nAt my next visit, I sought counsel from my discipler. His advice led me deeper into prayer, and around my birthday, she sent a simple message. That day, God confirmed it with His peace in my heart.",
				};
				setWeddingInfo(mockWeddingInfo);
			}

			// Fetch real photos from the API
			try {
				const photosResponse = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/uploads/public/photos/${userId}`
				);
				if (photosResponse.ok) {
					const photosData = await photosResponse.json();
					console.log('Fetched photos data:', photosData);
					// Convert relative URLs to full URLs
					const photosWithFullUrls = (photosData.photos || []).map((photo: any) => ({
						...photo,
						url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${photo.url}`
					}));
					console.log('Photos with full URLs:', photosWithFullUrls);
					setPhotos(photosWithFullUrls);
				} else {
					// If no photos found, set empty array
					setPhotos([]);
				}
			} catch (error) {
				console.error("Error fetching photos:", error);
				setPhotos([]);
			}
		} catch (error) {
			console.error("Error fetching wedding data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleRSVP = async (e: React.FormEvent) => {
		e.preventDefault();
		setRsvpLoading(true);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/public/rsvp`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId,
					guestName: rsvpForm.guestName,
					email: rsvpForm.email,
					response: rsvpForm.response,
					message: rsvpForm.message,
					dietaryRestrictions: rsvpForm.dietaryRestrictions,
					plusOnesCount: rsvpForm.plusOnesCount,
				}),
			});

			if (response.ok) {
				toast({
					title: "RSVP Submitted!",
					description: "Thank you for your response. We can't wait to celebrate with you!",
				});

				// Reset form
				setRsvpForm({
					guestName: "",
					email: "",
					response: "",
					message: "",
					dietaryRestrictions: "",
					plusOnesCount: 0,
				});
			} else {
				throw new Error("Failed to submit RSVP");
			}
		} catch (error) {
			console.error("Error submitting RSVP:", error);
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		} finally {
			setRsvpLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Heart className="h-8 w-8 text-primary animate-pulse mx-auto mb-4" />
					<p className="text-muted-foreground">Loading wedding details...</p>
				</div>
			</div>
		);
	}

	if (!weddingInfo) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-muted-foreground">Wedding not found</p>
				</div>
			</div>
		);
	}

	console.log('Current photos state:', photos);
	
	return (
		<div className="min-h-screen bg-background" style={{ backgroundColor: '#f7f5f3', minHeight: '100vh' }}>
			{/* Photo Carousel Hero */}
			<section className="relative h-screen overflow-hidden">
				{/* Background Images */}
				<div className="absolute inset-0">
					{photos.length > 0 ? (
						photos.map((photo, index) => (
							<div
								key={photo.id}
								className={`absolute inset-0 transition-opacity duration-1000 ${
									index === currentPhotoIndex ? "opacity-100" : "opacity-0"
								}`}
								style={{
									backgroundImage: `url(${photo.url})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							/>
						))
					) : (
						<div
							className="absolute inset-0"
							style={{
								backgroundImage:
									"url(https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&h=800&fit=crop)",
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						/>
					)}
				</div>

				{/* Overlay */}
				<div className="absolute inset-0 bg-black/40" />

				{/* Navigation */}
				<nav className="absolute top-0 w-full z-20 p-6">
					<div className="flex justify-between items-center text-white">
						<div className="text-xl font-medium">{weddingInfo.coupleNames}</div>
						<Menu className="h-6 w-6 cursor-pointer hover:opacity-70 transition-opacity" />
					</div>
				</nav>

				{/* Main Content */}
				<div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4" style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white', padding: '0 1rem' }}>
					<div className="space-y-8 max-w-4xl" style={{ maxWidth: '56rem' }}>
						<h1 className="text-6xl md:text-8xl font-light tracking-wide" style={{ fontSize: '3.75rem', fontWeight: '300', letterSpacing: '0.025em', marginBottom: '2rem' }}>{weddingInfo.coupleNames}</h1>

						{weddingInfo.tagline && (
							<p className="text-xl md:text-2xl font-light leading-relaxed opacity-90 italic">
								{weddingInfo.tagline.split("\n").map((line, i) => (
									<React.Fragment key={i}>
										{line}
										{i === 0 && <br />}
									</React.Fragment>
								))}
							</p>
						)}

						<div className="space-y-4">
							<div className="text-lg md:text-xl">
								{new Date(weddingInfo.weddingDate).toLocaleDateString("en-US", {
									weekday: "long",
								})}
							</div>
							<div className="text-2xl md:text-3xl font-medium">
								{new Date(weddingInfo.weddingDate).toLocaleDateString("en-US", {
									month: "long",
									day: "numeric",
									year: "numeric",
								})}
							</div>
							<div className="text-lg md:text-xl opacity-90">{weddingInfo.locationCity}</div>

							{/* Countdown */}
							<div className="text-base md:text-lg opacity-80 pt-2">
								{timeUntilWedding.days} days {timeUntilWedding.hours} hrs {timeUntilWedding.minutes}{" "}
								mins
							</div>
						</div>

						<Button
							variant="outline"
							size="lg"
							className="mt-8 bg-white/10 border-white/30 text-white hover:bg-white hover:text-foreground backdrop-blur-sm"
							onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })}>
							View Details
						</Button>
					</div>
				</div>
			</section>

			{/* Our Story Section */}
			{weddingInfo.story && (
				<section className="py-20 px-4 bg-white">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl md:text-5xl font-light mb-12 text-foreground">Our Story</h2>
						<div className="prose prose-lg max-w-none">
							{weddingInfo.story.split("\n\n").map((paragraph, i) => (
								<p key={i} className="text-lg leading-relaxed text-muted-foreground mb-6 text-left">
									{paragraph}
								</p>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Wedding Details */}
			<section id="details" className="py-20 px-4 bg-muted/30">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-4xl md:text-5xl font-light text-center mb-16 text-foreground">Wedding Details</h2>

					<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{/* Ceremony */}
						<Card className="p-8 text-center">
							<CardContent className="p-0">
								<Heart className="h-8 w-8 text-primary mx-auto mb-4" />
								<h3 className="text-2xl font-medium mb-6 text-foreground">Ceremony</h3>
								<div className="space-y-4 text-muted-foreground">
									<div className="flex items-center justify-center gap-2">
										<Clock className="h-5 w-5" />
										<span className="text-lg">{weddingInfo.ceremonyTime}</span>
									</div>
									<div className="flex items-start justify-center gap-2">
										<MapPin className="h-5 w-5 mt-1" />
										<span className="text-lg">{weddingInfo.ceremonyLocation}</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Reception */}
						<Card className="p-8 text-center">
							<CardContent className="p-0">
								<Users className="h-8 w-8 text-primary mx-auto mb-4" />
								<h3 className="text-2xl font-medium mb-6 text-foreground">Reception</h3>
								<div className="space-y-4 text-muted-foreground">
									<div className="flex items-center justify-center gap-2">
										<Clock className="h-5 w-5" />
										<span className="text-lg">{weddingInfo.receptionTime}</span>
									</div>
									<div className="flex items-start justify-center gap-2">
										<MapPin className="h-5 w-5 mt-1" />
										<span className="text-lg">{weddingInfo.receptionLocation}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Debug Info - Remove this after debugging */}
			<section className="py-10 px-4 bg-yellow-100">
				<div className="max-w-4xl mx-auto text-center">
					<h3 className="text-lg font-bold mb-4">Debug Info</h3>
					<p>Photos count: {photos.length}</p>
					{photos.length > 0 && (
						<div className="mt-4 text-left">
							<p>First photo URL: {photos[0]?.url}</p>
							<p>First photo ID: {photos[0]?.id}</p>
						</div>
					)}
				</div>
			</section>

			{/* Photo Gallery */}
			{photos.length > 0 && (
				<section className="py-20 px-4 bg-white">
					<div className="max-w-6xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-light text-center mb-16 text-foreground">Gallery</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{photos.map((photo, index) => (
								<div
									key={photo.id}
									className="aspect-square bg-muted rounded-lg overflow-hidden group">
									<img
										src={photo.url}
										alt={photo.title || `Photo ${index + 1}`}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* RSVP Section */}
			<section className="py-20 px-4 bg-muted/30">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">RSVP</h2>
					<p className="text-lg text-muted-foreground mb-12">
						Please respond by{" "}
						{new Date(new Date(weddingInfo.weddingDate).getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
							"en-US",
							{ month: "long", day: "numeric", year: "numeric" }
						)}
					</p>

					<Card className="p-8">
						<CardContent className="p-0">
							<form onSubmit={handleRSVP} className="space-y-6 text-left">
								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Full Name *
									</label>
									<Input
										required
										value={rsvpForm.guestName}
										onChange={(e) =>
											setRsvpForm({ ...rsvpForm, guestName: e.target.value })
										}
										placeholder="Your full name"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Email
									</label>
									<Input
										type="email"
										value={rsvpForm.email}
										onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
										placeholder="your.email@example.com"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-foreground mb-4">
										Will you be attending? *
									</label>
									<div className="flex gap-4">
										<Button
											type="button"
											variant={
												rsvpForm.response === "attending"
													? "default"
													: "outline"
											}
											onClick={() =>
												setRsvpForm({ ...rsvpForm, response: "attending" })
											}
											className="flex-1">
											Yes, I'll be there!
										</Button>
										<Button
											type="button"
											variant={
												rsvpForm.response === "not_attending"
													? "default"
													: "outline"
											}
											onClick={() =>
												setRsvpForm({
													...rsvpForm,
													response: "not_attending",
												})
											}
											className="flex-1">
											Sorry, can't make it
										</Button>
									</div>
								</div>

								{rsvpForm.response === "attending" && (
									<>
										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Number of additional guests
											</label>
											<Input
												type="number"
												min="0"
												max="3"
												value={rsvpForm.plusOnesCount}
												onChange={(e) =>
													setRsvpForm({
														...rsvpForm,
														plusOnesCount:
															parseInt(e.target.value) || 0,
													})
												}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-foreground mb-2">
												Dietary restrictions or allergies
											</label>
											<Input
												value={rsvpForm.dietaryRestrictions}
												onChange={(e) =>
													setRsvpForm({
														...rsvpForm,
														dietaryRestrictions: e.target.value,
													})
												}
												placeholder="None, vegetarian, gluten-free, etc."
											/>
										</div>
									</>
								)}

								<div>
									<label className="block text-sm font-medium text-foreground mb-2">
										Message for the couple
									</label>
									<Textarea
										value={rsvpForm.message}
										onChange={(e) =>
											setRsvpForm({ ...rsvpForm, message: e.target.value })
										}
										placeholder="Share your congratulations or memories..."
										rows={3}
									/>
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={rsvpLoading || !rsvpForm.guestName || !rsvpForm.response}>
									{rsvpLoading ? "Submitting..." : "Submit RSVP"}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 text-center bg-white">
				<div className="space-y-4">
					<p className="text-lg text-muted-foreground">Can't wait to celebrate with you!</p>
					<Heart className="h-6 w-6 text-primary mx-auto" />
					<div className="text-sm text-muted-foreground">
						Powered by <span className="font-medium">Green Eves</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
