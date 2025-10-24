'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Calendar, Heart } from 'lucide-react';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
}

export interface HeroSectionProps {
  event: any;
  config?: {
    layout?: 'centered' | 'split' | 'overlay' | 'minimal';
    showCountdown?: boolean;
    showDate?: boolean;
    height?: 'small' | 'medium' | 'large' | 'full';
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ event, config = {} }) => {
  const { colors, fonts } = useTheme();
  const {
    layout = 'centered',
    showCountdown = true,
    showDate = true,
    height = 'large',
  } = config;

  const [countdown, setCountdown] = useState<CountdownData | null>(null);

  const displayName = event.eventType === 'birthday'
    ? event.celebrantName || event.eventName
    : event.brideName && event.groomName
    ? `${event.brideName} & ${event.groomName}`
    : event.eventName;

  const eventTypeName = event.eventType === 'birthday' ? 'Birthday Celebration' : 'Wedding';

  // Countdown timer
  useEffect(() => {
    if (!showCountdown || !event.eventDate) return;

    const calculateCountdown = () => {
      const eventDate = new Date(event.eventDate);
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown({ days, hours, minutes });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [event.eventDate, showCountdown]);

  const heightClasses = {
    small: 'h-[400px]',
    medium: 'h-[500px]',
    large: 'h-[600px]',
    full: 'h-screen',
  };

  // Centered Layout - Classic centered design
  if (layout === 'centered') {
    return (
      <div
        className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden`}
        style={{
          backgroundColor: colors.background,
          backgroundImage: event.coverImageUrl ? `url(${event.coverImageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}dd 0%, ${colors.secondary}dd 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <Heart
            className="w-16 h-16 mx-auto mb-6 animate-pulse"
            style={{ color: colors.accent }}
          />
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg"
            style={{ fontFamily: fonts.heading }}
          >
            {displayName}
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 text-white/90"
            style={{ fontFamily: fonts.body }}
          >
            {eventTypeName}
          </p>

          {showDate && event.eventDate && (
            <div className="flex items-center justify-center gap-2 mb-8 text-white/90">
              <Calendar className="w-5 h-5" />
              <span style={{ fontFamily: fonts.body }}>
                {new Date(event.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {showCountdown && countdown && (
            <div className="flex gap-6 justify-center">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[100px]"
                >
                  <div
                    className="text-4xl font-bold text-white"
                    style={{ fontFamily: fonts.heading }}
                  >
                    {item.value}
                  </div>
                  <div className="text-sm text-white/80" style={{ fontFamily: fonts.body }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Split Layout - Image on one side, content on other
  if (layout === 'split') {
    return (
      <div className={`grid md:grid-cols-2 ${heightClasses[height]}`}>
        {/* Image Side */}
        <div
          className="relative bg-cover bg-center"
          style={{
            backgroundImage: event.coverImageUrl ? `url(${event.coverImageUrl})` : 'none',
            backgroundColor: colors.secondary,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `${colors.primary}40` }}
          />
        </div>

        {/* Content Side */}
        <div
          className="flex items-center justify-center p-8"
          style={{ backgroundColor: colors.background }}
        >
          <div className="max-w-lg">
            <Heart className="w-12 h-12 mb-6" style={{ color: colors.accent }} />
            <h1
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: fonts.heading, color: colors.primary }}
            >
              {displayName}
            </h1>
            <p
              className="text-xl mb-6"
              style={{ fontFamily: fonts.body, color: colors.text || '#333' }}
            >
              {eventTypeName}
            </p>

            {showDate && event.eventDate && (
              <div className="flex items-center gap-2 mb-8" style={{ color: colors.text || '#666' }}>
                <Calendar className="w-5 h-5" />
                <span style={{ fontFamily: fonts.body }}>
                  {new Date(event.eventDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}

            {showCountdown && countdown && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Minutes', value: countdown.minutes },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-4 rounded-lg"
                    style={{ backgroundColor: `${colors.primary}10` }}
                  >
                    <div
                      className="text-3xl font-bold"
                      style={{ fontFamily: fonts.heading, color: colors.primary }}
                    >
                      {item.value}
                    </div>
                    <div
                      className="text-sm"
                      style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Minimal Layout - Simple and clean
  if (layout === 'minimal') {
    return (
      <div
        className={`${heightClasses[height]} flex items-center justify-center`}
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center px-4 max-w-3xl">
          <h1
            className="text-6xl md:text-8xl font-bold mb-6"
            style={{ fontFamily: fonts.heading, color: colors.primary }}
          >
            {displayName}
          </h1>
          {showDate && event.eventDate && (
            <p
              className="text-xl md:text-2xl"
              style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
            >
              {new Date(event.eventDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Default to centered
  return null;
};
