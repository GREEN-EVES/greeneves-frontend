"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Heart, Users, Calendar, Gift } from "lucide-react";

interface EventDetailsSectionProps {
  config: {
    layout?: "grid" | "list" | "timeline";
    showIcons?: boolean;
  };
  eventData: {
    eventType: "wedding" | "birthday";
    eventDate: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
    ceremonyTime?: string;
    ceremonyLocation?: string;
    ceremonyVenue?: string;
    receptionTime?: string;
    receptionLocation?: string;
    receptionVenue?: string;
    eventSchedule?: string;
    dressCode?: string;
  };
}

export default function EventDetailsSection({
  config,
  eventData,
}: EventDetailsSectionProps) {
  const { layout = "grid", showIcons = true } = config;

  // Wedding-specific rendering
  if (eventData.eventType === "wedding") {
    return (
      <section id="details" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-16 text-foreground">
            Wedding Details
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Ceremony */}
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                {showIcons && <Heart className="h-8 w-8 text-primary mx-auto mb-4" />}
                <h3 className="text-2xl font-medium mb-6 text-foreground">Ceremony</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-lg">
                      {eventData.ceremonyTime ||
                        new Date(eventData.eventDate).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                    </span>
                  </div>
                  <div className="flex items-start justify-center gap-2">
                    <MapPin className="h-5 w-5 mt-1" />
                    <span className="text-lg">
                      {eventData.ceremonyLocation ||
                        eventData.ceremonyVenue ||
                        eventData.venueName}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reception */}
            <Card className="p-8 text-center">
              <CardContent className="p-0">
                {showIcons && <Users className="h-8 w-8 text-primary mx-auto mb-4" />}
                <h3 className="text-2xl font-medium mb-6 text-foreground">Reception</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-lg">
                      {eventData.receptionTime || "Following Ceremony"}
                    </span>
                  </div>
                  <div className="flex items-start justify-center gap-2">
                    <MapPin className="h-5 w-5 mt-1" />
                    <span className="text-lg">
                      {eventData.receptionLocation ||
                        eventData.receptionVenue ||
                        eventData.venueName}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dress Code */}
          {eventData.dressCode && (
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <Card className="p-6">
                <CardContent className="p-0">
                  <h4 className="text-xl font-medium mb-3 text-foreground flex items-center justify-center gap-2">
                    <Gift className="h-5 w-5" />
                    Dress Code
                  </h4>
                  <p className="text-lg text-muted-foreground">{eventData.dressCode}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Birthday or generic event rendering
  return (
    <section id="details" className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 text-foreground">
          Event Details
        </h2>

        <Card className="p-8">
          <CardContent className="p-0 space-y-6">
            {/* Date & Time */}
            <div className="flex items-start gap-4 pb-6 border-b">
              {showIcons && <Calendar className="h-6 w-6 text-primary mt-1" />}
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2 text-foreground">Date & Time</h3>
                <p className="text-lg text-muted-foreground">
                  {new Date(eventData.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                {eventData.eventTime && (
                  <p className="text-lg text-muted-foreground mt-1">{eventData.eventTime}</p>
                )}
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-4 pb-6 border-b">
              {showIcons && <MapPin className="h-6 w-6 text-primary mt-1" />}
              <div className="flex-1">
                <h3 className="text-xl font-medium mb-2 text-foreground">Venue</h3>
                <p className="text-lg text-muted-foreground font-medium">
                  {eventData.venueName}
                </p>
                {eventData.venueAddress && (
                  <p className="text-muted-foreground mt-1">{eventData.venueAddress}</p>
                )}
              </div>
            </div>

            {/* Schedule */}
            {eventData.eventSchedule && (
              <div className="flex items-start gap-4">
                {showIcons && <Clock className="h-6 w-6 text-primary mt-1" />}
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2 text-foreground">Schedule</h3>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {eventData.eventSchedule}
                  </div>
                </div>
              </div>
            )}

            {/* Dress Code */}
            {eventData.dressCode && (
              <div className="flex items-start gap-4 pt-6 border-t">
                {showIcons && <Gift className="h-6 w-6 text-primary mt-1" />}
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-2 text-foreground">Dress Code</h3>
                  <p className="text-lg text-muted-foreground">{eventData.dressCode}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
