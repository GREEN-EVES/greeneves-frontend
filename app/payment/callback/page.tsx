"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useUIStore } from "@/stores/ui";

import { PaymentVerification } from '@/types';

function PaymentCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const showToast = useUIStore((state) => state.showToast);
	
	const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'cancelled'>('verifying');
	const [paymentData, setPaymentData] = useState<PaymentVerification | null>(null);

	useEffect(() => {
		const reference = searchParams?.get('reference');
		const trxref = searchParams?.get('trxref'); // Alternative parameter name used by Paystack

		const paymentReference = reference || trxref;

		if (!paymentReference) {
			setStatus('failed');
			return;
		}

		verifyPayment(paymentReference);
	}, [searchParams]);

	const verifyPayment = async (reference: string) => {
		try {
			const response = await api.post('/payments/verify', { reference });
			
			if (response.data.status === 'success') {
				setStatus('success');
				setPaymentData(response.data);
				showToast('Payment successful! You now have access to premium features.', 'success');
			} else {
				setStatus('failed');
			}
		} catch (error) {
			console.error('Payment verification error:', error);
			setStatus('failed');
		}
	};

	const handleContinue = () => {
		// Redirect to website builder to continue or publish
		router.push('/event-setup?payment=success');
	};

	const handleRetry = () => {
		// Go back to website builder payment step
		router.push('/event-setup');
	};

	if (status === 'verifying') {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center">Verifying Payment</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
						<p className="text-muted-foreground">
							Please wait while we verify your payment...
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (status === 'success') {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center text-green-600">Payment Successful!</CardTitle>
					</CardHeader>
					<CardContent className="text-center space-y-4">
						<CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
						<div>
							<h3 className="text-lg font-semibold mb-2">Thank you for your purchase!</h3>
							<p className="text-muted-foreground mb-4">
								Your premium template has been activated. You can now continue building your wedding website.
							</p>
							{paymentData && (
								<div className="bg-muted p-3 rounded-lg text-sm">
									<p><strong>Amount:</strong> ₦{paymentData.amount}</p>
									<p><strong>Date:</strong> {new Date(paymentData.paidAt).toLocaleString()}</p>
								</div>
							)}
						</div>
						<Button onClick={handleContinue} className="w-full">
							Continue Building Website
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center text-red-600">Payment Failed</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					<XCircle className="h-16 w-16 text-red-500 mx-auto" />
					<div>
						<h3 className="text-lg font-semibold mb-2">Payment was not successful</h3>
						<p className="text-muted-foreground mb-4">
							There was an issue processing your payment. Please try again or contact support.
						</p>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => router.push('/dashboard')} className="flex-1">
							Go to Dashboard
						</Button>
						<Button onClick={handleRetry} className="flex-1">
							Try Again
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default function PaymentCallbackPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-center">Loading...</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
						<p className="text-muted-foreground">
							Please wait while we process your payment...
						</p>
					</CardContent>
				</Card>
			</div>
		}>
			<PaymentCallbackContent />
		</Suspense>
	);
}