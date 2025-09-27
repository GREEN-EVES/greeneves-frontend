"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Image, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);
	
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [uploading, setUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Mock photos data - replace with real API calls
	useEffect(() => {
		// Simulate API call
		const mockPhotos: Photo[] = [
			{
				id: "1",
				url: "/uploads/photos/engagement-1.jpg",
				title: "Engagement Photos",
				description: "Beautiful sunset engagement session",
				uploadedAt: "2024-12-01",
			},
			{
				id: "2", 
				url: "/uploads/photos/venue-visit.jpg",
				title: "Venue Visit",
				description: "First look at our wedding venue",
				uploadedAt: "2024-11-15",
			},
		];
		setPhotos(mockPhotos);
	}, []);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) return;

		setUploading(true);
		try {
			// Simulate upload - replace with real API call
			const formData = new FormData();
			formData.append('photo', selectedFile);
			formData.append('title', selectedFile.name);
			
			// Mock successful upload
			setTimeout(() => {
				const newPhoto: Photo = {
					id: Date.now().toString(),
					url: URL.createObjectURL(selectedFile),
					title: selectedFile.name,
					description: "Recently uploaded photo",
					uploadedAt: new Date().toISOString().split('T')[0],
				};
				
				setPhotos(prev => [newPhoto, ...prev]);
				setSelectedFile(null);
				setUploading(false);
				
				toast({
					title: "Photo uploaded successfully!",
					description: "Your photo has been added to the gallery.",
				});
			}, 2000);
			
		} catch (error) {
			console.error('Upload error:', error);
			toast({
				title: "Upload failed",
				description: "Failed to upload photo. Please try again.",
				variant: "destructive",
			});
			setUploading(false);
		}
	};

	const handleDelete = (photoId: string) => {
		setPhotos(prev => prev.filter(p => p.id !== photoId));
		toast({
			title: "Photo deleted",
			description: "Photo has been removed from your gallery.",
		});
	};

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
								className="flex items-center gap-2"
							>
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
								<Image className="h-8 w-8 text-primary" />
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
										{photos.filter(p => new Date(p.uploadedAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
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
								<p className="text-muted-foreground mb-6">Start building your wedding gallery by uploading your first photo</p>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{photos.map((photo) => (
									<div key={photo.id} className="group relative">
										<div className="aspect-square bg-muted rounded-lg overflow-hidden">
											<img
												src={photo.url}
												alt={photo.title || 'Wedding photo'}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
											/>
										</div>
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
											<div className="flex gap-2">
												<Button
													size="sm"
													variant="secondary"
													onClick={() => window.open(photo.url, '_blank')}
												>
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="destructive"
													onClick={() => handleDelete(photo.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
										{photo.title && (
											<div className="mt-2">
												<p className="text-sm font-medium text-foreground truncate">{photo.title}</p>
												<p className="text-xs text-muted-foreground">
													{new Date(photo.uploadedAt).toLocaleDateString()}
												</p>
											</div>
										)}
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