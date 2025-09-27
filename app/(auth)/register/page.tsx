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

const registerSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const templateId = searchParams?.get('template');
	const redirectTo = searchParams?.get('redirect');
	
	const register_action = useAuthStore((state) => state.register);
	const isLoading = useAuthStore((state) => state.isLoading);
	const showToast = useUIStore((state) => state.showToast);

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
			
			// Handle redirect based on where user came from
			if (redirectTo === 'website-builder' && templateId) {
				router.push(`/website-builder?template=${templateId}`);
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
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="p-3 bg-primary/10 rounded-full">
							<Heart className="w-8 h-8 text-primary" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
					<CardDescription>
						{templateId ? 'Create your account to build your wedding website' : 'Start planning your dream wedding today'}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								Email *
							</label>
							<Input id="email" type="email" placeholder="your.email@example.com" {...register("email")} />
							{errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
						</div>

						<div className="space-y-2">
							<label htmlFor="displayName" className="text-sm font-medium">
								Display Name
							</label>
							<Input
								id="displayName"
								type="text"
								placeholder="Your name or couple names"
								{...register("displayName")}
							/>
							{errors.displayName && <p className="text-sm text-red-500">{errors.displayName.message}</p>}
						</div>

						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium">
								Password *
							</label>
							<Input
								id="password"
								type="password"
								placeholder="Create a secure password"
								{...register("password")}
							/>
							{errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
						</div>

						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating account..." : "Create Account"}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link href="/login" className="text-primary hover:underline font-medium">
								Sign in
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
