import fs from 'node:fs';
import path from 'node:path';
import { ticketService } from '../modules/ticket/ticket.service.js';
import { ticketRenderer } from '../services/rendering/ticketRenderer.service.js';
import { attendeeService } from '../modules/attendee/attendee.service.js';
import { eventService } from '../modules/event/event.service.js';
import { designService } from '../modules/design/design.service.js';
import { getAllDesigns, getDesign } from '../templates/designs/registry.js';
import { OUTPUT_DIR } from '../config/constants.js';

interface TestAssertion {
  name: string;
  passed: boolean;
  details?: string;
}

export async function runFullVerification(): Promise<{ passed: boolean; results: TestAssertion[] }> {
  const assertions: TestAssertion[] = [];
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('===============================================================');
  console.log('   PassForge Milestone 3: Automated Verification Suite');
  console.log('===============================================================\n');

  // --- Test 1: Design Registry Verification ---
  console.log('Test 1: Design Registry & Metadata Verification...');
  const designs = getAllDesigns();
  assertions.push({
    name: 'Design Registry contains both "tech" and "editorial" layouts',
    passed: designs.length >= 2 && designs.some(d => d.id === 'tech') && designs.some(d => d.id === 'editorial'),
    details: `Available designs: ${designs.map(d => d.id).join(', ')}`,
  });

  const techDesign = getDesign('tech');
  const editorialDesign = getDesign('editorial');
  assertions.push({
    name: 'Both designs have all 4 Hyper Elements templates registered',
    passed:
      !!techDesign.templates.email &&
      !!techDesign.templates.page &&
      !!techDesign.templates.document &&
      !!techDesign.templates.canvas &&
      !!editorialDesign.templates.email &&
      !!editorialDesign.templates.page &&
      !!editorialDesign.templates.document &&
      !!editorialDesign.templates.canvas,
    details: 'All 8 template components registered in registry',
  });

  // --- Test 2: Standard Tech Design Generation ---
  console.log('\nTest 2: Standard Tech Design Ticket Generation (Hyper Elements SSR)...');
  const standardTicket = await ticketService.createTicketData();
  const techResults = await ticketRenderer.renderAll(standardTicket, OUTPUT_DIR, { designId: 'tech' });

  for (const format of ['email', 'page', 'pdf', 'png'] as const) {
    const res = techResults[format];
    const exists = res.outputPath ? fs.existsSync(res.outputPath) : false;
    assertions.push({
      name: `Tech Design: Render ${format.toUpperCase()} successfully`,
      passed: res.success && exists,
      details: res.success ? `Output: ${res.outputPath} (${res.sizeBytes} bytes)` : `Error: ${res.error}`,
    });
  }

  // --- Test 3: Premium Editorial Design Generation ---
  console.log('\nTest 3: Premium Editorial Design Ticket Generation (Hyper Elements SSR)...');
  const editorialOutputDir = path.join(OUTPUT_DIR, 'editorial-test');
  fs.mkdirSync(editorialOutputDir, { recursive: true });
  const editorialResults = await ticketRenderer.renderAll(standardTicket, editorialOutputDir, {
    designId: 'editorial',
    branding: { accentColor: '#b45309' },
  });

  for (const format of ['email', 'page', 'pdf', 'png'] as const) {
    const res = editorialResults[format];
    const exists = res.outputPath ? fs.existsSync(res.outputPath) : false;
    assertions.push({
      name: `Editorial Design: Render ${format.toUpperCase()} successfully`,
      passed: res.success && exists,
      details: res.success ? `Output: ${res.outputPath} (${res.sizeBytes} bytes)` : `Error: ${res.error}`,
    });
    if (!res.success) {
      console.error(`[ERROR] Editorial ${format} failed:`, res.error);
    }
  }

  // --- Test 4: Editorial Output File Integrity (PDF & PNG) ---
  console.log('\nTest 4: Editorial Output File Headers & Magic Bytes Integrity...');
  const editPdfPath = editorialResults.pdf.outputPath;
  if (editPdfPath && fs.existsSync(editPdfPath)) {
    const pdfBuffer = fs.readFileSync(editPdfPath);
    const pdfMagic = pdfBuffer.subarray(0, 5).toString('ascii');
    const isPdfValid = pdfMagic === '%PDF-';
    assertions.push({
      name: 'Editorial PDF Magic Bytes validation (%PDF-)',
      passed: isPdfValid && pdfBuffer.length > 1000,
      details: `Header: "${pdfMagic}", File size: ${pdfBuffer.length} bytes`,
    });
  } else {
    assertions.push({ name: 'Editorial PDF Magic Bytes validation', passed: false, details: `File missing or error: ${editorialResults.pdf.error}` });
  }

  const editPngPath = editorialResults.png.outputPath;
  if (editPngPath && fs.existsSync(editPngPath)) {
    const pngBuffer = fs.readFileSync(editPngPath);
    const isPngValid =
      (pngBuffer[0] === 0x89 && pngBuffer[1] === 0x50 && pngBuffer[2] === 0x4e && pngBuffer[3] === 0x47);
    assertions.push({
      name: 'Editorial PNG Magic Bytes validation (\\x89PNG)',
      passed: isPngValid && pngBuffer.length > 5000,
      details: `PNG signature matched, File size: ${pngBuffer.length} bytes`,
    });
  } else {
    assertions.push({ name: 'Editorial PNG Magic Bytes validation', passed: false, details: `File missing or error: ${editorialResults.png.error}` });
  }

  // --- Test 5: Consistency of Attendee & Event Data in Editorial ---
  console.log('\nTest 5: Attendee & Event Data in Editorial Design HTML...');
  const editEmailHtml = editorialResults.email.outputPath && fs.existsSync(editorialResults.email.outputPath)
    ? fs.readFileSync(editorialResults.email.outputPath, 'utf-8')
    : '';
  const editWebHtml = editorialResults.page.outputPath && fs.existsSync(editorialResults.page.outputPath)
    ? fs.readFileSync(editorialResults.page.outputPath, 'utf-8')
    : '';

  const requiredFields = [
    'Maksud Rahman',
    'KIET TechFest 2027',
    'VIP',
    'A-104',
    '15 February 2027',
    'KIET Group of Institutions',
    'KTF27-VIP-84920',
  ];

  for (const field of requiredFields) {
    const inEmail = editEmailHtml.includes(field);
    const inWeb = editWebHtml.includes(field);
    assertions.push({
      name: `Editorial: Field "${field}" present in Email & Web HTML`,
      passed: inEmail && inWeb,
      details: `In Email: ${inEmail}, In Web: ${inWeb}`,
    });
  }

  // --- Test 6: Branding Customization & Accent Color Propagation ---
  console.log('\nTest 6: Branding Customization & Accent Color Propagation...');
  const customAccent = '#e11d48'; // Rose accent
  const customBrandedResults = await ticketRenderer.renderAll(standardTicket, editorialOutputDir, {
    designId: 'editorial',
    branding: { accentColor: customAccent },
  });

  const customEmailHtml = customBrandedResults.email.outputPath && fs.existsSync(customBrandedResults.email.outputPath)
    ? fs.readFileSync(customBrandedResults.email.outputPath, 'utf-8')
    : '';
  const customWebHtml = customBrandedResults.page.outputPath && fs.existsSync(customBrandedResults.page.outputPath)
    ? fs.readFileSync(customBrandedResults.page.outputPath, 'utf-8')
    : '';
  assertions.push({
    name: 'Custom accent color propagates to Email & Web outputs',
    passed: customEmailHtml.includes(customAccent) && customWebHtml.includes(customAccent),
    details: `Found custom color ${customAccent} in rendered output templates`,
  });

  // --- Test 7: Handling Missing Seat Number ("Open Seating") ---
  console.log('\nTest 7: Missing Seat Number Graceful Fallback...');
  const unseatedAttendee = {
    name: 'Priya Sundaram',
    email: 'priya@example.com',
    ticketType: 'General',
    seat: undefined,
  };
  const unseatedTicket = await ticketService.createTicketData(unseatedAttendee, 'KTF27-GEN-10293');
  const unseatedEditPage = await ticketRenderer.renderPage(unseatedTicket, { designId: 'editorial' });
  assertions.push({
    name: 'Editorial handles missing seat number with "Open Seating"',
    passed: unseatedEditPage.html.includes('Open Seating'),
    details: 'Displays "Open Seating" when attendee.seat is undefined',
  });

  // --- Test 8: Design Resilience with Extreme Long Names ---
  console.log('\nTest 8: Design Resilience (Extreme Long Names in Editorial)...');
  const longNameTicket = await ticketService.createTicketData(
    {
      name: 'Dr. Elizabeth Charlotte Montgomery-Fitzgerald of Buckinghamshire III',
      email: 'elizabeth.montgomery.fitzgerald.buckinghamshire.iii@longdomainexample.org',
      ticketType: 'HONORARY FELLOW',
      seat: 'ZONE-ALPHA-ROW-01-SEAT-001',
    },
    'KTF27-HON-LONGNAME'
  );

  const longEditorialResults = await ticketRenderer.renderAll(longNameTicket, editorialOutputDir, {
    designId: 'editorial',
  });

  for (const format of ['email', 'page', 'pdf', 'png'] as const) {
    const res = longEditorialResults[format];
    assertions.push({
      name: `Editorial Long Name: Render ${format.toUpperCase()} without breaking`,
      passed: res.success,
      details: res.success ? `Output: ${res.outputPath}` : `Error: ${res.error}`,
    });
  }

  // --- Test 9: Event & CSV Import Tests from Milestone 2 ---
  console.log('\nTest 9: CSV Attendee Import Pipeline Validation...');
  const validCsv = `Full Name,Email Address,Ticket Type,Seat Number
Aarav Sharma,aarav@kiet.edu,VIP,B-101
Diya Patel,diya@kiet.edu,General,C-205
Rohan Verma,rohan@kiet.edu,Speaker,A-012`;

  const validImport = attendeeService.importAttendeesFromCsv(validCsv);
  assertions.push({
    name: 'Import valid CSV with column auto-detection',
    passed: validImport.validCount === 3 && validImport.invalidCount === 0,
    details: `Imported ${validImport.validCount}/3 attendees`,
  });

  const invalidCsv = `Name,Email,Ticket Type,Seat
,missingname@example.com,VIP,B-01
Invalid Email User,not-an-email,General,B-02
Valid User,valid@example.com,Student,B-03`;

  const invalidImport = attendeeService.importAttendeesFromCsv(invalidCsv);
  assertions.push({
    name: 'Validate missing name and invalid email format in CSV',
    passed:
      invalidImport.validCount === 1 &&
      invalidImport.invalidCount === 2 &&
      invalidImport.errors.some(e => e.field === 'name') &&
      invalidImport.errors.some(e => e.field === 'email'),
    details: `Valid: ${invalidImport.validCount}, Errors: ${invalidImport.errors.length}`,
  });

  // --- Test 10: In-Memory Design Configuration Persistence ---
  console.log('\nTest 10: Design Service State Management & Persistence...');
  designService.updateConfig({
    designId: 'editorial',
    branding: { accentColor: '#059669' },
  });
  const currentConfig = designService.getCurrentConfig();
  assertions.push({
    name: 'Design configuration update and retrieval in memory',
    passed: currentConfig.designId === 'editorial' && currentConfig.branding.accentColor === '#059669',
    details: `Saved: designId=${currentConfig.designId}, accentColor=${currentConfig.branding.accentColor}`,
  });
  designService.resetBranding();

  // Print Summary
  console.log('\n===============================================================');
  console.log('                     VERIFICATION RESULTS');
  console.log('===============================================================\n');

  let allPassed = true;
  for (const assertion of assertions) {
    const symbol = assertion.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} | ${assertion.name}`);
    if (assertion.details) {
      console.log(`        └─ ${assertion.details}`);
    }
    if (!assertion.passed) allPassed = false;
  }

  console.log('\n===============================================================');
  if (allPassed) {
    console.log(`🎉 ALL ${assertions.length} ASSERTIONS PASSED! Milestone 3 Design System verified.`);
  } else {
    console.log('⚠️ SOME ASSERTIONS FAILED. Inspect logs above.');
  }
  console.log('===============================================================\n');

  return { passed: allPassed, results: assertions };
}

import { runMilestone4Verification } from './verifyMilestone4.js';

if (process.argv[1] && process.argv[1].endsWith('verifyAll.ts')) {
  runFullVerification()
    .then(async res3 => {
      if (!res3.passed) process.exit(1);
      const res4 = await runMilestone4Verification();
      if (!res4.passed) process.exit(1);
    })
    .catch(err => {
      console.error('Verification failed:', err);
      process.exit(1);
    });
}
