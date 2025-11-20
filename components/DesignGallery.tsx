'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Eye, Crown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTemplateStore } from '@/stores/template';
import { useAuthStore } from '@/stores/auth';
import type { DesignTemplate } from '@/types';
import api from '@/lib/api';

const DesignGallery: React.FC = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { templates, isLoading, fetchTemplates, toggleFavorite } = useTemplateStore();
  const [userSubscriptions, setUserSubscriptions] = useState<Array<{ templateId: string }>>([]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const fetchUserSubscriptions = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await api.get('/payments/subscriptions');
      console.log('📦 User subscriptions:', response.data);
      // Response format: { subscriptions: [...], totalPurchased: number }
      setUserSubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error('Failed to fetch user subscriptions:', error);
      setUserSubscriptions([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserSubscriptions();
    }
  }, [isAuthenticated, fetchUserSubscriptions]);

  // Check if user has access to a specific template
  const hasTemplateAccess = (templateId: string, isPremium: boolean) => {
    // Free templates are always accessible
    if (!isPremium) return true;

    // Premium templates require active subscription
    return userSubscriptions.some(sub => sub.templateId === templateId);
  };

  const handlePreview = (template: DesignTemplate) => {
    // Navigate directly to preview page under /designs
    if (template.slug) {
      router.push(`/designs/${template.slug}`);
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
      router.push(`/register?template=${template.id}&redirect=event-setup`);
      return;
    }

    // Check if user has access to this template
    const hasAccess = hasTemplateAccess(template.id, template.isPremium);

    if (template.isPremium && !hasAccess) {
      // Premium template not purchased - go to checkout page to purchase
      router.push(`/designs/${template.slug}/checkout`);
      return;
    }

    // User has access (free template or purchased premium), go to event setup
    router.push(`/event-setup?template=${template.id}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border-2 border-gray-200 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-xl" />
                <div className="p-5 space-y-3">
                  <div className="bg-gray-200 h-5 rounded w-3/4" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                  <div className="bg-gray-200 h-10 rounded" />
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
              <div key={template.id} className="group bg-white rounded-xl shadow-md border-2 border-gray-200 hover:shadow-xl transition-all duration-300" style={{ borderColor: '#e5e7eb' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(123, 137, 37, 0.3)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}>
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={template.previewImage}
                    alt={template.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge for Premium/Free status */}
                  <div className="absolute top-3 right-3">
                    {template.isPremium ? (
                      hasTemplateAccess(template.id, template.isPremium) ? (
                        <div className="bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
                          <Check className="h-3 w-3" />
                          <span>Purchased</span>
                        </div>
                      ) : (
                        <div className="bg-yellow-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-lg">
                          <Crown className="h-3 w-3" />
                          <span>Premium</span>
                        </div>
                      )
                    ) : (
                      <div className="text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg" style={{ backgroundColor: 'hsl(68 61% 34%)' }}>
                        FREE
                      </div>
                    )}
                  </div>

                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                    <Button
                      size="sm"
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold shadow-lg"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                      onClick={(e) => handleToggleFavorite(template, e)}
                    >
                      <Heart className={`h-4 w-4 ${template.isFavorited ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                      {template.isPremium && template.price ? (
                        <span
                          className="text-sm font-bold"
                          style={{
                            color: hasTemplateAccess(template.id, template.isPremium)
                              ? '#9ca3af'
                              : 'hsl(68 61% 34%)',
                            textDecoration: hasTemplateAccess(template.id, template.isPremium)
                              ? 'line-through'
                              : 'none'
                          }}
                        >
                          ₦{template.price.toLocaleString()}
                        </span>
                      ) : !template.isPremium ? (
                        <span className="text-sm font-bold" style={{ color: 'hsl(68 61% 34%)' }}>FREE</span>
                      ) : null}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.description || template.category?.name || 'Event Template'}
                    </p>
                    <p className="text-xs font-semibold text-gray-500">
                      {template.eventType === 'WEDDING' ? '💒 Wedding' : '🎂 Birthday'}
                    </p>
                  </div>

                  <Button
                    className="w-full font-semibold shadow-sm hover:shadow-md transition-all"
                    style={{
                      backgroundColor: template.isPremium && !hasTemplateAccess(template.id, template.isPremium)
                        ? 'hsl(68 61% 34%)'
                        : 'transparent',
                      color: template.isPremium && !hasTemplateAccess(template.id, template.isPremium)
                        ? 'white'
                        : 'hsl(68 61% 34%)',
                      borderWidth: '2px',
                      borderColor: 'hsl(68 61% 34%)'
                    }}
                    onMouseEnter={(e) => {
                      if (template.isPremium && !hasTemplateAccess(template.id, template.isPremium)) {
                        e.currentTarget.style.backgroundColor = 'hsl(68 61% 28%)';
                      } else {
                        e.currentTarget.style.backgroundColor = 'hsl(68 61% 34%)';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (template.isPremium && !hasTemplateAccess(template.id, template.isPremium)) {
                        e.currentTarget.style.backgroundColor = 'hsl(68 61% 34%)';
                      } else {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'hsl(68 61% 34%)';
                      }
                    }}
                    onClick={() => handleUseDesign(template)}
                  >
                    {!template.isPremium
                      ? "Use Free Design"
                      : hasTemplateAccess(template.id, template.isPremium)
                      ? "Use Purchased Design"
                      : "Purchase & Use Design"
                    }
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Load more button - could implement pagination later */}
          {templates.length > 0 && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                className="px-12 font-semibold bg-gray-100 text-gray-500 cursor-not-allowed border-2 border-gray-200"
                disabled
              >
                Showing all designs
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DesignGallery;