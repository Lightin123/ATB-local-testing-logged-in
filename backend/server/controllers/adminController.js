import prisma from '../prisma.js';

export async function getAdminProperties(req, res) {
  const adminId = Number(req.params.adminId);
  try {
    const properties = await prisma.realEstateObject.findMany({
      where: { managerId: adminId },
      include: {
        _count: { select: { units: true } },
        images: { select: { url: true } },
        units: { select: { status: true } }
      }
    });
    const mapped = properties.map(p => ({
      id: p.id,
      title: p.title,
      thumbnail: p.images[0]?.url,
      totalUnits: p._count.units,
      occupiedUnits: p.units.filter(u => u.status === 'OCCUPIED').length
    }));
  res.json({ data: mapped });
  } catch (err) {
    console.error('getAdminProperties error:', err);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
}

import crypto from 'crypto';

export async function generateOverwriteCode(req, res) {
  const { propertyId, allUnits, unitIds = [] } = req.body;
  try {
    let ids = unitIds.map(id => Number(id));
    if (allUnits && propertyId) {
      const units = await prisma.unit.findMany({
        where: { realEstateObjectId: Number(propertyId) },
        select: { id: true }
      });
      ids = units.map(u => u.id);
    }
    if (!ids.length) {
      return res.status(400).json({ message: 'No units specified' });
    }
    const code = crypto.randomBytes(8).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
    await prisma.overwriteCode.create({
      data: {
        code,
        expiresAt,
        units: { connect: ids.map(id => ({ id })) }
      }
    });
  res.json({ data: { code, expiresAt } });
  } catch (err) {
    console.error('generateOverwriteCode error:', err);
    res.status(500).json({ message: 'Failed to generate code' });
  }
}
