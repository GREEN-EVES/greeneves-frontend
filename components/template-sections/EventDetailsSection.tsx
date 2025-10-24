'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Calendar, Clock, MapPin } from 'lucide-react';

export interface EventDetailsSectionProps {
  event: any;
  config?: {
    layout?: 'cards' | 'inline' | 'timeline';
    showIcons?: boolean;
  };
}

export const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({ event, config = {} }) => {
  const { colors, fonts } = useTheme();
  const { layout = 'cards', showIcons = true } = config;

  const details = [
    {
      icon: Calendar,
      label: 'Date',
      value: event.eventDate
        ? new Date(event.eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'TBA',
    },
    {
      icon: Clock,
      label: 'Time',
      value: event.eventTime || 'TBA',
    },
    {
      icon: MapPin,
      label: 'Venue',
      value: event.venueName || 'TBA',
    },
  ];

  // Cards Layout
  if (layout === 'cards') {
    return (
      <div className="py-16 px-4" style={{ backgroundColor: colors.background }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-12"
            style={{ fontFamily: fonts.heading, color: colors.primary }}
          >
            Event Details
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-lg shadow-lg transition-transform hover:scale-105"
                  style={{
                    backgroundColor: 'white',
                    borderTop: `4px solid ${colors.accent}`,
                  }}
                >
                  {showIcons && (
                    <Icon
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: colors.accent }}
                    />
                  )}
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ fontFamily: fonts.heading, color: colors.primary }}
                  >
                    {detail.label}
                  </h3>
                  <p
                    className="text-base"
                    style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                  >
                    {detail.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Inline Layout
  if (layout === 'inline') {
    return (
      <div className="py-16 px-4" style={{ backgroundColor: `${colors.primary}05` }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-around items-center gap-8">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div key={index} className="flex items-center gap-4">
                  {showIcons && (
                    <Icon
                      className="w-8 h-8 flex-shrink-0"
                      style={{ color: colors.accent }}
                    />
                  )}
                  <div>
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ fontFamily: fonts.heading, color: colors.primary }}
                    >
                      {detail.label}
                    </p>
                    <p
                      className="text-base"
                      style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
                    >
                      {detail.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
