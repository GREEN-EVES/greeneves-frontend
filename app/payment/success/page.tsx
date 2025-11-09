'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { useUIStore } from '@/stores/ui';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams?.get('reference');
  const showToast = useUIStore((state) => state.showToast);
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    } else {
      setVerificationStatus('failed');
    }
  }, [reference]);

  const verifyPayment = async (paymentReference: string) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ reference: paymentReference }),
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationStatus('success');
        
        // Generate website URL
        const userId = localStorage.getItem('userId'); // You'd need to store this
        const url = `${window.location.origin}/wedding/${userId}`;
        setWebsiteUrl(url);
        
        showToast('Payment successful! Your website is now live.', 'success');
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      setVerificationStatus('failed');
      showToast('Payment verification failed. Please contact support.', 'error');
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
              <Button onClick={() => router.push('/template-preview')} className="flex-1">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your event website is now live and ready to share
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {websiteUrl && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-medium text-green-800 mb-2">Your Website:</p>
              <div className="flex items-center gap-2">
                <code className="bg-white px-3 py-2 rounded border text-sm flex-1 text-gray-800">
                  {websiteUrl}
                </code>
                <Button 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(websiteUrl);
                    showToast('URL copied!', 'success');
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            <Button asChild>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                View Your Website
              </a>
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