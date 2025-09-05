'use client';

import React from 'react';
import Header from '@/components/Header';
import FilterSection from '@/components/FilterSection';
import DesignGallery from '@/components/DesignGallery';
import Footer from '@/components/Footer';

const DesignsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page Header */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Wedding Website Designs
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of beautiful wedding website templates. Find the perfect design that matches your style and personality.
            </p>
          </div>
        </section>
        
        <FilterSection />
        <DesignGallery />
      </main>
      <Footer />
    </div>
  );
};

export default DesignsPage;