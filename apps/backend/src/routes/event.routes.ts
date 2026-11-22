import { Router } from 'express';
import { eventController } from '../modules/event/event.controller.js';

const router = Router();

router.get('/current', (req, res) => eventController.getCurrentEvent(req, res));
router.post('/', (req, res) => eventController.updateEvent(req, res));

export default router;
