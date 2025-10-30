'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Eye, Check } from 'lucide-react';
import { useTemplateStore } from '@/stores/template';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { useEventStore } from '@/stores/event';

const DesignsPage = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { events, fetchEvents } = useEventStore();
  const {
    templates,
    categories,
    subscriptions,
    isLoading,
    filters,
    pagination,
    fetchTemplates,
    fetchCategories,
    fetchUserSubscriptions,
    setFilters,
    hasUserPurchasedTemplate,
  } = useTemplateStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<'wedding' | 'birthday' | 'all'>('all');
  const [selectedSortBy, setSelectedSortBy] = useState('popular');
  const [selectedPurchaseFilter, setSelectedPurchaseFilter] = useState<'all' | 'purchased' | 'free' | 'premium'>('all');

  useEffect(() => {
    fetchTemplates();
    fetchCategories();

    // Only fetch subscriptions if user is authenticated
    if (isAuthenticated) {
      console.log('✅ User is authenticated, fetching subscriptions and events...');
      fetchUserSubscriptions();
      fetchEvents();
    } else {
      console.log('⚠️ User is not authenticated, skipping subscription and event fetch');
    }
  }, [isAuthenticated]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilters({ search: value });
  };

  const handleEventTypeFilter = (eventType: 'wedding' | 'birthday' | 'all') => {
    setSelectedEventType(eventType);
    setFilters({ eventType: eventType === 'all' ? undefined : eventType, page: 1 });
  };

  const handleSortChange = (sortBy: string) => {
    setSelectedSortBy(sortBy);
    setFilters({ sortBy: sortBy as any });
  };

  const handlePurchase = async (template: any) => {
    // Check if user is authenticated first
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      router.push(`/login?redirect=/templates`);
      return;
    }

    const userHasEvent = events.length > 0;

    if (userHasEvent) {
        router.push(`/website-builder?template=${template.id}&edit=true`);
        return;
    }

    if (hasUserPurchasedTemplate(template.id)) {
      router.push(`/website-builder?template=${template.id}`);
      return;
    }

    if (!template.isPremium) {
      router.push(`/website-builder?template=${template.id}`);
      return;
    }

    // Redirect to purchase page for premium templates
    router.push(`/templates/${template.id}/purchase`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  // Filter templates based on purchase status
  const filteredTemplates = templates.filter((template) => {
    if (selectedPurchaseFilter === 'all') return true;
    if (selectedPurchaseFilter === 'purchased') return hasUserPurchasedTemplate(template.id);
    if (selectedPurchaseFilter === 'free') return !template.isPremium;
    if (selectedPurchaseFilter === 'premium') return template.isPremium && !hasUserPurchasedTemplate(template.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Beautiful Event Website Templates
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Choose from our collection of stunning templates for weddings, birthdays, and special events.
                Customize with your details and share with guests.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Templates */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Filter Bar */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Event Type Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedEventType === 'all' ? 'default' : 'outline'}
                  onClick={() => handleEventTypeFilter('all')}
                >
                  All Templates
                </Button>
                <Button
                  variant={selectedEventType === 'wedding' ? 'default' : 'outline'}
                  onClick={() => handleEventTypeFilter('wedding')}
                >
                  Weddings
                </Button>
                <Button
                  variant={selectedEventType === 'birthday' ? 'default' : 'outline'}
                  onClick={() => handleEventTypeFilter('birthday')}
                >
                  Birthdays
                </Button>
              </div>

              {/* Purchase Status Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedPurchaseFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedPurchaseFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={selectedPurchaseFilter === 'purchased' ? 'default' : 'outline'}
                  onClick={() => setSelectedPurchaseFilter('purchased')}
                  size="sm"
                >
                  My Purchased
                </Button>
                <Button
                  variant={selectedPurchaseFilter === 'free' ? 'default' : 'outline'}
                  onClick={() => setSelectedPurchaseFilter('free')}
                  size="sm"
                >
                  Free
                </Button>
                <Button
                  variant={selectedPurchaseFilter === 'premium' ? 'default' : 'outline'}
                  onClick={() => setSelectedPurchaseFilter('premium')}
                  size="sm"
                >
                  Premium (Not Purchased)
                </Button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                  value={selectedSortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border rounded-md bg-background"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            {!isLoading && (
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredTemplates.length} of {templates.length} template{templates.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* Templates Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-64 bg-muted" />
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No templates found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => {
                  const isPurchased = hasUserPurchasedTemplate(template.id);

                  return (
                    <Card key={template.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                      {/* Template Preview Image */}
                      <div className="relative h-64 overflow-hidden bg-muted">
                        <img
                          src={template.previewImage}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                          <div className="flex gap-2">
                            {template.isPremium && (
                              <Badge className="bg-yellow-500 text-white">
                                Premium
                              </Badge>
                            )}
                            {isPurchased && (
                              <Badge className="bg-green-500 text-white">
                                <Check className="w-3 h-3 mr-1" />
                                Purchased
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Preview Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="secondary"
                            onClick={() => router.push(`/templates/${template.slug}/preview`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>

                      {/* Template Info */}
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{template.name}</CardTitle>
                          {template.category && (
                            <Badge variant="outline" className="ml-2">
                              {template.category.name}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">
                          {template.description || 'A beautiful template for your special event'}
                        </CardDescription>
                      </CardHeader>

                      {/* Color Schemes Preview */}
                      {template.colorSchemes && template.colorSchemes.length > 0 && (
                        <CardContent>
                          <div className="flex gap-2 items-center">
                            <span className="text-sm text-muted-foreground">Colors:</span>
                            <div className="flex gap-1">
                              {template.colorSchemes[0] && (
                                <>
                                  <div
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: template.colorSchemes[0].primary }}
                                    title={template.colorSchemes[0].name}
                                  />
                                  <div
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: template.colorSchemes[0].secondary }}
                                  />
                                  <div
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: template.colorSchemes[0].accent }}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      )}

                      {/* Footer with Price and Action */}
                      <CardFooter className="flex justify-between items-center pt-4 border-t">
                        <div className="flex flex-col">
                          {template.isPremium ? (
                            <>
                              <span className="text-2xl font-bold">
                                {formatPrice(template.price || 0)}
                              </span>
                              <span className="text-xs text-muted-foreground">One-time purchase</span>
                            </>
                          ) : (
                            <span className="text-lg font-semibold text-green-600">Free</span>
                          )}
                        </div>

                        <Button
                          onClick={() => handlePurchase(template)}
                          className="ml-auto"
                          variant={isPurchased ? 'outline' : 'default'}
                        >
                          {isPurchased ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Use Template
                            </>
                          ) : template.isPremium ? (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Purchase
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Use Free
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => setFilters({ page: pagination.page - 1 })}
                >
                  Previous
                </Button>
                <div className="flex items-center px-4">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setFilters({ page: pagination.page + 1 })}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DesignsPage;