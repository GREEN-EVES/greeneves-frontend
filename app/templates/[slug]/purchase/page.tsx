'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Check, ArrowLeft, CreditCard, Shield, Zap } from 'lucide-react';
import { useTemplateStore } from '@/stores/template';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import api from '@/lib/api';

export default function TemplatePurchasePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params?.slug as string;

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const { currentTemplate, fetchTemplate, hasUserPurchasedTemplate } = useTemplateStore();
  const showToast = useUIStore((state) => state.showToast);

  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    // Wait for auth initialization
    if (!isInitialized || isLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=/templates/${templateId}/purchase`);
      return;
    }

    // Fetch template details
    if (templateId) {
      fetchTemplate(templateId);
    }
  }, [isAuthenticated, isLoading, isInitialized, templateId, fetchTemplate, router]);

  // Redirect if user already purchased this template
  useEffect(() => {
    if (currentTemplate && hasUserPurchasedTemplate(currentTemplate.id)) {
      showToast('You already own this template!', 'success');
      router.push(`/website-builder?template=${currentTemplate.id}`);
    }
  }, [currentTemplate, hasUserPurchasedTemplate, router, showToast]);

  const handlePurchase = async () => {
    if (!currentTemplate || !user) return;

    setProcessingPayment(true);
    try {
      // Calculate price based on selected plan
      const basePrice = currentTemplate.price || 5000;
      const amount = selectedPlan === 'yearly' ? basePrice * 10 : basePrice; // 10 months free on yearly

      // Initialize Paystack payment
      const response = await api.post('/payments/initialize', {
        email: user.email,
        amount,
        templateId: currentTemplate.id,
        plan: selectedPlan,
      });

      const paymentData = response.data;

      if (paymentData.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = paymentData.authorizationUrl;
      } else {
        throw new Error('No authorization URL returned');
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to initialize payment';
      showToast(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage, 'error');
      setProcessingPayment(false);
    }
  };

  const calculatePrice = (plan: 'monthly' | 'yearly') => {
    const basePrice = currentTemplate?.price || 5000;
    return plan === 'yearly' ? basePrice * 10 : basePrice; // Yearly = 10 months price (2 months free)
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  // Show loading spinner during initialization
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Show loading while fetching template
  if (!currentTemplate) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/templates')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Template Preview */}
          <div>
            <Card>
              <CardHeader>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={currentTemplate.previewImage}
                    alt={currentTemplate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="mt-4">{currentTemplate.name}</CardTitle>
                <CardDescription>{currentTemplate.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Event type badges */}
                  <div className="flex gap-2">
                    {currentTemplate.isWeddingSuitable && (
                      <Badge variant="secondary">Wedding</Badge>
                    )}
                    {currentTemplate.isBirthdaySuitable && (
                      <Badge variant="secondary">Birthday</Badge>
                    )}
                    {currentTemplate.isPremium && (
                      <Badge className="bg-yellow-500">Premium</Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-semibold mb-2">Included Features:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Customizable color schemes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Mobile-responsive design</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Photo gallery support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>RSVP management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Guest list tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>Event countdown</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
                <CardDescription>
                  Select a subscription plan that works for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Selection */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Monthly Plan */}
                  <div
                    onClick={() => setSelectedPlan('monthly')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === 'monthly'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">Monthly</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(calculatePrice('monthly'))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">per month</p>
                    </div>
                  </div>

                  {/* Yearly Plan */}
                  <div
                    onClick={() => setSelectedPlan('yearly')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                      selectedPlan === 'yearly'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <Badge className="absolute -top-2 -right-2 bg-green-500">2 months free</Badge>
                    <div className="text-center">
                      <p className="text-sm font-medium mb-2">Yearly</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(calculatePrice('yearly'))}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatPrice(calculatePrice('yearly') / 12)}/month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Plan Summary */}
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {selectedPlan === 'yearly' ? 'Annual' : 'Monthly'} Subscription
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPlan === 'yearly' ? 'Renews yearly' : 'Renews monthly'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(calculatePrice(selectedPlan))}
                      </p>
                      {selectedPlan === 'yearly' && (
                        <p className="text-xs text-green-600 font-medium">Save 17%</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">
                        Powered by Paystack - Nigeria's trusted payment platform
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Instant Access</p>
                      <p className="text-sm text-muted-foreground">
                        Start building your website immediately after payment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Cancel Anytime</p>
                      <p className="text-sm text-muted-foreground">
                        No commitment - cancel your subscription whenever you want
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By purchasing, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
