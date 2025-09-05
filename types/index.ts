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