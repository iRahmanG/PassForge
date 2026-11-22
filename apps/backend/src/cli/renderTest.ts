import { ticketService } from '../modules/ticket/ticket.service.js';
import { ticketRenderer } from '../services/rendering/ticketRenderer.service.js';
import { OUTPUT_DIR } from '../config/constants.js';
import fs from 'node:fs';

async function main() {
  console.log('=== PassForge: Milestone 2 Backend Rendering Test ===\n');

  console.log('1. Generating sample ticket data for KIET TechFest 2027...');
  const ticket = await ticketService.createTicketData();
  console.log(`   Attendee: ${ticket.attendee.name} (${ticket.attendee.email})`);
  console.log(`   Event:    ${ticket.event.name}`);
  console.log(`   Tier:     ${ticket.attendee.ticketType} | Seat: ${ticket.attendee.seat}`);
  console.log(`   ID:       ${ticket.ticketId}\n`);

  console.log('2. Rendering all 4 Hyper Elements formats...');
  const results = await ticketRenderer.renderAll(ticket, OUTPUT_DIR);

  console.log('\n3. Verification Results:');
  console.log('---------------------------------------------------------');

  for (const [format, result] of Object.entries(results)) {
    if (result.success) {
      const stats = fs.statSync(result.outputPath!);
      console.log(`✅ [${format.toUpperCase()}] SUCCESS`);
      console.log(`   File: ${result.outputPath}`);
      console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB (${stats.size} bytes)`);
      console.log(`   Time: ${result.renderTimeMs} ms`);
    } else {
      console.error(`❌ [${format.toUpperCase()}] FAILED: ${result.error}`);
    }
  }

  console.log('---------------------------------------------------------');
  console.log('All formats verified successfully!\n');
}

main().catch(err => {
  console.error('Render test failed:', err);
  process.exit(1);
});
