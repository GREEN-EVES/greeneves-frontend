"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { useEventStore } from "@/stores/event";
import Header from "@/components/Header";
import { Gift, Plus, Search, ArrowLeft, TrendingUp, TrendingDown, Wallet, Calculator, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";

interface BudgetItem {
	id: string;
	category: string;
	itemName: string;
	estimatedCost: number;
	actualCost: number;
	paidAmount: number;
	dueDate?: string;
	status: "planned" | "booked" | "paid" | "overdue";
	notes?: string;
	createdAt: string;
	// Mapped fields for UI compatibility
	description?: string;
	budgetedAmount?: number;
	actualAmount?: number;
}

const budgetCategories = [
	"Venue",
	"Catering",
	"Photography",
	"Videography",
	"Flowers",
	"Music/DJ",
	"Dress/Attire",
	"Rings",
	"Transportation",
	"Decorations",
	"Invitations",
	"Favors",
	"Hair/Makeup",
	"Honeymoon",
	"Miscellaneous",
];

export default function BudgetTrackerPage() {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isLoading = useAuthStore((state) => state.isLoading);
	const { events, currentEventId } = useEventStore();

	// Derive currentEvent from events array to ensure we get fresh data
	const currentEvent = events.find((e) => e.id === currentEventId) || null;

	const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAddForm, setShowAddForm] = useState(false);
	const [totalBudget, setTotalBudget] = useState(0);
	const [showBudgetEdit, setShowBudgetEdit] = useState(false);
	const [newItem, setNewItem] = useState({
		category: "",
		itemName: "",
		estimatedCost: 0,
		actualCost: 0,
		paidAmount: 0,
		dueDate: "",
		notes: "",
	});

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/login");
			return;
		}

		if (isAuthenticated) {
			fetchBudgetItems();
		}
	}, [isAuthenticated, isLoading, router]);

	const fetchBudgetItems = async () => {
		try {
			setLoading(true);
			console.log("🔍 Fetching budget items...");
			const response = await api.get("/budget");
			console.log("📡 Budget API Response:", response.data);

			let budgetItems = Array.isArray(response.data) ? response.data : [];

			// Map backend fields to frontend UI fields for compatibility
			budgetItems = budgetItems.map((item) => ({
				...item,
				description: item.itemName,
				budgetedAmount: item.estimatedCost || 0,
				actualAmount: item.actualCost || 0,
			}));

			console.log("✅ Mapped budget items:", budgetItems);
			setBudgetItems(budgetItems);
		} catch (error) {
			console.error("❌ Error fetching budget items:", error);
			setBudgetItems([]);
		} finally {
			setLoading(false);
		}
	};

	const handleAddItem = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			console.log("📤 Creating budget item:", newItem);
			const response = await api.post("/budget", newItem);
			console.log("✅ Budget item created:", response.data);

			// Refetch budget items to get updated list
			await fetchBudgetItems();

			setNewItem({
				category: "",
				itemName: "",
				estimatedCost: 0,
				actualCost: 0,
				paidAmount: 0,
				dueDate: "",
				notes: "",
			});
			setShowAddForm(false);
		} catch (error) {
			console.error("❌ Error adding budget item:", error);
		}
	};

	const handleDeleteItem = async (id: string) => {
		try {
			console.log("🗑️ Deleting budget item:", id);
			await api.delete(`/budget/${id}`);
			console.log("✅ Budget item deleted");

			// Remove from local state
			setBudgetItems(budgetItems.filter((item) => item.id !== id));
		} catch (error) {
			console.error("❌ Error deleting budget item:", error);
		}
	};

	const handleSetTotalBudget = (amount: number) => {
		setTotalBudget(amount);
		setShowBudgetEdit(false);
		// TODO: Save to backend user preferences
	};

	const filteredItems = budgetItems.filter(
		(item) =>
			(item.description || item.itemName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Auto-calculate total budget if not set manually
	const calculatedTotalBudget = totalBudget > 0 ? totalBudget : budgetItems.reduce((sum, item) => sum + (item.budgetedAmount || 0), 0);

	const budgetStats = {
		totalBudgeted: budgetItems.reduce((sum, item) => sum + (item.budgetedAmount || 0), 0),
		totalSpent: budgetItems.reduce((sum, item) => sum + (item.actualAmount || 0), 0),
		remaining: calculatedTotalBudget - budgetItems.reduce((sum, item) => sum + (item.actualAmount || 0), 0),
		percentageUsed:
			calculatedTotalBudget > 0
				? Math.round((budgetItems.reduce((sum, item) => sum + (item.actualAmount || 0), 0) / calculatedTotalBudget) * 100)
				: 0,
	};

	if (isLoading || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<div className="container mx-auto px-4 py-8 pt-24">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center space-x-4">
						<Button variant="ghost" onClick={() => router.push("/dashboard")} className="p-2">
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div>
							<h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
								<Gift className="h-8 w-8 text-primary" />
								Budget Tracker
							</h1>
							<p className="text-muted-foreground mt-2">
								{currentEvent
									? `Track your ${
											currentEvent.eventType === "birthday" ? "birthday" : "event"
									  } expenses and stay within budget`
									: "Track your event expenses and stay within budget"}
							</p>
						</div>
					</div>
					<Button onClick={() => setShowAddForm(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Expense
					</Button>
				</div>

				{/* Budget Overview */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2">
										<p className="text-2xl font-bold text-foreground">
											₦{calculatedTotalBudget.toLocaleString()}
										</p>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setShowBudgetEdit(true)}
											className="h-6 w-6 p-0">
											<Edit className="h-3 w-3" />
										</Button>
									</div>
									<p className="text-sm text-muted-foreground">
										{totalBudget > 0 ? "Total Budget (Custom)" : "Total Budget (Auto)"}
									</p>
								</div>
								<Wallet className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-red-600">
										₦{budgetStats.totalSpent.toLocaleString()}
									</p>
									<p className="text-sm text-muted-foreground">Total Spent</p>
								</div>
								<TrendingDown className="h-8 w-8 text-red-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-green-600">
										₦{budgetStats.remaining.toLocaleString()}
									</p>
									<p className="text-sm text-muted-foreground">Remaining</p>
								</div>
								<TrendingUp className="h-8 w-8 text-green-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold text-purple-600">
										{budgetStats.percentageUsed}%
									</p>
									<p className="text-sm text-muted-foreground">Budget Used</p>
								</div>
								<Calculator className="h-8 w-8 text-purple-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Budget Progress */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Budget Progress</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>
									₦{budgetStats.totalSpent.toLocaleString()} spent of ₦
									{calculatedTotalBudget.toLocaleString()}
								</span>
								<span>{budgetStats.percentageUsed}% used</span>
							</div>
							<Progress
								value={budgetStats.percentageUsed}
								className="h-3"
								color={
									budgetStats.percentageUsed > 90
										? "red"
										: budgetStats.percentageUsed > 75
										? "yellow"
										: "green"
								}
							/>
							{budgetStats.percentageUsed > 90 && (
								<div className="flex items-center text-red-600 text-sm mt-2">
									<AlertTriangle className="h-4 w-4 mr-2" />
									Warning: You're close to exceeding your budget!
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Search */}
				<Card className="mb-6">
					<CardContent className="p-6">
						<div className="relative">
							<Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search expenses..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Add Item Form */}
				{showAddForm && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Add New Budget Item</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleAddItem} className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-2">Category *</label>
										<select
											required
											value={newItem.category}
											onChange={(e) =>
												setNewItem({ ...newItem, category: e.target.value })
											}
											className="w-full px-3 py-2 border border-input rounded-md bg-background">
											<option value="">Select Category</option>
											{budgetCategories.map((cat) => (
												<option key={cat} value={cat}>
													{cat}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">
											Description *
										</label>
										<Input
											required
											value={newItem.itemName}
											onChange={(e) =>
												setNewItem({ ...newItem, itemName: e.target.value })
											}
											placeholder="Venue rental"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">
											Estimated Cost (₦) *
										</label>
										<Input
											type="number"
											required
											value={newItem.estimatedCost || ""}
											onChange={(e) =>
												setNewItem({
													...newItem,
													estimatedCost: Number(e.target.value),
												})
											}
											placeholder="15000"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">
											Actual Cost (₦)
										</label>
										<Input
											type="number"
											value={newItem.actualCost || ""}
											onChange={(e) =>
												setNewItem({
													...newItem,
													actualCost: Number(e.target.value),
												})
											}
											placeholder="14500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-2">Due Date</label>
										<Input
											type="date"
											value={newItem.dueDate}
											onChange={(e) =>
												setNewItem({ ...newItem, dueDate: e.target.value })
											}
										/>
									</div>
									<div className="md:col-span-2">
										<label className="block text-sm font-medium mb-2">Notes</label>
										<Input
											value={newItem.notes}
											onChange={(e) =>
												setNewItem({ ...newItem, notes: e.target.value })
											}
											placeholder="Additional notes..."
										/>
									</div>
								</div>
								<div className="flex gap-2">
									<Button type="submit">Add Item</Button>
									<Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
										Cancel
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				)}

				{/* Budget Edit Form */}
				{showBudgetEdit && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Set Total Budget</CardTitle>
							<CardDescription>
								{currentEvent
									? `Set your overall ${
											currentEvent.eventType === "birthday" ? "birthday" : "event"
									  } budget to track spending progress`
									: "Set your overall event budget to track spending progress"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const formData = new FormData(e.target as HTMLFormElement);
									const amount = Number(formData.get("budgetAmount"));
									handleSetTotalBudget(amount);
								}}
								className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Total {currentEvent?.eventType === "birthday" ? "Birthday" : "Event"}{" "}
										Budget (₦) *
									</label>
									<Input
										name="budgetAmount"
										type="number"
										required
										min="0"
										step="1000"
										defaultValue={totalBudget || calculatedTotalBudget}
										placeholder="50000"
										className="text-lg"
									/>
									<p className="text-xs text-muted-foreground mt-1">
										Current auto-calculated budget: ₦
										{budgetStats.totalBudgeted.toLocaleString()}
									</p>
								</div>
								<div className="flex gap-2">
									<Button type="submit">Set Budget</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => setShowBudgetEdit(false)}>
										Cancel
									</Button>
									{totalBudget > 0 && (
										<Button
											type="button"
											variant="ghost"
											onClick={() => handleSetTotalBudget(0)}
											className="text-muted-foreground">
											Use Auto Budget
										</Button>
									)}
								</div>
							</form>
						</CardContent>
					</Card>
				)}

				{/* Budget Items List */}
				<Card>
					<CardHeader>
						<CardTitle>Budget Items ({filteredItems.length})</CardTitle>
						<CardDescription>
							{currentEvent
								? `Track all your ${
										currentEvent.eventType === "birthday" ? "birthday" : "event"
								  } expenses and payments`
								: "Track all your event expenses and payments"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{filteredItems.length === 0 ? (
							<div className="text-center py-12">
								<Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-semibold mb-2">No budget items found</h3>
								<p className="text-muted-foreground mb-4">
									{budgetItems.length === 0
										? `Start tracking your ${
												currentEvent?.eventType === "birthday"
													? "birthday"
													: "event"
										  } expenses`
										: "Try adjusting your search"}
								</p>
								{budgetItems.length === 0 && (
									<Button onClick={() => setShowAddForm(true)}>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Budget Item
									</Button>
								)}
							</div>
						) : (
							<div className="space-y-4">
								{filteredItems.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between p-4 border rounded-lg">
										<div className="flex-1">
											<div className="flex items-center space-x-4">
												<div className="w-2 h-12 rounded-full bg-primary/20"></div>
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-1">
														<h4 className="font-semibold">
															{item.description}
														</h4>
														<Badge variant="outline">
															{item.category}
														</Badge>
														<Badge
															variant={
																item.status === "paid"
																	? "default"
																	: item.status ===
																	  "overdue"
																	? "destructive"
																	: "secondary"
															}>
															{item.status}
														</Badge>
													</div>
													<div className="flex items-center space-x-6 text-sm text-muted-foreground">
														<span>
															Budgeted:{" "}
															<span className="font-semibold">
																₦
																{(
																	item.budgetedAmount ||
																	0
																).toLocaleString()}
															</span>
														</span>
														<span>
															Actual:{" "}
															<span
																className={`font-semibold ${
																	(item.actualAmount ||
																		0) >
																	(item.budgetedAmount ||
																		0)
																		? "text-red-600"
																		: "text-green-600"
																}`}>
																₦
																{(
																	item.actualAmount ||
																	0
																).toLocaleString()}
															</span>
														</span>
														{item.dueDate && (
															<span>
																Due:{" "}
																{new Date(
																	item.dueDate
																).toLocaleDateString()}
															</span>
														)}
													</div>
													{item.notes && (
														<p className="text-xs text-muted-foreground mt-1">
															{item.notes}
														</p>
													)}
												</div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<div className="text-right mr-4">
												<div
													className={`text-sm font-semibold ${
														(item.actualAmount || 0) >
														(item.budgetedAmount || 0)
															? "text-red-600"
															: (item.actualAmount || 0) ===
															  0
															? "text-muted-foreground"
															: "text-green-600"
													}`}>
													{(item.actualAmount || 0) >
													(item.budgetedAmount || 0)
														? `+₦${(
																(item.actualAmount ||
																	0) -
																(item.budgetedAmount ||
																	0)
														  ).toLocaleString()}`
														: (item.actualAmount || 0) === 0
														? "Not paid"
														: `₦${(
																(item.budgetedAmount ||
																	0) -
																(item.actualAmount ||
																	0)
														  ).toLocaleString()} saved`}
												</div>
												<div className="text-xs text-muted-foreground">
													{(item.actualAmount || 0) > 0 &&
														(item.budgetedAmount || 0) > 0 &&
														`${Math.round(
															((item.actualAmount || 0) /
																(item.budgetedAmount ||
																	0)) *
																100
														)}% of budget`}
												</div>
											</div>
											<Button variant="ghost" size="sm">
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDeleteItem(item.id)}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
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
