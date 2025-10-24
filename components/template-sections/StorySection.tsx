'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Heart } from 'lucide-react';

export interface StorySectionProps {
  event: any;
  config?: {
    layout?: 'centered' | 'split' | 'card';
    showImage?: boolean;
  };
}

export const StorySection: React.FC<StorySectionProps> = ({ event, config = {} }) => {
  const { colors, fonts } = useTheme();
  const { layout = 'centered', showImage = true } = config;

  const storyTitle = event.eventType === 'birthday' ? 'Birthday Message' : 'Our Story';
  const storyContent = event.eventType === 'birthday' ? event.birthdayMessage : event.ourStory;

  if (!storyContent) return null;

  // Centered Layout
  if (layout === 'centered') {
    return (
      <div className="py-16 px-4" style={{ backgroundColor: colors.background }}>
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-12 h-12 mx-auto mb-6" style={{ color: colors.accent }} />
          <h2
            className="text-4xl md:text-5xl font-bold mb-8"
            style={{ fontFamily: fonts.heading, color: colors.primary }}
          >
            {storyTitle}
          </h2>
          <div
            className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
          >
            {storyContent}
          </div>
        </div>
      </div>
    );
  }

  // Split Layout with Image
  if (layout === 'split' && showImage && event.storyImageUrl) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={event.storyImageUrl}
                alt={storyTitle}
                className="w-full h-[400px] object-cover rounded-lg shadow-xl"
              />
            </div>
            <div>
              <Heart className="w-10 h-10 mb-4" style={{ color: colors.accent }} />
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ fontFamily: fonts.heading, color: colors.primary }}
              >
                {storyTitle}
              </h2>
              <div
                className="text-base md:text-lg leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
              >
                {storyContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Card Layout
  if (layout === 'card') {
    return (
      <div className="py-16 px-4" style={{ backgroundColor: `${colors.primary}05` }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="p-8 md:p-12 rounded-lg shadow-xl"
            style={{ backgroundColor: 'white' }}
          >
            <Heart className="w-10 h-10 mb-6 mx-auto" style={{ color: colors.accent }} />
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-8"
              style={{ fontFamily: fonts.heading, color: colors.primary }}
            >
              {storyTitle}
            </h2>
            <div
              className="text-base md:text-lg leading-relaxed whitespace-pre-wrap text-center"
              style={{ fontFamily: fonts.body, color: colors.text || '#666' }}
            >
              {storyContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
