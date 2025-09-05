'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  const heroImages = [
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop', 
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
  ];

  return (
    <section className="bg-gradient-hero py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-primary font-medium">Free Wedding Website Designs</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display leading-tight text-foreground">
                Thousands of design combinations.
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-body">
              Create your perfect look by mixing layouts, themes, fonts, colours and photos—your 
              wedding website, sorted in minutes. Change or update any part of your design whenever 
              you fancy.
            </p>

            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground group text-lg px-8 py-6">
                Start Customizing Your Website
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Hero Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-lg bg-white p-2">
                  <img 
                    src={heroImages[0]}
                    alt="Elegant lavender wedding design"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg bg-white p-2">
                  <img 
                    src={heroImages[1]}
                    alt="Classic marble wedding design"
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              </div>
              <div className="pt-8">
                <div className="rounded-lg overflow-hidden shadow-lg bg-white p-2">
                  <img 
                    src={heroImages[2]}
                    alt="Modern minimalist wedding design"
                    className="w-full h-56 object-cover rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;