ALTER TABLE "maintenance_request" ADD COLUMN "ownerId" INTEGER;
ALTER TABLE "maintenance_request" ADD COLUMN "tenantId" INTEGER;
ALTER TABLE "maintenance_request" ADD CONSTRAINT "maintenance_request_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "maintenance_request" ADD CONSTRAINT "maintenance_request_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- Drop tags column if exists
ALTER TABLE "maintenance_request" DROP COLUMN IF EXISTS "tags";
