import fs from 'node:fs';
import path from 'node:path';
import { createTicketData } from '../data/sampleTicket.js';
import { ticketRenderer } from '../services/ticketRenderer.js';

interface TestAssertion {
  name: string;
  passed: boolean;
  details?: string;
}

export async function runFullVerification(): Promise<{ passed: boolean; results: TestAssertion[] }> {
  const assertions: TestAssertion[] = [];
  const outputDir = path.resolve('output');
  fs.mkdirSync(outputDir, { recursive: true });

  console.log('===============================================================');
  console.log('   PassForge Milestone 1: Automated Verification Suite');
  console.log('===============================================================\n');

  // --- Test 1: Standard Ticket Generation ---
  console.log('Test 1: Standard Ticket Generation (Maksud Rahman)...');
  const standardTicket = await createTicketData();
  const stdResults = await ticketRenderer.renderAll(standardTicket, outputDir);

  for (const format of ['email', 'page', 'pdf', 'png'] as const) {
    const res = stdResults[format];
    const exists = res.outputPath ? fs.existsSync(res.outputPath) : false;
    assertions.push({
      name: `Render ${format.toUpperCase()} successfully`,
      passed: res.success && exists,
      details: res.success ? `Output: ${res.outputPath} (${res.sizeBytes} bytes)` : `Error: ${res.error}`,
    });
  }

  // --- Test 2: Output File Integrity ---
  console.log('\nTest 2: Output File Headers & Magic Bytes Integrity...');

  // PDF Magic bytes check (%PDF-)
  const pdfPath = stdResults.pdf.outputPath!;
  if (fs.existsSync(pdfPath)) {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfMagic = pdfBuffer.subarray(0, 5).toString('ascii');
    const isPdfValid = pdfMagic === '%PDF-';
    assertions.push({
      name: 'PDF Magic Bytes validation (%PDF-)',
      passed: isPdfValid && pdfBuffer.length > 1000,
      details: `Header: "${pdfMagic}", File size: ${pdfBuffer.length} bytes`,
    });
  } else {
    assertions.push({ name: 'PDF Magic Bytes validation', passed: false, details: 'File missing' });
  }

  // PNG Magic bytes check (\x89PNG)
  const pngPath = stdResults.png.outputPath!;
  if (fs.existsSync(pngPath)) {
    const pngBuffer = fs.readFileSync(pngPath);
    const isPngValid =
      pngBuffer[0] === 0x89 &&
      pngBuffer[1] === 0x50 && // 'P'
      pngBuffer[2] === 0x4e && // 'N'
      pngBuffer[3] === 0x47;   // 'G'
    assertions.push({
      name: 'PNG Magic Bytes validation (\\x89PNG)',
      passed: isPngValid && pngBuffer.length > 5000,
      details: `Header signature matched, File size: ${pngBuffer.length} bytes`,
    });
  } else {
    assertions.push({ name: 'PNG Magic Bytes validation', passed: false, details: 'File missing' });
  }

  // --- Test 3: Consistency of Attendee & Event Data ---
  console.log('\nTest 3: Consistency of Attendee & Event Data across formats...');
  const emailHtml = fs.readFileSync(stdResults.email.outputPath!, 'utf-8');
  const webHtml = fs.readFileSync(stdResults.page.outputPath!, 'utf-8');

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
    const inEmail = emailHtml.includes(field);
    const inWeb = webHtml.includes(field);
    assertions.push({
      name: `Field "${field}" present in Email & Web HTML`,
      passed: inEmail && inWeb,
      details: `In Email: ${inEmail}, In Web: ${inWeb}`,
    });
  }

  // --- Test 4: QR Code Integrity ---
  console.log('\nTest 4: QR Code Generation & Embedding...');
  const qrIsDataUrl = standardTicket.qrCodeDataUrl.startsWith('data:image/png;base64,');
  const qrBufferIsPng =
    standardTicket.qrBuffer[0] === 0x89 &&
    standardTicket.qrBuffer[1] === 0x50 &&
    standardTicket.qrBuffer[2] === 0x4e &&
    standardTicket.qrBuffer[3] === 0x47;

  assertions.push({
    name: 'QR Code Data URL format',
    passed: qrIsDataUrl,
    details: `Length: ${standardTicket.qrCodeDataUrl.length} chars`,
  });

  assertions.push({
    name: 'QR Code Raw Buffer PNG signature',
    passed: qrBufferIsPng,
    details: `Buffer size: ${standardTicket.qrBuffer.length} bytes`,
  });

  // --- Test 5: Design Resilience under Long Attendee Names ---
  console.log('\nTest 5: Design Resilience (Long Attendee Name & Seat)...');
  const longNameTicket = await createTicketData(
    {
      name: 'Prof. Dr. Alexandrina Montgomery-Fitzgerald III',
      email: 'alexandrina.montgomery.fitzgerald.iii@department.longdomain.example.org',
      ticketType: 'VIP DELEGATE',
      seat: 'ZONE-A-ROW-04-SEAT-112',
    },
    'KTF27-VIP-99999'
  );

  const longResults = await ticketRenderer.renderAll(longNameTicket, outputDir);

  for (const format of ['email', 'page', 'pdf', 'png'] as const) {
    const res = longResults[format];
    assertions.push({
      name: `Long Name: Render ${format.toUpperCase()} without breaking`,
      passed: res.success,
      details: res.success ? `Output: ${res.outputPath}` : `Error: ${res.error}`,
    });
  }

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
    console.log('🎉 ALL ASSERTIONS PASSED! Rendering POC is 100% verified.');
  } else {
    console.log('⚠️ SOME ASSERTIONS FAILED. Inspect logs above.');
  }
  console.log('===============================================================\n');

  return { passed: allPassed, results: assertions };
}

if (process.argv[1] && process.argv[1].endsWith('verifyAll.ts')) {
  runFullVerification()
    .then(res => {
      if (!res.passed) process.exit(1);
    })
    .catch(err => {
      console.error('Verification failed:', err);
      process.exit(1);
    });
}
