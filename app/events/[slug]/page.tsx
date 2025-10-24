"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import axios from "axios";
import {
  ThemeProvider,
  SECTION_COMPONENTS,
  ColorScheme,
  FontConfig,
} from "@/components/template-sections";

interface EventData {
  id: string;
  eventName: string;
  eventType: "wedding" | "birthday";
  eventDate: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  coverImageUrl?: string;
  galleryImages?: string[];
  storyImageUrl?: string;
  brideName?: string;
  groomName?: string;
  celebrantName?: string;
  age?: number;
  ourStory?: string;
  birthdayMessage?: string;
  bridalTrain?: any[];
  groomsmen?: any[];
  eventSchedule?: any[];
  templateCustomization?: any;
  customColors?: ColorScheme;
  template?: {
    id: string;
    name: string;
    colorSchemes: ColorScheme[];
    fonts: FontConfig;
    sections: TemplateSection[];
  };
}

interface TemplateSection {
  id: string;
  componentName: string;
  order: number;
  config: any;
}

// Default theme fallback
const DEFAULT_COLORS: ColorScheme = {
  primary: "#E91E63",
  secondary: "#9C27B0",
  accent: "#FF4081",
  background: "#FFFFFF",
  text: "#333333",
};

const DEFAULT_FONTS: FontConfig = {
  heading: "'Playfair Display', serif",
  body: "'Open Sans', sans-serif",
};

export default function PublicEventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/public/event/slug/${slug}`
        );
        setEvent(response.data.event);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching event:", err);
        setError(err.response?.data?.message || "Failed to load event. Please check the URL and try again.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Debug logging
  console.log('=== PUBLIC EVENT PAGE DEBUG ===');
  console.log('Event data:', event);
  console.log('Template data:', event.template);
  console.log('Template sections:', event.template?.sections);

  // Determine theme colors
  const colors: ColorScheme = event.customColors ||
    event.template?.colorSchemes?.[0] ||
    DEFAULT_COLORS;

  console.log('Resolved colors:', colors);

  // Determine fonts
  const fonts: FontConfig = event.template?.fonts || DEFAULT_FONTS;

  console.log('Resolved fonts:', fonts);

  // Get template sections or use default sections
  const sections: TemplateSection[] = event.template?.sections || [
    { id: '1', componentName: 'HeroSection', order: 1, config: { layout: 'centered', showCountdown: true } },
    { id: '2', componentName: 'EventDetailsSection', order: 2, config: { layout: 'cards' } },
    { id: '3', componentName: 'StorySection', order: 3, config: { layout: 'centered' } },
    { id: '4', componentName: 'GallerySection', order: 4, config: { layout: 'grid', columns: 3 } },
  ];

  console.log('Sections to render:', sections);

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  console.log('Sorted sections:', sortedSections);

  return (
    <ThemeProvider colors={colors} fonts={fonts}>
      <div className="min-h-screen">
        {sortedSections.map((section) => {
          console.log('Rendering section:', section);
          const componentName = section.componentName as keyof typeof SECTION_COMPONENTS;
          console.log('Looking for component:', componentName);
          const Component = SECTION_COMPONENTS[componentName];
          console.log('Found component:', Component ? 'YES' : 'NO');

          if (!Component) {
            console.warn(`Component "${section.componentName}" not found in SECTION_COMPONENTS`);
            console.warn('Available components:', Object.keys(SECTION_COMPONENTS));
            return null;
          }

          console.log('Rendering component with event:', event, 'config:', section.config);
          return (
            <Component
              key={section.id}
              event={event}
              config={section.config}
            />
          );
        })}
      </div>
    </ThemeProvider>
  );
}
