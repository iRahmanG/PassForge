import { Router } from 'express';
import { designController } from '../modules/design/design.controller.js';

const router = Router();

// List all available ticket designs
router.get('/', (req, res) => designController.getDesigns(req, res));

// Get current saved design and branding configuration
router.get('/current', (req, res) => designController.getCurrentConfig(req, res));

// Update and persist design and branding configuration
router.post('/current', (req, res) => designController.updateCurrentConfig(req, res));

// Get specific design metadata
router.get('/:designId', (req, res) => designController.getDesignById(req, res));

export default router;
