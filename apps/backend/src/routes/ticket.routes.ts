import { Router, Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { ticketService } from '../modules/ticket/ticket.service.js';
import { attendeeService } from '../modules/attendee/attendee.service.js';
import { ticketRenderer } from '../services/rendering/ticketRenderer.service.js';
import { runFullVerification } from '../cli/verifyAll.js';
import { OUTPUT_DIR } from '../config/constants.js';
import {
  OutputFormat,
  ticketPreviewRequestSchema,
  TicketPreviewResponse,
  TicketDesignId,
  BrandingConfig,
} from '@passforge/shared';
import { designService } from '../modules/design/design.service.js';

const router = Router();

// State cache
let lastRenderResults: Record<string, any> = {};

// POST /api/tickets/preview (and /api/preview)
router.post('/preview', async (req: Request, res: Response) => {
  try {
    const parseResult = ticketPreviewRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid preview request payload',
        details: parseResult.error.format(),
      });
    }

    const { attendeeId, attendee: attendeeInput, designId, branding: brandingInput, format } = parseResult.data;

    // Resolve attendee
    let attendee = attendeeInput;
    if (!attendee && attendeeId === 'test-long-name') {
      attendee = {
        name: 'Prof. Dr. Alexandrina Montgomery-Fitzgerald III',
        email: 'alexandrina.montgomery.fitzgerald.iii@longdomainexample.org',
        ticketType: 'VIP DELEGATE',
        seat: 'SECTION-A-ROW-02-SEAT-104',
      };
    } else if (!attendee && attendeeId === 'test-open-seating') {
      attendee = {
        name: 'Priya Sundaram',
        email: 'priya@example.com',
        ticketType: 'General',
        seat: '',
      };
    } else if (!attendee && attendeeId) {
      attendee = attendeeService.getAttendeeById(attendeeId);
    }
    if (!attendee) {
      const attendees = attendeeService.getAllAttendees();
      attendee = attendees.length > 0 ? attendees[0] : undefined;
    }

    const ticket = await ticketService.createTicketData(attendee);

    // Resolve design and branding
    const currentConfig = designService.getCurrentConfig();
    const effectiveDesignId: TicketDesignId = designId || currentConfig.designId;
    const effectiveBranding: BrandingConfig = {
      ...currentConfig.branding,
      ...(brandingInput || {}),
    };

    const renderOpts = {
      designId: effectiveDesignId,
      branding: effectiveBranding,
    };

    const responsePayload: TicketPreviewResponse = {
      success: true,
      designId: effectiveDesignId,
      branding: effectiveBranding,
      ticket,
      results: {},
    };

    if (format === 'all') {
      const results = await ticketRenderer.renderAll(ticket, OUTPUT_DIR, renderOpts);
      lastRenderResults = results;
      responsePayload.results = results;

      // Also attach in-memory base64 previews for fast UI rendering
      const pngPath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}.png`);
      let pngDataUrl: string | undefined;
      if (fs.existsSync(pngPath)) {
        const pngBuf = fs.readFileSync(pngPath);
        pngDataUrl = `data:image/png;base64,${pngBuf.toString('base64')}`;
      }

      const emailPath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}-email.html`);
      const emailHtml = fs.existsSync(emailPath) ? fs.readFileSync(emailPath, 'utf-8') : undefined;

      const pagePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}-web.html`);
      const pageHtml = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : undefined;

      return res.json({
        ...responsePayload,
        previews: {
          pngDataUrl,
          emailHtml,
          pageHtml,
          pdfUrl: `/api/preview/pdf?ticketId=${ticket.ticketId}`,
        },
      });
    }

    if (format === 'email') {
      const { html, diagnostics } = await ticketRenderer.renderEmail(ticket, renderOpts);
      const filePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}-email.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      const result = {
        format: 'email' as OutputFormat,
        success: true,
        outputPath: filePath,
        html,
        sizeBytes: Buffer.byteLength(html),
        diagnostics,
      };
      return res.json({
        ...responsePayload,
        result,
        html,
      });
    }

    if (format === 'page') {
      const { html, diagnostics } = await ticketRenderer.renderPage(ticket, renderOpts);
      const filePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}-web.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      const result = {
        format: 'page' as OutputFormat,
        success: true,
        outputPath: filePath,
        html,
        sizeBytes: Buffer.byteLength(html),
        diagnostics,
      };
      return res.json({
        ...responsePayload,
        result,
        html,
      });
    }

    if (format === 'pdf') {
      const { pdf, diagnostics } = await ticketRenderer.renderPdf(ticket, renderOpts);
      const filePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}.pdf`);
      fs.writeFileSync(filePath, Buffer.from(pdf));
      const pdfBase64 = Buffer.from(pdf).toString('base64');
      const result = {
        format: 'pdf' as OutputFormat,
        success: true,
        outputPath: filePath,
        sizeBytes: pdf.length,
        diagnostics,
      };
      return res.json({
        ...responsePayload,
        result,
        pdfBase64,
        pdfUrl: `/api/preview/pdf?ticketId=${ticket.ticketId}`,
      });
    }

    if (format === 'png') {
      const { image, diagnostics } = await ticketRenderer.renderCanvas(ticket, renderOpts);
      const filePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}.png`);
      fs.writeFileSync(filePath, Buffer.from(image));
      const pngBase64 = Buffer.from(image).toString('base64');
      const pngDataUrl = `data:image/png;base64,${pngBase64}`;
      const result = {
        format: 'png' as OutputFormat,
        success: true,
        outputPath: filePath,
        sizeBytes: image.length,
        diagnostics,
      };
      return res.json({
        ...responsePayload,
        result,
        pngDataUrl,
      });
    }

    return res.status(400).json({ success: false, error: `Invalid format '${format}'` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ticket-data
router.get('/ticket-data', async (_req: Request, res: Response) => {
  try {
    const ticket = await ticketService.createTicketData();
    if (Object.keys(lastRenderResults).length === 0) {
      lastRenderResults = await ticketRenderer.renderAll(ticket, OUTPUT_DIR);
    }
    res.json({
      success: true,
      ticket,
      results: lastRenderResults,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/generate/:format
router.post('/generate/:format', async (req: Request, res: Response) => {
  const format = req.params.format as OutputFormat | 'all';
  const attendeeId = req.query.attendeeId as string | undefined;

  try {
    const ticket = attendeeId
      ? (await ticketService.getTicketForAttendee(attendeeId)) || (await ticketService.createTicketData())
      : await ticketService.createTicketData();

    if (format === 'all') {
      lastRenderResults = await ticketRenderer.renderAll(ticket, OUTPUT_DIR);
      return res.json({ success: true, results: lastRenderResults, ticket });
    }

    if (format === 'email') {
      const start = performance.now();
      const { html, diagnostics } = await ticketRenderer.renderEmail(ticket);
      const filePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}-email.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      lastRenderResults.email = {
        format: 'email',
        success: true,
        outputPath: filePath,
        sizeBytes: Buffer.byteLength(html),
        renderTimeMs: Math.round(performance.now() - start),
        diagnostics,
      };
      return res.json({ success: true, result: lastRenderResults.email, ticket });
    }

    if (format === 'page') {
      const start = performance.now();
      const { html, diagnostics } = await ticketRenderer.renderPage(ticket);
      const filePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}-web.html`);
      fs.writeFileSync(filePath, html, 'utf-8');
      lastRenderResults.page = {
        format: 'page',
        success: true,
        outputPath: filePath,
        sizeBytes: Buffer.byteLength(html),
        renderTimeMs: Math.round(performance.now() - start),
        diagnostics,
      };
      return res.json({ success: true, result: lastRenderResults.page, ticket });
    }

    if (format === 'pdf') {
      const start = performance.now();
      const { pdf, diagnostics } = await ticketRenderer.renderPdf(ticket);
      const filePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}.pdf`);
      fs.writeFileSync(filePath, Buffer.from(pdf));
      lastRenderResults.pdf = {
        format: 'pdf',
        success: true,
        outputPath: filePath,
        sizeBytes: pdf.length,
        renderTimeMs: Math.round(performance.now() - start),
        diagnostics,
      };
      return res.json({ success: true, result: lastRenderResults.pdf, ticket });
    }

    if (format === 'png') {
      const start = performance.now();
      const { image, diagnostics } = await ticketRenderer.renderCanvas(ticket);
      const filePath = path.join(OUTPUT_DIR, `ticket-${ticket.ticketId}.png`);
      fs.writeFileSync(filePath, Buffer.from(image));
      lastRenderResults.png = {
        format: 'png',
        success: true,
        outputPath: filePath,
        sizeBytes: image.length,
        renderTimeMs: Math.round(performance.now() - start),
        diagnostics,
      };
      return res.json({ success: true, result: lastRenderResults.png, ticket });
    }

    return res.status(400).json({ success: false, error: `Unknown format: ${format}` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/preview/:format
router.get('/preview/:format', async (req: Request, res: Response) => {
  const format = req.params.format;
  const ticketId = (req.query.ticketId as string) || 'KTF27-VIP-84920';

  const fileMap: Record<string, { file: string; type: string }> = {
    email: { file: `ticket-${ticketId}-email.html`, type: 'text/html; charset=utf-8' },
    page: { file: `ticket-${ticketId}-web.html`, type: 'text/html; charset=utf-8' },
    pdf: { file: `ticket-${ticketId}.pdf`, type: 'application/pdf' },
    png: { file: `ticket-${ticketId}.png`, type: 'image/png' },
  };

  const info = fileMap[format];
  if (!info) return res.status(400).send('Invalid format');

  let filePath = path.join(OUTPUT_DIR, info.file);

  // Fallback to default sample output if specific ticketId not rendered yet
  if (!fs.existsSync(filePath)) {
    const defaultFile = info.file.replace(ticketId, 'KTF27-VIP-84920');
    filePath = path.join(OUTPUT_DIR, defaultFile);
  }

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', info.type);
    return res.sendFile(filePath);
  }

  return res.status(404).send('File not found. Please generate it first.');
});

// GET /api/download/:format
router.get('/download/:format', async (req: Request, res: Response) => {
  const format = req.params.format;
  const ticketId = (req.query.ticketId as string) || 'KTF27-VIP-84920';

  const fileMap: Record<string, string> = {
    email: `ticket-${ticketId}-email.html`,
    page: `ticket-${ticketId}-web.html`,
    pdf: `ticket-${ticketId}.pdf`,
    png: `ticket-${ticketId}.png`,
  };

  const fileName = fileMap[format];
  if (!fileName) return res.status(400).send('Invalid format');

  let filePath = path.join(OUTPUT_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    const defaultFile = fileName.replace(ticketId, 'KTF27-VIP-84920');
    filePath = path.join(OUTPUT_DIR, defaultFile);
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File has not been generated yet.');
  }

  res.download(filePath, fileName);
});

// POST /api/test-long-name
router.post('/test-long-name', async (_req: Request, res: Response) => {
  try {
    const longTicket = await ticketService.createTicketData(
      {
        name: 'Prof. Dr. Alexandrina Montgomery-Fitzgerald III',
        email: 'alexandrina.montgomery.fitzgerald.iii@longdomainexample.org',
        ticketType: 'VIP DELEGATE',
        seat: 'SECTION-A-ROW-02-SEAT-104',
      },
      'KTF27-VIP-LONGNAME'
    );
    const results = await ticketRenderer.renderAll(longTicket, OUTPUT_DIR);
    return res.json({ success: true, results, ticket: longTicket });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/verify
router.get('/verify', async (_req: Request, res: Response) => {
  try {
    const suiteResult = await runFullVerification();
    res.json(suiteResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
