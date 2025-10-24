"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface MapSectionProps {
  config: {
    showDirectionsButton?: boolean;
    mapHeight?: number; // in pixels
    zoom?: number;
  };
  eventData: {
    venueName?: string;
    venueAddress?: string;
    venueCoordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export default function MapSection({ config, eventData }: MapSectionProps) {
  const {
    showDirectionsButton = true,
    mapHeight = 450,
    zoom = 15,
  } = config;

  if (!eventData.venueName && !eventData.venueAddress) {
    return null; // Don't render if no venue data
  }

  // Generate Google Maps embed URL
  const getMapEmbedUrl = () => {
    const baseUrl = "https://www.google.com/maps/embed/v1/place";
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY";

    let query = "";
    if (eventData.venueCoordinates) {
      query = `${eventData.venueCoordinates.lat},${eventData.venueCoordinates.lng}`;
    } else if (eventData.venueAddress) {
      query = encodeURIComponent(eventData.venueAddress);
    } else if (eventData.venueName) {
      query = encodeURIComponent(eventData.venueName);
    }

    return `${baseUrl}?key=${apiKey}&q=${query}&zoom=${zoom}`;
  };

  // Generate directions link
  const getDirectionsUrl = () => {
    let destination = "";
    if (eventData.venueCoordinates) {
      destination = `${eventData.venueCoordinates.lat},${eventData.venueCoordinates.lng}`;
    } else if (eventData.venueAddress) {
      destination = encodeURIComponent(eventData.venueAddress);
    } else if (eventData.venueName) {
      destination = encodeURIComponent(eventData.venueName);
    }

    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-4 text-foreground">
          Location
        </h2>

        {/* Venue Details */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-2xl font-medium text-foreground">
              {eventData.venueName}
            </h3>
          </div>
          {eventData.venueAddress && (
            <p className="text-lg text-muted-foreground">{eventData.venueAddress}</p>
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
              onClick={() => window.open(getDirectionsUrl(), "_blank")}
              className="gap-2"
            >
              <Navigation className="h-5 w-5" />
              Get Directions
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
