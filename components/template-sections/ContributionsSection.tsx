'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, Heart, CreditCard } from 'lucide-react';

export interface ContributionsSectionProps {
  event: any;
  config?: {
    showPredefinedAmounts?: boolean;
    predefinedAmounts?: number[];
    showGoal?: boolean;
    contributionGoal?: number;
    showBankDetails?: boolean;
  };
}

export const ContributionsSection: React.FC<ContributionsSectionProps> = ({ event, config = {} }) => {
  const { colors, fonts } = useTheme();
  const {
    showPredefinedAmounts = true,
    predefinedAmounts = [5000, 10000, 20000, 50000],
    showGoal = false,
    contributionGoal = 0,
    showBankDetails = true,
  } = config;

  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [contributorName, setContributorName] = useState('');
  const [message, setMessage] = useState('');

  // Check if contributions are enabled (from event.details or event.contributionsEnabled)
  const contributionsEnabled = event.contributionsEnabled || event.details?.contributionsEnabled || false;

  if (!contributionsEnabled) {
    return null; // Don't render if contributions not enabled
  }

  const handleContribute = async (amount: number) => {
    // This would initiate payment via Paystack
    console.log('Initiating contribution:', {
      amount,
      contributorName,
      message,
      userId: event.userId,
      eventId: event.id,
    });

    // TODO: Implement Paystack payment initialization
    alert(`Contribution feature coming soon! Amount: ₦${amount.toLocaleString()}`);
  };

  // Get bank details from event
  const bankDetails = event.bankAccountDetails || event.details?.bankAccountDetails;

  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Gift className="h-12 w-12 mx-auto mb-4" style={{ color: colors.accent }} />
          <h2
            className="text-4xl md:text-5xl font-light mb-4"
            style={{ fontFamily: fonts.heading, color: colors.primary }}
          >
            Gift Registry
          </h2>
          <p className="text-lg" style={{ fontFamily: fonts.body, color: colors.text ? `${colors.text}99` : '#666' }}>
            Your presence is the greatest gift, but if you wish to contribute, we'd be grateful
          </p>
        </div>

        {/* Contribution Goal Progress */}
        {showGoal && contributionGoal > 0 && (
          <Card className="mb-8 p-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ fontFamily: fonts.body }}>
                  Contribution Goal
                </span>
                <span className="text-sm" style={{ fontFamily: fonts.body, color: colors.text ? `${colors.text}99` : '#666' }}>
                  ₦0 / ₦{contributionGoal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{ width: '0%', backgroundColor: colors.primary }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Predefined Amounts */}
        {showPredefinedAmounts && (
          <div className="mb-8">
            <h3
              className="text-xl font-medium mb-4 text-center"
              style={{ fontFamily: fonts.heading, color: colors.text || '#333' }}
            >
              Quick Amounts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedAmount(amount)}
                  className="h-20 text-lg"
                  style={
                    selectedAmount === amount
                      ? {
                          backgroundColor: colors.primary,
                          color: '#fff',
                          fontFamily: fonts.body,
                        }
                      : {
                          borderColor: colors.primary,
                          color: colors.primary,
                          fontFamily: fonts.body,
                        }
                  }
                >
                  ₦{amount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Amount */}
        <Card className="mb-8 p-6">
          <CardContent className="p-0 space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
              >
                Custom Amount (₦)
              </label>
              <Input
                type="number"
                min="1000"
                step="1000"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Enter custom amount"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
              >
                Your Name (Optional)
              </label>
              <Input
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="Anonymous"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
              >
                Message
              </label>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Best wishes..."
              />
            </div>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={() => handleContribute(selectedAmount || parseInt(customAmount) || 0)}
              disabled={!selectedAmount && !customAmount}
              style={{
                backgroundColor: colors.primary,
                color: '#fff',
                fontFamily: fonts.body,
              }}
            >
              <CreditCard className="h-5 w-5" />
              Contribute{' '}
              {selectedAmount || customAmount
                ? `₦${(selectedAmount || parseInt(customAmount)).toLocaleString()}`
                : ''}
            </Button>
          </CardContent>
        </Card>

        {/* Bank Transfer Details */}
        {showBankDetails && bankDetails && (
          <Card className="p-6" style={{ backgroundColor: `${colors.secondary}20` }}>
            <CardContent className="p-0">
              <h3
                className="text-xl font-medium mb-4 text-center flex items-center justify-center gap-2"
                style={{ fontFamily: fonts.heading, color: colors.primary }}
              >
                <Heart className="h-5 w-5" style={{ color: colors.accent }} />
                Or Transfer Directly
              </h3>
              <div className="space-y-2 text-center">
                <div>
                  <span className="text-sm" style={{ fontFamily: fonts.body, color: colors.text ? `${colors.text}99` : '#666' }}>
                    Bank Name:
                  </span>
                  <p className="text-lg font-medium" style={{ fontFamily: fonts.body, color: colors.text || '#333' }}>
                    {bankDetails.bankName}
                  </p>
                </div>
                <div>
                  <span className="text-sm" style={{ fontFamily: fonts.body, color: colors.text ? `${colors.text}99` : '#666' }}>
                    Account Number:
                  </span>
                  <p className="text-lg font-medium font-mono" style={{ fontFamily: fonts.body, color: colors.text || '#333' }}>
                    {bankDetails.accountNumber}
                  </p>
                </div>
                <div>
                  <span className="text-sm" style={{ fontFamily: fonts.body, color: colors.text ? `${colors.text}99` : '#666' }}>
                    Account Name:
                  </span>
                  <p className="text-lg font-medium" style={{ fontFamily: fonts.body, color: colors.text || '#333' }}>
                    {bankDetails.accountName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};
