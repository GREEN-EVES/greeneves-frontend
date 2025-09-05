'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const FilterSection = () => {
  const filters = [
    {
      label: 'All Layouts',
      options: ['All Layouts', 'Single Page', 'Multi Page', 'Timeline', 'Gallery']
    },
    {
      label: 'Collection',
      options: ['All Collections', 'Green Eves Original', 'Premium', 'Classic']
    },
    {
      label: 'Category',
      options: ['All Categories', 'Bold', 'Classic', 'Cultural', 'Destination', 'Floral & Botanical', 'Metallic', 'Modern', 'Rustic', 'Seasonal', 'Textured']
    },
    {
      label: 'Color',
      options: ['All Colors', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Brown', 'Purple', 'Pink', 'Beige', 'Gray', 'Black', 'White', 'Gold', 'Rose Gold', 'Silver']
    }
  ];

  return (
    <section className="py-12 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {filters.map((filter, index) => (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px] justify-between">
                  {filter.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 max-h-64 overflow-y-auto">
                {filter.options.map((option) => (
                  <DropdownMenuItem key={option} className="cursor-pointer">
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          
          <Button variant="outline" className="min-w-[120px]">
            Matching Prints
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;