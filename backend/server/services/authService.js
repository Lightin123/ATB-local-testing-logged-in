import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

export async function refreshTokens(refreshToken) {
  if (!refreshToken) {
    throw new Error('MISSING_TOKEN');
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw new Error('INVALID_USER');
    }
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw err;
  }
}
