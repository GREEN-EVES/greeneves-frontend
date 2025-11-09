// TypeScript types for event templates

export interface EventTemplateProps {
  event: Event;
}

export interface Event {
  // Basic Info
  id: string;
  eventType: 'WEDDING' | 'BIRTHDAY';
  eventName: string;
  eventDate: string;
  eventTime: string;

  // Venue
  venueName: string;
  venueAddress: string;
  venueLat?: number;
  venueLng?: number;

  // Media
  coverImageUrl?: string;
  storyImageUrl?: string;
  galleryImages?: string[];

  // Wedding-Specific Fields
  brideName?: string;
  groomName?: string;
  ourStory?: string;
  bridalTrain?: Array<{
    name: string;
    role: string;
    photo?: string;
  }>;
  groomsmen?: Array<{
    name: string;
    role: string;
    photo?: string;
  }>;

  // Birthday-Specific Fields
  celebrantName?: string;
  age?: number;
  birthdayMessage?: string;

  // Schedule
  eventSchedule?: Array<{
    time: string;
    title: string;
    description?: string;
  }>;

  // Settings
  rsvpEnabled: boolean;
  contributionsEnabled: boolean;
  contributionGoal?: number;

  // Public
  publicSlug: string;

  // Template Info
  template?: {
    id: string;
    name: string;
    slug: string;
    componentPath: string;
  };
}

export interface TemplateMetadata {
  id: string;
  name: string;
  slug: string;
  description: string;
  eventType: 'WEDDING' | 'BIRTHDAY';
  isPremium: boolean;
  price: number;
  previewImage: string;
  componentPath: string;
}
