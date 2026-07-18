import { Inter, IBM_Plex_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'greek', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

// NOTE: When Clash Display font files are provided, configure next/font/local here.
// For now, we rely on a manual CSS variable setup in globals.css using system fallbacks
// to prevent build errors from missing local font files.
export const clashDisplayVariable = '--font-clash-display';
