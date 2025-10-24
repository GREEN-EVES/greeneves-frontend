"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Heart, CreditCard } from "lucide-react";

interface ContributionsSectionProps {
  config: {
    showPredefinedAmounts?: boolean;
    predefinedAmounts?: number[];
    showGoal?: boolean;
    contributionGoal?: number;
    showBankDetails?: boolean;
  };
  eventData: {
    eventId: string;
    userId: string;
    eventType: "wedding" | "birthday";
    contributionsEnabled: boolean;
    bankAccountDetails?: {
      bankName: string;
      accountNumber: string;
      accountName: string;
    };
  };
}

export default function ContributionsSection({
  config,
  eventData,
}: ContributionsSectionProps) {
  const {
    showPredefinedAmounts = true,
    predefinedAmounts = [5000, 10000, 20000, 50000],
    showGoal = false,
    contributionGoal = 0,
    showBankDetails = true,
  } = config;

  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [contributorName, setContributorName] = useState("");
  const [message, setMessage] = useState("");

  if (!eventData.contributionsEnabled) {
    return null; // Don't render if contributions not enabled
  }

  const handleContribute = async (amount: number) => {
    // This would initiate payment via Paystack
    console.log("Initiating contribution:", {
      amount,
      contributorName,
      message,
      userId: eventData.userId,
    });

    // TODO: Implement Paystack payment initialization
    alert(`Contribution feature coming soon! Amount: ₦${amount.toLocaleString()}`);
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-foreground">
            Gift Registry
          </h2>
          <p className="text-lg text-muted-foreground">
            Your presence is the greatest gift, but if you wish to contribute, we'd be grateful
          </p>
        </div>

        {/* Contribution Goal Progress */}
        {showGoal && contributionGoal > 0 && (
          <Card className="mb-8 p-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Contribution Goal</span>
                <span className="text-sm text-muted-foreground">
                  ₦0 / ₦{contributionGoal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: "0%" }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Predefined Amounts */}
        {showPredefinedAmounts && (
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-center">Quick Amounts</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedAmount(amount)}
                  className="h-20 text-lg"
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
              <label className="block text-sm font-medium text-foreground mb-2">
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Name (Optional)
              </label>
              <Input
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="Anonymous"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
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
              onClick={() =>
                handleContribute(selectedAmount || parseInt(customAmount) || 0)
              }
              disabled={!selectedAmount && !customAmount}
            >
              <CreditCard className="h-5 w-5" />
              Contribute {selectedAmount || customAmount ? `₦${(selectedAmount || parseInt(customAmount)).toLocaleString()}` : ""}
            </Button>
          </CardContent>
        </Card>

        {/* Bank Transfer Details */}
        {showBankDetails && eventData.bankAccountDetails && (
          <Card className="p-6 bg-muted/30">
            <CardContent className="p-0">
              <h3 className="text-xl font-medium mb-4 text-center flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Or Transfer Directly
              </h3>
              <div className="space-y-2 text-center">
                <div>
                  <span className="text-sm text-muted-foreground">Bank Name:</span>
                  <p className="text-lg font-medium">
                    {eventData.bankAccountDetails.bankName}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Account Number:</span>
                  <p className="text-lg font-medium font-mono">
                    {eventData.bankAccountDetails.accountNumber}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Account Name:</span>
                  <p className="text-lg font-medium">
                    {eventData.bankAccountDetails.accountName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
