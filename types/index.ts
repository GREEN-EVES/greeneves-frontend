export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  message: string;
}

export interface WeddingInfo {
  id: string;
  coupleNames: string;
  weddingDate: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  receptionTime?: string;
  receptionLocation?: string;
  ceremonyAddress?: string;
  receptionAddress?: string;
  themeColor?: string;
  tagline?: string;
  story?: string;
  locationCity?: string;
  coverPhotoUrl?: string;
  couplePhoto1Url?: string;
  couplePhoto2Url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  relationship?: string;
  guestType: 'guest' | 'plus_one' | 'child';
  invitedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RSVP {
  id: string;
  guestId: string;
  response: 'attending' | 'not_attending' | 'pending';
  mealPreference?: string;
  dietaryRestrictions?: string;
  plusOnesCount: number;
  message?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  guest?: Guest;
}

export interface WeddingProgress {
  guestManagement: {
    total: number;
    rsvped: number;
    pending: number;
    attending: number;
    notAttending: number;
  };
  vendors: {
    total: number;
    booked: number;
    considering: number;
    contacted: number;
    declined: number;
  };
  budget: {
    total: number;
    spent: number;
    percentage: number;
    remaining: number;
  };
  timeline: {
    total: number;
    completed: number;
    percentage: number;
    upcoming: number;
  };
  overallProgress: number;
  daysUntilWedding: number;
}

export interface PublicWeddingData {
  weddingInfo: WeddingInfo & {
    user: {
      id: string;
      displayName: string;
    };
  };
  countdown: {
    days: number;
    hours: number;
    minutes: number;
  };
}

export interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface TemplateFont {
  heading: string;
  body: string;
  accent?: string;
}

export interface DesignTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  category?: TemplateCategory;
  previewImage: string;
  demoUrl?: string;
  colorSchemes: ColorScheme[];
  fonts: TemplateFont;
  isWeddingSuitable: boolean;
  isBirthdaySuitable: boolean;
  popularityScore: number;
  isPremium: boolean;
  price?: number;
  isActive: boolean;
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingDesign {
  id: string;
  userId: string;
  templateId: string;
  name: string;
  category?: string;
  customStyles?: any;
  createdAt: string;
  updatedAt: string;
  template?: DesignTemplate;
}

export interface GetDesignTemplatesParams {
  categoryId?: string;
  eventType?: 'wedding' | 'birthday';
  search?: string;
  sortBy?: 'popular' | 'newest' | 'name' | 'price-low' | 'price-high';
  page?: number;
  limit?: number;
}

export interface PaymentInitialization {
  paymentId: string;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
}

export interface PaymentVerification {
  paymentId: string;
  subscriptionId: string;
  status: string;
  amount: number;
  paidAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  templateId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  plan?: 'monthly' | 'yearly';
  amount?: number;
  currency?: string;
  purchasedAt: string;
  expiresAt?: string | null;
  template?: DesignTemplate;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  userId: string;
  eventType: 'wedding' | 'birthday';
  eventName: string;
  eventDate: string;
  eventTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueLat?: number;
  venueLng?: number;

  // Wedding-specific fields
  brideName?: string;
  groomName?: string;
  ourStory?: string;
  storyImageUrl?: string;
  bridalTrain?: Array<{
    name: string;
    role: string;
    image: string;
    contact?: string;
  }>;
  groomsmen?: Array<{
    name: string;
    role: string;
    image: string;
    contact?: string;
  }>;

  // Birthday-specific fields
  celebrantName?: string;
  age?: number;
  birthdayMessage?: string;

  // Media
  coverImageUrl?: string;
  galleryImages?: string[];

  // Event schedule
  eventSchedule?: Array<{
    time: string;
    title: string;
    description?: string;
  }>;

  // Template
  selectedTemplateId?: string;
  selectedTemplate?: DesignTemplate;
  customColors?: Record<string, string>;
  templateCustomization?: {
    selectedColorSchemeId?: string;
    customColors?: Record<string, string>;
    customFonts?: { heading?: string; body?: string };
    sectionOrder?: string[];
    hiddenSections?: string[];
    sectionCustomizations?: Record<string, any>;
  };

  // Settings
  rsvpEnabled: boolean;
  contributionsEnabled: boolean;
  contributionGoal?: number;
  calendarIntegration?: boolean;
  dressCode?: string;
  specialInstructions?: string;

  // Status and visibility
  eventStatus: 'draft' | 'published';
  subscriptionStatus?: 'free' | 'paid';
  publicSlug?: string;
  subscriptionExpiresAt?: string;
  paymentReference?: string;

  createdAt: string;
  updatedAt: string;
}