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
