import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { PORT, OUTPUT_DIR, CORS_ORIGIN, FRONTEND_DIST } from './config/constants.js';
import apiRoutes from './routes/index.js';
import { ticketService } from './modules/ticket/ticket.service.js';
import { ticketRenderer } from './services/rendering/ticketRenderer.service.js';

const app = express();

app.use(cors({ origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',') }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static route for generated preview artifacts
app.use('/output', express.static(OUTPUT_DIR));

// Mount main API routes
app.use('/api', apiRoutes);

// In production or when frontend build exists, serve static client bundle
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.use((req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }
    if (req.path.startsWith('/api') || req.path.startsWith('/output')) {
      return next();
    }
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}


// Initialize sample ticket rendering in background on server boot
async function initServer() {
  try {
    const sampleTicket = await ticketService.createTicketData();
    await ticketRenderer.renderAll(sampleTicket, OUTPUT_DIR);
    console.log('✅ Initialized sample ticket rendering cache');
  } catch (err: any) {
    console.warn('⚠️ Non-fatal: Initial ticket rendering cache skipped:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 PassForge Backend Server running at http://localhost:${PORT}`);
  });
}

initServer();

export default app;
