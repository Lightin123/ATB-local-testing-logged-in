import prisma from '../prisma.js';

/**
 * List all messages.
 */
export async function getMessages(req, res) {
  try {
    const data = await prisma.message.findMany();
    res.status(200).json({ data });
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
}

/**
 * Create a new message.
 */
export async function createMessage(req, res) {
  try {
    const payload = req.body;
    const created = await prisma.message.create({ data: payload });
    res.status(201).json({ data: created });
  } catch (err) {
    console.error('createMessage error:', err);
    res.status(500).json({ message: 'Error creating message' });
  }
}

/**
 * Update an existing message by ID.
 */
export async function updateMessage(req, res) {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    const updated = await prisma.message.update({
      where: { id },
      data: updates
    });
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error('updateMessage error:', err);
    res.status(500).json({ message: 'Error updating message' });
  }
}

/**
 * Delete a message by ID.
 */
export async function deleteMessage(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.message.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('deleteMessage error:', err);
    res.status(500).json({ message: 'Error deleting message' });
  }
}
