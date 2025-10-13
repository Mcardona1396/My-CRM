-- Baseline: existing "Deal" table plus new contact-manager columns
CREATE TABLE IF NOT EXISTS "Deal" (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    company    TEXT NOT NULL,
    value      INTEGER NOT NULL,
    stage      TEXT NOT NULL,
    "closeDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    contact    TEXT,
    email      TEXT,
    accounts   TEXT,
    phone      TEXT,
    type       TEXT,
    location   TEXT,
    priority   TEXT,
    comments   TEXT
);
