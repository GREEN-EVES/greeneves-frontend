'use client';

import React from 'react';
import { EventTemplateProps } from '../types';
import { Countdown } from '../utils/Countdown';
import { RSVPForm } from '../utils/RSVPForm';
import Image from 'next/image';

export default function CharlotteTemplate({ event }: EventTemplateProps) {
  const {
    brideName,
    groomName,
    eventDate,
    eventTime,
    venueName,
    venueAddress,
    ourStory,
    coverImageUrl,
    storyImageUrl,
    galleryImages,
    eventSchedule,
    rsvpEnabled,
    id,
  } = event;

  return (
    <div className="font-['Lato'] text-gray-800 bg-[#F5E6D3]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center">
        {coverImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={coverImageUrl}
              alt="Wedding cover"
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
        )}
        <div className="relative z-10 px-4">
          <h1 className="font-['Playfair_Display'] text-6xl md:text-8xl font-bold text-[#D4AF37] mb-6">
            {brideName} & {groomName}
          </h1>
          <div className="text-2xl md:text-3xl text-gray-700 mb-8">
            {new Date(eventDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
            {eventTime && ` • ${eventTime}`}
          </div>
          <div className="text-xl md:text-2xl text-gray-600 mb-12">
            {venueName}
          </div>
          <Countdown targetDate={eventDate} className="text-[#D4AF37]" />
        </div>
      </section>

      {/* Our Story Section */}
      {ourStory && (
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#D4AF37] text-center mb-16">
              Our Story
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {ourStory}
                </p>
              </div>
              {storyImageUrl && (
                <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={storyImageUrl}
                    alt="Our story"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Event Details Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#D4AF37] text-center mb-16">
            Event Details
          </h2>

          {/* Date, Time, Venue */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">📅</div>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2">Date</h3>
              <p className="text-gray-700">
                {new Date(eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">🕐</div>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2">Time</h3>
              <p className="text-gray-700">{eventTime || 'TBA'}</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-[#D4AF37] text-4xl mb-4">📍</div>
              <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-2">Venue</h3>
              <p className="text-gray-700">{venueName}</p>
              <p className="text-gray-600 text-sm mt-2">{venueAddress}</p>
            </div>
          </div>

          {/* Event Schedule */}
          {eventSchedule && eventSchedule.length > 0 && (
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
              <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[#D4AF37] mb-8 text-center">
                Schedule
              </h3>
              <div className="space-y-6">
                {eventSchedule.map((item, index) => (
                  <div key={index} className="flex gap-6 border-l-4 border-[#D4AF37] pl-6">
                    <div className="font-bold text-[#D4AF37] min-w-[100px]">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      {item.description && (
                        <p className="text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-20 px-4 md:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#D4AF37] text-center mb-16">
              Gallery
            </h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative break-inside-avoid mb-4">
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {rsvpEnabled && (
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#D4AF37] text-center mb-8">
              RSVP
            </h2>
            <p className="text-center text-gray-700 mb-12 text-lg">
              We would be honored by your presence. Please let us know if you can attend.
            </p>
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
              <RSVPForm eventId={id} />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#D4AF37] text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-['Playfair_Display'] text-3xl font-bold mb-4">
            {brideName} & {groomName}
          </h3>
          <p className="text-lg opacity-90">
            {new Date(eventDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <div className="mt-8 text-sm opacity-75">
            Designed with love using Green Eves
          </div>
        </div>
      </footer>
    </div>
  );
}
