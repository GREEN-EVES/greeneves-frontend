import { Event } from './types';

// Dummy wedding data for template previews
export const dummyWeddingData: Event = {
  id: 'preview-wedding-001',
  eventType: 'WEDDING',
  eventName: 'Sarah & Michael Wedding',
  eventDate: '2025-12-20',
  eventTime: '4:00 PM',
  venueName: 'The Grand Ballroom',
  venueAddress: '123 Elegant Street, Victoria Island, Lagos',
  venueLat: 6.4281,
  venueLng: 3.4219,

  // Wedding-specific fields
  brideName: 'Sarah',
  groomName: 'Michael',
  ourStory: `We met on a rainy Tuesday at a coffee shop in Lekki. Michael accidentally grabbed Sarah's latte, and when he returned it with an apologetic smile, Sarah knew there was something special about him.

Three years of adventures later—from midnight beach walks to Sunday brunch traditions—we're ready to start our forever together.

Join us as we celebrate our love story and the beginning of a beautiful new chapter.`,

  // Media
  coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
  storyImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
  galleryImages: [
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1525258876303-f8a1db05939f?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&h=600&fit=crop',
  ],

  bridalTrain: [
    { name: 'Emily Johnson', role: 'Maid of Honor', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop' },
    { name: 'Jessica Williams', role: 'Bridesmaid', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop' },
    { name: 'Amanda Davis', role: 'Bridesmaid', photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop' },
  ],

  groomsmen: [
    { name: 'David Thompson', role: 'Best Man', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop' },
    { name: 'James Miller', role: 'Groomsman', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' },
    { name: 'Robert Anderson', role: 'Groomsman', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop' },
  ],

  // Schedule
  eventSchedule: [
    { time: '3:30 PM', title: 'Guest Arrival', description: 'Please arrive early to find your seats' },
    { time: '4:00 PM', title: 'Ceremony Begins', description: 'Exchange of vows' },
    { time: '5:00 PM', title: 'Cocktail Hour', description: 'Light refreshments and mingling' },
    { time: '6:00 PM', title: 'Reception Dinner', description: 'Three-course meal' },
    { time: '8:00 PM', title: 'First Dance', description: 'Bride and groom first dance' },
    { time: '8:30 PM', title: 'Dancing & Celebration', description: 'Party continues into the night' },
  ],

  // Settings
  rsvpEnabled: true,
  contributionsEnabled: true,
  contributionGoal: 500000,

  publicSlug: 'sarah-michael-wedding',

  template: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Charlotte',
    slug: 'charlotte',
    componentPath: 'weddings/CharlotteTemplate',
  },
};

// Dummy birthday data for template previews
export const dummyBirthdayData: Event = {
  id: 'preview-birthday-001',
  eventType: 'BIRTHDAY',
  eventName: 'Alex Milestone Birthday',
  eventDate: '2025-11-25',
  eventTime: '6:00 PM',
  venueName: 'Skyline Rooftop Lounge',
  venueAddress: '456 Party Avenue, Ikoyi, Lagos',
  venueLat: 6.4541,
  venueLng: 3.4205,

  // Birthday-specific fields
  celebrantName: 'Alex',
  age: 30,
  birthdayMessage: `Three decades of amazing memories, countless adventures, and incredible friendships!

As I step into this new chapter, I want to celebrate with the people who've made my journey so special.

Join me for an unforgettable night of music, dancing, and making new memories together.

Let's make 30 the best year yet!`,

  // Media
  coverImageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=800&fit=crop',
  storyImageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop',
  galleryImages: [
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  ],

  // Schedule
  eventSchedule: [
    { time: '6:00 PM', title: 'Doors Open', description: 'Arrival and welcome drinks' },
    { time: '7:00 PM', title: 'Dinner Served', description: 'Buffet-style dining' },
    { time: '8:00 PM', title: 'Birthday Toast', description: 'Speeches and cake cutting' },
    { time: '9:00 PM', title: 'DJ & Dancing', description: 'Dance floor opens' },
    { time: '11:00 PM', title: 'Late Night Snacks', description: 'Light bites served' },
  ],

  // Settings
  rsvpEnabled: true,
  contributionsEnabled: false,

  publicSlug: 'alex-30th-birthday',

  template: {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'Editorial Lime',
    slug: 'editorial-lime',
    componentPath: 'birthdays/EditorialLimeTemplate',
  },
};

// Helper function to get dummy data by event type
export function getDummyDataByEventType(eventType: 'WEDDING' | 'BIRTHDAY'): Event {
  return eventType === 'WEDDING' ? dummyWeddingData : dummyBirthdayData;
}
