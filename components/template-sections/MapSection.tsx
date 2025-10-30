'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

export interface MapSectionProps {
  event: any;
  config?: {
    showDirectionsButton?: boolean;
    mapHeight?: number; // in pixels
    zoom?: number;
  };
}

export const MapSection: React.FC<MapSectionProps> = ({ event, config = {} }) => {
  const { colors, fonts } = useTheme();
  const { showDirectionsButton = true, mapHeight = 450, zoom = 15 } = config;

  if (!event.venueName && !event.venueAddress) {
    return null; // Don't render if no venue data
  }

  // Generate Google Maps embed URL
  const getMapEmbedUrl = () => {
    const baseUrl = 'https://www.google.com/maps/embed/v1/place';
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';

    let query = '';
    if (event.details?.venueCoordinates) {
      query = `${event.details.venueCoordinates.lat},${event.details.venueCoordinates.lng}`;
    } else if (event.venueAddress) {
      query = encodeURIComponent(event.venueAddress);
    } else if (event.venueName) {
      query = encodeURIComponent(event.venueName);
    }

    return `${baseUrl}?key=${apiKey}&q=${query}&zoom=${zoom}`;
  };

  // Generate directions link
  const getDirectionsUrl = () => {
    let destination = '';
    if (event.details?.venueCoordinates) {
      destination = `${event.details.venueCoordinates.lat},${event.details.venueCoordinates.lng}`;
    } else if (event.venueAddress) {
      destination = encodeURIComponent(event.venueAddress);
    } else if (event.venueName) {
      destination = encodeURIComponent(event.venueName);
    }

    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  return (
    <section className="py-20 px-4" style={{ backgroundColor: `${colors.secondary}20` }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-light text-center mb-4"
          style={{ fontFamily: fonts.heading, color: colors.primary }}
        >
          Location
        </h2>

        {/* Venue Details */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="h-5 w-5" style={{ color: colors.accent }} />
            <h3
              className="text-2xl font-medium"
              style={{ fontFamily: fonts.heading, color: colors.text || '#333' }}
            >
              {event.venueName}
            </h3>
          </div>
          {event.venueAddress && (
            <p className="text-lg" style={{ fontFamily: fonts.body, color: colors.text ? `${colors.text}99` : '#666' }}>
              {event.venueAddress}
            </p>
          )}
        </div>

        {/* Map Embed */}
        <div className="rounded-lg overflow-hidden shadow-lg mb-6">
          <iframe
            src={getMapEmbedUrl()}
            width="100%"
            height={mapHeight}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue Location Map"
          />
        </div>

        {/* Directions Button */}
        {showDirectionsButton && (
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => window.open(getDirectionsUrl(), '_blank')}
              className="gap-2"
              style={{
                backgroundColor: colors.primary,
                color: '#fff',
                fontFamily: fonts.body,
              }}
            >
              <Navigation className="h-5 w-5" />
              Get Directions
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
