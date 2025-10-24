'use client';

import React, { createContext, useContext } from 'react';

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text?: string;
}

export interface FontConfig {
  heading: string;
  body: string;
}

interface ThemeContextType {
  colors: ColorScheme;
  fonts: FontConfig;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  colors: ColorScheme;
  fonts: FontConfig;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ colors, fonts, children }) => {
  return (
    <ThemeContext.Provider value={{ colors, fonts }}>
      <div
        style={{
          '--color-primary': colors.primary,
          '--color-secondary': colors.secondary,
          '--color-accent': colors.accent,
          '--color-background': colors.background,
          '--color-text': colors.text || '#333333',
          '--font-heading': fonts.heading,
          '--font-body': fonts.body,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
