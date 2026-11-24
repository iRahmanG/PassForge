import { ticketService } from '../modules/ticket/ticket.service.js';
import { ticketRenderer } from '../services/rendering/ticketRenderer.service.js';
import { DESIGNS_REGISTRY } from '../templates/designs/registry.js';
import { DEMO_ATTENDEES, DEMO_EVENT } from '../config/sampleData.js';
import path from 'node:path';
import fs from 'node:fs';

const AUDIT_DIR = path.join(process.cwd(), 'output', 'audit_day2');

async function runAudit() {
  console.log('===============================================================');
  console.log('   PassForge Day 2: 8-Output Ticket Visual Quality Audit');
  console.log('===============================================================\n');

  fs.mkdirSync(AUDIT_DIR, { recursive: true });

  const designs = ['tech', 'editorial'] as const;
  const formats = ['email', 'page', 'pdf', 'png'] as const;

  // Test attendees from demo roster
  const testScenarios = [
    { label: 'Normal General', attendee: DEMO_ATTENDEES.find(a => a.ticketType === 'General')! },
    { label: 'VIP with Seat', attendee: DEMO_ATTENDEES.find(a => a.ticketType === 'VIP')! },
    { label: 'Speaker with Seat', attendee: DEMO_ATTENDEES.find(a => a.ticketType === 'Speaker')! },
    { label: 'Student with Balcony', attendee: DEMO_ATTENDEES.find(a => a.ticketType === 'Student')! },
    {
      label: 'Long Name & Open Seating',
      attendee: {
        id: 'att-long',
        name: 'Prof. Dr. Alexandrina Maria Montgomery-Fitzgerald III',
        email: 'alexandrina.montgomery@example.com',
        ticketType: 'VIP' as const,
        seat: undefined,
      }
    }
  ];

  const results: any[] = [];

  for (const designId of designs) {
    console.log(`\n--- Auditing Design: [${designId.toUpperCase()}] ---`);
    for (const scenario of testScenarios) {
      const ticketData = await ticketService.createTicketData(scenario.attendee, `PASS-${scenario.attendee.ticketType.toUpperCase()}-001`);
      
      const brandingCustom = {
        eventName: DEMO_EVENT.name,
        accentColor: designId === 'tech' ? '#00f2fe' : '#B86E52',
        primaryColor: designId === 'tech' ? '#0a0e17' : '#FAF8F5',
      };

      const scenarioFolder = path.join(AUDIT_DIR, designId, scenario.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      fs.mkdirSync(scenarioFolder, { recursive: true });

      const renderResults = await ticketRenderer.renderAll(ticketData, scenarioFolder, {
        designId,
        branding: brandingCustom,
      });

      for (const format of formats) {
        const res = renderResults[format];
        if (res.success && res.outputPath) {
          const stats = fs.statSync(res.outputPath);
          results.push({
            design: designId,
            scenario: scenario.label,
            format,
            filePath: res.outputPath,
            sizeBytes: stats.size,
            timeMs: res.renderTimeMs,
            success: true
          });
          console.log(`  ✓ ${designId.padEnd(9)} | ${format.padEnd(5)} | ${scenario.label.padEnd(25)} | ${(stats.size / 1024).toFixed(1)} KB | ${res.renderTimeMs}ms`);
        } else {
          results.push({
            design: designId,
            scenario: scenario.label,
            format,
            error: res.error,
            success: false
          });
          console.error(`  ✗ ${designId.padEnd(9)} | ${format.padEnd(5)} | ${scenario.label.padEnd(25)} | ERROR: ${res.error}`);
        }
      }
    }
  }

  console.log('\n===============================================================');
  console.log(`Audit rendered ${results.filter(r => r.success).length}/${results.length} outputs.`);
  console.log(`Output files saved to: ${AUDIT_DIR}`);
  console.log('===============================================================');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
