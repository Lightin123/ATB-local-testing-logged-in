import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getCurrentUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Get current user profile
router.get('/', authenticateToken, getCurrentUser);

// Update a user
router.patch('/:id', authenticateToken, updateUser);

// Delete a user
router.delete('/:id', authenticateToken, deleteUser);

export default router;
