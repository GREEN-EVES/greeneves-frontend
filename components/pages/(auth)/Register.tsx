"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense, useEffect } from "react";
import Image from "next/image";
import { Mail, Lock, User } from "lucide-react";

const registerSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const templateId = searchParams?.get("template");
	const redirectTo = searchParams?.get("redirect");

	const register_action = useAuthStore((state) => state.register);
	const isLoading = useAuthStore((state) => state.isLoading);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitialized = useAuthStore((state) => state.isInitialized);
	const showToast = useUIStore((state) => state.showToast);

	// Redirect authenticated users to dashboard
	useEffect(() => {
		// Wait for initialization to complete before making routing decisions
		if (!isInitialized || isLoading) {
			return;
		}

		// Redirect if user is already authenticated
		if (isAuthenticated) {
			if (redirectTo === "event-setup" && templateId) {
				router.push(`/event-setup?template=${templateId}`);
			} else {
				router.push("/dashboard");
			}
		}
	}, [isAuthenticated, isInitialized, isLoading, router, templateId, redirectTo]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterForm) => {
		try {
			await register_action(data.email, data.password, data.displayName);
			showToast("Account created successfully! Welcome to GreenEves.", "success");

			if (redirectTo === "event-setup" && templateId) {
				router.push(`/event-setup?template=${templateId}`);
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			if (error instanceof Error) {
				showToast(error.message || "Registration failed. Please try again.", "error");
			}
		}
	};

	return (
		<div className="min-h-screen flex relative bg-gradient-to-br from-rose-50 to-[#ffffff]">
			{/* Background Image */}
			<Image
				src="/olivegreen.jpg" // same as login page
				alt="Wedding background"
				fill
				priority
				className="object-cover opacity-90"
			/>

			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-[#505a11] to-[#6A8E22]/70" />

			{/* Centered Form */}
			<div className="absolute flex items-center justify-center h-full w-full px-6 py-10">
				<Card className="w-full max-w-md shadow-lg border-2 border-[#6A8E22] bg-gradient-to-br from-white to-[#fcfff5]">
					<CardHeader className="text-center">
						<div className="flex justify-center">
							<div className="p-3 bg-primary/10 rounded-full">
								<Image
									src="/assets/main.png"
									alt="GreenEves logo"
									className="w-40 h-25 object-contain"
								/>
							</div>
						</div>
						<CardTitle className="text-2xl font-bold text-gray-800">Create Your Account</CardTitle>
						<CardDescription className="text-gray-600">
							{templateId
								? "Create your account to start building your dream wedding website"
								: "Join GreenEves and start planning your perfect wedding"}
						</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							{/* Email Field */}
							<div className="space-y-2">
								<label htmlFor="email" className="text-sm font-semibold text-gray-700">
									Email
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
									<Input
										id="email"
										type="email"
										placeholder="your.email@example.com"
										className="w-full py-6 pl-10 border-[#acacac] focus:border-[#6A8E22] rounded-xl bg-gray-50 shadow-sm focus:ring-2 focus:ring-[#6A8E22] focus:bg-white transition-all duration-200"
										{...register("email")}
									/>
								</div>
								{errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
							</div>

							{/* Display Name Field */}
							<div className="space-y-2">
								<label htmlFor="displayName" className="text-sm font-semibold text-gray-700">
									Display Name
								</label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
									<Input
										id="displayName"
										type="text"
										placeholder="Your name or couple names"
										className="w-full py-6 pl-10 border-[#acacac] focus:border-[#6A8E22] rounded-xl bg-gray-50 shadow-sm focus:ring-2 focus:ring-[#6A8E22] focus:bg-white transition-all duration-200"
										{...register("displayName")}
									/>
								</div>
								{errors.displayName && (
									<p className="text-xs text-red-500">{errors.displayName.message}</p>
								)}
							</div>

							{/* Password Field */}
							<div className="space-y-2">
								<label htmlFor="password" className="text-sm font-semibold text-gray-700">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
									<Input
										id="password"
										type="password"
										placeholder="Create a secure password"
										className="w-full py-6 pl-10 border-[#acacac] focus:border-[#6A8E22] rounded-xl bg-gray-50 shadow-sm focus:ring-2 focus:ring-[#6A8E22] focus:bg-white transition-all duration-200"
										{...register("password")}
									/>
								</div>
								{errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full bg-[#6A8E22] hover:bg-[#7FA827] text-white font-semibold rounded-xl py-4 my-6 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
								disabled={isLoading}>
								{isLoading ? "Creating account..." : "Create Account"}
							</Button>
						</form>

						{/* Footer */}
						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								Already have an account?{" "}
								<Link
									href={
										templateId
											? `/login?template=${templateId}&redirect=${redirectTo}`
											: "/login"
									}
									className="text-[#6A8E22] font-semibold hover:underline transition-colors duration-200">
									Sign in
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
