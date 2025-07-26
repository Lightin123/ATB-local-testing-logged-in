import prisma from '../prisma.js';
import { sendEmail } from '../services/mailService.js';
import { sendSMS } from '../services/smsService.js';
import { createMessage } from './messageController.js';
import { z } from 'zod';

// Create a new maintenance request
export async function createMaintenanceReport(req, res) {
  try {
    const { unitId, reporterId, ...rest } = req.body;

    let relationConnect;
    if (req.user.role === 'TENANT') {
      let tenantId = reporterId;
      if (!tenantId) {
        const tenant = await prisma.tenant.findUnique({
          where: { userId: req.user.userId }
        });
        if (!tenant) {
          return res
            .status(404)
            .json({ message: 'Tenant profile not found for this user.' });
        }
        tenantId = tenant.id;
      }
      relationConnect = { reporter: { connect: { id: Number(tenantId) } } };
    } else {
      relationConnect = { owner: { connect: { id: req.user.userId } } };
    }

    const newMaintenanceReport = await prisma.maintenanceRequest.create({
      data: {
        ...rest,                              // title, notes, category, etc.
        unit:    { connect: { id: Number(unitId) } },
        ...relationConnect
      }
    });

    return res.status(200).json({ data: newMaintenanceReport });
  } catch (err) {
    console.error('createMaintenanceReport error:', err);
    return res.status(500).json({ message: 'Error creating maintenance report' });
  }
}

// Other controller functions unchanged...
export async function getMaintenanceReports(req, res) {
  try {
    // optional unit filter
    const unitId = req.query.unitId ? Number(req.query.unitId) : undefined;
    const filters = {};
    if (unitId) filters.unitId = unitId;

    // role based filters
    const { role, userId } = req.user;
    if (role === 'TENANT') {
      const tenant = await prisma.tenant.findUnique({ where: { userId } });
      if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
      filters.reporterId = tenant.id;
    } else if (role === 'OWNER') {
      const owner = await prisma.user.findUnique({ where: { id: userId } });
      if (!owner) return res.status(404).json({ message: 'Owner not found' });
      filters.unit = { owners: { some: { id: owner.id } } };
    }

    const maintenanceReports = await prisma.maintenanceRequest.findMany({
      where: filters,
      include: {
        unit: {
          include: {
            realEstateObject: true,
            owners: true,
            tenant: { include: { user: true } },
          },
        },
        owner: true,                       // direct User relation
        reporter: { include: { user: true } },// Tenant → include its User
        vendor: true,                       // Vendor relation
        // tags removed — this field does not exist in your schema
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(maintenanceReports);
  } catch (error) {
    console.error('getMaintenanceReports error:', error);
    return res
      .status(500)
      .json({ message: 'Error fetching maintenance reports' });
  }
}

export async function requestTag(req, res) {
  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        unit: { include: { owners: true } }
      }
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const isOwner = request.unit?.owners?.some((o) => o.id === userId);
    if (!isOwner) {
      return res.status(403).json({
        message: 'Not authorized to request HOA review for this unit'
      });
    }

    await prisma.maintenanceRequest.update({
      where: { id },
      data: { pendingTagRequest: true }
    });

    res.json({ success: true });
  } catch (err) {
    console.error('requestTag error:', err);
    res.status(500).json({ message: 'Error requesting HOA tag' });
  }
}

export async function approveTag(req, res) {
  try {
    const id = Number(req.params.id);
    const { approve } = req.body;
    const existing = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        unit: { include: { owners: true } },
        vendor: true
      }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const data = { pendingTagRequest: false };
    if (approve === true) data.isHOAIssue = true;

    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data,
      include: {
        unit: { include: { owners: true } },
        vendor: true
      }
    });

    const owners = updated.unit?.owners || [];
    if (approve === true) {
      const notif = `Your request #${id} is approved as an HOA issue.`;
      for (const o of owners) {
        if (o.email) await sendEmail(o.email, 'HOA Request Approved', notif);
        await sendSMS(o.phone || '', notif);
      }
      if (updated.vendor) {
        if (updated.vendor.email) await sendEmail(updated.vendor.email, 'HOA Work Order', notif);
        await sendSMS(updated.vendor.phone || '', notif);
      }
    } else {
      const notif = `HOA declined your request #${id}.`;
      for (const o of owners) {
        if (o.email) await sendEmail(o.email, 'HOA Request Declined', notif);
        await sendSMS(o.phone || '', notif);
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('approveTag error:', err);
    res.status(500).json({ message: 'Error approving HOA tag' });
  }
}

// Schema for updates using your actual Prisma fields
const updateReportSchema = z.object({
  title: z.string().min(1).optional(),
  status: z
    .enum([
      'REPORTED',
      'OPEN',
      'IN_PROGRESS',
      'VENDOR_ASSIGNED',
      'SCHEDULED',
      'COMPLETED'
    ])
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  category: z.string().max(50).optional(),
  categoryOther: z.string().max(15).optional(),
  pendingTagRequest: z.boolean().optional(),
  isHOAIssue: z.boolean().optional(),
  notes: z.string().optional()
});

export async function updateMaintenanceReport(req, res, next) {
  const parsed = updateReportSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid update payload',
      details: parsed.error.issues
    });
  }

  try {
    const id = Number(req.params.id);
    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data: parsed.data
    });
    return res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Report not found' });
    }
    console.error('updateMaintenanceReport error:', err);
    return res
      .status(500)
      .json({ error: 'Failed to update maintenance report' });
  }
}

export async function deleteMaintenanceReport(req, res) {
  try {
    const allowed = ['TENANT', 'OWNER', 'ADMIN'];
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const id = Number(req.params.id);
    const record = await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { unit: { include: { owners: true } }, reporter: true }
    });

    if (!record) {
      return res.status(404).json({ message: 'Not found' });
    }

    if (req.user.role === 'TENANT') {
      if (record.reporter?.userId !== req.user.userId) {
        return res.status(403).json({ message: 'You cannot delete this request' });
      }
    }

    if (req.user.role === 'OWNER') {
      const isOwner = record.unit?.owners?.some((o) => o.id === req.user.userId);
      if (!isOwner) {
        return res.status(403).json({ message: 'Not authorized to delete this request' });
      }
    }

    await prisma.maintenanceRequest.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error('deleteMaintenanceReport error:', err);
    res.status(500).json({ message: 'Error deleting maintenance report' });
  }
}

export async function linkMaintenanceRequests(ids, userId) {
  try {
    if (!ids || ids.length < 2) return;
    const [first, ...rest] = ids.map(Number);
    const data = rest.map((r) => ({ requestAId: first, requestBId: r }));
    await prisma.linkedRequest.createMany({ data, skipDuplicates: true });
  } catch (err) {
    throw new Error('Error linking maintenance requests');
  }
}
