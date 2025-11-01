// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useAuthStore } from "@/stores/auth";
// import { useUIStore } from "@/stores/ui";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Heart } from "lucide-react";
// import { useEffect, useState } from "react";

// const loginSchema = z.object({
// 	email: z.string().email("Invalid email address"),
// 	password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type LoginForm = z.infer<typeof loginSchema>;

// export default function LoginPage() {
// 	const router = useRouter();
// 	const searchParams = useSearchParams();
// 	const login = useAuthStore((state) => state.login);
// 	const isLoading = useAuthStore((state) => state.isLoading);
// 	const showToast = useUIStore((state) => state.showToast);

// 	// Get template and redirect params from URL
// 	const [templateId, setTemplateId] = useState<string | null>(null);
// 	const [redirectPath, setRedirectPath] = useState<string>('/dashboard');

// 	useEffect(() => {
// 		const template = searchParams?.get('template');
// 		const redirect = searchParams?.get('redirect');

// 		if (template) {
// 			setTemplateId(template);
// 			localStorage.setItem('selectedTemplateId', template);
// 		}

// 		if (redirect) {
// 			setRedirectPath(redirect === 'website-builder' ? '/website-builder' : redirect);
// 		} else if (template) {
// 			// If template is selected but no redirect specified, go to website builder
// 			setRedirectPath('/website-builder');
// 		}
// 	}, [searchParams]);

// 	const {
// 		register,
// 		handleSubmit,
// 		formState: { errors },
// 	} = useForm<LoginForm>({
// 		resolver: zodResolver(loginSchema),
// 	});

// 	const onSubmit = async (data: LoginForm) => {
// 		try {
// 			await login(data.email, data.password);
// 			showToast("Welcome back! You have successfully signed in.", "success");

// 			// Add template to URL if it exists
// 			let finalRedirectPath = redirectPath;
// 			if (templateId && redirectPath === '/website-builder') {
// 				finalRedirectPath = `/website-builder?template=${templateId}`;
// 			}

// 			router.push(finalRedirectPath);
// 		} catch (error) {
// 			if (error instanceof Error) {
// 				showToast(error?.message || "Login failed. Please try again.", "error");
// 			}
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 px-4">
// 			<Card className="w-full max-w-md">
// 				<CardHeader className="text-center">
// 					<div className="flex justify-center mb-4">
// 						<div className="p-3 bg-primary/10 rounded-full">
// 							<Heart className="w-8 h-8 text-primary" />
// 						</div>
// 					</div>
// 					<CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
// 					<CardDescription>
// 						{templateId
// 							? "Sign in to continue with your selected template"
// 							: "Sign in to continue planning your perfect wedding"}
// 					</CardDescription>
// 				</CardHeader>
// 				<CardContent>
// 					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
// 						<div className="space-y-2">
// 							<label htmlFor="email" className="text-sm font-medium">
// 								Email
// 							</label>
// 							<Input id="email" type="email" placeholder="your.email@example.com" {...register("email")} />
// 							{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
// 						</div>

// 						<div className="space-y-2">
// 							<label htmlFor="password" className="text-sm font-medium">
// 								Password
// 							</label>
// 							<Input
// 								id="password"
// 								type="password"
// 								placeholder="Enter your password"
// 								{...register("password")}
// 							/>
// 							{errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
// 						</div>

// 						<Button type="submit" className="w-full" disabled={isLoading}>
// 							{isLoading ? "Signing in..." : "Sign In"}
// 						</Button>
// 					</form>

// 					<div className="mt-6 text-center">
// 						<p className="text-sm text-muted-foreground">
// 							Don&apos;t have an account?{" "}
// 							<Link
// 								href={templateId ? `/register?template=${templateId}&redirect=${redirectPath}` : "/register"}
// 								className="text-primary hover:underline font-medium"
// 							>
// 								Create account
// 							</Link>
// 						</p>
// 					</div>
// 				</CardContent>
// 			</Card>
// 		</div>
// 	);
// }



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
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Mail } from "lucide-react";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const login = useAuthStore((state) => state.login);
	const isLoading = useAuthStore((state) => state.isLoading);
	const showToast = useUIStore((state) => state.showToast);

	const [templateId, setTemplateId] = useState<string | null>(null);
	const [redirectPath, setRedirectPath] = useState<string>("/dashboard");

	useEffect(() => {
		const template = searchParams?.get("template");
		const redirect = searchParams?.get("redirect");

		if (template) {
			setTemplateId(template);
			localStorage.setItem("selectedTemplateId", template);
		}

		if (redirect) {
			setRedirectPath(redirect === "website-builder" ? "/website-builder" : redirect);
		} else if (template) {
			setRedirectPath("/website-builder");
		}
	}, [searchParams]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginForm) => {
		try {
			await login(data.email, data.password);
			showToast("Welcome back! You have successfully signed in.", "success");

			let finalRedirectPath = redirectPath;
			if (templateId && redirectPath === "/website-builder") {
				finalRedirectPath = `/website-builder?template=${templateId}`;
			}

			router.push(finalRedirectPath);
		} catch (error) {
			if (error instanceof Error) {
				showToast(error?.message || "Login failed. Please try again.", "error");
			}
		}
	};

	return (
		<div className="min-h-screen flex   relative bg-gradient-to-br from-rose-50 to-[#ffffff]">



			<Image
				src="/olivegreen.jpg" // local asset
				alt="Wedding background"
				fill
				priority
				className="object-cover opacity-90"
			/>
			{/* <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" /> */}

			<div className="absolute inset-0 bg-gradient-to-r from-[#505a11] to-[#6A8E22]/70" />

			{/* Right Form Section */}
			<div className="absolute flex items-center justify-center h-full w-full  px-6 py-10">
				<Card className="w-full max-w-md shadow-lg border-2 border-[#6A8E22] bg-gradient-to-br from-white to-[#fcfff5]">
					<CardHeader className="text-center">
						<div className="flex justify-center">
							<div className="p-3 bg-primary/10 rounded-full">
								<img
									src="/assets/main.png"
									alt="Heart icon"
									className="w-40 h-25 object-contain"
								/>
							</div>
						</div>
						<CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
						<CardDescription className="text-gray-600">
							{templateId
								? "Sign in to continue with your selected template"
								: "Sign in to continue planning your perfect wedding"}
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
										placeholder="Enter your password"
										className="w-full py-6 pl-10 focus:border-[#6A8E22] border-[#acacac] bg-gray-50 shadow-sm focus:ring-2 focus:ring-[#6A8E22] focus:bg-white transition-all duration-200"
										{...register("password")}
									/>
								</div>
								{/* <div className="relative">
								 
									<Input
										id="password"
										type="password"
										placeholder="Enter your password"
										className="w-full py-6  focus:border-[#6A8E22] border-[#acacac]  bg-gray-50 shadow-sm focus:ring-2 focus:ring-[#6A8E22] focus:bg-white transition-all duration-200"
										{...register("password")}
									/>
								</div> */}
								{errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								className="w-full bg-[#6A8E22] hover:bg-[#7FA827] text-white font-semibold rounded-xl py-4 my-6 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
								disabled={isLoading}
							>
								{isLoading ? "Signing in..." : "Sign In"}
							</Button>
						</form>

						{/* Footer Link */}
						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								Don&apos;t have an account?{" "}
								<Link
									href={templateId ? `/register?template=${templateId}&redirect=${redirectPath}` : "/register"}
									className="text-[#6A8E22] font-semibold hover:underline transition-colors duration-200"
								>
									Create account
								</Link>
							</p>
						</div>
					</CardContent>

				</Card>
			</div>
		</div>
	);
}
