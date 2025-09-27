import api from './api';
import type { DesignTemplate, WeddingDesign, GetDesignTemplatesParams } from '@/types';

export const designApi = {
  // Get all design templates with optional filters
  getTemplates: async (params?: GetDesignTemplatesParams): Promise<DesignTemplate[]> => {
    const response = await api.get('/design-templates', { params });
    return response.data;
  },

  // Get a specific template by ID
  getTemplate: async (id: string): Promise<DesignTemplate> => {
    const response = await api.get(`/design-templates/${id}`);
    return response.data;
  },

  // Toggle favorite status for a template
  toggleFavorite: async (templateId: string): Promise<{ isFavorited: boolean; message: string }> => {
    const response = await api.post('/design-templates/favorite', { templateId });
    return response.data;
  },

  // Select a template for the user's wedding
  selectTemplate: async (templateId: string, name?: string, customStyles?: any): Promise<WeddingDesign> => {
    const response = await api.post('/design-templates/select', {
      templateId,
      name,
      customStyles,
    });
    return response.data;
  },

  // Get user's favorite templates
  getFavorites: async (): Promise<DesignTemplate[]> => {
    const response = await api.get('/design-templates/favorites');
    return response.data;
  },

  // Get user's selected designs
  getSelectedDesigns: async (): Promise<WeddingDesign[]> => {
    const response = await api.get('/design-templates/selected');
    return response.data;
  },
};