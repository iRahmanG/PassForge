import fs from 'node:fs';
import { ticketService } from '../modules/ticket/ticket.service.js';
import { ticketRenderer } from '../services/rendering/ticketRenderer.service.js';
import { attendeeService } from '../modules/attendee/attendee.service.js';
import { eventService } from '../modules/event/event.service.js';
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
  console.log('   PassForge Milestone 2: Automated Verification Suite');
  console.log('===============================================================\n');

  // --- Test 1: Standard Ticket Generation ---
  console.log('Test 1: Standard Ticket Generation (Hyper Elements SSR)...');
  const standardTicket = await ticketService.createTicketData();
  const stdResults = await ticketRenderer.renderAll(standardTicket, OUTPUT_DIR);

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

  const pngPath = stdResults.png.outputPath!;
  if (fs.existsSync(pngPath)) {
    const pngBuffer = fs.readFileSync(pngPath);
    const isPngValid =
      pngBuffer[0] === 0x89 &&
      pngBuffer[1] === 0x50 &&
      pngBuffer[2] === 0x4e &&
      pngBuffer[3] === 0x47;
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
    standardTicket.qrBuffer &&
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
    passed: !!qrBufferIsPng,
    details: `Buffer size: ${standardTicket.qrBuffer?.length || 0} bytes`,
  });

  // --- Test 5: Design Resilience under Long Attendee Names ---
  console.log('\nTest 5: Design Resilience (Long Attendee Name & Seat)...');
  const longNameTicket = await ticketService.createTicketData(
    {
      name: 'Prof. Dr. Alexandrina Montgomery-Fitzgerald III',
      email: 'alexandrina.montgomery.fitzgerald.iii@department.longdomain.example.org',
      ticketType: 'VIP DELEGATE',
      seat: 'ZONE-A-ROW-04-SEAT-112',
    },
    'KTF27-VIP-99999'
  );

  const longResults = await ticketRenderer.renderAll(longNameTicket, OUTPUT_DIR);

  for (const format of ['email', 'page', 'pdf', 'png'] as const) {
    const res = longResults[format];
    assertions.push({
      name: `Long Name: Render ${format.toUpperCase()} without breaking`,
      passed: res.success,
      details: res.success ? `Output: ${res.outputPath}` : `Error: ${res.error}`,
    });
  }

  // --- Test 6: Event Update & State Management ---
  console.log('\nTest 6: Event Configuration API Service...');
  const updatedEvent = eventService.updateEvent({
    name: 'KIET TechFest 2027 — Innovators Edition',
    venue: 'Auditorium Block A, KIET',
  });
  assertions.push({
    name: 'Event update validation and persistence',
    passed:
      updatedEvent.name === 'KIET TechFest 2027 — Innovators Edition' &&
      updatedEvent.venue === 'Auditorium Block A, KIET',
    details: `Name: ${updatedEvent.name}, Venue: ${updatedEvent.venue}`,
  });
  eventService.resetToDefault();

  // --- Test 7: CSV Attendee Import Validation ---
  console.log('\nTest 7: CSV Attendee Import Pipeline Validation...');

  // 7a: Valid CSV with standard columns
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

  // 7b: Invalid email & missing name validation
  const invalidCsv = `Name,Email,Ticket Type,Seat
,missingname@example.com,VIP,B-01
Invalid Email User,not-an-email,General,B-02
Valid User,valid@example.com,Student,B-03`;

  const invalidImport = attendeeService.importAttendeesFromCsv(invalidCsv);
  assertions.push({
    name: 'Validate missing name and invalid email format',
    passed:
      invalidImport.validCount === 1 &&
      invalidImport.invalidCount === 2 &&
      invalidImport.errors.some(e => e.field === 'name') &&
      invalidImport.errors.some(e => e.field === 'email'),
    details: `Valid: ${invalidImport.validCount}, Errors: ${invalidImport.errors.length}`,
  });

  // 7c: Duplicate email detection
  const duplicateCsv = `Name,Email,Ticket Type,Seat
User One,dupe@example.com,VIP,A-01
User Two,dupe@example.com,General,A-02`;

  const dupeImport = attendeeService.importAttendeesFromCsv(duplicateCsv);
  assertions.push({
    name: 'Detect duplicate email in CSV batch',
    passed:
      dupeImport.validCount === 1 &&
      dupeImport.invalidCount === 1 &&
      dupeImport.errors.some(e => e.message.includes('Duplicate email')),
    details: `Duplicate correctly flagged on row ${dupeImport.errors[0]?.row}`,
  });

  // 7d: Empty rows & whitespace skipping
  const emptyRowsCsv = `Name,Email,Ticket Type,Seat
Alice Wonder,alice@example.com,VIP,S-01

   ,   ,   ,   
Bob Builder,bob@example.com,General,S-02
`;

  const emptyImport = attendeeService.importAttendeesFromCsv(emptyRowsCsv);
  assertions.push({
    name: 'Skip empty lines and whitespace rows gracefully',
    passed: emptyImport.validCount === 2 && emptyImport.skippedEmptyRows >= 1,
    details: `Valid: ${emptyImport.validCount}, Skipped: ${emptyImport.skippedEmptyRows}`,
  });

  // 7e: Custom column mapping support
  const customColsCsv = `MemberName,ContactEmail,PassCategory,AssignedDesk
Dev Kumar,dev@kiet.edu,Speaker,Desk-9`;

  const mappedImport = attendeeService.importAttendeesFromCsv(customColsCsv, {
    name: 'MemberName',
    email: 'ContactEmail',
    ticketType: 'PassCategory',
    seat: 'AssignedDesk',
  });
  assertions.push({
    name: 'Custom CSV column mapping',
    passed:
      mappedImport.validCount === 1 &&
      mappedImport.importedAttendees[0]?.name === 'Dev Kumar' &&
      mappedImport.importedAttendees[0]?.seat === 'Desk-9',
    details: `Mapped Dev Kumar to Desk-9`,
  });

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
    console.log('🎉 ALL ASSERTIONS PASSED! Monorepo & CSV Import verified.');
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
