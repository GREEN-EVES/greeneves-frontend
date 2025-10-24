'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Heart, MessageCircle, Send } from 'lucide-react';

export interface BirthdayWishesSectionProps {
  event: any;
  config?: {
    layout?: 'cards' | 'list' | 'masonry';
    showWishesCount?: boolean;
    allowPublicWishes?: boolean;
    moderationRequired?: boolean;
  };
}

interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
}

export const BirthdayWishesSection: React.FC<BirthdayWishesSectionProps> = ({
  event,
  config = {}
}) => {
  const { colors, fonts } = useTheme();
  const {
    layout = 'cards',
    showWishesCount = true,
    allowPublicWishes = true,
  } = config;

  // Sample wishes (in production, these would come from API)
  const [wishes] = useState<Wish[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      message: 'Wishing you a day filled with love, laughter, and all your favorite things! Happy Birthday!',
      timestamp: new Date(),
    },
    {
      id: '2',
      name: 'Michael Chen',
      message: 'May this special day bring you endless joy and tons of precious memories!',
      timestamp: new Date(),
    },
    {
      id: '3',
      name: 'Emily Davis',
      message: 'Happy Birthday to an amazing person! Hope your day is as wonderful as you are!',
      timestamp: new Date(),
    },
  ]);

  const [newWish, setNewWish] = useState({ name: '', message: '' });

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, submit to API
    console.log('Submitting wish:', newWish);
    setNewWish({ name: '', message: '' });
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
            <Heart className="w-8 h-8" style={{ color: colors.primary }} />
            <h2
              className="text-4xl md:text-5xl font-bold"
              style={{ fontFamily: fonts.heading, color: colors.primary }}
            >
              Birthday Wishes
            </h2>
          </div>
          <p
            className="text-lg"
            style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
          >
            Leave your heartfelt wishes for {event.celebrantName || event.eventName}
          </p>
          {showWishesCount && (
            <p
              className="mt-2 text-sm"
              style={{ fontFamily: fonts.body, color: colors.accent }}
            >
              {wishes.length} wishes shared
            </p>
          )}
        </div>

        {/* Wishes Display */}
        <div className={`grid gap-6 mb-12 ${
          layout === 'cards' ? 'md:grid-cols-2 lg:grid-cols-3' :
          layout === 'masonry' ? 'md:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 max-w-3xl mx-auto'
        }`}>
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: '#fff',
                borderTop: `4px solid ${colors.primary}`,
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <MessageCircle
                  className="w-5 h-5 flex-shrink-0 mt-1"
                  style={{ color: colors.accent }}
                />
                <div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ fontFamily: fonts.heading, color: colors.text || '#333' }}
                  >
                    {wish.name}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: colors.text ? `${colors.text}80` : '#999' }}
                  >
                    {wish.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p
                className="leading-relaxed"
                style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
              >
                {wish.message}
              </p>
            </div>
          ))}
        </div>

        {/* Wish Form */}
        {allowPublicWishes && (
          <div className="max-w-2xl mx-auto">
            <div
              className="p-8 rounded-lg shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
              }}
            >
              <h3
                className="text-2xl font-bold mb-6 text-center"
                style={{ fontFamily: fonts.heading, color: colors.primary }}
              >
                Share Your Wishes
              </h3>
              <form onSubmit={handleSubmitWish} className="space-y-4">
                <div>
                  <label
                    htmlFor="wish-name"
                    className="block mb-2 font-medium"
                    style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
                  >
                    Your Name
                  </label>
                  <input
                    id="wish-name"
                    type="text"
                    value={newWish.name}
                    onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
                    style={{
                      fontFamily: fonts.body,
                      borderColor: `${colors.primary}40`,
                      backgroundColor: '#fff',
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="wish-message"
                    className="block mb-2 font-medium"
                    style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
                  >
                    Your Message
                  </label>
                  <textarea
                    id="wish-message"
                    value={newWish.message}
                    onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
                    placeholder="Write your birthday wishes..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{
                      fontFamily: fonts.body,
                      borderColor: `${colors.primary}40`,
                      backgroundColor: '#fff',
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: colors.primary,
                    color: '#fff',
                    fontFamily: fonts.body,
                  }}
                >
                  <Send className="w-5 h-5" />
                  Send Wishes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
