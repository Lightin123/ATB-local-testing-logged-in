import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';

const router = express.Router();

// List expenses
router.get('/', authenticateToken, getExpenses);

// Create expense
router.post('/', authenticateToken, createExpense);

// Update expense
router.patch('/:id', authenticateToken, updateExpense);

// Delete expense
router.delete('/:id', authenticateToken, deleteExpense);

export default router;
