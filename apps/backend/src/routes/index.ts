import { Router } from 'express';
import eventRoutes from './event.routes.js';
import attendeeRoutes from './attendee.routes.js';
import ticketRoutes from './ticket.routes.js';
import designRoutes from './design.routes.js';
import brandingRoutes from './branding.routes.js';
import bulkRoutes from './bulk.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PassForge API Server',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

// Event management endpoints
router.use('/events', eventRoutes);

// Attendee import & listing endpoints
router.use('/attendees', attendeeRoutes);

// Design management & presets endpoints
router.use('/designs', designRoutes);

// Branding customization endpoints
router.use('/branding', brandingRoutes);

// Bulk ticket generation & ZIP export endpoints (Milestone 4)
router.use('/bulk', bulkRoutes);

// Ticket generation & rendering endpoints
router.use('/tickets', ticketRoutes);
// Mount ticket routes directly on /api for backward compatibility with Milestone 1
router.use('/', ticketRoutes);

export default router;
