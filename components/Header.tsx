"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth";
import Image from "next/image";

const MotionLink = motion(Link);

const Header = () => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<>
			{/* Top notification bar */}
			{/* <div className="bg-gradient-to-r from-[#7c8925] to-[#6A8E22] px-4 py-2 text-sm text-center text-white">
        Up to 40% off all Save the Dates and Invitations
        <Link href="/designs" className="ml-2 underline cursor-pointer hover:no-underline text-yellow-200 hover:text-white transition">
          Explore Designs
        </Link>
      </div> */}

			{/* Main header */}
			<nav className="fixed w-full h-[80px] z-40 left-0 px-6 bg-gradient-to-r from-[#7c8925] to-[#6A8E22] top-0">
				<div className=" mx-auto flex h-full items-center justify-between  relative">
					{/* Logo */}
					{/* Logo */}
					<MotionLink
						href="/"
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="flex items-center h-14  rounded-2xl">
						<Image
							src="/assets/logo.svg"
							alt="Stunning Logo"
							width={160}
							height={50}
							priority
							className="invert brightness-0"
						/>
					</MotionLink>

					{/* Desktop Navigation */}
					<div className="hidden md:flex h-full items-center gap-6 rounded-2xl px-4 py-2">
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center space-x-1 text-white hover:text-yellow-200 transition text-sm font-medium group">
								<span>Plan & Invite</span>
								<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-2xl rounded-xl min-w-[240px] p-3 z-50"
								sideOffset={8}
								align="start"
								side="bottom">
								<div className="py-2">
									<div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
										Plan & Invite
									</div>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/designs"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Wedding Website
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/save-the-dates"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Save the Dates
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/invitations"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Invitations
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/guests"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Guest List
										</Link>
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center space-x-1 text-white hover:text-yellow-200 transition text-sm font-medium group">
								<span>Gift List</span>
								<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-2xl rounded-xl min-w-[240px] p-3 z-50"
								sideOffset={8}
								align="start"
								side="bottom">
								<div className="py-2">
									<div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
										Gift Registry
									</div>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/registry"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Create Registry
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/gifts"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Browse Gifts
										</Link>
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center space-x-1 text-white hover:text-yellow-200 transition text-sm font-medium group">
								<span>Expert Advice</span>
								<ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-2xl rounded-xl min-w-[240px] p-3 z-50"
								sideOffset={8}
								align="start"
								side="bottom">
								<div className="py-2">
									<div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
										Expert Advice
									</div>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/planning"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Wedding Planning
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/etiquette"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Etiquette Guide
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className="rounded-lg px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-[#7c8925]/15 hover:to-[#6A8E22]/15 hover:text-[#7c8925] transition-all duration-200 cursor-pointer focus:bg-gradient-to-r focus:from-[#7c8925]/15 focus:to-[#6A8E22]/15 group">
										<Link
											href="/inspiration"
											className="w-full font-medium group-hover:translate-x-1 transition-transform duration-200">
											Inspiration
										</Link>
									</DropdownMenuItem>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Right side actions */}
					<div className="flex items-center space-x-4">
						<span className="hidden lg:inline text-sm text-white/80">Find an Event</span>

						<div className="hidden md:block">
							<AuthButtons />
						</div>

						<button
							className="md:hidden bg-white/10 backdrop-blur-sm p-2 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							aria-label="Open menu">
							<Menu className="w-6 h-6" />
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 bg-black/40 flex justify-end md:hidden"
					onClick={() => setIsMobileMenuOpen(false)}>
					<motion.div
						initial={{ x: 300 }}
						animate={{ x: 0 }}
						exit={{ x: 300 }}
						transition={{ type: "spring", stiffness: 300 }}
						className="w-80 bg-white h-full shadow-2xl p-6"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex justify-between items-center mb-8">
							<div className="font-bold text-lg text-[#7c8925]">GreenEves</div>
							<button
								className="p-2 hover:bg-gray-100 rounded-lg transition"
								onClick={() => setIsMobileMenuOpen(false)}>
								<X className="w-5 h-5" />
							</button>
						</div>

						<nav className="flex flex-col gap-6">
							{/* Plan & Invite Section */}
							<div>
								<h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
									Plan & Invite
								</h3>
								<div className="space-y-2 ml-2">
									<Link
										href="/designs"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Wedding Website
									</Link>
									<Link
										href="/save-the-dates"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Save the Dates
									</Link>
									<Link
										href="/invitations"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Invitations
									</Link>
									<Link
										href="/guests"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Guest List
									</Link>
								</div>
							</div>

							{/* Gift List Section */}
							<div>
								<h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
									Gift List
								</h3>
								<div className="space-y-2 ml-2">
									<Link
										href="/registry"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Create Registry
									</Link>
									<Link
										href="/gifts"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Browse Gifts
									</Link>
								</div>
							</div>

							{/* Expert Advice Section */}
							<div>
								<h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
									Expert Advice
								</h3>
								<div className="space-y-2 ml-2">
									<Link
										href="/planning"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Wedding Planning
									</Link>
									<Link
										href="/etiquette"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Etiquette Guide
									</Link>
									<Link
										href="/inspiration"
										onClick={() => setIsMobileMenuOpen(false)}
										className="block py-2 text-gray-600 hover:text-[#7c8925] transition">
										Inspiration
									</Link>
								</div>
							</div>

							{/* Find Event */}
							<div className="text-gray-600 text-sm border-t pt-4">Find an Event</div>

							{/* Auth Buttons */}
							<div className="border-t pt-4" onClick={() => setIsMobileMenuOpen(false)}>
								<AuthButtons />
							</div>
						</nav>
					</motion.div>
				</motion.div>
			)}
		</>
	);
};

const AuthButtons = () => {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const router = useRouter();

	const handleSignOut = () => {
		logout();
		router.push("/");
	};

	if (user) {
		return (
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2 text-sm">
					<User className="w-4 h-4 text-white" />
					<span className="text-white/80">{user.email}</span>
				</div>
				<Button variant="ghost" size="sm" className="text-white hover:text-yellow-200 hover:bg-white/10" asChild>
					<Link href="/dashboard">Dashboard</Link>
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleSignOut}
					className="text-white hover:text-yellow-200 hover:bg-white/10">
					Sign Out
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-3">
			<Link href="/login" className="text-white hover:text-yellow-200 transition text-sm font-medium">
				Log in
			</Link>
			<Link
				href="/register"
				className="px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-[#c3d265] to-[#6A8E22] text-white font-semibold shadow-md hover:brightness-105 transition">
				Get Started
			</Link>
		</div>
	);
};

export default Header;
