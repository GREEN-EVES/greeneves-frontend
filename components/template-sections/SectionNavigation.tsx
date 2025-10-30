'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { Menu, X, Heart } from 'lucide-react';

interface Section {
  id: string;
  componentName: string;
  config?: any;
}

export interface SectionNavigationProps {
  sections: Section[];
  event: any;
}

// Map component names to display names and icons
const SECTION_DISPLAY_NAMES: Record<string, string> = {
  HeroSection: 'Home',
  StorySection: 'Our Story',
  EventDetailsSection: 'Details',
  GallerySection: 'Gallery',
  RSVPSection: 'RSVP',
  BridalPartySection: 'Wedding Party',
  MapSection: 'Location',
  ContributionsSection: 'Gifts',
  BirthdayWishesSection: 'Wishes',
  GiftRegistrySection: 'Registry',
  MusicPlaylistSection: 'Music',
};

// Sections that should NOT appear in navigation (hero is the home position)
const NON_NAVIGABLE_SECTIONS = [
  'HeroSection',
];

export const SectionNavigation: React.FC<SectionNavigationProps> = ({ sections, event }) => {
  const { colors, fonts } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Get display name for event (check both direct fields and details object)
  const brideName = event.brideName || event.details?.brideName;
  const groomName = event.groomName || event.details?.groomName;
  const celebrantName = event.celebrantName || event.details?.celebrantName;

  const eventDisplayName = event.eventType === 'birthday'
    ? celebrantName || event.eventName
    : brideName && groomName
    ? `${brideName} & ${groomName}`
    : event.eventName;

  // Filter sections to exclude non-navigable ones (like HeroSection)
  // This ensures only sections that actually exist in the template are shown
  const filteredSections = sections.filter((section) =>
    !NON_NAVIGABLE_SECTIONS.includes(section.componentName)
  );

  // Deduplicate sections by componentName to avoid showing duplicates in nav
  // (e.g., if template has two BridalPartySections, only show "Wedding Party" once)
  const seenComponents = new Set<string>();
  const navSections = filteredSections.filter((section) => {
    if (seenComponents.has(section.componentName)) {
      return false;
    }
    seenComponents.add(section.componentName);
    return true;
  });

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScrollSpy = () => {
      const sectionElements = navSections.map((section) =>
        document.getElementById(`section-${section.id}`)
      );

      const currentSection = sectionElements.find((el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        const sectionId = currentSection.id.replace('section-', '');
        setActiveSection(sectionId);
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [navSections]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const offset = 80; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setIsMobileMenuOpen(false);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isScrolled
            ? `${colors.background}ee`
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: isScrolled ? `1px solid ${colors.primary}20` : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Event Name */}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Heart
                className="w-5 h-5"
                style={{
                  color: isScrolled ? colors.primary : '#fff',
                  filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))'
                }}
              />
              <span
                className="text-lg font-semibold hidden sm:inline"
                style={{
                  fontFamily: fonts.heading,
                  color: isScrolled ? colors.primary : '#fff',
                  textShadow: isScrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.8)',
                }}
              >
                {eventDisplayName}
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-sm font-medium hover:opacity-70 transition-opacity relative"
                  style={{
                    fontFamily: fonts.body,
                    color: isScrolled ? colors.text || '#333' : '#fff',
                    textShadow: isScrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.8)',
                  }}
                >
                  {SECTION_DISPLAY_NAMES[section.componentName] || section.componentName}
                  {activeSection === section.id && (
                    <div
                      className="absolute -bottom-1 left-0 right-0 h-0.5"
                      style={{ backgroundColor: colors.accent }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X
                  className="w-6 h-6"
                  style={{
                    color: isScrolled ? colors.primary : '#fff',
                    filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))'
                  }}
                />
              ) : (
                <Menu
                  className="w-6 h-6"
                  style={{
                    color: isScrolled ? colors.primary : '#fff',
                    filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))'
                  }}
                />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: `${colors.background}f8` }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <button
              onClick={scrollToTop}
              className="text-2xl font-semibold mb-4"
              style={{
                fontFamily: fonts.heading,
                color: colors.primary,
              }}
            >
              {eventDisplayName}
            </button>

            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-xl font-medium hover:opacity-70 transition-opacity"
                style={{
                  fontFamily: fonts.body,
                  color: colors.text || '#333',
                }}
              >
                {SECTION_DISPLAY_NAMES[section.componentName] || section.componentName}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
