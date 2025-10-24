"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Calendar, Users, Check, X } from "lucide-react";

export interface RSVPSectionProps {
	event: any;
	config?: {
		showMessage?: boolean;
		showPlusOnes?: boolean;
		rsvpDeadlineDays?: number;
		showAttendeeCount?: boolean;
		showDietaryRestrictions?: boolean;
	};
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ event, config = {} }) => {
	const { colors, fonts } = useTheme();
	const { showMessage = true, showPlusOnes = true, rsvpDeadlineDays = 7, showAttendeeCount = true, showDietaryRestrictions = false } = config;

	const [rsvpForm, setRsvpForm] = useState({
		name: "",
		email: "",
		attending: "",
		guests: 1,
		message: "",
		dietary: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("RSVP submitted:", rsvpForm);
		// In production, submit to API
	};

	const getDeadlineDate = () => {
		if (!event.eventDate) return "";
		const eventDate = new Date(event.eventDate);
		const deadline = new Date(eventDate);
		deadline.setDate(deadline.getDate() - rsvpDeadlineDays);
		return deadline.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<section
			className="py-16 px-4"
			style={{
				background: `linear-gradient(135deg, ${colors.primary}05 0%, ${colors.secondary}05 100%)`,
			}}>
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="flex items-center justify-center gap-2 mb-4">
						<Calendar className="w-8 h-8" style={{ color: colors.primary }} />
						<h2
							className="text-4xl md:text-5xl font-bold"
							style={{ fontFamily: fonts.heading, color: colors.primary }}>
							RSVP
						</h2>
					</div>
					<p className="text-lg mb-2" style={{ fontFamily: fonts.body, color: colors.text || "#666" }}>
						We hope you can join us for this special celebration!
					</p>
					{getDeadlineDate() && (
						<p className="text-sm" style={{ fontFamily: fonts.body, color: colors.accent }}>
							Please respond by {getDeadlineDate()}
						</p>
					)}
					{showAttendeeCount && (
						<div
							className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
							style={{
								backgroundColor: `${colors.primary}20`,
								color: colors.primary,
							}}>
							<Users className="w-5 h-5" />
							<span style={{ fontFamily: fonts.body }}>47 guests attending</span>
						</div>
					)}
				</div>

				{/* RSVP Form */}
				<div className="p-8 rounded-lg shadow-xl" style={{ backgroundColor: "#fff" }}>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name */}
						<div>
							<label
								htmlFor="rsvp-name"
								className="block mb-2 font-medium"
								style={{ fontFamily: fonts.body, color: colors.text || "#333" }}>
								Your Name *
							</label>
							<input
								id="rsvp-name"
								type="text"
								value={rsvpForm.name}
								onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
								placeholder="Enter your full name"
								className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
								style={{
									fontFamily: fonts.body,
									borderColor: `${colors.primary}40`,
								}}
								required
							/>
						</div>

						{/* Email */}
						<div>
							<label
								htmlFor="rsvp-email"
								className="block mb-2 font-medium"
								style={{ fontFamily: fonts.body, color: colors.text || "#333" }}>
								Email Address *
							</label>
							<input
								id="rsvp-email"
								type="email"
								value={rsvpForm.email}
								onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
								placeholder="your.email@example.com"
								className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
								style={{
									fontFamily: fonts.body,
									borderColor: `${colors.primary}40`,
								}}
								required
							/>
						</div>

						{/* Attendance */}
						<div>
							<label
								className="block mb-3 font-medium"
								style={{ fontFamily: fonts.body, color: colors.text || "#333" }}>
								Will you be attending? *
							</label>
							<div className="grid grid-cols-2 gap-4">
								<button
									type="button"
									onClick={() => setRsvpForm({ ...rsvpForm, attending: "yes" })}
									className="py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
									style={{
										backgroundColor:
											rsvpForm.attending === "yes" ? colors.primary : "#fff",
										color: rsvpForm.attending === "yes" ? "#fff" : colors.text || "#333",
										border: `2px solid ${
											rsvpForm.attending === "yes"
												? colors.primary
												: `${colors.primary}40`
										}`,
										fontFamily: fonts.body,
									}}>
									<Check className="w-5 h-5" />
									Yes, I'll be there!
								</button>
								<button
									type="button"
									onClick={() => setRsvpForm({ ...rsvpForm, attending: "no" })}
									className="py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
									style={{
										backgroundColor:
											rsvpForm.attending === "no" ? colors.secondary : "#fff",
										color: rsvpForm.attending === "no" ? "#fff" : colors.text || "#333",
										border: `2px solid ${
											rsvpForm.attending === "no"
												? colors.secondary
												: `${colors.primary}40`
										}`,
										fontFamily: fonts.body,
									}}>
									<X className="w-5 h-5" />
									Can't make it
								</button>
							</div>
						</div>

						{/* Conditional fields for attending */}
						{rsvpForm.attending === "yes" && (
							<>
								{/* Number of Guests */}
								{showPlusOnes && (
									<div>
										<label
											htmlFor="rsvp-guests"
											className="block mb-2 font-medium"
											style={{
												fontFamily: fonts.body,
												color: colors.text || "#333",
											}}>
											Number of Guests
										</label>
										<select
											id="rsvp-guests"
											value={rsvpForm.guests}
											onChange={(e) =>
												setRsvpForm({
													...rsvpForm,
													guests: parseInt(e.target.value),
												})
											}
											className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
											style={{
												fontFamily: fonts.body,
												borderColor: `${colors.primary}40`,
											}}>
											<option value={1}>Just me</option>
											<option value={2}>2 people</option>
											<option value={3}>3 people</option>
											<option value={4}>4 people</option>
										</select>
									</div>
								)}

								{/* Dietary Restrictions */}
								{showDietaryRestrictions && (
									<div>
										<label
											htmlFor="rsvp-dietary"
											className="block mb-2 font-medium"
											style={{
												fontFamily: fonts.body,
												color: colors.text || "#333",
											}}>
											Dietary Restrictions
										</label>
										<input
											id="rsvp-dietary"
											type="text"
											value={rsvpForm.dietary}
											onChange={(e) =>
												setRsvpForm({ ...rsvpForm, dietary: e.target.value })
											}
											placeholder="e.g., Vegetarian, Gluten-free, None"
											className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
											style={{
												fontFamily: fonts.body,
												borderColor: `${colors.primary}40`,
											}}
										/>
									</div>
								)}
							</>
						)}

						{/* Message */}
						{showMessage && (
							<div>
								<label
									htmlFor="rsvp-message"
									className="block mb-2 font-medium"
									style={{ fontFamily: fonts.body, color: colors.text || "#333" }}>
									Message {rsvpForm.attending === "yes" ? "(Optional)" : ""}
								</label>
								<textarea
									id="rsvp-message"
									value={rsvpForm.message}
									onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
									placeholder={
										rsvpForm.attending === "yes"
											? "Share your excitement or any special requests..."
											: "Let us know you'll be there in spirit..."
									}
									rows={4}
									className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
									style={{
										fontFamily: fonts.body,
										borderColor: `${colors.primary}40`,
									}}
								/>
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={!rsvpForm.name || !rsvpForm.email || !rsvpForm.attending}
							className="w-full py-4 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
							style={{
								backgroundColor: colors.primary,
								color: "#fff",
								fontFamily: fonts.heading,
							}}>
							Submit RSVP
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};
