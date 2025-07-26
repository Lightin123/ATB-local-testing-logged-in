import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import {
  createPropertyWithUnits,
  getPropertyById,
  getPropertyUnits
} from '../controllers/propertyController.js';
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/realEstateController.js';

const router = express.Router();

// List properties
router.get('/', authenticateToken, getProperties);

// Create property
router.post('/', authenticateToken, authorizeRoles('ADMIN'), createProperty);

// Update property
router.patch('/:id', authenticateToken, updateProperty);

// GET all units for a property
router.get(
  '/:id/units',
  authenticateToken,
  getPropertyUnits
);

// Delete property
router.delete('/:id', authenticateToken, deleteProperty);

// GET one property by ID
router.get(
  '/:id',
  authenticateToken,
  getPropertyById
);


router.post(
  '/properties',
  authenticateToken,
  authorizeRoles('ADMIN'),
  createPropertyWithUnits
);

export default router;
