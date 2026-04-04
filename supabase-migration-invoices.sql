-- =============================================================================
-- Migration: Invoice system refactor (income/expense, workspace-level invoices)
-- Run in Supabase SQL Editor
-- =============================================================================

-- ─── Step 1: Add new enum, new columns, make projectId nullable ─────────────

-- Create InvoiceType enum
CREATE TYPE "InvoiceType" AS ENUM ('INCOME', 'EXPENSE');

-- Add new columns to Invoice
ALTER TABLE "Invoice"
  ADD COLUMN "type" "InvoiceType" NOT NULL DEFAULT 'INCOME',
  ADD COLUMN "workspaceId" TEXT,
  ADD COLUMN "isDeclared" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "vendorName" TEXT,
  ADD COLUMN "category" TEXT;

-- Change currency default from USD to EUR
ALTER TABLE "Invoice" ALTER COLUMN "currency" SET DEFAULT 'EUR';

-- Make projectId nullable
ALTER TABLE "Invoice" ALTER COLUMN "projectId" DROP NOT NULL;

-- Add isDeclared to Project
ALTER TABLE "Project"
  ADD COLUMN "isDeclared" BOOLEAN NOT NULL DEFAULT true;

-- ─── Step 2: Backfill workspaceId from Project, then set NOT NULL ───────────

-- Backfill workspaceId for existing invoices using their linked project
UPDATE "Invoice" i
SET "workspaceId" = p."workspaceId"
FROM "Project" p
WHERE i."projectId" = p."id";

-- Now enforce NOT NULL on workspaceId
ALTER TABLE "Invoice" ALTER COLUMN "workspaceId" SET NOT NULL;

-- ─── Step 3: Create ExpenseAllocation, update constraints and FKs ───────────

-- Create ExpenseAllocation table
CREATE TABLE "ExpenseAllocation" (
  "id" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "amount" DECIMAL(12, 2) NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ExpenseAllocation_pkey" PRIMARY KEY ("id")
);

-- Unique constraint: one allocation per invoice-project pair
ALTER TABLE "ExpenseAllocation"
  ADD CONSTRAINT "ExpenseAllocation_invoiceId_projectId_key" UNIQUE ("invoiceId", "projectId");

-- Foreign keys for ExpenseAllocation
ALTER TABLE "ExpenseAllocation"
  ADD CONSTRAINT "ExpenseAllocation_invoiceId_fkey"
  FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExpenseAllocation"
  ADD CONSTRAINT "ExpenseAllocation_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Drop old unique constraint on Invoice (projectId, number)
ALTER TABLE "Invoice"
  DROP CONSTRAINT "Invoice_projectId_number_key";

-- Add new unique constraint (workspaceId, type, number)
ALTER TABLE "Invoice"
  ADD CONSTRAINT "Invoice_workspaceId_type_number_key" UNIQUE ("workspaceId", "type", "number");

-- Add foreign key for Invoice -> Workspace
ALTER TABLE "Invoice"
  ADD CONSTRAINT "Invoice_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Make projectId FK optional (drop and recreate to allow NULLs — FK itself already allows NULLs)
-- The existing FK on projectId should still work since NULLs are ignored by FK checks.
-- No action needed for the existing Invoice_projectId_fkey constraint.
