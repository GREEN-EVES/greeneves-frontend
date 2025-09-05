'use client';

import React from 'react';
import { Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock wedding design data
const weddingDesigns = [
  {
    id: 1,
    name: 'Charlotte',
    category: 'Classic',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
    colors: ['Cream', 'Gold'],
    collection: 'Premium'
  },
  {
    id: 2,
    name: 'Lavender Leaves',
    category: 'Floral & Botanical',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
    colors: ['Purple', 'Green'],
    collection: 'Green Eves Original'
  },
  {
    id: 3,
    name: 'Deco Sunburst Silver',
    category: 'Metallic',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop',
    colors: ['Silver', 'White'],
    collection: 'Premium'
  },
  {
    id: 4,
    name: 'Strung In Love',
    category: 'Rustic',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop',
    colors: ['Beige', 'Brown'],
    collection: 'Green Eves Original'
  },
  {
    id: 5,
    name: 'Sea Salt',
    category: 'Destination',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop',
    colors: ['Blue', 'White'],
    collection: 'Green Eves Original'
  },
  {
    id: 6,
    name: 'Coastal',
    category: 'Destination',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    colors: ['Blue', 'Cream'],
    collection: 'Premium'
  },
  {
    id: 7,
    name: 'Gold Foil Frame',
    category: 'Metallic',
    image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop',
    colors: ['Gold', 'White'],
    collection: 'Premium'
  },
  {
    id: 8,
    name: 'Elegant Flowers',
    category: 'Floral & Botanical',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=300&fit=crop',
    colors: ['Pink', 'Green'],
    collection: 'Green Eves Original'
  },
  {
    id: 9,
    name: 'Cherie',
    category: 'Modern',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop',
    colors: ['Pink', 'White'],
    collection: 'Green Eves Original'
  },
  {
    id: 10,
    name: 'Modern Simplicity',
    category: 'Modern',
    image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop',
    colors: ['Black', 'White'],
    collection: 'Premium'
  },
  {
    id: 11,
    name: 'Editorial Lime',
    category: 'Bold',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    colors: ['Green', 'White'],
    collection: 'Classic'
  },
  {
    id: 12,
    name: 'Lavender Blush',
    category: 'Floral & Botanical',
    image: 'https://images.unsplash.com/photo-1606800052049-3b861f63e1c8?w=400&h=300&fit=crop',
    colors: ['Purple', 'Pink'],
    collection: 'Green Eves Original'
  }
];

const getColorHex = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    cream: '#F5F5DC',
    gold: '#FFD700',
    purple: '#8B5CF6',
    green: '#10B981',
    silver: '#C0C0C0',
    white: '#FFFFFF',
    beige: '#F5F5DC',
    brown: '#8B4513',
    blue: '#3B82F6',
    pink: '#EC4899',
    black: '#000000',
  };
  
  return colorMap[color.toLowerCase()] || '#6B7280';
};

const DesignGallery = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {weddingDesigns.map((design) => (
            <div key={design.id} className="group bg-card rounded-xl shadow-sm border border-border hover:shadow-lg transition-shadow duration-300">
              {/* Image */}
              <div className="relative overflow-hidden rounded-t-xl">
                <img 
                  src={design.image} 
                  alt={design.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                  <Button size="sm" variant="secondary" className="bg-white/90 text-foreground hover:bg-white">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg text-foreground">{design.name}</h3>
                  <p className="text-sm text-muted-foreground">{design.category}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {design.colors.slice(0, 2).map((color, index) => (
                      <div 
                        key={index}
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{design.collection}</span>
                </div>

                <Button variant="outline" className="w-full">
                  Use This Design
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load more button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-12">
            Load More Designs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DesignGallery;