import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { render } from '@hyper-elements/react';
import { renderPdf } from '@hyper-elements/react/pdf';
import { renderImage } from '@hyper-elements/react/image';
import { Resvg } from '@resvg/resvg-js';
import { TicketData, RenderResult, OutputFormat, TicketDesignId, BrandingConfig } from '@passforge/shared';

import { getDesign } from '../../templates/designs/registry.js';
import { designService } from '../../modules/design/design.service.js';
import { FONTS_DIR, OUTPUT_DIR } from '../../config/constants.js';

interface FontDefinition {
  family: string;
  src: Buffer;
  weight?: 400 | 700;
}

let cachedFonts: FontDefinition[] | null = null;

function getFonts(): FontDefinition[] {
  if (cachedFonts) return cachedFonts;

  const fontFiles = [
    { family: 'Arial', file: 'arial.ttf', weight: 400 as const },
    { family: 'Arial', file: 'arialbd.ttf', weight: 700 as const },
    { family: 'Georgia', file: 'georgia.ttf', weight: 400 as const },
    { family: 'Georgia', file: 'georgiab.ttf', weight: 700 as const },
    { family: 'Courier New', file: 'cour.ttf', weight: 400 as const },
    { family: 'Courier New', file: 'courbd.ttf', weight: 700 as const },
    { family: 'Courier', file: 'cour.ttf', weight: 400 as const },
    { family: 'Courier', file: 'courbd.ttf', weight: 700 as const },
    { family: 'Trebuchet MS', file: 'trebuc.ttf', weight: 400 as const },
    { family: 'Trebuchet MS', file: 'trebucbd.ttf', weight: 700 as const },
    { family: 'Times New Roman', file: 'times.ttf', weight: 400 as const },
    { family: 'Times New Roman', file: 'timesbd.ttf', weight: 700 as const },
    { family: 'Times', file: 'times.ttf', weight: 400 as const },
    { family: 'Times', file: 'timesbd.ttf', weight: 700 as const },
  ];

  const loaded: FontDefinition[] = [];
  for (const item of fontFiles) {
    const fontPath = path.join(FONTS_DIR, item.file);
    if (fs.existsSync(fontPath)) {
      try {
        const buf = fs.readFileSync(fontPath);
        loaded.push({ family: item.family, src: buf, weight: item.weight });
      } catch (e) {
        console.warn(`Could not load font ${item.file}:`, e);
      }
    }
  }

  cachedFonts = loaded;
  return loaded;
}

export interface RenderOptions {
  designId?: TicketDesignId;
  branding?: BrandingConfig;
}

export class TicketRendererService {
  private resolveOptions(options?: RenderOptions): { designId: TicketDesignId; branding: BrandingConfig } {
    const current = designService.getCurrentConfig();
    const designId = options?.designId || current.designId;
    const branding: BrandingConfig = {
      ...current.branding,
      ...(options?.branding || {}),
    };
    return { designId, branding };
  }

