import { TicketDesignId, DesignMetadata, DesignConfig, BrandingConfig } from '@passforge/shared';
import { getAllDesigns, getDesignMetadata, DESIGNS_REGISTRY } from '../../templates/designs/registry.js';

export class DesignService {
  private currentConfig: DesignConfig = {
    designId: 'tech',
    branding: {
      accentColor: '#06b6d4',
      showOrganizer: true,
    },
    updatedAt: new Date().toISOString(),
  };

  private logoBuffer: Buffer | null = null;

  getAllDesigns(): DesignMetadata[] {
    return getAllDesigns();
  }

  getDesignById(designId: TicketDesignId): DesignMetadata | null {
    const registered = DESIGNS_REGISTRY[designId];
    return registered ? registered.metadata : null;
  }

  getCurrentConfig(): DesignConfig {
    return { ...this.currentConfig };
  }

  getLogoBuffer(): Buffer | null {
    return this.logoBuffer;
  }

  updateConfig(updates: Partial<DesignConfig>): DesignConfig {
    if (updates.designId && updates.designId !== this.currentConfig.designId) {
      this.currentConfig.designId = updates.designId;
      // If no custom accent color provided, set default for that design
      if (!updates.branding?.accentColor) {
        const meta = getDesignMetadata(updates.designId);
        this.currentConfig.branding.accentColor = meta.defaultAccentColor;
      }
    }

    if (updates.branding) {
      this.currentConfig.branding = {
        ...this.currentConfig.branding,
        ...updates.branding,
      };
    }

    this.currentConfig.updatedAt = new Date().toISOString();
    return this.getCurrentConfig();
  }

  setLogo(dataUrl: string, buffer?: Buffer): DesignConfig {
    this.currentConfig.branding.logoUrl = dataUrl;
    if (buffer) {
      this.logoBuffer = buffer;
    } else if (dataUrl.startsWith('data:image/')) {
      const base64Data = dataUrl.split(',')[1];
      if (base64Data) {
        this.logoBuffer = Buffer.from(base64Data, 'base64');
      }
    }
    this.currentConfig.updatedAt = new Date().toISOString();
    return this.getCurrentConfig();
  }

  resetBranding(): DesignConfig {
    const meta = getDesignMetadata(this.currentConfig.designId);
    this.currentConfig.branding = {
      accentColor: meta.defaultAccentColor,
      showOrganizer: true,
      logoUrl: undefined,
    };
    this.logoBuffer = null;
    this.currentConfig.updatedAt = new Date().toISOString();
    return this.getCurrentConfig();
  }
}

export const designService = new DesignService();
