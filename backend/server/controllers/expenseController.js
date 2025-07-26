import prisma from '../prisma.js';

/**
 * List all expenses.
 */
export async function getExpenses(req, res) {
  try {
    const data = await prisma.expense.findMany();
    res.status(200).json({ data });
  } catch (err) {
    console.error('getExpenses error:', err);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
}

/**
 * Create a new expense.
 */
export async function createExpense(req, res) {
  try {
    const payload = req.body;
    const created = await prisma.expense.create({ data: payload });
    res.status(201).json({ data: created });
  } catch (err) {
    console.error('createExpense error:', err);
    res.status(500).json({ message: 'Error creating expense' });
  }
}

/**
 * Update an existing expense by ID.
 */
export async function updateExpense(req, res) {
  try {
    const id = Number(req.params.id);
    const updates = req.body;
    const updated = await prisma.expense.update({
      where: { id },
      data: updates
    });
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error('updateExpense error:', err);
    res.status(500).json({ message: 'Error updating expense' });
  }
}

/**
 * Delete an expense by ID.
 */
export async function deleteExpense(req, res) {
  try {
    const id = Number(req.params.id);
    await prisma.expense.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('deleteExpense error:', err);
    res.status(500).json({ message: 'Error deleting expense' });
  }
}
