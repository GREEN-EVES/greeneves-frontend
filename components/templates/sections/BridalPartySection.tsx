"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PartyMember {
  name: string;
  role: string;
  image?: string;
}

interface BridalPartySectionProps {
  config: {
    layout?: "grid" | "carousel";
    showRoles?: boolean;
    showPhotos?: boolean;
  };
  eventData: {
    eventType: "wedding" | "birthday";
    bridalTrain?: PartyMember[];
    groomsmen?: PartyMember[];
  };
}

export default function BridalPartySection({
  config,
  eventData,
}: BridalPartySectionProps) {
  const { layout = "grid", showRoles = true, showPhotos = true } = config;

  // Only render for weddings
  if (eventData.eventType !== "wedding") {
    return null;
  }

  const hasBridalTrain = eventData.bridalTrain && eventData.bridalTrain.length > 0;
  const hasGroomsmen = eventData.groomsmen && eventData.groomsmen.length > 0;

  if (!hasBridalTrain && !hasGroomsmen) {
    return null; // Don't render if no bridal party data
  }

  const renderPartyMembers = (members: PartyMember[], title: string) => (
    <div className="mb-16 last:mb-0">
      <h3 className="text-3xl md:text-4xl font-light text-center mb-10 text-foreground">
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member, index) => (
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
                <p className="font-medium text-foreground">{member.name}</p>
                {showRoles && member.role && (
                  <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 text-foreground">
          Our Wedding Party
        </h2>

        {hasBridalTrain && renderPartyMembers(eventData.bridalTrain!, "Bridal Train")}
        {hasGroomsmen && renderPartyMembers(eventData.groomsmen!, "Groomsmen")}
      </div>
    </section>
  );
}
