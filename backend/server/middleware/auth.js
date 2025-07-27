import { authenticateToken } from '../controllers/authController.js';
import { authorizeRoles } from './authorizeRoles.js';

export const protect = authenticateToken;
export { authenticateToken, authorizeRoles };
