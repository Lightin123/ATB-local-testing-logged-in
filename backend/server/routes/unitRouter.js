import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import {
  getUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  getUnitById,
  getRequestsByUnit,
  updateUnitOwner
} from '../controllers/unitController.js';

const router = express.Router();

// List units
router.get('/', authenticateToken, getUnits);

// Get single unit
router.get('/:id', authenticateToken, getUnit);

// Create unit
router.post('/', authenticateToken, createUnit);

// Update unit
router.patch('/:id', authenticateToken, updateUnit);

// Delete unit
router.delete('/:id', authenticateToken, deleteUnit);

router.get('/:unitId', authenticateToken, authorizeRoles('ADMIN'), getUnitById);
router.get('/:unitId/requests', authenticateToken, authorizeRoles('ADMIN'), getRequestsByUnit);
router.put('/:unitId/owner', authenticateToken, authorizeRoles('ADMIN'), updateUnitOwner);

export default router;
