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
import { Heart, Upload, Calendar, MapPin, Camera, Globe, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { useDesignStore } from "@/stores/design";
import { useWeddingStore } from "@/stores/wedding";
import { useUIStore } from "@/stores/ui";
import Header from "@/components/Header";
import type { DesignTemplate } from "@/types";
import api from "@/lib/api";

const weddingInfoSchema = z.object({
	coupleNames: z.string().min(2, "Couple names are required"),
	weddingDate: z.string().min(1, "Wedding date is required"),
	ceremonyTime: z.string().optional(),
	ceremonyLocation: z.string().optional(),
	receptionTime: z.string().optional(),
	receptionLocation: z.string().optional(),
	tagline: z.string().optional(),
	story: z.string().optional(),
	locationCity: z.string().optional(),
});

type WeddingInfoForm = z.infer<typeof weddingInfoSchema>;

const steps = [
	{ id: 1, title: "Template", description: "Selected design" },
	{ id: 2, title: "Details", description: "Wedding information" },
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
	const showToast = useUIStore((state) => state.showToast);

	const { currentTemplate, fetchTemplate } = useDesignStore();
	const { weddingInfo, fetchWeddingInfo } = useWeddingStore();

	const [currentStep, setCurrentStep] = useState(editMode ? 2 : 2); // Start at details step since template is already selected
	const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
	const [userSubscription, setUserSubscription] = useState<any>(null);
	const [subscriptionLoading, setSubscriptionLoading] = useState(false);

	console.log("Website Builder - templateId:", templateId, "editMode:", editMode, "selectedTemplate:", selectedTemplate);
	const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
	const [websiteUrl, setWebsiteUrl] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<WeddingInfoForm>({
		resolver: zodResolver(weddingInfoSchema),
		defaultValues: {
			coupleNames: user?.displayName || "",
		},
	});

	const watchedValues = watch();

	const fetchUserSubscription = useCallback(async () => {
		if (!isAuthenticated) return;

		try {
			setSubscriptionLoading(true);
			const response = await api.get("/payments/subscription");
			setUserSubscription(response.data);
		} catch (error) {
			console.error("Failed to fetch user subscription:", error);
			setUserSubscription(null);
		} finally {
			setSubscriptionLoading(false);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
			return;
		}

		if (templateId) {
			fetchTemplate(templateId);
		}

		// Fetch existing wedding info and subscription for all authenticated users
		if (isAuthenticated) {
			fetchWeddingInfo().catch(() => {});
			fetchUserSubscription();
		}

		// Don't handle payment success here - wait for wedding info to load
	}, [isAuthenticated, isLoading, templateId, editMode, paymentSuccess, fetchTemplate, fetchWeddingInfo, fetchUserSubscription, router]);

	// Populate form with existing wedding info if available
	useEffect(() => {
		if (weddingInfo) {
			setValue("coupleNames", weddingInfo.coupleNames || "");
			setValue("weddingDate", weddingInfo.weddingDate || "");
			setValue("ceremonyTime", weddingInfo.ceremonyTime || "");
			setValue("ceremonyLocation", weddingInfo.ceremonyLocation || "");
			setValue("receptionTime", weddingInfo.receptionTime || "");
			setValue("receptionLocation", weddingInfo.receptionLocation || "");
			setValue("tagline", weddingInfo.tagline || "");
			setValue("story", weddingInfo.story || "");
			setValue("locationCity", weddingInfo.locationCity || "");
		}
	}, [weddingInfo, setValue]);

	useEffect(() => {
		if (currentTemplate) {
			setSelectedTemplate(currentTemplate);
		}
	}, [currentTemplate]);

	const publishWebsite = useCallback(async () => {
		try {
			// Ensure wedding info exists (it should have been created in step 2)
			// If in edit mode, we don't need to create again
			if (!editMode && user?.id) {
				// Verify the wedding info was saved - if not, this should trigger an error
				const response = await api.get("/weddings/my-wedding");
				if (!response.data.weddingInfo) {
					throw new Error("Wedding information not found. Please go back and fill out the details.");
				}
			}

			// Select/publish the chosen template (save the design choice to backend)
			if (selectedTemplate?.id) {
				console.log('Publishing website with template:', selectedTemplate.id);
				
				try {
					await api.post("/design-templates/select", {
						templateId: selectedTemplate.id,
						name: `${user?.displayName || 'My'} Wedding Website`,
					});
					console.log('Template selection saved successfully');
				} catch (error: any) {
					// If user already selected this template, that's fine - just log and continue
					if (error.response?.status === 409) {
						console.log('Template already selected, continuing...');
					} else {
						throw error; // Re-throw other errors
					}
				}
			}

			// Generate the website URL
			const url = `${window.location.origin}/wedding/${user?.id}`;
			setWebsiteUrl(url);
			setCurrentStep(5);
			showToast("Your wedding website is now live!", "success");
		} catch (error) {
			console.error("Publish website error:", error);
			showToast("Failed to publish website. Please ensure your wedding details are saved.", "error");
		}
	}, [editMode, user?.id, user?.displayName, selectedTemplate?.id, showToast]);

	// Handle payment success after wedding info is loaded
	useEffect(() => {
		if (paymentSuccess && isAuthenticated && weddingInfo) {
			console.log("Payment success detected, publishing website...");
			publishWebsite();
		}
	}, [paymentSuccess, isAuthenticated, weddingInfo, publishWebsite]);

	const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setUploadedPhotos((prev) => [...prev, ...files].slice(0, 6)); // Max 6 photos
	};

	const removePhoto = (index: number) => {
		setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
	};

	const onSubmitWeddingInfo = async (data: WeddingInfoForm) => {
		try {
			let response;
			if (editMode || weddingInfo) {
				// Update existing wedding info (either in edit mode or user already has wedding info)
				response = await api.patch("/weddings", data);
			} else {
				// Create new wedding info
				response = await api.post("/weddings", data);
			}

			if (response.status === 200 || response.status === 201) {
				setCurrentStep(3);
				showToast("Wedding details saved!", "success");
			}
		} catch (error) {
			console.error("Error saving wedding info:", error);
			showToast("Failed to save wedding details", "error");
		}
	};

	const handlePhotosNext = async () => {
		if (uploadedPhotos.length > 0) {
			try {
				const uploadPromises = uploadedPhotos.map(async (photo) => {
					const formData = new FormData();
					formData.append("file", photo);
					formData.append("album", "public");
					formData.append("title", `Wedding Photo ${Date.now()}`);
					formData.append("description", "Wedding photo uploaded via website builder");

					return await api.post("/uploads/photos", formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});
				});

				await Promise.all(uploadPromises);
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
			// Check if user already has an active premium subscription
			const hasActivePremium =
				userSubscription &&
				userSubscription.status === "active" &&
				(userSubscription.plan === "premium" || userSubscription.plan === "enterprise") &&
				(!userSubscription.expiresAt || new Date(userSubscription.expiresAt) > new Date());

			if (hasActivePremium) {
				// User already has premium access, skip payment
				showToast("Using your existing premium subscription!", "success");
				await publishWebsite();
			} else {
				// User needs to purchase premium access
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

	if (!isAuthenticated || (!selectedTemplate && !editMode)) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
					{currentStep === 2 && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Wedding Details
								</CardTitle>
								<CardDescription>
									<div>
										{editMode ? (
											"Update your wedding information"
										) : (
											<div className="flex items-center gap-2 flex-wrap">
												<span>Tell us about your special day using the {selectedTemplate?.name} template</span>
												{selectedTemplate?.isPremium && userSubscription && userSubscription.status === 'active' && (
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
														<Check className="h-3 w-3 mr-1" />
														Premium Purchased
													</span>
												)}
											</div>
										)}
									</div>
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit(onSubmitWeddingInfo)} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="md:col-span-2">
											<label className="block text-sm font-medium mb-2">
												Couple Names *
											</label>
											<Input
												placeholder="John & Jane Smith"
												{...register("coupleNames")}
											/>
											{errors.coupleNames && (
												<p className="text-sm text-red-500 mt-1">
													{errors.coupleNames.message}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Wedding Date *
											</label>
											<Input type="date" {...register("weddingDate")} />
											{errors.weddingDate && (
												<p className="text-sm text-red-500 mt-1">
													{errors.weddingDate.message}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Location/City
											</label>
											<Input
												placeholder="Lagos, Nigeria"
												{...register("locationCity")}
											/>
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Ceremony Time
											</label>
											<Input placeholder="4:00 PM" {...register("ceremonyTime")} />
										</div>

										<div>
											<label className="block text-sm font-medium mb-2">
												Reception Time
											</label>
											<Input placeholder="6:00 PM" {...register("receptionTime")} />
										</div>

										<div className="md:col-span-2">
											<label className="block text-sm font-medium mb-2">
												Ceremony Location
											</label>
											<Input
												placeholder="St. Mary's Church, 123 Main Street"
												{...register("ceremonyLocation")}
											/>
										</div>

										<div className="md:col-span-2">
											<label className="block text-sm font-medium mb-2">
												Reception Location
											</label>
											<Input
												placeholder="Grand Ballroom, Hotel Paradise"
												{...register("receptionLocation")}
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
												Your Love Story (Optional)
											</label>
											<Textarea
												placeholder="Tell your guests about how you met and your journey together..."
												rows={4}
												{...register("story")}
											/>
										</div>
									</div>

									<Button type="submit" className="w-full">
										<ArrowRight className="h-4 w-4 mr-2" />
										Continue to Photos
									</Button>
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
									{selectedTemplate?.isPremium && userSubscription && userSubscription.status === 'active' && (
										<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-auto">
											<Check className="h-3 w-3 mr-1" />
											Premium Purchased
										</span>
									)}
								</CardTitle>
								<CardDescription>
									<div>
										Add beautiful photos to your wedding website (optional)
										{selectedTemplate?.isPremium && userSubscription && userSubscription.status === 'active' && (
											<span className="block text-green-600 text-sm mt-1">
												✓ Using your premium subscription - no payment required
											</span>
										)}
									</div>
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

									{uploadedPhotos.length > 0 && (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{uploadedPhotos.map((photo, index) => (
												<div key={index} className="relative group">
													<img
														src={URL.createObjectURL(photo)}
														alt={`Photo ${index + 1}`}
														className="w-full h-32 object-cover rounded-lg"
													/>
													<button
														onClick={() => removePhoto(index)}
														className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
														×
													</button>
												</div>
											))}
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
												
												const hasActivePremium = userSubscription && 
													userSubscription.status === "active" && 
													(userSubscription.plan === "premium" || userSubscription.plan === "enterprise") &&
													(!userSubscription.expiresAt || new Date(userSubscription.expiresAt) > new Date());
												
												return hasActivePremium ? "Publish Website" : "Continue to Payment";
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
									{/* Show subscription status if loading */}
									{subscriptionLoading && (
										<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
											<div className="flex items-center">
												<Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600" />
												<span className="text-blue-800">
													Checking your subscription status...
												</span>
											</div>
										</div>
									)}

									{/* Show active subscription notice */}
									{!subscriptionLoading &&
										userSubscription &&
										userSubscription.status === "active" && (
											<div className="bg-green-50 p-4 rounded-lg border border-green-200">
												<div className="flex items-center mb-2">
													<Check className="h-4 w-4 text-green-600 mr-2" />
													<span className="font-medium text-green-800">
														You already have premium access!
													</span>
												</div>
												<p className="text-sm text-green-700">
													Your {userSubscription.plan} subscription is
													active
													{userSubscription.expiresAt &&
														` until ${new Date(
															userSubscription.expiresAt
														).toLocaleDateString()}`}
													.
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
												subscriptionLoading ||
												(userSubscription &&
													userSubscription.status === "active")
											}>
											{userSubscription && userSubscription.status === "active"
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
									Congratulations! Your wedding website is now ready to share
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
