import api from "./api";
import type { DesignTemplate, TemplateCategory, GetDesignTemplatesParams, Subscription, Meta } from "@/types";

export const designApi = {
	// Get all templates with optional filters
	getTemplates: async (params?: GetDesignTemplatesParams): Promise<{ data: DesignTemplate[]; meta: Meta }> => {
		const response = await api.get("/templates", { params });
		return response.data;
	},

	// Get a specific template by ID
	getTemplate: async (id: string): Promise<DesignTemplate> => {
		const response = await api.get(`/templates/${id}`);
		return response.data;
	},

	// Get template by slug
	getTemplateBySlug: async (slug: string): Promise<DesignTemplate> => {
		const response = await api.get(`/templates/slug/${slug}`);
		return response.data;
	},

	// Get template categories
	getCategories: async (): Promise<TemplateCategory[]> => {
		const response = await api.get("/templates/categories");
		return response.data;
	},

	// Get user's purchased templates (subscriptions)
	getUserSubscriptions: async (): Promise<{ subscriptions: Subscription[]; totalPurchased: number }> => {
		const response = await api.get("/payments/subscriptions");
		return response.data;
	},

	// Initialize payment for template purchase
	initializePayment: async (data: {
		email: string;
		amount: number;
		templateId: string;
	}): Promise<{
		paymentId: string;
		reference: string;
		authorizationUrl: string;
		accessCode: string;
	}> => {
		const response = await api.post("/payments/initialize", data);
		return response.data;
	},

	// Verify payment
	verifyPayment: async (
		reference: string
	): Promise<{
		paymentId: string;
		subscriptionId: string;
		status: string;
		amount: number;
		paidAt: string;
	}> => {
		const response = await api.post("/payments/verify", { reference });
		return response.data;
	},
};
