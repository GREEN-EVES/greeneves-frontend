import { TemplateMetadata } from './types';
import dynamic from 'next/dynamic';

// Dynamically import template components
// This allows code splitting and lazy loading
const CharlotteTemplate = dynamic(() => import('./weddings/CharlotteTemplate'));
const ModernSimplicityTemplate = dynamic(() => import('./weddings/ModernSimplicityTemplate'));
const EditorialLimeTemplate = dynamic(() => import('./birthdays/EditorialLimeTemplate'));

// Component mapping - maps componentPath to React component
export const TEMPLATE_COMPONENTS = {
  'weddings/CharlotteTemplate': CharlotteTemplate,
  'weddings/ModernSimplicityTemplate': ModernSimplicityTemplate,
  'birthdays/EditorialLimeTemplate': EditorialLimeTemplate,
} as const;

// Template metadata registry
// This should match the templates seeded in the database
export const TEMPLATE_REGISTRY: TemplateMetadata[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Charlotte',
    slug: 'charlotte',
    description: 'Elegant classic design with cream and gold accents, perfect for traditional weddings.',
    eventType: 'WEDDING',
    isPremium: true,
    price: 4999.99,
    previewImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=600&fit=crop',
    componentPath: 'weddings/CharlotteTemplate',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Modern Simplicity',
    slug: 'modern-simplicity',
    description: 'Clean, minimalist design with bold black and white contrast for contemporary weddings.',
    eventType: 'WEDDING',
    isPremium: true,
    price: 3499.99,
    previewImage: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    componentPath: 'weddings/ModernSimplicityTemplate',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'Editorial Lime',
    slug: 'editorial-lime',
    description: 'Bold editorial design with vibrant lime green for energetic birthday celebrations.',
    eventType: 'BIRTHDAY',
    isPremium: false,
    price: 0,
    previewImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    componentPath: 'birthdays/EditorialLimeTemplate',
  },
];

// Helper function to get template component by path
export function getTemplateComponent(componentPath: string) {
  return TEMPLATE_COMPONENTS[componentPath as keyof typeof TEMPLATE_COMPONENTS];
}

// Helper function to get template metadata by slug
export function getTemplateMetadata(slug: string): TemplateMetadata | undefined {
  return TEMPLATE_REGISTRY.find((template) => template.slug === slug);
}
