-- Tax fields migration
-- Run in Supabase SQL Editor

-- Project: IVA and IRPF rates
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Project' AND column_name='vatRate') THEN
    ALTER TABLE "Project" ADD COLUMN "vatRate" INTEGER NOT NULL DEFAULT 21;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Project' AND column_name='irpfRate') THEN
    ALTER TABLE "Project" ADD COLUMN "irpfRate" INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Invoice: VAT amount for expense deductions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Invoice' AND column_name='vatAmount') THEN
    ALTER TABLE "Invoice" ADD COLUMN "vatAmount" DECIMAL(12,2);
  END IF;
END $$;
