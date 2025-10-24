'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Eye, Crown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTemplateStore } from '@/stores/template';
import { useAuthStore } from '@/stores/auth';
import DesignPreviewModal from './DesignPreviewModal';
import type { DesignTemplate } from '@/types';
import api from '@/lib/api';

const getColorHex = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    cream: '#F5F5DC',
    gold: '#FFD700',
    purple: '#8B5CF6',
    green: '#10B981',
    silver: '#C0C0C0',
    white: '#FFFFFF',
    beige: '#F5F5DC',
    brown: '#8B4513',
    blue: '#3B82F6',
    pink: '#EC4899',
    black: '#000000',
  };
  
  return colorMap[color.toLowerCase()] || '#6B7280';
};

const DesignGallery: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { templates, isLoading, fetchTemplates, toggleFavorite } = useTemplateStore();
  const [previewTemplate, setPreviewTemplate] = useState<DesignTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const fetchUserSubscription = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.get('/payments/subscriptions');
      setUserSubscription(response.data);
    } catch (error) {
      console.error('Failed to fetch user subscription:', error);
      setUserSubscription(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserSubscription();
    }
  }, [isAuthenticated, fetchUserSubscription]);

  const hasActivePremium = () => {
    return userSubscription && 
      userSubscription.status === 'active' && 
      (userSubscription.plan === 'premium' || userSubscription.plan === 'enterprise') &&
      (!userSubscription.expiresAt || new Date(userSubscription.expiresAt) > new Date());
  };

  const handlePreview = (template: DesignTemplate) => {
    // Navigate directly to preview page instead of opening modal
    if (template.slug) {
      router.push(`/templates/${template.slug}/preview`);
    }
  };

  const handleToggleFavorite = async (template: DesignTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    await toggleFavorite(template.id);
  };

  const handleUseDesign = async (template: DesignTemplate) => {
    if (!isAuthenticated) {
      // Store template ID in localStorage for after registration
      localStorage.setItem('selectedTemplateId', template.id);
      router.push(`/register?template=${template.id}&redirect=website-builder`);
      return;
    }
    
    // User is authenticated, go directly to website builder
    router.push(`/website-builder?template=${template.id}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-card rounded-xl shadow-sm border border-border animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="bg-gray-200 h-3 rounded w-1/2" />
                  <div className="bg-gray-200 h-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="group bg-card rounded-xl shadow-sm border border-border hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {template.isPremium && (
                    <div className={`absolute top-2 right-2 p-1 rounded-full ${
                      hasActivePremium() 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {hasActivePremium() ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Crown className="h-3 w-3" />
                      )}
                    </div>
                  )}
                  
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="bg-white/90 text-foreground hover:bg-white"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-white hover:bg-white/20"
                      onClick={(e) => handleToggleFavorite(template, e)}
                    >
                      <Heart className={`h-4 w-4 ${template.isFavorited ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-lg text-foreground">{template.name}</h3>
                      {template.isPremium && template.price && (
                        <div className="flex items-center space-x-2">
                          {hasActivePremium() && (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              Purchased
                            </span>
                          )}
                          <span className={`text-sm font-semibold ${
                            hasActivePremium() ? 'line-through text-gray-400' : 'text-primary'
                          }`}>₦{template.price}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {template.category?.name || 'General'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {template.colorSchemes && template.colorSchemes.length > 0 && (
                        <>
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: template.colorSchemes[0].primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: template.colorSchemes[0].secondary }}
                          />
                        </>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {template.colorSchemes?.[0]?.name || 'Custom'}
                    </span>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUseDesign(template)}
                  >
                    {template.isPremium && hasActivePremium() 
                      ? "Use Premium Design" 
                      : "Use This Design"
                    }
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Load more button - could implement pagination later */}
          {templates.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-12" disabled>
                Showing all designs
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      <DesignPreviewModal
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewTemplate(null);
        }}
      />
    </>
  );
};

export default DesignGallery;