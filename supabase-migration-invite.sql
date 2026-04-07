DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Waitlist' AND column_name='invited') THEN
    ALTER TABLE "Waitlist" ADD COLUMN "invited" BOOLEAN NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Waitlist' AND column_name='invitedAt') THEN
    ALTER TABLE "Waitlist" ADD COLUMN "invitedAt" TIMESTAMP(3);
  END IF;
END $$;
