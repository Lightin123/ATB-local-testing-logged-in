import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getLeases,
  createLease,
  updateLease,
  deleteLease
} from '../controllers/leaseController.js';

const router = express.Router();

// List leases
router.get('/', authenticateToken, getLeases);

// Create lease
router.post('/', authenticateToken, createLease);

// Update lease
router.patch('/:id', authenticateToken, updateLease);

// Delete lease
router.delete('/:id', authenticateToken, deleteLease);

export default router;
