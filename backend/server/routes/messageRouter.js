import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage
} from '../controllers/messageController.js';

const router = express.Router();

// List messages
router.get('/', authenticateToken, getMessages);

// Create message
router.post('/', authenticateToken, createMessage);

// Update message
router.patch('/:id', authenticateToken, updateMessage);

// Delete message
router.delete('/:id', authenticateToken, deleteMessage);

export default router;
