-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "actorId" INTEGER,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditLog_uuid_key" ON "public"."AuditLog"("uuid");
CREATE INDEX "AuditLog_actorId_idx" ON "public"."AuditLog"("actorId");
CREATE INDEX "AuditLog_action_idx" ON "public"."AuditLog"("action");
CREATE INDEX "AuditLog_resourceType_idx" ON "public"."AuditLog"("resourceType");
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
