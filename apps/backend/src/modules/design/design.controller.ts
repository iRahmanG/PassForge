import { Request, Response } from 'express';
import { designService } from './design.service.js';
import { TicketDesignId, designConfigSchema } from '@passforge/shared';

export class DesignController {
  getDesigns(_req: Request, res: Response) {
    try {
      const designs = designService.getAllDesigns();
      res.json({ success: true, designs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  getDesignById(req: Request, res: Response) {
    try {
      const designId = req.params.designId as TicketDesignId;
      const design = designService.getDesignById(designId);
      if (!design) {
        return res.status(404).json({ success: false, error: `Design '${designId}' not found` });
      }
      res.json({ success: true, design });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  getCurrentConfig(_req: Request, res: Response) {
    try {
      const config = designService.getCurrentConfig();
      res.json({ success: true, config });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  updateCurrentConfig(req: Request, res: Response) {
    try {
      const parsed = designConfigSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid design configuration',
          details: parsed.error.format(),
        });
      }

      const updated = designService.updateConfig(parsed.data);
      res.json({ success: true, config: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  uploadLogo(req: Request, res: Response) {
    try {
      const { dataUrl } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ success: false, error: 'A valid dataUrl is required' });
      }

      const updated = designService.setLogo(dataUrl);
      res.json({ success: true, config: updated, logoUrl: dataUrl });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  resetBranding(_req: Request, res: Response) {
    try {
      const updated = designService.resetBranding();
      res.json({ success: true, config: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const designController = new DesignController();
