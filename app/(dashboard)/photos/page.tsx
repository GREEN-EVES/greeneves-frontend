"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useEventStore } from "@/stores/event";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Image as Img, Trash2, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import api from "@/lib/api";

interface Photo {
	id: string;
	url: string;
	title?: string;
	description?: string;
	uploadedAt: string;
}

export default function PhotosPage() {
	const router = useRouter();
	const { toast } = useToast();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const currentEvent = useEventStore((state) => state.currentEvent);
	const updateEvent = useEventStore((state) => state.updateEvent);
	const fetchEvents = useEventStore((state) => state.fetchEvents);

	const [uploading, setUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Handle authentication and fetch events
	useEffect(() => {
		// Wait for auth store to initialize
		if (!isInitialized || isLoading) {
			return;
		}

		// Redirect if not authenticated after initialization
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		// Fetch events if authenticated
		if (isAuthenticated) {
			fetchEvents().catch(() => {});
		}
	}, [isAuthenticated, isLoading, isInitialized, fetchEvents, router]);

	// Debug: Log when currentEvent changes
	useEffect(() => {
		console.log("=== PHOTOS PAGE CURRENT EVENT CHANGED ===");
		console.log("currentEvent:", currentEvent);
		console.log("galleryImages:", currentEvent?.galleryImages);
		console.log("coverImageUrl:", currentEvent?.coverImageUrl);
	}, [currentEvent]);

	// Get photos from current event's gallery images
	const photos: Photo[] =
		currentEvent?.galleryImages?.map((url, index) => ({
			id: `${index}`,
			url,
			title: `Photo ${index + 1}`,
			description: "",
			uploadedAt: currentEvent.updatedAt || new Date().toISOString(),
		})) || [];

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile || !currentEvent) return;

		setUploading(true);
		try {
			// Upload photo to backend
			const formData = new FormData();
			formData.append("file", selectedFile);
			formData.append("album", "public");
			formData.append("title", selectedFile.name);
			formData.append("description", "Photo uploaded from gallery");

			const response = await api.post("/uploads/photos", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			const imageUrl = response.data.data.url;

			// Append to existing gallery images
			const existingGalleryImages = Array.isArray(currentEvent.galleryImages) ? currentEvent.galleryImages : [];
			const updatedGalleryImages = [...existingGalleryImages, imageUrl];

			// Update event with new gallery
			await updateEvent(currentEvent.id, {
				galleryImages: updatedGalleryImages,
				coverImageUrl: currentEvent.coverImageUrl || imageUrl, // Set as cover if no cover exists
			});

			setSelectedFile(null);
			setUploading(false);

			toast({
				title: "Photo uploaded successfully!",
				description: "Your photo has been added to the gallery.",
			});
		} catch (error) {
			console.error("Upload error:", error);
			toast({
				title: "Upload failed",
				description: "Failed to upload photo. Please try again.",
				variant: "destructive",
			});
			setUploading(false);
		}
	};

	const handleDelete = async (photoId: string) => {
		if (!currentEvent) return;

		try {
			// Find the photo URL by index (photoId is the index as a string)
			const photoIndex = parseInt(photoId);
			const photoUrl = currentEvent.galleryImages?.[photoIndex];

			if (!photoUrl) return;

			// Remove from gallery images array
			const updatedGalleryImages = currentEvent.galleryImages?.filter((_, index) => index !== photoIndex) || [];

			// If deleted photo was the cover, set new cover
			let updatedCoverImage = currentEvent.coverImageUrl;
			if (currentEvent.coverImageUrl === photoUrl) {
				updatedCoverImage = updatedGalleryImages.length > 0 ? updatedGalleryImages[0] : "";
			}

			// Update event
			await updateEvent(currentEvent.id, {
				galleryImages: updatedGalleryImages,
				coverImageUrl: updatedCoverImage,
			});

			toast({
				title: "Photo deleted",
				description: "Photo has been removed from your gallery.",
			});
		} catch (error) {
			console.error("Delete error:", error);
			toast({
				title: "Delete failed",
				description: "Failed to delete photo. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleSetCover = async (photoId: string) => {
		if (!currentEvent) return;

		try {
			const photoIndex = parseInt(photoId);
			const photoUrl = currentEvent.galleryImages?.[photoIndex];

			if (!photoUrl) return;

			console.log("=== SET COVER DEBUG ===");
			console.log("Setting cover to:", photoUrl);
			console.log("Current event before update:", currentEvent);

			// Update event with new cover image
			// IMPORTANT: Include galleryImages to prevent backend from returning null
			await updateEvent(currentEvent.id, {
				coverImageUrl: photoUrl,
				galleryImages: currentEvent.galleryImages, // Preserve existing gallery
			});

			console.log("Update complete");

			toast({
				title: "Cover photo updated",
				description: "This photo is now your cover image.",
			});
		} catch (error) {
			console.error("Set cover error:", error);
			toast({
				title: "Update failed",
				description: "Failed to set cover photo. Please try again.",
				variant: "destructive",
			});
		}
	};

	// Show loading spinner during initialization or while auth is loading
	if (!isInitialized || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Show nothing while redirecting (will redirect in useEffect)
	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8 pt-24">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">Photo Gallery</h1>
					<p className="text-muted-foreground">Share and organize wedding photos</p>
				</div>

				{/* Upload Section */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Upload className="h-5 w-5" />
							Upload Photos
						</CardTitle>
						<CardDescription>Add photos to your wedding gallery</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex gap-4 items-end">
							<div className="flex-1">
								<Input
									type="file"
									accept="image/*"
									onChange={handleFileSelect}
									disabled={uploading}
								/>
							</div>
							<Button
								onClick={handleUpload}
								disabled={!selectedFile || uploading}
								className="flex items-center gap-2">
								{uploading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Uploading...
									</>
								) : (
									<>
										<Camera className="h-4 w-4" />
										Upload
									</>
								)}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Gallery Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-3">
								<Img className="h-8 w-8 text-primary" />
								<div>
									<p className="text-2xl font-bold text-foreground">{photos.length}</p>
									<p className="text-sm text-muted-foreground">Total Photos</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-3">
								<Upload className="h-8 w-8 text-green-600" />
								<div>
									<p className="text-2xl font-bold text-foreground">
										{
											photos.filter(
												(p) =>
													new Date(p.uploadedAt) >
													new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
											).length
										}
									</p>
									<p className="text-sm text-muted-foreground">This Week</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center space-x-3">
								<Camera className="h-8 w-8 text-purple-600" />
								<div>
									<p className="text-2xl font-bold text-foreground">5GB</p>
									<p className="text-sm text-muted-foreground">Storage Used</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Photo Grid */}
				<Card>
					<CardHeader>
						<CardTitle>Your Photos</CardTitle>
						<CardDescription>All your wedding photos in one place</CardDescription>
					</CardHeader>
					<CardContent>
						{photos.length === 0 ? (
							<div className="text-center py-12">
								<Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2">No photos yet</h3>
								<p className="text-muted-foreground mb-6">
									Start building your wedding gallery by uploading your first photo
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{photos.map((photo) => {
									const isCover = currentEvent?.coverImageUrl === photo.url;
									return (
										<div key={photo.id} className="relative">
											<div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
												<Image
													src={photo.url}
													alt={photo.title || "Event photo"}
													className="w-full h-full object-cover"
												/>

												{/* Cover badge */}
												{isCover && (
													<div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
														<Star className="h-3 w-3 fill-white" />
														Cover
													</div>
												)}

												{/* Action buttons - always visible for mobile */}
												<div className="absolute top-2 right-2 flex flex-col gap-1">
													<Button
														size="sm"
														variant="secondary"
														className="h-8 w-8 p-0 shadow-lg"
														onClick={() =>
															window.open(
																photo.url,
																"_blank"
															)
														}
														title="View full size">
														<Eye className="h-4 w-4" />
													</Button>
													{!isCover && (
														<Button
															size="sm"
															className="h-8 w-8 p-0 bg-yellow-500 hover:bg-yellow-600 shadow-lg"
															onClick={() =>
																handleSetCover(
																	photo.id
																)
															}
															title="Set as cover image">
															<Star className="h-4 w-4" />
														</Button>
													)}
													<Button
														size="sm"
														variant="destructive"
														className="h-8 w-8 p-0 shadow-lg"
														onClick={() => handleDelete(photo.id)}
														title="Delete photo">
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
											{photo.title && (
												<div className="mt-2">
													<p className="text-sm font-medium text-foreground truncate">
														{photo.title}
													</p>
													<p className="text-xs text-muted-foreground">
														{new Date(
															photo.uploadedAt
														).toLocaleDateString()}
													</p>
												</div>
											)}
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
