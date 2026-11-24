import React from 'react';
import { TicketDesignId, DesignMetadata, TicketData, BrandingConfig } from '@passforge/shared';

import { TechEmail } from './tech/TechEmail.js';
import { TechPage } from './tech/TechPage.js';
import { TechDocument } from './tech/TechDocument.js';
import { TechCanvas } from './tech/TechCanvas.js';

import { EditorialEmail } from './editorial/EditorialEmail.js';
import { EditorialPage } from './editorial/EditorialPage.js';
import { EditorialDocument } from './editorial/EditorialDocument.js';
import { EditorialCanvas } from './editorial/EditorialCanvas.js';

import { VintageEmail } from './vintage/VintageEmail.js';
import { VintagePage } from './vintage/VintagePage.js';
import { VintageDocument } from './vintage/VintageDocument.js';
import { VintageCanvas } from './vintage/VintageCanvas.js';

import { FestivalEmail } from './festival/FestivalEmail.js';
import { FestivalPage } from './festival/FestivalPage.js';
import { FestivalDocument } from './festival/FestivalDocument.js';
import { FestivalCanvas } from './festival/FestivalCanvas.js';

export interface DesignTemplates {
  email: React.ComponentType<{ ticket: TicketData; branding?: BrandingConfig }>;
  page: React.ComponentType<{ ticket: TicketData; branding?: BrandingConfig }>;
  document: React.ComponentType<{ ticket: TicketData; branding?: BrandingConfig }>;
  canvas: React.ComponentType<{ ticket: TicketData; branding?: BrandingConfig }>;
}

export interface RegisteredDesign {
  metadata: DesignMetadata;
  templates: DesignTemplates;
}

export const DESIGNS_REGISTRY: Record<TicketDesignId, RegisteredDesign> = {
  tech: {
    metadata: {
      id: 'tech',
      name: 'Cyber Tech & Hackathon',
      description: 'Futuristic high-contrast dark theme with cyan neon accents, tech badge stubs, and geometric layout.',
      visualDirection: 'Dark navy background, electric blue/cyan accent, modern typography, geometric details, integrated QR code.',
      category: 'dark-tech',
      defaultAccentColor: '#06b6d4',
      tags: ['Dark Mode', 'Hackathon', 'Developer Conf', 'Cyberpunk', 'Modern'],
    },
    templates: {
      email: TechEmail,
      page: TechPage,
      document: TechDocument,
      canvas: TechCanvas,
    },
  },
  editorial: {
    metadata: {
      id: 'editorial',
      name: 'Premium Editorial & Gala',
      description: 'Sophisticated warm-white parchment with warm terracotta accents, refined serif typography, and elegant admission stubs.',
      visualDirection: 'Warm white/cream background, elegant typography, generous whitespace, restrained terracotta accent, refined dividers.',
      category: 'light-editorial',
      defaultAccentColor: '#b45309',
      tags: ['Light Mode', 'Editorial', 'Executive Gala', 'Conference Pass', 'Classic'],
    },
    templates: {
      email: EditorialEmail,
      page: EditorialPage,
      document: EditorialDocument,
      canvas: EditorialCanvas,
    },
  },
  vintage: {
    metadata: {
      id: 'vintage',
      name: 'Vintage Cinema & Event Stub',
      description: 'Classic notched ticket with authentic perforated tear stubs, retro double-line typography, and vintage admission stamps.',
      visualDirection: 'Warm antique cream background, vintage crimson/kraft accents, perforated dashed borders, vertical Admit One tear stubs.',
      category: 'vintage-retro',
      defaultAccentColor: '#C23B38',
      tags: ['Vintage', 'Cinema', 'Carnival', 'Theater', 'Perforated Stub'],
    },
    templates: {
      email: VintageEmail,
      page: VintagePage,
      document: VintageDocument,
      canvas: VintageCanvas,
    },
  },
  festival: {
    metadata: {
      id: 'festival',
      name: 'Neon Festival & Concert Pass',
      description: 'Modern high-energy concert pass with electric wave separator, prominent [Gate] [Row] [Seat] pill badges, and admission barcode.',
      visualDirection: 'Deep midnight indigo background, electric neon magenta/cyan accents, curved dotted ribbon divider, fast-track stub.',
      category: 'concert-festival',
      defaultAccentColor: '#FF2E93',
      tags: ['Concert', 'Festival', 'Neon', 'Live Music', 'VIP Pass'],
    },
    templates: {
      email: FestivalEmail,
      page: FestivalPage,
      document: FestivalDocument,
      canvas: FestivalCanvas,
    },
  },
};

export function getAllDesigns(): DesignMetadata[] {
  return Object.values(DESIGNS_REGISTRY).map((entry) => entry.metadata);
}

export function getDesign(id: TicketDesignId = 'tech'): RegisteredDesign {
  const design = DESIGNS_REGISTRY[id];
  if (!design) {
    return DESIGNS_REGISTRY['tech'];
  }
  return design;
}

export function getDesignMetadata(id: TicketDesignId = 'tech'): DesignMetadata {
  return getDesign(id).metadata;
}
