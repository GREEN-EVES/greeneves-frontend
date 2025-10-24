'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Gift, DollarSign, Heart, ExternalLink } from 'lucide-react';

export interface GiftRegistrySectionProps {
  event: any;
  config?: {
    allowCashGifts?: boolean;
    showGoalAmount?: boolean;
    showContributors?: boolean;
    showSuggestedGifts?: boolean;
  };
}

interface SuggestedGift {
  id: string;
  name: string;
  price: string;
  url?: string;
  image?: string;
}

export const GiftRegistrySection: React.FC<GiftRegistrySectionProps> = ({
  event,
  config = {}
}) => {
  const { colors, fonts } = useTheme();
  const {
    allowCashGifts = true,
    showGoalAmount = true,
    showContributors = false,
    showSuggestedGifts = true,
  } = config;

  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');

  const suggestedAmounts = ['₦5,000', '₦10,000', '₦20,000', '₦50,000'];

  const suggestedGifts: SuggestedGift[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      price: '₦25,000',
      url: '#',
    },
    {
      id: '2',
      name: 'Smartwatch',
      price: '₦45,000',
      url: '#',
    },
    {
      id: '3',
      name: 'Coffee Maker',
      price: '₦18,000',
      url: '#',
    },
  ];

  const handleContribute = () => {
    const amount = customAmount || selectedAmount;
    console.log('Contributing:', amount);
    // In production, integrate with Paystack
  };

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-8 h-8" style={{ color: colors.primary }} />
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: fonts.heading, color: colors.primary }}
            >
              Gift Registry
            </h2>
          </div>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
          >
            Your presence is the greatest gift, but if you'd like to celebrate with a gift,
            here are some ideas!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Cash Gifts */}
          {allowCashGifts && (
            <div
              className="p-8 rounded-lg shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <DollarSign
                  className="w-8 h-8"
                  style={{ color: colors.accent }}
                />
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: fonts.heading, color: colors.primary }}
                >
                  Cash Gift
                </h3>
              </div>

              {showGoalAmount && (
                <div className="mb-6">
                  <p
                    className="text-sm mb-2"
                    style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                  >
                    Contribution Progress
                  </p>
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                      style={{
                        width: '45%',
                        backgroundColor: colors.primary,
                      }}
                    />
                  </div>
                  <p
                    className="text-sm mt-2"
                    style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                  >
                    ₦450,000 of ₦1,000,000 goal
                  </p>
                </div>
              )}

              <p
                className="mb-6"
                style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
              >
                Help us celebrate this special day with a cash contribution
              </p>

              {/* Suggested Amounts */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className="py-3 px-4 rounded-lg font-semibold transition-all"
                    style={{
                      backgroundColor: selectedAmount === amount ? colors.primary : '#fff',
                      color: selectedAmount === amount ? '#fff' : colors.text || '#333',
                      border: `2px solid ${selectedAmount === amount ? colors.primary : `${colors.primary}40`}`,
                      fontFamily: fonts.body,
                    }}
                  >
                    {amount}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium"
                  style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                >
                  Or enter custom amount
                </label>
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount('');
                  }}
                  placeholder="₦"
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2"
                  style={{
                    fontFamily: fonts.body,
                    borderColor: `${colors.primary}40`,
                  }}
                />
              </div>

              <button
                onClick={handleContribute}
                disabled={!selectedAmount && !customAmount}
                className="w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.primary,
                  color: '#fff',
                  fontFamily: fonts.body,
                }}
              >
                <Heart className="w-5 h-5" />
                Send Gift
              </button>

              {showContributors && (
                <p
                  className="text-center mt-4 text-sm"
                  style={{ fontFamily: fonts.body, color: colors.text || '#999' }}
                >
                  Join 24 others who have contributed
                </p>
              )}
            </div>
          )}

          {/* Suggested Gifts */}
          {showSuggestedGifts && (
            <div
              className="p-8 rounded-lg shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary}15 0%, ${colors.accent}15 100%)`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Gift
                  className="w-8 h-8"
                  style={{ color: colors.secondary }}
                />
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: fonts.heading, color: colors.primary }}
                >
                  Suggested Gifts
                </h3>
              </div>

              <p
                className="mb-6"
                style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
              >
                If you prefer to give a physical gift, here are some items we'd love!
              </p>

              <div className="space-y-4">
                {suggestedGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <div>
                      <h4
                        className="font-semibold mb-1"
                        style={{ fontFamily: fonts.heading, color: colors.text || '#333' }}
                      >
                        {gift.name}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: colors.accent }}
                      >
                        {gift.price}
                      </p>
                    </div>
                    {gift.url && (
                      <a
                        href={gift.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: `${colors.primary}20` }}
                      >
                        <ExternalLink
                          className="w-5 h-5"
                          style={{ color: colors.primary }}
                        />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{
                  backgroundColor: `${colors.primary}10`,
                }}
              >
                <p
                  className="text-sm text-center"
                  style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                >
                  Click the link icon to view and purchase these items online
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
