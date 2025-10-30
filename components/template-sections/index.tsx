// Re-export theme provider
export { ThemeProvider, useTheme } from './ThemeProvider';
export type { ColorScheme, FontConfig } from './ThemeProvider';

// Re-export navigation
export { SectionNavigation } from './SectionNavigation';
export type { SectionNavigationProps } from './SectionNavigation';

// Import components
import { HeroSection } from './HeroSection';
import { EventDetailsSection } from './EventDetailsSection';
import { StorySection } from './StorySection';
import { GallerySection } from './GallerySection';
import { RSVPSection } from './RSVPSection';
import { BirthdayWishesSection } from './BirthdayWishesSection';
import { GiftRegistrySection } from './GiftRegistrySection';
import { MusicPlaylistSection } from './MusicPlaylistSection';
import { BridalPartySection } from './BridalPartySection';
import { MapSection } from './MapSection';
import { ContributionsSection } from './ContributionsSection';

// Re-export components
export { HeroSection } from './HeroSection';
export type { HeroSectionProps } from './HeroSection';

export { EventDetailsSection } from './EventDetailsSection';
export type { EventDetailsSectionProps } from './EventDetailsSection';

export { StorySection } from './StorySection';
export type { StorySectionProps } from './StorySection';

export { GallerySection } from './GallerySection';
export type { GallerySectionProps } from './GallerySection';

export { RSVPSection } from './RSVPSection';
export type { RSVPSectionProps } from './RSVPSection';

export { BirthdayWishesSection } from './BirthdayWishesSection';
export type { BirthdayWishesSectionProps } from './BirthdayWishesSection';

export { GiftRegistrySection } from './GiftRegistrySection';
export type { GiftRegistrySectionProps } from './GiftRegistrySection';

export { MusicPlaylistSection } from './MusicPlaylistSection';
export type { MusicPlaylistSectionProps } from './MusicPlaylistSection';

export { BridalPartySection } from './BridalPartySection';
export type { BridalPartySectionProps } from './BridalPartySection';

export { MapSection } from './MapSection';
export type { MapSectionProps } from './MapSection';

export { ContributionsSection } from './ContributionsSection';
export type { ContributionsSectionProps } from './ContributionsSection';

// Component mapping for dynamic rendering
export const SECTION_COMPONENTS = {
  HeroSection: HeroSection,
  EventDetailsSection: EventDetailsSection,
  StorySection: StorySection,
  GallerySection: GallerySection,
  RSVPSection: RSVPSection,
  BirthdayWishesSection: BirthdayWishesSection,
  GiftRegistrySection: GiftRegistrySection,
  MusicPlaylistSection: MusicPlaylistSection,
  BridalPartySection: BridalPartySection,
  MapSection: MapSection,
  ContributionsSection: ContributionsSection,
} as const;

export type SectionComponentName = keyof typeof SECTION_COMPONENTS;
