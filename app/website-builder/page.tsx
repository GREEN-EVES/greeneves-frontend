"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Upload, Calendar, MapPin, Camera, Globe, ArrowLeft, ArrowRight, Check, Loader2, Gift, Trash2, Star } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useTemplateStore } from "@/stores/template";
import { useEventStore } from "@/stores/event";
import { useUIStore } from "@/stores/ui";
import Header from "@/components/Header";
import type { DesignTemplate } from "@/types";
import api from "@/lib/api";

const eventInfoSchema = z.object({
  eventName: z.string().min(2, "An event name is required"),
  eventDate: z.string().min(1, "An event date is required"),
  eventTime: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
});

type EventInfoForm = z.infer<typeof eventInfoSchema>;

const steps = [
	{ id: 1, title: "Event Type", description: "Choose event type" },
	{ id: 2, title: "Details", description: "Event information" },
	{ id: 3, title: "Photos", description: "Upload images" },
	{ id: 4, title: "Payment", description: "Complete purchase" },
	{ id: 5, title: "Live", description: "Your website is ready!" },
];

function WebsiteBuilderContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const templateId = searchParams?.get("template");
	const editMode = searchParams?.get("edit") === "true";
	const paymentSuccess = searchParams?.get("payment") === "success";

	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const showToast = useUIStore((state) => state.showToast);

	const { currentTemplate, fetchTemplate, subscriptions, fetchUserSubscriptions, hasUserPurchasedTemplate } = useTemplateStore();

	// Get event store state - use separate selectors to avoid creating new objects
	const currentEvent = useEventStore((state) => state.currentEvent);
	const events = useEventStore((state) => state.events);
	const fetchEvents = useEventStore((state) => state.fetchEvents);
	const createEvent = useEventStore((state) => state.createEvent);
	const updateEvent = useEventStore((state) => state.updateEvent);

	// Debug logging for edit mode
	useEffect(() => {
		console.log("=== WEBSITE BUILDER STATE DEBUG ===");
		console.log("Edit mode:", editMode);
		console.log("Events array:", events);
		console.log("Events count:", events?.length);
		console.log("Store currentEvent:", currentEvent);
		console.log("currentEvent ID:", currentEvent?.id);
		console.log("currentEvent galleryImages:", currentEvent?.galleryImages);
		console.log("galleryImages type:", typeof currentEvent?.galleryImages);
		console.log("galleryImages isArray:", Array.isArray(currentEvent?.galleryImages));
	}, [editMode, events, currentEvent]);

	const [currentStep, setCurrentStep] = useState(editMode ? 2 : currentEvent ? 2 : 1); // Start at event type if no event exists
	const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
	const [selectedEventType, setSelectedEventType] = useState<"wedding" | "birthday">(currentEvent?.eventType || "wedding");
	const [loadTimeout, setLoadTimeout] = useState(false);

	console.log("Website Builder - Mode:", editMode ? "EDIT" : "CREATE", "templateId:", templateId, "selectedTemplate:", selectedTemplate);
	const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
	const [websiteUrl, setWebsiteUrl] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<EventInfoForm>({
		resolver: zodResolver(eventInfoSchema),
		defaultValues: {
			eventName: user?.displayName || "",
		},
	});

	const watchedValues = watch();

	useEffect(() => {
		// Wait for auth store to initialize before making routing decisions
		if (!isInitialized || isLoading) {
			return;
		}

		// Only redirect if user is not authenticated after initialization completes
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		if (templateId) {
			fetchTemplate(templateId);
		}

		// Fetch existing events and subscriptions for all authenticated users
		if (isAuthenticated) {
			fetchEvents().catch(() => {});
			fetchUserSubscriptions();
		}

		// Don't handle payment success here - wait for event info to load
	}, [
		isAuthenticated,
		isLoading,
		isInitialized,
		templateId,
		editMode,
		paymentSuccess,
		fetchTemplate,
		fetchEvents,
		fetchUserSubscriptions,
		router,
	]);

	// Populate form with existing event info if available
	useEffect(() => {
		if (currentEvent) {
      setValue("eventName", currentEvent.eventName);
      setValue("eventDate", new Date(currentEvent.eventDate).toISOString().split("T")[0]);
      setValue("eventTime", currentEvent.eventTime || "");
      setValue("venueName", currentEvent.venueName || "");
      setValue("venueAddress", currentEvent.venueAddress || "");
      if (currentEvent.details) {
        for (const key in currentEvent.details) {
          setValue(key, currentEvent.details[key]);
        }
      }
		}
	}, [currentEvent, setValue]);

	useEffect(() => {
		if (currentTemplate) {
			setSelectedTemplate(currentTemplate);
		}
	}, [currentTemplate]);

	// Template loading timeout
	useEffect(() => {
		const timer = setTimeout(() => {
			if (!selectedTemplate && !editMode) {
				console.error("Template loading timeout - template may not exist or failed to load");
				console.error("Template ID:", templateId);
				console.error("Current template from store:", currentTemplate);
				setLoadTimeout(true);
			}
		}, 3000);

		return () => clearTimeout(timer);
	}, [selectedTemplate, editMode, templateId, currentTemplate]);

	const publishWebsite = useCallback(async () => {
		try {
			// Ensure event exists (it should have been created in step 2)
			// If in edit mode, we don't need to create again
			if (!editMode && !currentEvent) {
				throw new Error("Event information not found. Please go back and fill out the details.");
			}

			// Template is already associated with the event via selectedTemplateId
			// No need to call a separate endpoint to "select" the template

			// Generate the website URL using publicSlug
			if (!currentEvent?.publicSlug) {
				throw new Error("Event does not have a public URL. Please refresh and try again.");
			}
			const url = `${window.location.origin}/events/${currentEvent.publicSlug}`;
			setWebsiteUrl(url);
			setCurrentStep(5);
			showToast(`Your ${currentEvent.eventType} website is now live!`, "success");
		} catch (error) {
			console.error("Publish website error:", error);
			showToast("Failed to publish website. Please ensure your event details are saved.", "error");
		}
	}, [editMode, currentEvent, showToast]);

	// Handle payment success after event info is loaded
	useEffect(() => {
		if (paymentSuccess && isAuthenticated && currentEvent) {
			console.log("Payment success detected, publishing website...");
			publishWebsite();
		}
	}, [paymentSuccess, isAuthenticated, currentEvent, publishWebsite]);

	// Debug: Log currentEvent data when on photo step
	useEffect(() => {
		if (currentStep === 3) {
			console.log("=== PHOTO STEP DEBUG ===");
			console.log("currentEvent:", currentEvent);
			console.log("galleryImages:", currentEvent?.galleryImages);
			console.log("galleryImages length:", currentEvent?.galleryImages?.length);
			console.log("coverImageUrl:", currentEvent?.coverImageUrl);
			console.log("editMode:", editMode);
		}
	}, [currentStep, currentEvent, editMode]);

	const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setUploadedPhotos((prev) => [...prev, ...files].slice(0, 6)); // Max 6 photos
	};

	const removePhoto = (index: number) => {
		setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
	};

	// Delete an existing gallery image
	const deleteExistingImage = async (imageUrl: string) => {
		if (!currentEvent) return;

		try {
			const updatedGalleryImages = currentEvent.galleryImages?.filter((img) => img !== imageUrl) || [];

			// If the deleted image was the cover, set the first remaining image as cover
			let updatedCoverImage = currentEvent.coverImageUrl;
			if (currentEvent.coverImageUrl === imageUrl) {
				updatedCoverImage = updatedGalleryImages.length > 0 ? updatedGalleryImages[0] : "";
			}

			await updateEvent(currentEvent.id, {
				galleryImages: updatedGalleryImages,
				coverImageUrl: updatedCoverImage,
			});

			showToast("Image deleted successfully!", "success");
		} catch (error) {
			console.error("Error deleting image:", error);
			showToast("Failed to delete image", "error");
		}
	};

	// Set an existing gallery image as the cover image
	const setAsCoverImage = async (imageUrl: string) => {
		if (!currentEvent) return;

		try {
			// IMPORTANT: Include galleryImages to prevent backend from returning null
			await updateEvent(currentEvent.id, {
				coverImageUrl: imageUrl,
				galleryImages: currentEvent.galleryImages, // Preserve existing gallery
			});

			showToast("Cover image updated successfully!", "success");
		} catch (error) {
			console.error("Error setting cover image:", error);
			showToast("Failed to set cover image", "error");
		}
	};

	const onSubmitEventInfo = async (data: EventInfoForm) => {
		try {
      const { eventName, eventDate, eventTime, venueName, venueAddress, tagline, description, ...details } = data;

			if (editMode || currentEvent) {
				// Update existing event (either in edit mode or user already has event)
				const updateData: any = {
					eventName: data.eventName,
					eventDate: new Date(data.eventDate).toISOString(),
					eventTime: data.eventTime || undefined,
					venueName: data.venueName || undefined,
					venueAddress: data.venueAddress || undefined,
          details,
				};

				// Update template if a different one is selected
				        if (selectedTemplate?.id) {
					updateData.selectedTemplateId = selectedTemplate.id;
					console.log("Updating template to", selectedTemplate.id);
				}

				await updateEvent(currentEvent!.id, updateData);
			} else {
				// Create new event with selected event type using store method
				const eventData: any = {
					eventType: selectedEventType,
					eventName: data.eventName,
					eventDate: new Date(data.eventDate).toISOString(),
					eventTime: data.eventTime || undefined,
					venueName: data.venueName || undefined,
					venueAddress: data.venueAddress || undefined,
					selectedTemplateId: selectedTemplate?.id, // Associate template with event
          details,
				};

				await createEvent(eventData);
			}

			setCurrentStep(3);
			showToast("Event details saved!", "success");
		} catch (error) {
			console.error("Error saving event info:", error);
			showToast("Failed to save event details", "error");
		}
	};

	const handlePhotosNext = async () => {
		if (uploadedPhotos.length > 0) {
			try {
				const uploadPromises = uploadedPhotos.map(async (photo) => {
					const formData = new FormData();
					formData.append("file", photo);
					formData.append("album", "public");
					formData.append("title", `${selectedEventType} Photo ${Date.now()}`);
					formData.append("description", `${selectedEventType} photo uploaded via website builder`);

					return await api.post("/uploads/photos", formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});
				});

				const uploadResults = await Promise.all(uploadPromises);

				// Extract image URLs from upload responses
				// Backend response: { data: { message: '...', data: { url: '...', publicId: '...', ... } } }
				const imageUrls = uploadResults.map((result) => result.data.data.url);

				// Append new images to existing gallery instead of replacing
				if (currentEvent && imageUrls.length > 0) {
					const existingGalleryImages = Array.isArray(currentEvent.galleryImages) ? currentEvent.galleryImages : [];

					console.log("=== PHOTO UPLOAD DEBUG ===");
					console.log("Existing gallery images:", existingGalleryImages);
					console.log("New image URLs:", imageUrls);

					const updatedGalleryImages = [...existingGalleryImages, ...imageUrls];
					console.log("Updated gallery images:", updatedGalleryImages);

					// Only update cover image if there isn't one already
					const updatedCoverImage = currentEvent.coverImageUrl || imageUrls[0];

					await updateEvent(currentEvent.id, {
						coverImageUrl: updatedCoverImage,
						galleryImages: updatedGalleryImages,
					});

					// Clear uploaded photos after successful save
					setUploadedPhotos([]);
				}

				showToast("Photos uploaded successfully!", "success");
			} catch (error) {
				console.error("Photo upload error:", error);
				showToast("Failed to upload photos", "error");
				return; // Don't proceed if photo upload fails
			}
		}

		// Move to payment step
		if (editMode) {
			// In edit mode, assume payment was already handled, skip to publishing
			await publishWebsite();
		} else if (selectedTemplate?.isPremium) {
			// Check if user already purchased this specific template
			const hasPurchasedTemplate = hasUserPurchasedTemplate(selectedTemplate.id);

			if (hasPurchasedTemplate) {
				// User already purchased this template, skip payment
				showToast("Using your purchased template!", "success");
				await publishWebsite();
			} else {
				// User needs to purchase this template
				setCurrentStep(4);
			}
		} else {
			// Free template - skip payment, go directly to live
			await publishWebsite();
		}
	};

	const handlePayment = async () => {
		if (!selectedTemplate?.isPremium) return;

		// Ensure we have a valid price in Naira
		const amount = selectedTemplate.price && selectedTemplate.price > 0 ? selectedTemplate.price : 50; // Default fallback price (50 NGN)

		console.log("Payment data:", {
			email: user?.email,
			amount: amount,
			templateId: selectedTemplate.id,
			planType: "premium",
			selectedTemplate: selectedTemplate,
		});

		try {
			// Initialize Paystack payment
			const response = await api.post("/payments/initialize", {
				email: user?.email,
				amount: amount,
				templateId: selectedTemplate.id,
				planType: "premium",
			});

			const paymentData = response.data;

			if (paymentData.authorizationUrl) {
				// Redirect to Paystack payment page
				window.location.href = paymentData.authorizationUrl;
			}
		} catch (error: any) {
			console.error("Payment initialization error:", error);
			const errorMessage = error.response?.data?.message || "Failed to initialize payment";
			showToast(Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage, "error");
		}
	};

	const copyWebsiteUrl = () => {
		navigator.clipboard.writeText(websiteUrl);
		showToast("Website URL copied to clipboard!", "success");
	};

	// Show loading spinner during initialization or while auth is loading
	if (!isInitialized || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Show spinner if not authenticated (will redirect)
	if (!isAuthenticated) {
		return null;
	}

	if (!selectedTemplate && !editMode && !loadTimeout) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<p className="mt-4 text-gray-600">Loading template...</p>
			</div>
		);
	}

	// If timeout occurred, show error message
	if (!selectedTemplate && !editMode && loadTimeout) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="max-w-md p-6">
					<CardHeader>
						<CardTitle className="text-red-600">Template Loading Failed</CardTitle>
						<CardDescription>
							The template (ID: {templateId}) could not be loaded. This might be because:
							<ul className="list-disc list-inside mt-2">
								<li>The template doesn't exist</li>
								<li>There was a network error</li>
								<li>The template ID is invalid</li>
							</ul>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push("/templates")} className="w-full">
							Browse Templates
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8">
				{/* Progress Steps */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						{steps.map((step, index) => (
							<div key={step.id} className="flex items-center">
								<div
									className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
										currentStep >= step.id
											? "bg-primary border-primary text-primary-foreground"
											: "border-gray-300 text-gray-400"
									}`}>
									{currentStep > step.id ? (
										<Check className="h-4 w-4" />
									) : (
										<span className="text-sm font-medium">{step.id}</span>
									)}
								</div>
								<div className="ml-2 hidden sm:block">
									<div
										className={`text-sm font-medium ${
											currentStep >= step.id ? "text-primary" : "text-gray-400"
										}`}>
										{step.title}
									</div>
									<div className="text-xs text-gray-500">{step.description}</div>
								</div>
								{index < steps.length - 1 && (
									<div
										className={`w-12 h-1 mx-4 ${
											currentStep > step.id ? "bg-primary" : "bg-gray-200"
										}`}
									/>
								)}
							</div>
						))}
					</div>
					<Progress value={(currentStep / steps.length) * 100} className="h-2" />
				</div>

				{/* Step Content */}
				<div className="max-w-2xl mx-auto">
					{/* Step 1: Event Type Selection */}
					{currentStep === 1 && !currentEvent && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Heart className="h-5 w-5" />
									Choose Your Event Type
								</CardTitle>
								<CardDescription>What kind of event are you planning?</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div
										onClick={() => setSelectedEventType("wedding")}
										className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
											selectedEventType === "wedding"
												? "border-primary bg-primary/5"
												: "border-gray-200 hover:border-primary/50"
										}`}>
										<div className="text-center">
											<Heart className="h-12 w-12 mx-auto mb-4 text-pink-500" />
											<h3 className="text-lg font-semibold mb-2">Wedding</h3>
											<p className="text-sm text-muted-foreground">
												Create a beautiful website for your special day
											</p>
										</div>
									</div>
									<div
										onClick={() => setSelectedEventType("birthday")}
										className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
											selectedEventType === "birthday"
												? "border-primary bg-primary/5"
												: "border-gray-200 hover:border-primary/50"
										}`}>
										<div className="text-center">
											<Gift className="h-12 w-12 mx-auto mb-4 text-purple-500" />
											<h3 className="text-lg font-semibold mb-2">Birthday</h3>
											<p className="text-sm text-muted-foreground">
												Celebrate your birthday with a custom website
											</p>
										</div>
									</div>
								</div>
								<Button onClick={() => setCurrentStep(2)} className="w-full mt-6">
									<ArrowRight className="h-4 w-4 mr-2" />
									Continue
								</Button>
							</CardContent>
						</Card>
					)}

					{/* Step 2: Event Details */}
					{currentStep === 2 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									{selectedEventType === "birthday" ? "Birthday" : "Wedding"} Details
								</CardTitle>
								<CardDescription>
									{editMode ? (
										`Update your ${
											selectedEventType === "birthday" ? "birthday" : "wedding"
										} information`
									) : (
										<span className="flex items-center gap-2 flex-wrap">
											<span>
												Tell us about your special day using the{" "}
												{selectedTemplate?.name} template
											</span>
											{selectedTemplate?.isPremium &&
												hasUserPurchasedTemplate(selectedTemplate.id) && (
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
														<Check className="h-3 w-3 mr-1" />
														Template Purchased
													</span>
												)}
										</span>
									)}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit(onSubmitEventInfo)} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="md:col-span-2">
											<label className="block text-sm font-medium mb-2">
												Event Name
												*
											</label>
											<Input
												placeholder={
													selectedEventType === "birthday"
														? "John's 30th Birthday"
														: "John & Jane's Wedding"
												}
												{...register("eventName")}
											/>
											{errors.eventName && (
												<p className="text-sm text-red-500 mt-1">
													{errors.eventName.message}
												</p>
											)}
										</div>

                    {selectedEventType === 'wedding' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Bride's Name
                          </label>
                          <Input placeholder="Jane" {...register("brideName")} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Groom's Name
                          </label>
                          <Input placeholder="John" {...register("groomName")} />
                        </div>
                      </>
                    )}

                    {selectedEventType === 'birthday' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Celebrant's Name
                          </label>
                          <Input placeholder="John" {...register("celebrantName")} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Age (Optional)
                          </label>
                          <Input type="number" placeholder="30" {...register("age")} />
                        </div>
                      </>
                    )}

										<div>
											<label className="block text-sm font-medium mb-2">
												Event Date *
											</label>
											<Input type="date" {...register("eventDate")} />
											{errors.eventDate && (
												<p className="text-sm text-red-500 mt-1">
													{errors.eventDate.message}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Location/City
											</label>
											<Input
												placeholder="Lagos, Nigeria"
												{...register("venueAddress")}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Event Time
											</label>
											<Input placeholder="4:00 PM" {...register("eventTime")} />
										</div>

										<div className="md:col-span-2">
											<label className="block text-sm font-medium mb-2">
												Venue Location
											</label>
											<Input
												placeholder="Event venue name"
												{...register("venueName")}
											/>
										</div>

										<div className="md:col-span-2">
											<label className="block text-sm font-medium mb-2">
												Tagline (Optional)
											</label>
											<Input
												placeholder="Two hearts, one love"
												{...register("tagline")}
											/>
										</div>

										<div className="md:col-span-2">
											<label className="block text-sm font-medium mb-2">
												Description (Optional)
											</label>
											<Textarea
												placeholder={
													selectedEventType === "birthday"
														? "Share a special message with your guests..."
														: "Tell your guests about how you met and your journey together..."
												}
												rows={4}
												{...register("description")}
											/>
										</div>
									</div>

									<div className="flex gap-4">
										{!editMode && !currentEvent && (
											<Button
												type="button"
												variant="outline"
												onClick={() => setCurrentStep(1)}
												className="flex-1">
												<ArrowLeft className="h-4 w-4 mr-2" />
												Back
											</Button>
										)}
										<Button
											type="submit"
											className={!editMode && !currentEvent ? "flex-1" : "w-full"}>
											<ArrowRight className="h-4 w-4 mr-2" />
											Continue to Photos
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					)}

					{currentStep === 3 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Camera className="h-5 w-5" />
									Upload Photos
									{selectedTemplate?.isPremium &&
										hasUserPurchasedTemplate(selectedTemplate.id) && (
											<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-auto">
												<Check className="h-3 w-3 mr-1" />
												Template Purchased
											</span>
										)}
								</CardTitle>
								<CardDescription className="space-y-1">
									Add beautiful photos to your{" "}
									{selectedEventType === "birthday" ? "birthday" : "wedding"} website (optional)
									{selectedTemplate?.isPremium &&
										hasUserPurchasedTemplate(selectedTemplate.id) && (
											<span className="block text-green-600 text-sm mt-1">
												✓ Using your purchased template - no payment required
											</span>
										)}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
										<Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<p className="text-lg font-medium text-gray-700 mb-2">
											Upload your photos
										</p>
										<p className="text-gray-500 mb-4">
											Add up to 6 photos for your gallery
										</p>
										<input
											type="file"
											multiple
											accept="image/*"
											onChange={handlePhotoUpload}
											className="hidden"
											id="photo-upload"
										/>
										<Button asChild>
											<label htmlFor="photo-upload" className="cursor-pointer">
												Choose Photos
											</label>
										</Button>
									</div>

									{/* Display existing gallery images whenever they exist */}
									{currentEvent?.galleryImages && currentEvent.galleryImages.length > 0 && (
										<div>
											<h3 className="text-sm font-medium text-gray-700 mb-3">
												Existing Gallery Images
											</h3>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
												{currentEvent.galleryImages.map((imageUrl, index) => {
													const isCover =
														currentEvent.coverImageUrl ===
														imageUrl;
													return (
														<div
															key={`existing-${index}`}
															className="relative">
															<img
																src={imageUrl}
																alt={`Gallery ${
																	index + 1
																}`}
																className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
															/>
															{/* Cover image badge */}
															{isCover && (
																<div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
																	<Star className="h-3 w-3 fill-white" />
																	Cover
																</div>
															)}
															{/* Action buttons - always visible for mobile */}
															<div className="absolute top-2 right-2 flex flex-col gap-1">
																{!isCover && (
																	<button
																		onClick={() =>
																			setAsCoverImage(
																				imageUrl
																			)
																		}
																		className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md"
																		title="Set as cover image">
																		<Star className="h-4 w-4" />
																	</button>
																)}
																<button
																	onClick={() =>
																		deleteExistingImage(
																			imageUrl
																		)
																	}
																	className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md"
																	title="Delete image">
																	<Trash2 className="h-4 w-4" />
																</button>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									)}

									{/* Display newly uploaded photos (before saving) */}
									{uploadedPhotos.length > 0 && (
										<div>
											<h3 className="text-sm font-medium text-gray-700 mb-3">
												New Photos to Upload
											</h3>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
												{uploadedPhotos.map((photo, index) => (
													<div
														key={`new-${index}`}
														className="relative group">
														<img
															src={URL.createObjectURL(
																photo
															)}
															alt={`Photo ${index + 1}`}
															className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
														/>
														<button
															onClick={() =>
																removePhoto(index)
															}
															className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									<div className="flex gap-4">
										<Button
											variant="outline"
											onClick={() => setCurrentStep(2)}
											className="flex-1">
											<ArrowLeft className="h-4 w-4 mr-2" />
											Back
										</Button>
										<Button onClick={handlePhotosNext} className="flex-1">
											<ArrowRight className="h-4 w-4 mr-2" />
											{(() => {
												if (!selectedTemplate?.isPremium) {
													return "Publish Website";
												}

												const hasPurchased = hasUserPurchasedTemplate(
													selectedTemplate.id
												);

												return hasPurchased
													? "Publish Website"
													: "Continue to Payment";
											})()}
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{currentStep === 4 && selectedTemplate?.isPremium && (
						<Card>
							<CardHeader>
								<CardTitle>Complete Your Purchase</CardTitle>
								<CardDescription>
									Unlock premium features for your {selectedTemplate.name} template
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{/* Show active subscription notice if user already purchased this template */}
									{selectedTemplate && hasUserPurchasedTemplate(selectedTemplate.id) && (
										<div className="bg-green-50 p-4 rounded-lg border border-green-200">
											<div className="flex items-center mb-2">
												<Check className="h-4 w-4 text-green-600 mr-2" />
												<span className="font-medium text-green-800">
													You already own this template!
												</span>
											</div>
											<p className="text-sm text-green-700">
												This template has been purchased and is ready to use.
											</p>
										</div>
									)}

									<div className="bg-gray-50 p-4 rounded-lg">
										<div className="flex justify-between items-center mb-2">
											<span className="font-medium">
												{selectedTemplate.name} Template
											</span>
											<span className="font-bold">₦{selectedTemplate.price}</span>
										</div>
										<div className="text-sm text-gray-600">
											Premium features included:
										</div>
										<ul className="text-sm text-gray-600 mt-2 space-y-1">
											{selectedTemplate.features?.map((feature, index) => (
												<li key={index} className="flex items-center">
													<Check className="h-3 w-3 text-green-500 mr-2" />
													{feature}
												</li>
											))}
										</ul>
									</div>

									<div className="flex gap-4">
										<Button
											variant="outline"
											onClick={() => setCurrentStep(3)}
											className="flex-1">
											<ArrowLeft className="h-4 w-4 mr-2" />
											Back
										</Button>
										<Button
											onClick={handlePayment}
											className="flex-1"
											disabled={
												selectedTemplate &&
												hasUserPurchasedTemplate(selectedTemplate.id)
											}>
											{selectedTemplate &&
											hasUserPurchasedTemplate(selectedTemplate.id)
												? "Already Purchased"
												: "Pay with Paystack"}
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{currentStep === 5 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-green-600">
									<Globe className="h-5 w-5" />
									Your Website is Live!
								</CardTitle>
								<CardDescription>
									Congratulations! Your{" "}
									{selectedEventType === "birthday" ? "birthday" : "wedding"} website is now
									ready to share
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									<div className="bg-green-50 p-4 rounded-lg border border-green-200">
										<p className="font-medium text-green-800 mb-2">Website URL:</p>
										<div className="flex items-center gap-2">
											<code className="bg-white px-3 py-2 rounded border text-sm flex-1">
												{websiteUrl}
											</code>
											<Button size="sm" onClick={copyWebsiteUrl}>
												Copy
											</Button>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Button asChild>
											<a
												href={websiteUrl}
												target="_blank"
												rel="noopener noreferrer">
												<Globe className="h-4 w-4 mr-2" />
												View Your Website
											</a>
										</Button>
										<Button variant="outline" asChild>
											<a href="/dashboard">Go to Dashboard</a>
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}

export default function WebsiteBuilderPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			}>
			<WebsiteBuilderContent />
		</Suspense>
	);
}
