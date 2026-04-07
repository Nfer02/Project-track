CREATE TABLE IF NOT EXISTS "Waitlist" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "source" TEXT DEFAULT 'landing',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Waitlist_email_key" ON "Waitlist"("email");
