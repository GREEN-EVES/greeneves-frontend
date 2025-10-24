import { create } from 'zustand';
import { designApi } from '@/lib/design-api';
import type { DesignTemplate, TemplateCategory, GetDesignTemplatesParams, Subscription } from '@/types';

interface TemplateState {
  templates: DesignTemplate[];
  categories: TemplateCategory[];
  subscriptions: Subscription[];
  selectedTemplate: DesignTemplate | null;
  currentTemplate: DesignTemplate | null;
  isLoading: boolean;
  error: string | null;
  filters: GetDesignTemplatesParams;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TemplateActions {
  fetchTemplates: (params?: GetDesignTemplatesParams) => Promise<void>;
  fetchTemplate: (id: string) => Promise<void>;
  fetchTemplateBySlug: (slug: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchUserSubscriptions: () => Promise<void>;
  setFilters: (filters: Partial<GetDesignTemplatesParams>) => void;
  setSelectedTemplate: (template: DesignTemplate | null) => void;
  clearError: () => void;
  purchaseTemplate: (templateId: string, email: string, amount: number) => Promise<string>;
  verifyPayment: (reference: string) => Promise<boolean>;
  hasUserPurchasedTemplate: (templateId: string) => boolean;
  setCurrentTemplate: (template: DesignTemplate | null) => void;
}

type TemplateStore = TemplateState & TemplateActions;

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  // State
  templates: [],
  categories: [],
  subscriptions: [],
  selectedTemplate: null,
  currentTemplate: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 12,
    sortBy: 'popular',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },

  // Actions
  fetchTemplates: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = get().filters;
      const mergedParams = { ...currentFilters, ...params };

      const response = await designApi.getTemplates(mergedParams);

      set({
        templates: response.data,
        pagination: response.meta,
        filters: mergedParams,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
        isLoading: false,
      });
    }
  },

  fetchTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const template = await designApi.getTemplate(id);
      set({ currentTemplate: template, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch template',
        isLoading: false,
      });
    }
  },

  fetchTemplateBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const template = await designApi.getTemplateBySlug(slug);
      set({ currentTemplate: template, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch template',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await designApi.getCategories();
      set({ categories });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      });
    }
  },

  fetchUserSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('🔄 Fetching user subscriptions...');
      console.log('🔑 Auth token exists:', !!localStorage.getItem('access_token'));

      const result = await designApi.getUserSubscriptions();
      console.log('📦 API Response:', result);

      const { subscriptions } = result;
      console.log('=== SUBSCRIPTIONS DEBUG ===');
      console.log('Fetched subscriptions:', subscriptions);
      console.log('Active subscriptions:', subscriptions.filter((s: Subscription) => s.status === 'active'));
      set({ subscriptions, isLoading: false });
    } catch (error: any) {
      console.error('❌ Failed to fetch subscriptions:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch subscriptions',
        isLoading: false,
        subscriptions: [], // Set empty array on error so it doesn't break
      });
    }
  },

  setFilters: (filters) => {
    set((state) => {
      const newFilters = { ...state.filters, ...filters };

      // Remove undefined values to properly clear filters
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key as keyof GetDesignTemplatesParams] === undefined) {
          delete newFilters[key as keyof GetDesignTemplatesParams];
        }
      });

      // Reset to page 1 when filters change (but not when only page is changing)
      const isOnlyPageChange = Object.keys(filters).length === 1 && 'page' in filters;
      if (!isOnlyPageChange && !filters.page) {
        newFilters.page = 1;
      }

      return { filters: newFilters };
    });
    // Automatically fetch with new filters
    get().fetchTemplates();
  },

  setSelectedTemplate: (template) => {
    set({ selectedTemplate: template });
  },

  clearError: () => set({ error: null }),

  purchaseTemplate: async (templateId, email, amount) => {
    set({ isLoading: true, error: null });
    try {
      const result = await designApi.initializePayment({
        email,
        amount,
        templateId,
      });
      set({ isLoading: false });
      return result.authorizationUrl;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize payment',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyPayment: async (reference) => {
    set({ isLoading: true, error: null });
    try {
      const result = await designApi.verifyPayment(reference);

      // Refresh subscriptions after successful payment
      if (result.status === 'success') {
        await get().fetchUserSubscriptions();
      }

      set({ isLoading: false });
      return result.status === 'success';
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to verify payment',
        isLoading: false,
      });
      return false;
    }
  },

  hasUserPurchasedTemplate: (templateId) => {
    const { subscriptions } = get();

    console.log('=== PURCHASE CHECK ===');
    console.log('Checking template ID:', templateId, '(type:', typeof templateId, ')');
    console.log('Total subscriptions:', subscriptions.length);
    console.log('All subscriptions:', subscriptions.map(s => ({
      id: s.id,
      templateId: s.templateId,
      templateIdType: typeof s.templateId,
      status: s.status,
      match: s.templateId === templateId,
      statusMatch: s.status === 'active'
    })));

    const hasPurchased = subscriptions.some(
      (sub) => sub.templateId === templateId && sub.status === 'active'
    );

    console.log('Purchase result:', hasPurchased);
    console.log('========================');
    return hasPurchased;
  },

  setCurrentTemplate: (template) => set({ currentTemplate: template }),
}));