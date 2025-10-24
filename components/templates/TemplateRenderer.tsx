"use client";

import React from "react";
import HeroSection from "./sections/HeroSection";
import StorySection from "./sections/StorySection";
import EventDetailsSection from "./sections/EventDetailsSection";
import GallerySection from "./sections/GallerySection";
import RSVPSection from "./sections/RSVPSection";
import BridalPartySection from "./sections/BridalPartySection";
import MapSection from "./sections/MapSection";
import ContributionsSection from "./sections/ContributionsSection";
import { Heart } from "lucide-react";

interface TemplateSection {
  id: string;
  sectionType: string;
  componentName: string;
  config: Record<string, any>;
  sortOrder: number;
  isRequired: boolean;
}

interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text?: string;
  background?: string;
}

interface FontConfig {
  heading: string;
  body: string;
  accent?: string;
}

interface TemplateRendererProps {
  template: {
    id: string;
    name: string;
    colorSchemes: ColorScheme[];
    fonts: FontConfig;
    sections: TemplateSection[];
  };
  eventData: any; // Event data from backend
  photos?: { id: string; url: string; title?: string; description?: string }[];
  customizations?: {
    selectedColorScheme?: string;
    sectionVisibility?: Record<string, boolean>;
    sectionOrder?: string[];
  };
}

export default function TemplateRenderer({
  template,
  eventData,
  photos = [],
  customizations = {},
}: TemplateRendererProps) {
  // Apply color scheme
  const applyColorScheme = () => {
    const selectedScheme =
      customizations.selectedColorScheme ||
      (template.colorSchemes.length > 0 ? template.colorSchemes[0].name : null);

    if (selectedScheme) {
      const scheme = template.colorSchemes.find((s) => s.name === selectedScheme);
      if (scheme) {
        // Apply CSS variables
        if (typeof document !== "undefined") {
          const root = document.documentElement;
          root.style.setProperty("--template-primary", scheme.primary);
          root.style.setProperty("--template-secondary", scheme.secondary);
          root.style.setProperty("--template-accent", scheme.accent);
          if (scheme.text) root.style.setProperty("--template-text", scheme.text);
          if (scheme.background)
            root.style.setProperty("--template-background", scheme.background);
        }
      }
    }
  };

  // Apply font configuration
  const applyFonts = () => {
    if (typeof document !== "undefined" && template.fonts) {
      const root = document.documentElement;
      root.style.setProperty("--font-heading", template.fonts.heading);
      root.style.setProperty("--font-body", template.fonts.body);
      if (template.fonts.accent) {
        root.style.setProperty("--font-accent", template.fonts.accent);
      }
    }
  };

  React.useEffect(() => {
    applyColorScheme();
    applyFonts();
  }, [template, customizations.selectedColorScheme]);

  // Component mapping
  const componentMap: Record<string, React.ComponentType<any>> = {
    HeroSection,
    StorySection,
    EventDetailsSection,
    GallerySection,
    RSVPSection,
    BridalPartySection,
    MapSection,
    ContributionsSection,
  };

  // Get sections in correct order
  const getSortedSections = () => {
    let sections = [...template.sections];

    // Apply custom order if specified
    if (customizations.sectionOrder && customizations.sectionOrder.length > 0) {
      sections.sort((a, b) => {
        const indexA = customizations.sectionOrder!.indexOf(a.id);
        const indexB = customizations.sectionOrder!.indexOf(b.id);
        if (indexA === -1 && indexB === -1) return a.sortOrder - b.sortOrder;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    } else {
      // Default sort by sortOrder
      sections.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    // Filter out hidden sections
    if (customizations.sectionVisibility) {
      sections = sections.filter(
        (section) =>
          customizations.sectionVisibility![section.id] !== false &&
          customizations.sectionVisibility![section.sectionType] !== false
      );
    }

    return sections;
  };

  const renderSection = (section: TemplateSection) => {
    const Component = componentMap[section.componentName];

    if (!Component) {
      console.warn(`Component "${section.componentName}" not found in component map`);
      return null;
    }

    // Prepare props based on section type
    const commonProps = {
      config: section.config,
      eventData,
    };

    // Add section-specific props
    if (section.componentName === "HeroSection") {
      return <Component key={section.id} {...commonProps} photos={photos} />;
    } else if (section.componentName === "GallerySection") {
      return <Component key={section.id} config={section.config} photos={photos} />;
    } else if (section.componentName === "RSVPSection") {
      return (
        <Component
          key={section.id}
          config={section.config}
          eventData={{
            eventId: eventData.id,
            userId: eventData.userId,
            eventDate: eventData.eventDate,
            eventType: eventData.eventType,
          }}
        />
      );
    } else if (section.componentName === "ContributionsSection") {
      return (
        <Component
          key={section.id}
          config={section.config}
          eventData={{
            eventId: eventData.id,
            userId: eventData.userId,
            eventType: eventData.eventType,
            contributionsEnabled: eventData.contributionsEnabled || false,
            bankAccountDetails: eventData.bankAccountDetails,
          }}
        />
      );
    }

    return <Component key={section.id} {...commonProps} />;
  };

  const sortedSections = getSortedSections();

  if (!template || !eventData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if template has sections
  if (!template.sections || template.sections.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-8">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">{template.name}</h1>
          <p className="text-muted-foreground mb-6">
            This template is currently being developed and doesn't have sections configured yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Please try the "Elegant Rose" template to see a fully functional preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {sortedSections.map((section) => renderSection(section))}

      {/* Footer */}
      <footer className="py-12 text-center bg-white">
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            {eventData.eventType === "wedding"
              ? "Can't wait to celebrate with you!"
              : "Looking forward to celebrating together!"}
          </p>
          <Heart className="h-6 w-6 text-primary mx-auto" />
          <div className="text-sm text-muted-foreground">
            Powered by <span className="font-medium">Green Eves</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
