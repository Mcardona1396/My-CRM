-- Add contact-manager columns
ALTER TABLE "Deal"
  ADD COLUMN "contact"   TEXT,
  ADD COLUMN "email"     TEXT,
  ADD COLUMN "accounts"  TEXT,
  ADD COLUMN "phone"     TEXT,
  ADD COLUMN "type"      TEXT,
  ADD COLUMN "location"  TEXT,
  ADD COLUMN "priority"  TEXT,
  ADD COLUMN "comments"  TEXT;
