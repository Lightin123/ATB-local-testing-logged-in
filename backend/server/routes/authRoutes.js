import express from 'express';
import * as authController from '../controllers/authController.js';
import * as authService from '../services/authService.js';

const router = express.Router();

router.post('/signup', authController.createUser);
router.post('/login', authController.login);

// POST /api/refresh handler
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }
  try {
    const tokens = await authService.refreshTokens(refreshToken);
    return res.json(tokens);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});

export default router;
