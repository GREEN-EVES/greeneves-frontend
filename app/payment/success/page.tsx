'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { AxiosError } from 'axios';
import { useUIStore } from '@/stores/ui';
import { useTemplateStore } from '@/stores/template';
import { designApi } from '@/lib/design-api';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams?.get('reference');
  const templateId = searchParams?.get('template');
  const showToast = useUIStore((state) => state.showToast);
  const { fetchUserSubscriptions } = useTemplateStore();

  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    } else {
      setVerificationStatus('failed');
    }
  }, [reference]);

  const verifyPayment = async (paymentReference: string) => {
    try {
      console.log('🔄 Verifying payment with reference:', paymentReference);

      const result = await designApi.verifyPayment(paymentReference);

      console.log('✅ Payment verification result:', result);

      if (result.status === 'success') {
        setVerificationStatus('success');

        // Refresh user subscriptions
        console.log('📦 Refreshing user subscriptions...');
        await fetchUserSubscriptions();

        showToast('Payment successful! Your template subscription is now active.', 'success');

        // Redirect to event setup after 3 seconds
        setTimeout(() => {
          if (templateId) {
            router.push(`/event-setup?template=${templateId}`);
          } else {
            router.push('/designs');
          }
        }, 3000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: unknown) {
      console.error('❌ Payment verification error:', error);
      setVerificationStatus('failed');
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed. Please contact support.';
      showToast(errorMessage, 'error');
    }
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Verifying Payment</h3>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Verification Failed</h3>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please contact support if money was deducted.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/dashboard')} className="flex-1">
                Go to Dashboard
              </Button>
              <Button onClick={() => router.push('/designs')} className="flex-1">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your template subscription is now active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <p className="font-medium text-green-800 mb-2">
              ✨ Subscription Activated
            </p>
            <p className="text-sm text-green-700">
              You can now use this template to create your event website
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <p className="text-sm text-blue-800">
              Redirecting you to website builder in 3 seconds...
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => {
                if (templateId) {
                  router.push(`/event-setup?template=${templateId}`);
                } else {
                  router.push('/designs');
                }
              }}
            >
              Start Building Now
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Loading...</h3>
            <p className="text-gray-600">Please wait...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}