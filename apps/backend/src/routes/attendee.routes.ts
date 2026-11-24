import { Router } from 'express';
import { attendeeController } from '../modules/attendee/attendee.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import { csvUploadLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

router.get('/', (req, res) => attendeeController.getAllAttendees(req, res));
router.post('/demo', (req, res) => attendeeController.loadDemo(req, res));
router.post('/import', csvUploadLimiter, upload.single('file'), (req, res) => attendeeController.importCsv(req, res));
router.post('/reset', (req, res) => attendeeController.resetAttendees(req, res));

export default router;
