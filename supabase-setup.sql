-- =====================================================================
-- ProjectTrack — Setup inicial de base de datos
-- Ejecuta este script en: Supabase Dashboard > SQL Editor > New query
-- =====================================================================

-- ─── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAST_DUE', 'CANCELLED');

-- ─── Tablas ───────────────────────────────────────────────────────────────────

CREATE TABLE "User" (
    "id"        TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "name"      TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Workspace" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "slug"      TEXT NOT NULL,
    "plan"      "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

CREATE TABLE "WorkspaceMember" (
    "id"          TEXT NOT NULL,
    "userId"      TEXT,
    "workspaceId" TEXT NOT NULL,
    "role"        "MemberRole" NOT NULL DEFAULT 'MEMBER',
    "inviteEmail" TEXT,
    "inviteToken" TEXT,
    "acceptedAt"  TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WorkspaceMember_inviteToken_key" ON "WorkspaceMember"("inviteToken");
CREATE UNIQUE INDEX "WorkspaceMember_userId_workspaceId_key" ON "WorkspaceMember"("userId", "workspaceId");

CREATE TABLE "Project" (
    "id"          TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "clientName"  TEXT,
    "description" TEXT,
    "status"      "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "budget"      DECIMAL(12,2),
    "currency"    TEXT NOT NULL DEFAULT 'USD',
    "startDate"   TIMESTAMP(3),
    "endDate"     TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Invoice" (
    "id"          TEXT NOT NULL,
    "projectId"   TEXT NOT NULL,
    "number"      TEXT NOT NULL,
    "description" TEXT,
    "amount"      DECIMAL(12,2) NOT NULL,
    "currency"    TEXT NOT NULL DEFAULT 'USD',
    "issueDate"   TIMESTAMP(3) NOT NULL,
    "dueDate"     TIMESTAMP(3),
    "paidDate"    TIMESTAMP(3),
    "status"      "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "notes"       TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Invoice_projectId_number_key" ON "Invoice"("projectId", "number");

CREATE TABLE "InvoiceFile" (
    "id"          TEXT NOT NULL,
    "invoiceId"   TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "filename"    TEXT NOT NULL,
    "mimeType"    TEXT NOT NULL,
    "sizeBytes"   INTEGER NOT NULL,
    "ocrData"     JSONB,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InvoiceFile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Subscription" (
    "id"               TEXT NOT NULL,
    "workspaceId"      TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubId"      TEXT,
    "stripePriceId"    TEXT,
    "status"           "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE',
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Subscription_workspaceId_key" ON "Subscription"("workspaceId");
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");
CREATE UNIQUE INDEX "Subscription_stripeSubId_key" ON "Subscription"("stripeSubId");

-- ─── Foreign Keys ─────────────────────────────────────────────────────────────
ALTER TABLE "WorkspaceMember"
    ADD CONSTRAINT "WorkspaceMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkspaceMember"
    ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Project"
    ADD CONSTRAINT "Project_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invoice"
    ADD CONSTRAINT "Invoice_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InvoiceFile"
    ADD CONSTRAINT "InvoiceFile_invoiceId_fkey"
    FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Subscription"
    ADD CONSTRAINT "Subscription_workspaceId_fkey"
    FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Prisma migrations table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    VARCHAR(36) NOT NULL,
    "checksum"              VARCHAR(64) NOT NULL,
    "finished_at"           TIMESTAMPTZ,
    "migration_name"        VARCHAR(255) NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        TIMESTAMPTZ,
    "started_at"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "applied_steps_count"   INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- ─── Listo ────────────────────────────────────────────────────────────────────
-- Después de ejecutar este script:
-- 1. Crea el bucket "invoice-files" en Storage > New bucket (Public: OFF)
-- 2. Ve a Authentication > URL Configuration y agrega:
--    https://project-track-ruby.vercel.app
