import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { PORT, OUTPUT_DIR, CORS_ORIGIN, FRONTEND_DIST } from './config/constants.js';
import apiRoutes from './routes/index.js';
import { ticketService } from './modules/ticket/ticket.service.js';
import { ticketRenderer } from './services/rendering/ticketRenderer.service.js';
import { bulkService } from './modules/bulk/bulk.service.js';

import { generalApiLimiter } from './middleware/rateLimit.middleware.js';

const app = express();

app.use(cors({ origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',') }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount main API routes with safety rate limiter (polling routes bypass automatically)
app.use('/api', generalApiLimiter, apiRoutes);

// Explicitly block direct /output path access to prevent exposure of generated artifacts
app.use('/output', (_req, res) => {
  res.status(404).json({ error: 'Direct access to output directory is disabled' });
});

// In production or when frontend build exists, serve static client bundle
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.use((req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}


// Initialize sample ticket rendering in background on server boot
async function initServer() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PassForge Backend Server running at http://localhost:${PORT}`);
  });

  // Clean up any orphaned bulk_* directories from previous sessions safely on boot
  try {
    const { removedDirs } = bulkService.cleanupOrphanedDirs(OUTPUT_DIR);
    if (removedDirs.length > 0) {
      console.log(`🧹 Cleaned up ${removedDirs.length} orphaned bulk directory/directories from previous session`);
    }
  } catch (err: any) {
    console.warn('⚠️ Non-fatal: Orphaned bulk directory cleanup skipped:', err.message);
  }

  // Start periodic background cleanup for expired bulk jobs (runs every 15 minutes)
  bulkService.startPeriodicCleanup();

  // Run initial cache warming in background without blocking server readiness
  setImmediate(async () => {
    try {
      const sampleTicket = await ticketService.createTicketData();
      await ticketRenderer.renderAll(sampleTicket, OUTPUT_DIR);
      console.log('✅ Initialized sample ticket rendering cache');
    } catch (err: any) {
      console.warn('⚠️ Non-fatal: Initial ticket rendering cache skipped:', err.message);
    }
  });
}

initServer();

process.on('SIGTERM', () => {
  bulkService.stopPeriodicCleanup();
});
process.on('SIGINT', () => {
  bulkService.stopPeriodicCleanup();
});

export default app;
