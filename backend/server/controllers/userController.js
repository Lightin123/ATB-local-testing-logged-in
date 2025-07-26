import prisma from '../prisma.js';

/**
 * Fetch and return the current authenticated user.
 */
export async function getCurrentUser(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.userId) },
      select: { id: true, email: true, role: true /* add other fields as needed */ }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    console.error('getCurrentUser error:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
}

/**
 * Update a user by ID.
 */
export async function updateUser(req, res) {
  try {
    const id = Number(req.params.id);
    const {
      firstName,
      lastName,
      phone,
      street,
      city,
      state,
      zip,
      country
    } = req.body;
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (phone !== undefined) updates.phone = phone;
    if (street !== undefined) updates.street = street;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (zip !== undefined) updates.zip = zip;
    if (country !== undefined) updates.country = country;
    const updated = await prisma.user.update({
      where: { id },
      data: updates,
      select: { id: true, email: true, role: true /* adjust as needed */ }
    });
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error('updateUser error:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
}

/**
 * Delete a user by ID.
 */
export async function deleteUser(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
}
