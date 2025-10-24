"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface HeroSectionProps {
  config: {
    layout?: "centered" | "left" | "right";
    overlay?: boolean;
    showCountdown?: boolean;
    overlayOpacity?: number;
  };
  eventData: {
    eventType: "wedding" | "birthday";
    eventName?: string;
    brideName?: string;
    groomName?: string;
    celebrantName?: string;
    eventDate: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
    coverImageUrl?: string;
    galleryImages?: string[];
    ourStory?: string;
    birthdayMessage?: string;
  };
  photos?: { id: string; url: string; title?: string }[];
}

export default function HeroSection({ config, eventData, photos = [] }: HeroSectionProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [timeUntil, setTimeUntil] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const {
    layout = "centered",
    overlay = true,
    showCountdown = true,
    overlayOpacity = 0.4,
  } = config;

  // Photo carousel effect
  useEffect(() => {
    const displayPhotos = photos.length > 0 ? photos : [];
    if (displayPhotos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % displayPhotos.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [photos]);

  // Countdown timer
  useEffect(() => {
    if (!eventData.eventDate || !showCountdown) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const eventDate = new Date(eventData.eventDate).getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        setTimeUntil({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [eventData.eventDate, showCountdown]);

  // Determine display name based on event type
  const getDisplayName = () => {
    if (eventData.eventType === "wedding") {
      if (eventData.brideName && eventData.groomName) {
        return `${eventData.brideName} & ${eventData.groomName}`;
      }
      return eventData.eventName || "Our Wedding";
    } else if (eventData.eventType === "birthday") {
      return eventData.celebrantName || eventData.eventName || "Birthday Celebration";
    }
    return eventData.eventName || "Celebration";
  };

  // Get background image
  const getBackgroundImage = () => {
    if (photos.length > 0) {
      return photos[currentPhotoIndex].url;
    }
    if (eventData.coverImageUrl) {
      return eventData.coverImageUrl;
    }
    // Default fallback image
    return "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&h=800&fit=crop";
  };

  const displayPhotos = photos.length > 0 ? photos : eventData.coverImageUrl ? [{ id: '1', url: eventData.coverImageUrl }] : [];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {displayPhotos.length > 0 ? (
          displayPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentPhotoIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${photo.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${getBackgroundImage()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
      </div>

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Navigation */}
      <nav className="absolute top-0 w-full z-20 p-6">
        <div className="flex justify-between items-center text-white">
          <div className="text-xl font-medium">{getDisplayName()}</div>
          <Menu className="h-6 w-6 cursor-pointer hover:opacity-70 transition-opacity" />
        </div>
      </nav>

      {/* Main Content */}
      <div
        className={`relative z-10 h-full flex items-center px-4 text-white ${
          layout === "centered"
            ? "justify-center text-center"
            : layout === "left"
            ? "justify-start text-left"
            : "justify-end text-right"
        }`}
      >
        <div className="space-y-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-light tracking-wide">
            {getDisplayName()}
          </h1>

          {/* Event-specific tagline */}
          {eventData.eventType === "birthday" && eventData.birthdayMessage && (
            <p className="text-xl md:text-2xl font-light leading-relaxed opacity-90 italic">
              {eventData.birthdayMessage}
            </p>
          )}

          {eventData.eventType === "wedding" && eventData.ourStory && (
            <p className="text-xl md:text-2xl font-light leading-relaxed opacity-90 italic">
              {eventData.ourStory.substring(0, 150)}...
            </p>
          )}

          <div className="space-y-4">
            <div className="text-lg md:text-xl">
              {new Date(eventData.eventDate).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </div>
            <div className="text-2xl md:text-3xl font-medium">
              {new Date(eventData.eventDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            {eventData.venueName && (
              <div className="text-lg md:text-xl opacity-90">{eventData.venueName}</div>
            )}

            {/* Countdown */}
            {showCountdown && (
              <div className="text-base md:text-lg opacity-80 pt-2">
                {timeUntil.days} days {timeUntil.hours} hrs {timeUntil.minutes} mins
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="lg"
            className="mt-8 bg-white/10 border-white/30 text-white hover:bg-white hover:text-foreground backdrop-blur-sm"
            onClick={() =>
              document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View Details
          </Button>
        </div>
      </div>
    </section>
  );
}
