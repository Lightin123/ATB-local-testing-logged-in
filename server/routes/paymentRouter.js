import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment
} from '../controllers/paymentController.js';

const router = express.Router();

// List payments
router.get('/', authenticateToken, getPayments);

// Create payment
router.post('/', authenticateToken, createPayment);

// Update payment
router.patch('/:id', authenticateToken, updatePayment);

// Delete payment
router.delete('/:id', authenticateToken, deletePayment);

export default router;
