import { Router } from 'express';
import { designController } from '../modules/design/design.controller.js';

const router = Router();

// Upload event logo (dataUrl)
router.post('/logo', (req, res) => designController.uploadLogo(req, res));

// Reset branding to design defaults
router.post('/reset', (req, res) => designController.resetBranding(req, res));

export default router;
