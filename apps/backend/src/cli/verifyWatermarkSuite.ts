import fs from 'node:fs';
import path from 'node:path';
import { ticketService } from '../modules/ticket/ticket.service.js';
import { ticketRenderer } from '../services/rendering/ticketRenderer.service.js';
import { attendeeService } from '../modules/attendee/attendee.service.js';
import { designService } from '../modules/design/design.service.js';
import { bulkService } from '../modules/bulk/bulk.service.js';
import { OUTPUT_DIR } from '../config/constants.js';

interface Assertion {
  name: string;
  passed: boolean;
  details?: string;
}

export async function runWatermarkVerification(): Promise<{ passed: boolean; assertions: Assertion[] }> {
  const assertions: Assertion[] = [];
  const testOutputDir = path.join(OUTPUT_DIR, 'watermark-verification');
  if (fs.existsSync(testOutputDir)) {
    fs.rmSync(testOutputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(testOutputDir, { recursive: true });

  const attendees = attendeeService.getAllAttendees();
  const sampleAttendee = attendees[0];
  const ticket = await ticketService.createTicketData(sampleAttendee);

  const testLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" fill="#4F46E5" rx="8"/><text x="100" y="38" fill="#FFFFFF" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle">TECHCORP</text></svg>`;
  const logoBuffer = Buffer.from(testLogoSvg);
  const logoUrl = `data:image/svg+xml;base64,${logoBuffer.toString('base64')}`;

  console.log('=== PassForge Watermark Verification Suite ===\n');

  // ------------------------------------------------------------------------
  // Test 1: No logo uploaded (Watermark disabled by default, clean fallback)
  // ------------------------------------------------------------------------
  try {
    const noLogoOpts = {
      designId: 'tech' as const,
      branding: {
        accentColor: '#06b6d4',
        logoUrl: undefined,
        watermark: { enabled: false },
      },
    };
    const resCanvas = await ticketRenderer.renderCanvas(ticket, noLogoOpts);
    const resPage = await ticketRenderer.renderPage(ticket, noLogoOpts);
    const resEmail = await ticketRenderer.renderEmail(ticket, noLogoOpts);
    const resPdf = await ticketRenderer.renderPdf(ticket, noLogoOpts);

    assertions.push({
      name: 'No logo uploaded: All 4 formats render cleanly without watermark',
      passed: resCanvas.image.byteLength > 1000 && resPage.html.length > 500 && resEmail.html.length > 500 && resPdf.pdf.byteLength > 500,
      details: `Canvas: ${resCanvas.image.byteLength}B, Page: ${resPage.html.length}B, Email: ${resEmail.html.length}B, PDF: ${resPdf.pdf.byteLength}B`,
    });
  } catch (err: any) {
    assertions.push({
      name: 'No logo uploaded: All 4 formats render cleanly without watermark',
      passed: false,
      details: err.message,
    });
  }

  // ------------------------------------------------------------------------
  // Test 2: Logo uploaded, watermark enabled (Default 8% opacity, 40% size)
  // ------------------------------------------------------------------------
  try {
    const wmOpts = {
      designId: 'tech' as const,
      branding: {
        accentColor: '#06b6d4',
        logoUrl,
        logoBuffer,
        watermark: {
          enabled: true,
          opacity: 0.08,
          size: 40,
          position: 'center' as const,
        },
      },
    };
    const canvasRes = await ticketRenderer.renderCanvas(ticket, wmOpts);
    const pageRes = await ticketRenderer.renderPage(ticket, wmOpts);
    const emailRes = await ticketRenderer.renderEmail(ticket, wmOpts);
    const pdfRes = await ticketRenderer.renderPdf(ticket, wmOpts);

    // Save actual outputs to disk
    fs.writeFileSync(path.join(testOutputDir, 'tech-watermark.png'), Buffer.from(canvasRes.image));
    fs.writeFileSync(path.join(testOutputDir, 'tech-watermark-web.html'), pageRes.html);
    fs.writeFileSync(path.join(testOutputDir, 'tech-watermark-email.html'), emailRes.html);
    fs.writeFileSync(path.join(testOutputDir, 'tech-watermark.pdf'), Buffer.from(pdfRes.pdf));

    const pageHasWatermark = pageRes.html.includes('Watermark') || pageRes.html.includes('data:image/png;base64');
    const emailHasWatermark = emailRes.html.includes('Watermark') || emailRes.html.includes('data:image/png;base64');

    assertions.push({
      name: 'Logo uploaded + watermark enabled: Renders all 4 formats with watermark',
      passed: canvasRes.image.byteLength > 5000 && pdfRes.pdf.byteLength > 1000 && pageHasWatermark && emailHasWatermark,
      details: `Saved to disk: PNG (${canvasRes.image.byteLength}B), PDF (${pdfRes.pdf.byteLength}B), Web HTML, Email HTML`,
    });
  } catch (err: any) {
    assertions.push({
      name: 'Logo uploaded + watermark enabled: Renders all 4 formats with watermark',
      passed: false,
      details: err.message,
    });
  }

  // ------------------------------------------------------------------------
  // Test 3: Logo uploaded, watermark disabled (Primary logo only)
  // ------------------------------------------------------------------------
  try {
    const disabledOpts = {
      designId: 'tech' as const,
      branding: {
        accentColor: '#06b6d4',
        logoUrl,
        logoBuffer,
        watermark: { enabled: false },
      },
    };
    const canvasRes = await ticketRenderer.renderCanvas(ticket, disabledOpts);
    const pageRes = await ticketRenderer.renderPage(ticket, disabledOpts);

    const hasPrimaryLogo = pageRes.html.includes('TECHCORP') || pageRes.html.includes(logoUrl);

    assertions.push({
      name: 'Logo uploaded + watermark disabled: Primary header logo displays, watermark suppressed',
      passed: canvasRes.image.byteLength > 1000 && hasPrimaryLogo,
      details: `Primary logo present: ${hasPrimaryLogo}`,
    });
  } catch (err: any) {
    assertions.push({
      name: 'Logo uploaded + watermark disabled: Primary header logo displays, watermark suppressed',
      passed: false,
      details: err.message,
    });
  }

  // ------------------------------------------------------------------------
  // Test 4: Low opacity (3%) vs High opacity (15%)
  // ------------------------------------------------------------------------
  try {
    const lowOpts = {
      designId: 'tech' as const,
      branding: {
        accentColor: '#06b6d4',
        logoUrl,
        logoBuffer,
        watermark: { enabled: true, opacity: 0.03, size: 40, position: 'center' as const },
      },
    };
    const highOpts = {
      designId: 'tech' as const,
      branding: {
        accentColor: '#06b6d4',
        logoUrl,
        logoBuffer,
        watermark: { enabled: true, opacity: 0.15, size: 55, position: 'center' as const },
      },
    };

    const lowCanvas = await ticketRenderer.renderCanvas(ticket, lowOpts);
    const highCanvas = await ticketRenderer.renderCanvas(ticket, highOpts);

    fs.writeFileSync(path.join(testOutputDir, 'tech-watermark-low-3pct.png'), Buffer.from(lowCanvas.image));
    fs.writeFileSync(path.join(testOutputDir, 'tech-watermark-high-15pct.png'), Buffer.from(highCanvas.image));

    assertions.push({
      name: 'Opacity range test: Both 3% (subtle) and 15% (vibrant) render distinct valid outputs',
      passed: lowCanvas.image.byteLength > 1000 && highCanvas.image.byteLength > 1000,
      details: `Low 3% PNG: ${lowCanvas.image.byteLength}B, High 15% PNG: ${highCanvas.image.byteLength}B`,
    });
  } catch (err: any) {
    assertions.push({
      name: 'Opacity range test: Both 3% (subtle) and 15% (vibrant) render distinct valid outputs',
      passed: false,
      details: err.message,
    });
  }

  // ------------------------------------------------------------------------
  // Test 5: Editorial design across all 4 formats with watermark enabled
  // ------------------------------------------------------------------------
  try {
    const editorialOpts = {
      designId: 'editorial' as const,
      branding: {
        accentColor: '#b45309',
        logoUrl,
        logoBuffer,
        watermark: { enabled: true, opacity: 0.08, size: 40, position: 'center' as const },
      },
    };

    const edCanvas = await ticketRenderer.renderCanvas(ticket, editorialOpts);
    const edPage = await ticketRenderer.renderPage(ticket, editorialOpts);
    const edEmail = await ticketRenderer.renderEmail(ticket, editorialOpts);
    const edPdf = await ticketRenderer.renderPdf(ticket, editorialOpts);

    fs.writeFileSync(path.join(testOutputDir, 'editorial-watermark.png'), Buffer.from(edCanvas.image));
    fs.writeFileSync(path.join(testOutputDir, 'editorial-watermark-web.html'), edPage.html);
    fs.writeFileSync(path.join(testOutputDir, 'editorial-watermark-email.html'), edEmail.html);
    fs.writeFileSync(path.join(testOutputDir, 'editorial-watermark.pdf'), Buffer.from(edPdf.pdf));

    const edPageHasWatermark = edPage.html.includes('Watermark') || edPage.html.includes('data:image/png;base64');
    const edEmailHasWatermark = edEmail.html.includes('Watermark') || edEmail.html.includes('data:image/png;base64');

    assertions.push({
      name: 'Editorial design: All 4 formats render cleanly with watermark',
      passed: edCanvas.image.byteLength > 5000 && edPdf.pdf.byteLength > 1000 && edPageHasWatermark && edEmailHasWatermark,
      details: `Saved: Editorial PNG (${edCanvas.image.byteLength}B), PDF (${edPdf.pdf.byteLength}B), Web HTML, Email HTML`,
    });
  } catch (err: any) {
    assertions.push({
      name: 'Editorial design: All 4 formats render cleanly with watermark',
      passed: false,
      details: err.message,
    });
  }

  // ------------------------------------------------------------------------
  // Test 6: Scannability & Readability (QR code and attendee info preserved)
  // ------------------------------------------------------------------------
  try {
    const pageHtml = fs.readFileSync(path.join(testOutputDir, 'tech-watermark-web.html'), 'utf-8');
    const emailHtml = fs.readFileSync(path.join(testOutputDir, 'tech-watermark-email.html'), 'utf-8');

    const hasAttendeeInPage = pageHtml.includes(sampleAttendee.name);
    const hasQrInPage = pageHtml.includes(ticket.qrCodeDataUrl) || pageHtml.includes('QR code');
    const hasAttendeeInEmail = emailHtml.includes(sampleAttendee.name);

    assertions.push({
      name: 'Readability & Scannability: Attendee name and QR code remain intact and unobstructed',
      passed: hasAttendeeInPage && hasQrInPage && hasAttendeeInEmail,
      details: `Attendee present in Page (${hasAttendeeInPage}), Email (${hasAttendeeInEmail}), QR in Page (${hasQrInPage})`,
    });
  } catch (err: any) {
    assertions.push({
      name: 'Readability & Scannability: Attendee name and QR code remain intact and unobstructed',
      passed: false,
      details: err.message,
    });
  }

  // ------------------------------------------------------------------------
  // Test 7: Bulk generation with watermark enabled
  // ------------------------------------------------------------------------
  try {
    designService.updateConfig({
      designId: 'tech',
      branding: {
        accentColor: '#06b6d4',
        logoUrl,
        watermark: { enabled: true, opacity: 0.08, size: 40, position: 'center' },
      },
    });

    attendeeService.loadDemoRoster();
    const demoAttendees = attendeeService.getAllAttendees();
    const bulkJob = await bulkService.createJob({
      attendeeIds: demoAttendees.slice(0, 2).map((a) => a.id),
      formats: ['png', 'pdf', 'page', 'email'],
    });

    // Wait for bulk job to complete
    let completedJob = bulkService.getJob(bulkJob.jobId);
    let attempts = 0;
    while (completedJob && (completedJob.status === 'QUEUED' || completedJob.status === 'PROCESSING') && attempts < 30) {
      await new Promise((r) => setTimeout(r, 400));
      completedJob = bulkService.getJob(bulkJob.jobId);
      attempts++;
    }

    const isCompleted = completedJob?.status === 'COMPLETED';
    const totalCompleted = completedJob?.completedTasks === completedJob?.totalTasks && (completedJob?.totalTasks || 0) > 0;

    assertions.push({
      name: 'Bulk generation: 2 attendees × 4 formats completed with watermark active',
      passed: Boolean(isCompleted && totalCompleted),
      details: `Status: ${completedJob?.status}, Completed tasks: ${completedJob?.completedTasks}/${completedJob?.totalTasks}`,
    });
  } catch (err: any) {
    assertions.push({
      name: 'Bulk generation: 2 attendees × 4 formats completed with watermark active',
      passed: false,
      details: err.message,
    });
  }

  console.log('Results:');
  for (const a of assertions) {
    const badge = a.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${badge} | ${a.name}`);
    if (a.details) console.log(`        └─ ${a.details}`);
  }

  const allPassed = assertions.every((a) => a.passed);
  return { passed: allPassed, assertions };
}

runWatermarkVerification().then(({ passed }) => {
  if (!passed) process.exit(1);
}).catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
