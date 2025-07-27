// server/controllers/unitController.js

import prisma from '../prisma.js';
import { z } from 'zod';

/**
 * List all units.
 */
export async function getUnits(req, res) {
  try {
    const units = await prisma.unit.findMany({
      include: {
        owners: true,
        tenant: { include: { user: true } },
        realEstateObject: true,
      },
    });
    res.status(200).json({ data: units });
  } catch (err) {
    console.error('getUnits error:', err);
    res.status(500).json({ message: 'Error fetching units' });
  }
}

/**
 * Create a new unit.
 */
export async function createUnit(req, res) {
  try {
    const { name, propertyId, ...rest } = req.body;
    if (!name || !propertyId) {
      return res.status(400).json({ message: 'name and propertyId are required' });
    }
    const newUnit = await prisma.unit.create({
      data: { name, property: { connect: { id: Number(propertyId) } }, ...rest }
    });
    res.status(201).json({ data: newUnit });
  } catch (err) {
    console.error('createUnit error:', err);
    res.status(500).json({ message: 'Error creating unit' });
  }
}

/**
 * Update an existing unit.
 */
export async function updateUnit(req, res) {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    const updated = await prisma.unit.update({
      where: { id },
      data: updates
    });
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error('updateUnit error:', err);
    res.status(500).json({ message: 'Error updating unit' });
  }
}

/**
 * Delete a unit.
 */
export async function deleteUnit(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.unit.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('deleteUnit error:', err);
    res.status(500).json({ message: 'Error deleting unit' });
  }
}

/**
 * Fetch a single unit by ID.
 */
export async function getUnit(req, res) {
  try {
    const id = Number(req.params.id);
    const unit = await prisma.unit.findUnique({ where: { id } });
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    return res.status(200).json({ data: unit });
  } catch (err) {
    console.error('getUnit error:', err);
    return res.status(500).json({ message: 'Error fetching unit' });
  }
}

export async function getUnitById(req, res) {
  try {
    const id = Number(req.params.unitId);
    const unit = await prisma.unit.findUnique({
      where: { id },
      include: {
        owners: true,
        tenant: { include: { user: true } }
      }
    });
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    return res.status(200).json({ data: unit });
  } catch (err) {
    console.error('getUnitById error:', err);
    return res.status(500).json({ message: 'Error fetching unit' });
  }
}

export async function getRequestsByUnit(req, res) {
  const unitId = Number(req.params.unitId);
  const requests = await prisma.maintenanceRequest.findMany({
    where: { unitId },
    include: { reporter: { select: { firstName: true, lastName: true } }, vendor: true }
  });
  res.json({ data: requests });
}

const updateOwnerSchema = z.object({ ownerId: z.string() });

export async function updateUnitOwner(req, res) {
  let payload;
  try {
    payload = updateOwnerSchema.parse(req.body);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
  try {
    const unitId = Number(req.params.unitId);
    const { ownerId } = payload;
    const updated = await prisma.unit.update({
      where: { id: unitId },
      data: { owners: { set: [{ id: Number(ownerId) }] } }
    });
    res.json({ data: updated });
  } catch (err) {
    console.error('updateUnitOwner error:', err);
    res.status(500).json({ message: 'Error updating unit owner' });
  }
}