  private generateWatermark(
    branding: BrandingConfig | undefined,
    width: number,
    height: number
  ): { buffer: Buffer; dataUrl: string } | undefined {
    // If explicitly disabled, suppress watermark
    if (branding?.watermark?.enabled === false) return undefined;

    let logoBuffer = branding?.logoBuffer || designService.getLogoBuffer();
    if (!logoBuffer && branding?.logoUrl && branding.logoUrl.startsWith('data:image/')) {
      const commaIdx = branding.logoUrl.indexOf(',');
      if (commaIdx !== -1) {
        try {
          logoBuffer = Buffer.from(branding.logoUrl.substring(commaIdx + 1), 'base64');
        } catch (e) {
          console.warn('Failed to parse logo buffer from dataUrl:', e);
        }
      }
    }

    if (!logoBuffer && !branding?.logoUrl) return undefined;

    const opacity = typeof branding?.watermark?.opacity === 'number' ? branding.watermark.opacity : 0.08;
    const sizePercent = typeof branding?.watermark?.size === 'number' ? branding.watermark.size : 40;

    let effectiveUrl = branding.logoUrl;
    if (!effectiveUrl || !effectiveUrl.startsWith('data:')) {
      if (!logoBuffer) return undefined;
      const isSvg = logoBuffer.toString('utf8').includes('<svg');
      const mime = isSvg ? 'image/svg+xml' : 'image/png';
      effectiveUrl = `data:${mime};base64,${logoBuffer.toString('base64')}`;
    }

    const logoTargetWidth = Math.round((width * sizePercent) / 100);
    const logoTargetHeight = Math.round(height * 0.75);
    const x = Math.round((width - logoTargetWidth) / 2);
    const y = Math.round((height - logoTargetHeight) / 2);

    const wrapperSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <image href="${effectiveUrl}" x="${x}" y="${y}" width="${logoTargetWidth}" height="${logoTargetHeight}" preserveAspectRatio="xMidYMid meet" opacity="${opacity}" />
    </svg>`;

    try {
      const resvg = new Resvg(wrapperSvg);
      const pngBuffer = Buffer.from(resvg.render().asPng());
      const dataUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;
      return { buffer: pngBuffer, dataUrl };
    } catch (err) {
      console.warn('Failed to render watermark SVG to PNG:', err);
      return undefined;
    }
  }

  private resolveImages(
    ticket: TicketData,
    branding?: BrandingConfig,
    watermark?: { buffer: Buffer; dataUrl: string }
  ): Record<string, Uint8Array | Buffer> | undefined {
    const images: Record<string, Uint8Array | Buffer> = {};

    if (ticket.qrBuffer) {
      images[ticket.qrCodeDataUrl] = ticket.qrBuffer;
    }

    let logoBuffer = branding?.logoBuffer || designService.getLogoBuffer();
    if (!logoBuffer && branding?.logoUrl && branding.logoUrl.startsWith('data:image/')) {
      const commaIdx = branding.logoUrl.indexOf(',');
      if (commaIdx !== -1) {
        try {
          logoBuffer = Buffer.from(branding.logoUrl.substring(commaIdx + 1), 'base64');
        } catch (e) {
          console.warn('Failed to parse logo buffer from dataUrl:', e);
        }
      }
    }

    if (logoBuffer && branding?.logoUrl) {
      images[branding.logoUrl] = logoBuffer;
    }

    if (watermark) {
      images[watermark.dataUrl] = watermark.buffer;
    }

    return Object.keys(images).length > 0 ? images : undefined;
  }

  /**
   * Render personalized confirmation email HTML using Hyper Elements <Email> and render()
   */
  async renderEmail(
    ticket: TicketData,
    options?: RenderOptions
  ): Promise<{ html: string; text: string; diagnostics: any[] }> {
    const { designId, branding } = this.resolveOptions(options);
    const watermark = this.generateWatermark(branding, 600, 440);
    const effectiveBranding: BrandingConfig = {
      ...branding,
      watermarkUrl: watermark?.dataUrl,
    };
    const { templates } = getDesign(designId);

    const element = React.createElement(templates.email, { ticket, branding: effectiveBranding });
    const { html, text, diagnostics } = await render(element);
    return { html, text, diagnostics };
  }

  /**
   * Render responsive digital web ticket HTML using Hyper Elements <Page> and render()
   */
  async renderPage(
    ticket: TicketData,
    options?: RenderOptions
  ): Promise<{ html: string; text: string; diagnostics: any[] }> {
    const { designId, branding } = this.resolveOptions(options);
    const watermark = this.generateWatermark(branding, 620, 480);
    const effectiveBranding: BrandingConfig = {
      ...branding,
      watermarkUrl: watermark?.dataUrl,
    };
    const { templates } = getDesign(designId);

    const element = React.createElement(templates.page, { ticket, branding: effectiveBranding });
    const { html, text, diagnostics } = await render(element);
    return { html, text, diagnostics };
  }

  /**
   * Render printable ticket PDF using Hyper Elements <Document> and renderPdf()
   */
  async renderPdf(
    ticket: TicketData,
    options?: RenderOptions
  ): Promise<{ pdf: Uint8Array; diagnostics: any[] }> {
    const { designId, branding } = this.resolveOptions(options);
    const watermark = this.generateWatermark(branding, 520, 320);
    const effectiveBranding: BrandingConfig = {
      ...branding,
      watermarkUrl: watermark?.dataUrl,
    };
    const { templates } = getDesign(designId);
    const images = this.resolveImages(ticket, effectiveBranding, watermark);

    const element = React.createElement(templates.document, { ticket, branding: effectiveBranding });
    const { pdf, diagnostics } = await renderPdf(element, { images });
    return { pdf, diagnostics };
  }

  /**
   * Render ticket PNG image using Hyper Elements <Canvas> and renderImage()
   */
  async renderCanvas(
    ticket: TicketData,
    options?: RenderOptions
  ): Promise<{ image: Uint8Array; width: number; height: number; diagnostics: any[] }> {
    const fonts = getFonts();
    const { designId, branding } = this.resolveOptions(options);
    const watermark = this.generateWatermark(branding, 960, 380);
    const effectiveBranding: BrandingConfig = {
      ...branding,
      watermarkUrl: watermark?.dataUrl,
    };
    const { templates } = getDesign(designId);
    const images = this.resolveImages(ticket, effectiveBranding, watermark);

    const element = React.createElement(templates.canvas, { ticket, branding: effectiveBranding });
    const { image, width, height, diagnostics } = await renderImage(element, {
      format: 'png',
      scale: 2, // 2x retina output
      fonts,
      images,
    });
    return { image, width, height, diagnostics };
  }

  /**
   * Render all 4 formats and save outputs to designated directory
   */
  async renderAll(
    ticket: TicketData,
    outputDir = OUTPUT_DIR,
    options?: RenderOptions
  ): Promise<Record<OutputFormat, RenderResult>> {
    fs.mkdirSync(outputDir, { recursive: true });
    const results: Partial<Record<OutputFormat, RenderResult>> = {};

    // 1. Email HTML
    const emailStart = performance.now();
    try {
      const { html, diagnostics } = await this.renderEmail(ticket, options);
      const emailPath = path.join(outputDir, `ticket-${ticket.ticketId}-email.html`);
      fs.writeFileSync(emailPath, html, 'utf-8');
      results.email = {
        format: 'email',
        success: true,
        outputPath: emailPath,
        contentType: 'text/html',
        sizeBytes: Buffer.byteLength(html, 'utf-8'),
        renderTimeMs: Math.round(performance.now() - emailStart),
        diagnostics,
      };
    } catch (err: any) {
      results.email = {
        format: 'email',
        success: false,
        contentType: 'text/html',
        sizeBytes: 0,
        renderTimeMs: Math.round(performance.now() - emailStart),
        error: err.message,
      };
    }

    // 2. Responsive Page HTML
    const pageStart = performance.now();
    try {
      const { html, diagnostics } = await this.renderPage(ticket, options);
      const pagePath = path.join(outputDir, `ticket-${ticket.ticketId}-web.html`);
      fs.writeFileSync(pagePath, html, 'utf-8');
      results.page = {
        format: 'page',
        success: true,
        outputPath: pagePath,
        contentType: 'text/html',
        sizeBytes: Buffer.byteLength(html, 'utf-8'),
        renderTimeMs: Math.round(performance.now() - pageStart),
        diagnostics,
      };
    } catch (err: any) {
      results.page = {
        format: 'page',
        success: false,
        contentType: 'text/html',
        sizeBytes: 0,
        renderTimeMs: Math.round(performance.now() - pageStart),
        error: err.message,
      };
    }

    // 3. Document PDF
    const pdfStart = performance.now();
    try {
      const { pdf, diagnostics } = await this.renderPdf(ticket, options);
      const pdfPath = path.join(outputDir, `ticket-${ticket.ticketId}.pdf`);
      fs.writeFileSync(pdfPath, Buffer.from(pdf));
      results.pdf = {
        format: 'pdf',
        success: true,
        outputPath: pdfPath,
        contentType: 'application/pdf',
        sizeBytes: pdf.length,
        renderTimeMs: Math.round(performance.now() - pdfStart),
        diagnostics,
      };
    } catch (err: any) {
      results.pdf = {
        format: 'pdf',
        success: false,
        contentType: 'application/pdf',
        sizeBytes: 0,
        renderTimeMs: Math.round(performance.now() - pdfStart),
        error: err.message,
      };
    }

    // 4. Canvas PNG
    const pngStart = performance.now();
    try {
      const { image, width, height, diagnostics } = await this.renderCanvas(ticket, options);
      const pngPath = path.join(outputDir, `ticket-${ticket.ticketId}.png`);
      fs.writeFileSync(pngPath, Buffer.from(image));
      results.png = {
        format: 'png',
        success: true,
        outputPath: pngPath,
        contentType: 'image/png',
        sizeBytes: image.length,
        renderTimeMs: Math.round(performance.now() - pngStart),
        diagnostics,
      };
    } catch (err: any) {
      results.png = {
        format: 'png',
        success: false,
        contentType: 'image/png',
        sizeBytes: 0,
        renderTimeMs: Math.round(performance.now() - pngStart),
        error: err.message,
      };
    }

    return results as Record<OutputFormat, RenderResult>;
  }
}

export const ticketRenderer = new TicketRendererService();
