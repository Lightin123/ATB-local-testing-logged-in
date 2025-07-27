import pkg from '@prisma/client';
const { PrismaClient, MaintenanceStatus, Priority } = pkg;

const prisma = new PrismaClient();

export { MaintenanceStatus, Priority };

export default prisma;



