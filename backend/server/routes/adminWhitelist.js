import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import { z } from 'zod';
import prisma from '../prisma.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const rowSchema = z.object({
  email: z.string().email(),
  role: z.enum(['TENANT', 'OWNER'])
});

router.use(authenticateToken, authorizeRoles('ADMIN'));

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    let inserted = 0;
    for (const rawRow of rows) {
      const parsed = rowSchema.safeParse({
        email: rawRow.email || rawRow.Email || rawRow[0],
        role: rawRow.role || rawRow.Role || rawRow[1]
      });
      if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid row', details: parsed.error.issues });
      }
      const data = parsed.data;
      await prisma.whitelistedUser.upsert({
        where: { email: data.email },
        update: { role: data.role },
        create: { email: data.email, role: data.role }
      });
      inserted++;
    }
    res.status(200).json({ success: true, inserted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

export default router;
