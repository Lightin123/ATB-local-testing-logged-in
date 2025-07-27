import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant
} from '../controllers/tenantController.js';

const router = express.Router();

// List tenants
router.get('/', authenticateToken, getTenants);

// Create tenant
router.post('/', authenticateToken, createTenant);

// Update tenant
router.patch('/:id', authenticateToken, updateTenant);

// Delete tenant
router.delete('/:id', authenticateToken, deleteTenant);

export default router;
