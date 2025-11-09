'use client';

import React from 'react';
import { EventTemplateProps } from '../types';
import { Countdown } from '../utils/Countdown';
import { RSVPForm } from '../utils/RSVPForm';
import Image from 'next/image';

export default function EditorialLimeTemplate({ event }: EventTemplateProps) {
  const {
    celebrantName,
    age,
    eventDate,
    eventTime,
    venueName,
    venueAddress,
    birthdayMessage,
    coverImageUrl,
    galleryImages,
    eventSchedule,
    rsvpEnabled,
    id,
  } = event;

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#C1FF72] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {coverImageUrl && (
            <Image
              src={coverImageUrl}
              alt="Birthday cover"
              fill
              className="object-cover opacity-20"
              priority
            />
          )}
          {/* Geometric pattern overlay */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
        </div>

        <div className="relative z-10 text-center px-4 py-16">
          <div className="inline-block bg-black text-white px-8 py-3 mb-8 font-bold uppercase tracking-widest text-sm">
            Birthday Celebration
          </div>

          <h1 className="font-['Bebas_Neue'] text-8xl md:text-[12rem] font-bold uppercase leading-none mb-6 text-black">
            {celebrantName}
          </h1>

          {age && (
            <div className="text-9xl md:text-[15rem] font-['Bebas_Neue'] font-bold text-black opacity-20 leading-none mb-8">
              {age}
            </div>
          )}

          <div className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-4">
            {new Date(eventDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>

          {eventTime && (
            <div className="text-xl md:text-2xl uppercase tracking-wider mb-12">
              {eventTime}
            </div>
          )}

          <Countdown targetDate={eventDate} className="text-black" />
        </div>
      </section>

      {/* Birthday Message Section */}
      {birthdayMessage && (
        <section className="py-24 px-8 md:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black text-white p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#C1FF72] opacity-30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#C1FF72] opacity-30 rounded-full translate-x-1/2 translate-y-1/2"></div>

              <div className="relative z-10">
                <div className="font-['Bebas_Neue'] text-4xl md:text-5xl uppercase tracking-wide mb-8 text-[#C1FF72]">
                  A Special Message
                </div>
                <p className="text-xl md:text-2xl leading-relaxed font-light whitespace-pre-line">
                  {birthdayMessage}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Event Details Section */}
      <section className="py-24 px-8 md:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Bebas_Neue'] text-6xl md:text-7xl uppercase tracking-tight mb-16 text-center">
            Event Details
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Venue Card */}
            <div className="bg-white p-8 border-l-8 border-[#C1FF72]">
              <div className="font-['Bebas_Neue'] text-3xl uppercase tracking-wide mb-4">
                Location
              </div>
              <div className="text-xl font-semibold mb-2">{venueName}</div>
              <div className="text-gray-600">{venueAddress}</div>
            </div>

            {/* Date/Time Card */}
            <div className="bg-[#C1FF72] p-8 text-black">
              <div className="font-['Bebas_Neue'] text-3xl uppercase tracking-wide mb-4">
                When
              </div>
              <div className="text-xl font-semibold mb-2">
                {new Date(eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              {eventTime && <div className="text-lg">{eventTime}</div>}
            </div>
          </div>

          {/* Event Schedule */}
          {eventSchedule && eventSchedule.length > 0 && (
            <div className="bg-white p-8 md:p-12">
              <div className="font-['Bebas_Neue'] text-4xl uppercase tracking-wide mb-8 text-center">
                Schedule
              </div>
              <div className="space-y-6">
                {eventSchedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-6 items-start border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="bg-[#C1FF72] text-black font-bold px-4 py-2 rounded min-w-[100px] text-center">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl mb-1">{item.title}</h4>
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
        <section className="py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Bebas_Neue'] text-6xl md:text-7xl uppercase tracking-tight mb-16 text-center">
              Memories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#C1FF72] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
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
            <h2 className="font-['Bebas_Neue'] text-6xl md:text-7xl uppercase tracking-tight mb-8 text-[#C1FF72]">
              Join the Party
            </h2>
            <p className="text-xl mb-12 font-light">
              Let us know if you can make it to the celebration!
            </p>
            <div className="bg-white text-black p-8 md:p-12">
              <RSVPForm eventId={id} />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#C1FF72] text-black py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-['Bebas_Neue'] text-5xl uppercase tracking-tight mb-4">
            {celebrantName}
            {age && ` Turns ${age}`}
          </div>
          <div className="text-xl font-bold uppercase tracking-wider">
            {new Date(eventDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="mt-8 text-sm uppercase tracking-widest opacity-75">
            Powered by Green Eves
          </div>
        </div>
      </footer>
    </div>
  );
}
