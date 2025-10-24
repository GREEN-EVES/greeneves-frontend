"use client";

import React from "react";

interface StorySectionProps {
  config: {
    columns?: 1 | 2;
    imagePosition?: "left" | "right" | "top" | "bottom";
    showImage?: boolean;
  };
  eventData: {
    eventType: "wedding" | "birthday";
    ourStory?: string;
    birthdayMessage?: string;
    storyImageUrl?: string;
    celebrantName?: string;
    age?: number;
  };
}

export default function StorySection({ config, eventData }: StorySectionProps) {
  const { columns = 1, imagePosition = "left", showImage = true } = config;

  // Get the appropriate story content based on event type
  const getStoryContent = () => {
    if (eventData.eventType === "wedding") {
      return eventData.ourStory || "";
    } else if (eventData.eventType === "birthday") {
      return eventData.birthdayMessage || "";
    }
    return "";
  };

  // Get section title based on event type
  const getTitle = () => {
    if (eventData.eventType === "wedding") {
      return "Our Story";
    } else if (eventData.eventType === "birthday") {
      return `Celebrating ${eventData.celebrantName || "A Special Life"}`;
    }
    return "Our Story";
  };

  const story = getStoryContent();

  if (!story) {
    return null; // Don't render if no story content
  }

  const storyParagraphs = story.split("\n\n").filter((p) => p.trim());

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-12 text-center text-foreground">
          {getTitle()}
        </h2>

        {columns === 2 && showImage && eventData.storyImageUrl ? (
          <div
            className={`grid md:grid-cols-2 gap-12 items-center ${
              imagePosition === "right" ? "md:flex-row-reverse" : ""
            }`}
          >
            <div
              className={`${imagePosition === "right" ? "md:order-2" : "md:order-1"}`}
            >
              <div className="prose prose-lg max-w-none">
                {storyParagraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-lg leading-relaxed text-muted-foreground mb-6"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div
              className={`${imagePosition === "right" ? "md:order-1" : "md:order-2"}`}
            >
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={eventData.storyImageUrl}
                  alt="Story"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            {showImage && eventData.storyImageUrl && imagePosition === "top" && (
              <div className="mb-12 rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto">
                <img
                  src={eventData.storyImageUrl}
                  alt="Story"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {storyParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed text-muted-foreground mb-6 text-left"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {showImage && eventData.storyImageUrl && imagePosition === "bottom" && (
              <div className="mt-12 rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto">
                <img
                  src={eventData.storyImageUrl}
                  alt="Story"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Birthday-specific: Show age if available */}
        {eventData.eventType === "birthday" && eventData.age && (
          <div className="text-center mt-12">
            <div className="inline-block bg-primary/10 rounded-full px-8 py-4">
              <span className="text-6xl font-bold text-primary">{eventData.age}</span>
              <span className="text-2xl text-muted-foreground ml-2">years young!</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
