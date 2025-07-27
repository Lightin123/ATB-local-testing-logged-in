import express from 'express';
import { z } from 'zod';
import prisma from '../prisma.js';

const router = express.Router();

const BOARD_POSITIONS = [
  'President',
  'VP',
  'Secretary',
  'Treasurer',
  'Developer/Builder',
  'Other',
];

const PROPERTY_TYPES = [
  'Single Family',
  'Townhome',
  'Condo',
  'Mixed Use',
];

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().email(),
  boardPositions: z.array(z.enum(BOARD_POSITIONS)).optional().default([]),
  communityName: z.string().optional(),
  communityLocation: z.string().optional(),
  communityDescription: z.string().optional(),
  referralSource: z.string().optional(),
  numberOfUnits: z.number().int().optional(),
  propertyType: z.enum(PROPERTY_TYPES),
});

router.post('/', async (req, res) => {
  try {
    const data = schema.parse(req.body);
    const record = await prisma.contactRequest.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        boardPositions: data.boardPositions,
        communityName: data.communityName,
        communityLocation: data.communityLocation,
        communityDescription: data.communityDescription,
        referralSource: data.referralSource,
        numberOfUnits: data.numberOfUnits,
        propertyType: data.propertyType,
      },
    });
    res.status(201).json({ success: true, id: record.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
