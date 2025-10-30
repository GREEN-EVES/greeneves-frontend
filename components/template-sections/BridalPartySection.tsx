'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Card, CardContent } from '@/components/ui/card';

interface PartyMember {
  name: string;
  role: string;
  image?: string;
}

export interface BridalPartySectionProps {
  event: any;
  config?: {
    layout?: 'grid' | 'carousel';
    showRoles?: boolean;
    showPhotos?: boolean;
  };
}

export const BridalPartySection: React.FC<BridalPartySectionProps> = ({ event, config = {} }) => {
  const { colors, fonts } = useTheme();
  const { layout = 'grid', showRoles = true, showPhotos = true } = config;

  // Only render for weddings
  if (event.eventType !== 'wedding') {
    return null;
  }

  // Get bridal party data from event.details
  const bridalTrain = event.details?.bridalTrain || [];
  const groomsmen = event.details?.groomsmen || [];

  const hasBridalTrain = bridalTrain.length > 0;
  const hasGroomsmen = groomsmen.length > 0;

  if (!hasBridalTrain && !hasGroomsmen) {
    return null; // Don't render if no bridal party data
  }

  const renderPartyMembers = (members: PartyMember[], title: string) => (
    <div className="mb-16 last:mb-0">
      <h3
        className="text-3xl md:text-4xl font-light text-center mb-10"
        style={{ fontFamily: fonts.heading, color: colors.primary }}
      >
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member: PartyMember, index: number) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              {showPhotos && member.image && (
                <div className="aspect-square bg-muted">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 text-center">
                <p className="font-medium" style={{ color: colors.text || '#333' }}>
                  {member.name}
                </p>
                {showRoles && member.role && (
                  <p className="text-sm mt-1" style={{ color: colors.text ? `${colors.text}99` : '#666' }}>
                    {member.role}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-light text-center mb-16"
          style={{ fontFamily: fonts.heading, color: colors.primary }}
        >
          Our Wedding Party
        </h2>

        {hasBridalTrain && renderPartyMembers(bridalTrain, 'Bridal Train')}
        {hasGroomsmen && renderPartyMembers(groomsmen, 'Groomsmen')}
      </div>
    </section>
  );
};
