import prisma from '../prisma.js';

/**
 * List all properties.
 */
export async function getProperties(req, res) {
  try {
    const data = await prisma.realEstateObject.findMany({
      select: {
        id: true,
        title: true,
        street: true,
        city: true,
        state: true,
        zip: true,
        createdAt: true,
        updatedAt: true,
        images: { select: { imageUrl: true } },
        units: { select: { id: true, status: true } },
        _count: { select: { units: true } }
      }
    });

    const safeData = data.map(prop => ({
      ...prop,
      images: Array.isArray(prop.images) ? prop.images : []
    }));

    return res.status(200).json({ data: safeData });
  } catch (err) {
    console.error('getProperties error:', err);
    return res.status(200).json({ data: [] });
  }
}

/**
 * Create a new property.
 */
export async function createProperty(req, res) {
  try {
    const { title, street, city, state, zip, country, units = [] } = req.body;

    const created = await prisma.realEstateObject.create({
      data: {
        title,
        street,
        city,
        state,
        zip,
        country,
        units: { create: units }
      }
    });
    res.status(201).json({ data: created });
  } catch (err) {
    console.error('createProperty error:', err);
    res.status(500).json({ message: 'Error creating property' });
  }
}

/**
 * Update an existing property by ID.
 */
export async function updateProperty(req, res) {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    const updated = await prisma.realEstateObject.update({
      where: { id },
      data: updates
    });
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error('updateProperty error:', err);
    res.status(500).json({ message: 'Error updating property' });
  }
}

/**
 * Delete a property by ID.
 */
export async function deleteProperty(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.realEstateObject.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('deleteProperty error:', err);
    res.status(500).json({ message: 'Error deleting property' });
  }
}
