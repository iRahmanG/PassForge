import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { render } from '@hyper-elements/react';
import { renderPdf } from '@hyper-elements/react/pdf';
import { renderImage } from '@hyper-elements/react/image';
import { TicketData, RenderResult, OutputFormat, TicketDesignId, BrandingConfig } from '@passforge/shared';

import { getDesign } from '../../templates/designs/registry.js';
import { designService } from '../../modules/design/design.service.js';
import { FONTS_DIR, OUTPUT_DIR } from '../../config/constants.js';

let cachedRegularFont: Buffer | null = null;
let cachedBoldFont: Buffer | null = null;

function getFonts() {
  if (!cachedRegularFont) {
    const regularPath = path.join(FONTS_DIR, 'arial.ttf');
    cachedRegularFont = fs.readFileSync(regularPath);
  }
  if (!cachedBoldFont) {
    const boldPath = path.join(FONTS_DIR, 'arialbd.ttf');
    cachedBoldFont = fs.readFileSync(boldPath);
  }
  return {
    regular: cachedRegularFont,
    bold: cachedBoldFont,
  };
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

  private resolveImages(ticket: TicketData, branding?: BrandingConfig): Record<string, Uint8Array | Buffer> | undefined {
    const images: Record<string, Uint8Array | Buffer> = {};

    if (ticket.qrBuffer) {
      images[ticket.qrCodeDataUrl] = ticket.qrBuffer;
    }

    const logoBuffer = branding?.logoBuffer || designService.getLogoBuffer();
    if (logoBuffer && branding?.logoUrl) {
      images[branding.logoUrl] = logoBuffer;
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
    const { templates } = getDesign(designId);

    const element = React.createElement(templates.email, { ticket, branding });
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
    const { templates } = getDesign(designId);

    const element = React.createElement(templates.page, { ticket, branding });
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
    const { templates } = getDesign(designId);
    const images = this.resolveImages(ticket, branding);

    const element = React.createElement(templates.document, { ticket, branding });
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
    const { templates } = getDesign(designId);
    const images = this.resolveImages(ticket, branding);

    const element = React.createElement(templates.canvas, { ticket, branding });
    const { image, width, height, diagnostics } = await renderImage(element, {
      format: 'png',
      scale: 2, // 2x retina output
      fonts: [
        { family: 'Arial', src: fonts.regular, weight: 400 },
        { family: 'Arial', src: fonts.bold, weight: 700 },
      ],
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
