import express from 'express';
import { z } from 'zod';
import prisma, { MaintenanceStatus, Priority } from '../prisma.js';
import {
  getMaintenanceReports,
  createMaintenanceReport,
  requestTag,
  approveTag,
  deleteMaintenanceReport,
  linkMaintenanceRequests
} from '../controllers/maintenanceController.js';
import { updateMaintenanceReport } from '../controllers/maintenanceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// GET /api/maintenance/meta - expose enum values
router.get(
  '/meta',
  authenticateToken,
  authorizeRoles('ADMIN', 'OWNER', 'TENANT'),
  async (_req, res) => {
    res.json({
      statusOptions: Object.values(MaintenanceStatus),
      priorityOptions: Object.values(Priority),
    });
  }
);

// List maintenance requests
router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'OWNER', 'TENANT'),
  getMaintenanceReports
);

// Create a maintenance request
router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN', 'OWNER', 'TENANT'),
  createMaintenanceReport
);

// Owner requests HOA tag
router.patch(
  '/:id/request-tag',
  authenticateToken,
  authorizeRoles('ADMIN'),
  requestTag
);

// Admin approves/rejects HOA tag
router.patch(
  '/:id/approve-tag',
  authenticateToken,
  authorizeRoles('ADMIN'),
  approveTag
);

// Admin updates report
router.patch(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  updateMaintenanceReport
);

// Delete report
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('ADMIN'),
  deleteMaintenanceReport
);

// Link related reports
const linkSchema = z.object({ ids: z.array(z.number().int()).min(2) });
router.post(
  '/link',
  authenticateToken,
  authorizeRoles('ADMIN'),
  async (req, res) => {
    const parsed = linkSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.issues });
    }
    try {
      await linkMaintenanceRequests(parsed.data.ids, req.user.userId);
      res.json({ success: true });
    } catch (err) {
      console.error('linkMaintenanceRequests error:', err);
      res.status(500).json({ error: 'Failed to link maintenance requests' });
    }
  }
);

export default router;
