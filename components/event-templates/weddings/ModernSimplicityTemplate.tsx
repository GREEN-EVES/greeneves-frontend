'use client';

import React from 'react';
import { EventTemplateProps } from '../types';
import { Countdown } from '../utils/Countdown';
import { RSVPForm } from '../utils/RSVPForm';
import Image from 'next/image';

export default function ModernSimplicityTemplate({ event }: EventTemplateProps) {
  const {
    brideName,
    groomName,
    eventDate,
    eventTime,
    venueName,
    venueAddress,
    ourStory,
    coverImageUrl,
    galleryImages,
    rsvpEnabled,
    id,
  } = event;

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Hero Section - Split Layout */}
      <section className="min-h-screen grid md:grid-cols-2">
        {/* Left Side - Image */}
        <div className="relative h-[50vh] md:h-screen bg-black">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt="Wedding cover"
              fill
              className="object-cover opacity-80"
              priority
            />
          )}
        </div>

        {/* Right Side - Info */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-16 md:py-8">
          <div className="max-w-xl">
            <h1 className="font-['Oswald'] text-7xl md:text-8xl font-bold uppercase tracking-tight mb-8 leading-none">
              {brideName}
              <br />
              &
              <br />
              {groomName}
            </h1>

            <div className="space-y-4 text-lg border-l-4 border-black pl-6 mb-12">
              <div>
                <div className="font-['Oswald'] uppercase text-sm tracking-wider mb-1">
                  Date
                </div>
                <div className="font-light">
                  {new Date(eventDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {eventTime && (
                <div>
                  <div className="font-['Oswald'] uppercase text-sm tracking-wider mb-1">
                    Time
                  </div>
                  <div className="font-light">{eventTime}</div>
                </div>
              )}

              <div>
                <div className="font-['Oswald'] uppercase text-sm tracking-wider mb-1">
                  Location
                </div>
                <div className="font-light">{venueName}</div>
                <div className="font-light text-sm text-gray-600">
                  {venueAddress}
                </div>
              </div>
            </div>

            <Countdown targetDate={eventDate} className="text-black" />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      {ourStory && (
        <section className="py-24 px-8 md:px-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-['Oswald'] text-5xl md:text-6xl font-bold uppercase tracking-tight mb-12">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed font-light text-xl whitespace-pre-line">
                {ourStory}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section - 4 Column Grid */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="py-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-['Oswald'] text-5xl md:text-6xl font-bold uppercase tracking-tight mb-12 px-4">
              Moments
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {rsvpEnabled && (
        <section className="py-24 px-8 md:px-16 bg-black text-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-['Oswald'] text-5xl md:text-6xl font-bold uppercase tracking-tight mb-8">
              RSVP
            </h2>
            <p className="text-gray-300 mb-12 text-lg font-light">
              Join us in celebrating our special day.
            </p>
            <div className="bg-white text-black p-8 md:p-12">
              <RSVPForm eventId={id} />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-['Oswald'] text-3xl font-bold uppercase tracking-tight mb-2">
            {brideName} & {groomName}
          </div>
          <div className="text-gray-600 font-light">
            {new Date(eventDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="mt-8 text-xs text-gray-400 uppercase tracking-wider">
            Designed with Green Eves
          </div>
        </div>
      </footer>
    </div>
  );
}
