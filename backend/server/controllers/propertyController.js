import prisma from '../prisma.js';

export async function getUnitsForProperty(req, res) {
  try {
    const propertyId = Number(req.params.propertyId);
    const units = await prisma.unit.findMany({
      where: { realEstateObjectId: propertyId },
      include: {
        owners: { select: { firstName: true, lastName: true, email: true } },
        tenant: {
          include: { user: { select: { firstName: true, lastName: true, email: true } } }
        }
      }
    });
    res.json(units);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPropertyUnits(req, res) {
  const propertyId = Number(req.params.id);
  const units = await prisma.unit.findMany({
    where: { realEstateObjectId: propertyId },
    include: {
      owners: true,
      tenant: { include: { user: true } }
    }
  });
  res.json(units);
}

/**
 * GET /api/properties/:propertyId/units
 * returns an array of units with their owners & tenant
 */
export async function getUnitsByProperty(req, res) {
  const propertyId = Number(req.params.propertyId);
  try {
    const property = await prisma.realEstateObject.findUnique({
      where: { id: propertyId },
      include: {
        units: {
          include: {
            owners: true, // adjust relation name if different
            tenant: true // adjust if your model is named differently
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    return res.json(property.units);
  } catch (err) {
    console.error('getUnitsByProperty error', err);
    return res.status(500).json({ message: 'Error fetching units' });
  }
}

export async function createPropertyWithUnits(req, res) {
  try {
    const { title, street, city, state, zip, country, units } = req.body;

    if (
      !title ||
      !street ||
      !city ||
      !state ||
      !zip ||
      !country ||
      !Array.isArray(units)
    ) {
      return res.status(400).json({ message: 'Invalid property payload' });
    }

    const created = await prisma.realEstateObject.create({
      data: {
        title,
        street,
        city,
        state,
        zip,
        country,
        managerId: req.user.userId,
        units: {
          create: units.map(u => ({
            unitNumber: u.unitNumber,
            owners: u.owner?.ownerId
              ? { connect: { id: u.owner.ownerId } }
              : { create: { user: { create: u.owner.newOwner } } },
            tenant: u.tenant?.tenantId
              ? { connect: { id: u.tenant.tenantId } }
              : u.tenant?.newTenant
                ? { create: { user: { create: u.tenant.newTenant } } }
                : undefined
          }))
        }
      },
      include: {
        units: {
          include: {
            owners: true,
            tenant: { include: { user: true } }
          }
        }
      }
    });

    res.status(201).json({ data: created });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPropertyById(req, res) {
  console.log('[getPropertyById] \u2714\uFE0F  Called with id =', req.params.id);
  try {
    const id = Number(req.params.id);
    const property = await prisma.realEstateObject.findUnique({
      where: { id },
      include: {
        images: true,
        units: {
          include: {
            realEstateObject: true,
            tenant: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true } }
              }
            },
            owners: { select: { id: true, firstName: true, lastName: true } },
            maintenanceRequests: {
              select: {
                id: true,
                title: true,
                status: true,
                createdAt: true
              }
            }
          }
        }
      }
    });
    console.log('[getPropertyById] \uD83D\uDD0D  Result:', property);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    return res.json(property);
  } catch (err) {
    console.error('[getPropertyById] \u274C  Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
