import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { getAdminProperties, generateOverwriteCode } from '../controllers/adminController.js';

const router = express.Router();

router.get('/:adminId/properties', authenticateToken, authorizeRoles('ADMIN'), getAdminProperties);
router.post('/generate-overwrite-code', authenticateToken, authorizeRoles('ADMIN'), generateOverwriteCode);

export default router;
