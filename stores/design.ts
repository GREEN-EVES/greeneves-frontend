import { create } from 'zustand';
import { designApi } from '@/lib/design-api';
import type { DesignTemplate, WeddingDesign, GetDesignTemplatesParams } from '@/types';

interface DesignState {
  templates: DesignTemplate[];
  favorites: DesignTemplate[];
  selectedDesigns: WeddingDesign[];
  currentTemplate: DesignTemplate | null;
  isLoading: boolean;
  error: string | null;
}

interface DesignActions {
  fetchTemplates: (params?: GetDesignTemplatesParams) => Promise<void>;
  fetchTemplate: (id: string) => Promise<void>;
  toggleFavorite: (templateId: string) => Promise<void>;
  selectTemplate: (templateId: string, name?: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  fetchSelectedDesigns: () => Promise<void>;
  clearError: () => void;
  setCurrentTemplate: (template: DesignTemplate | null) => void;
}

type DesignStore = DesignState & DesignActions;

export const useDesignStore = create<DesignStore>((set, get) => ({
  // State
  templates: [],
  favorites: [],
  selectedDesigns: [],
  currentTemplate: null,
  isLoading: false,
  error: null,

  // Actions
  fetchTemplates: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const templates = await designApi.getTemplates(params);
      set({ templates, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
        isLoading: false 
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
        isLoading: false 
      });
    }
  },

  toggleFavorite: async (templateId) => {
    try {
      const result = await designApi.toggleFavorite(templateId);
      
      // Update the template in the templates list
      set((state) => ({
        templates: state.templates.map(template =>
          template.id === templateId
            ? { ...template, isFavorited: result.isFavorited }
            : template
        ),
        currentTemplate: state.currentTemplate?.id === templateId
          ? { ...state.currentTemplate, isFavorited: result.isFavorited }
          : state.currentTemplate
      }));

      // Refresh favorites if they were loaded
      const { favorites } = get();
      if (favorites.length > 0) {
        get().fetchFavorites();
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update favorite'
      });
    }
  },

  selectTemplate: async (templateId, name) => {
    set({ isLoading: true, error: null });
    try {
      const selectedDesign = await designApi.selectTemplate(templateId, name);
      set((state) => ({
        selectedDesigns: [...state.selectedDesigns, selectedDesign],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to select template',
        isLoading: false 
      });
    }
  },

  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const favorites = await designApi.getFavorites();
      set({ favorites, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch favorites',
        isLoading: false 
      });
    }
  },

  fetchSelectedDesigns: async () => {
    set({ isLoading: true, error: null });
    try {
      const selectedDesigns = await designApi.getSelectedDesigns();
      set({ selectedDesigns, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch selected designs',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),

  setCurrentTemplate: (template) => set({ currentTemplate: template }),
}));